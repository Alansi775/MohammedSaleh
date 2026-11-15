/* ==================================================================
   ASSISTANT

   A retrieval-free chat against Mohammed's own backend, which runs a
   three-model fallback chain (Groq → Gemini → DeepSeek) so a single
   provider outage never takes the assistant down.

   Two things shape this UI more than anything else:

   1. The service is on a free tier that sleeps. A cold request takes
      ~25s. So the page WAKES IT EARLY — on the first sign of intent,
      long before anyone opens the panel — and if a request is still
      cold it says so honestly instead of looking broken.

   2. Answers arrive whole, not streamed. Printing them instantly feels
      like a canned reply, so they are typed out at reading pace, which
      is both truthful about the latency and easier to follow.
================================================================== */

import { detectProjects, projectHasMedia, goToProject, startTour, stopTour } from './navigate.js';

const API = 'https://mohammedsaleh-chatbot.onrender.com/api/chat';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s).replace(/[&<>"]/g,
  m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m]));

let history = [];          // [{role, content}] sent so the model has context
let busy = false;
let woken = false;
let open = false;
let getLang = () => 'en';
let tr = k => k;

export function initAssistant({ t, lang }){
  tr = t; getLang = lang;

  const launcher = $('#aiLauncher');
  const panel    = $('#aiPanel');
  const form     = $('#aiForm');
  const input    = $('#aiInput');
  if (!launcher || !panel) return;

  /* ---- open / close ------------------------------------------- */
  const setOpen = v=>{
    open = v;
    panel.classList.toggle('is-open', v);
    launcher.classList.toggle('is-open', v);
    if (!v){ panel.classList.remove('is-big'); document.body.classList.remove('ai-big'); }
    launcher.setAttribute('aria-expanded', String(v));
    if (v){
      wake();
      setTimeout(()=> input?.focus({ preventScroll:true }), 360);
    }
  };

  launcher.addEventListener('click', ()=> setOpen(!open));
  $('#aiClose')?.addEventListener('click', ()=> setOpen(false));

  /* Expanded: the panel takes the middle of the screen and the page
     behind it goes soft, so a long answer can be read without the
     portfolio competing for attention. */
  let big = false;
  const setBig = v=>{
    big = v;
    panel.classList.toggle('is-big', v);
    document.body.classList.toggle('ai-big', v);
    $('#aiExpand')?.setAttribute('aria-label', v ? 'Collapse' : 'Expand');
  };
  $('#aiExpand')?.addEventListener('click', ()=> setBig(!big));

  watchScroll();
  $('#aiLatest')?.addEventListener('click', ()=> scroll(true));

  /* Anywhere outside dismisses it — the backdrop, or a click on the
     page itself. The launcher is excluded, or its own click would
     reopen what it just closed. */
  document.addEventListener('pointerdown', e=>{
    if (!open) return;
    if (e.target.closest('#aiPanel') || e.target.closest('#aiLauncher')) return;
    setOpen(false);
  });

  addEventListener('keydown', e=>{
    if (e.key !== 'Escape' || !open) return;
    big ? setBig(false) : setOpen(false);   // Escape steps back one level
  });

  /* ---- send ---------------------------------------------------- */
  form?.addEventListener('submit', e=>{
    e.preventDefault();
    const text = input.value.trim();
    if (!text || busy) return;
    input.value = '';
    autosize(input);
    ask(text);
  });

  /* Enter sends, Shift+Enter breaks the line — what people expect of
     a chat box, and what a plain textarea does not do by itself. */
  input?.addEventListener('keydown', e=>{
    if (e.key === 'Enter' && !e.shiftKey){
      e.preventDefault();
      form.requestSubmit();
    }
  });
  input?.addEventListener('input', ()=> autosize(input));

  /* suggested openers, delegated so they survive a language switch */
  panel.addEventListener('click', e=>{
    const chip = e.target.closest('[data-ask]');
    if (chip && !busy){ ask(chip.textContent.trim()); return; }

    if (e.target.closest('[data-tour]')){
      setOpen(false);
      startTour({ onStep: ()=>{} });
      return;
    }

    const go = e.target.closest('[data-go]');
    if (go){
      /* collapse out of the expanded view, otherwise the scroll lands
         behind a full-screen panel and nothing appears to happen */
      panel.classList.remove('is-big');
      document.body.classList.remove('ai-big');
      setOpen(false);
      goToProject(go.dataset.go, { openGallery: !!go.dataset.gallery });
    }
  });

  /* ---- wake the service on the first sign of intent ------------ */
  const armWake = ()=>{
    ['pointerdown','keydown','scroll'].forEach(ev =>
      addEventListener(ev, wake, { once:true, passive:true }));
    setTimeout(wake, 9000);        // or just after the page settles
  };
  armWake();

  renderSuggestions();
}

/* A HEAD-ish ping that costs the model nothing but gets the dyno up,
   so the first real question is not the one that waits 25 seconds. */
function wake(){
  if (woken) return;
  woken = true;
  setStatus('waking');
  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'ping', language: 'en', history: [] })
  })
    .then(r => setStatus(r.ok ? 'ready' : 'down'))
    .catch(()=> setStatus('down'));
}

function setStatus(state){
  const el = $('#aiStatus');
  if (!el) return;
  el.dataset.state = state;
  el.querySelector('span').textContent = tr('ai.' + state);
}

/* ---- conversation ---------------------------------------------- */

async function ask(text){
  busy = true;
  $('#aiSuggest')?.remove();
  addMsg('me', text);

  const typing = addTyping();
  const t0 = performance.now();

  /* the backend speaks en and ar; Turkish readers get the English
     model with a Turkish-facing UI rather than a 400 */
  const lang = getLang() === 'ar' ? 'ar' : 'en';

  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, language: lang, history: history.slice(-8) })
    });

    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const answer = (data.response || '').trim();

    /* A reply that lands in 300ms snaps the thinking state on and off
       like a flicker. Hold it long enough to be read as a pause. */
    const held = performance.now() - t0;
    if (held < 650) await new Promise(r => setTimeout(r, 650 - held));

    typing.remove();
    if (!answer) throw new Error('empty');

    history.push({ role:'user', content:text }, { role:'assistant', content:answer });
    await typeOut(addMsg('ai', ''), answer);
    setStatus('ready');

    /* If the exchange was clearly about one project, offer to take the
       reader to it. Matched on the question AND the answer, so a reply
       that names the project still counts when the question did not. */
    const hits = detectProjects(text, answer);
    if (hits.length) offerJump(hits);

    /* a cold start is the single most likely bad first impression, so
       it gets named rather than hidden */
    if (performance.now() - t0 > 9000) note(tr('ai.cold'));

  } catch (err){
    typing.remove();
    addMsg('ai', tr('ai.error'), true);
    setStatus('down');
  } finally {
    busy = false;
    $('#aiInput')?.focus({ preventScroll:true });
  }
}

function addMsg(who, text, isError){
  const log = $('#aiLog');
  const el = document.createElement('div');
  el.className = `msg msg--${who}` + (isError ? ' msg--err' : '');
  el.innerHTML = `<div class="msg__b">${who === 'ai' ? md(text) : esc(text)}</div>`;
  log.appendChild(el);
  scroll(who === 'me');
  return el;
}

/* The wait is not dead time: the orb turns over and the word shimmers
   across itself, so the pause reads as the model working rather than
   as the page having stalled. */
function addTyping(){
  const log = $('#aiLog');
  const el = document.createElement('div');
  el.className = 'msg msg--ai msg--think';
  el.innerHTML = `
    <div class="msg__b msg__typing">
      <span class="ai__orb ai__orb--sm" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="think">${esc(tr('ai.think'))}</span>
    </div>`;
  log.appendChild(el);
  scroll();
  return el;
}

/* The page is the portfolio; the chat is a way into it. These do the
   walking: reset the filter, scroll to the card, mark it, and open the
   screenshots if there are any. */
function offerJump(ids){
  const log = $('#aiLog');
  const row = document.createElement('div');
  row.className = 'ai__act';

  /* One match gets a labelled pair of controls. Several get a chip
     each, because the useful thing then is the choice, not the verb. */
  if (ids.length === 1){
    const id = ids[0];
    row.innerHTML =
      `<button class="ai__go" data-go="${id}">
         <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
         ${esc(tr('ai.jump'))}
       </button>` +
      (projectHasMedia(id)
        ? `<button class="ai__go ai__go--ghost" data-go="${id}" data-gallery="1">
             <svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 16 5-5 4 4 3-3 6 6"/></svg>
             ${esc(tr('ai.shots'))}
           </button>`
        : '');
  } else {
    row.innerHTML =
      `<span class="ai__actk mono">${esc(tr('ai.seeon'))}</span>` +
      ids.map(id =>
        `<button class="ai__go ai__go--ghost" data-go="${id}">${esc(tr(id + '.t'))}</button>`
      ).join('');
  }

  log.appendChild(row);
  scroll();
}

function note(text){
  const log = $('#aiLog');
  const el = document.createElement('p');
  el.className = 'ai__note mono';
  el.textContent = text;
  log.appendChild(el);
  scroll();
}

/* ==================================================================
   FOLLOWING THE ANSWER

   Scrolling to the bottom on every update pinned the reader to the
   end of a reply they had not read: try to scroll up mid-answer and
   the next frame dragged you back down. By the time it finished you
   had read nothing.

   So the log follows only while you are ALREADY at the bottom. Scroll
   up and it lets go, and says so with a button that takes you back.
   Sending a message always re-attaches, because that is you asking
   for the newest thing.
================================================================== */
let stick = true;
const NEAR = 60;            // px from the bottom that still counts as "at the bottom"

function atBottom(log){
  return log.scrollHeight - log.scrollTop - log.clientHeight < NEAR;
}

function watchScroll(){
  const log = $('#aiLog');
  if (!log || log.dataset.watched) return;
  log.dataset.watched = '1';
  log.addEventListener('scroll', ()=>{
    stick = atBottom(log);
    $('#aiPanel')?.classList.toggle('is-away', !stick);
  }, { passive:true });
}

function scroll(force){
  const log = $('#aiLog');
  if (!log) return;
  if (force) stick = true;
  if (!stick) return;
  log.scrollTop = log.scrollHeight;
  $('#aiPanel')?.classList.remove('is-away');
}

/* ==================================================================
   THE REVEAL

   The answer arrives whole, so there is nothing to stream. Printing
   it at once reads as a canned reply; appending it word by word and
   re-rendering the markdown each step reflowed the whole bubble 200
   times and kept dragging the scroll with it.

   So it is laid out ONCE, in full, and then each word is faded up out of
   a blur on a staggered delay. The browser runs the whole thing on
   the compositor, the layout never moves after the first frame, and
   the reader can scroll back up through a paragraph while the next
   one is still arriving.

   Words, not characters: character-typing mangles Arabic, where a
   letter's form depends on the letter that has not been written yet.
================================================================== */
const STEP = 26;            // ms between words
const CAP  = 5200;          // never make anyone wait longer than this

function wrapWords(root){
  const skip = new Set(['CODE', 'PRE']);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: n => skip.has(n.parentNode.nodeName)
      ? NodeFilter.FILTER_REJECT
      : (n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT)
  });

  const texts = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) texts.push(n);

  let i = 0;
  for (const node of texts){
    const frag = document.createDocumentFragment();
    for (const part of node.nodeValue.split(/(\s+)/)){
      if (!part) continue;
      if (!part.trim()){ frag.appendChild(document.createTextNode(part)); continue; }
      const sp = document.createElement('span');
      sp.className = 'rw';
      sp.style.setProperty('--d', Math.min(i++ * STEP, CAP) + 'ms');
      sp.textContent = part;
      frag.appendChild(sp);
    }
    node.parentNode.replaceChild(frag, node);
  }
  return Math.min(i * STEP, CAP) + 420;        // + the fade itself
}

function typeOut(el, text){
  const body = el.querySelector('.msg__b');
  body.innerHTML = md(text);

  if (RM){ scroll(); return Promise.resolve(); }

  const total = wrapWords(body);
  /* one scroll, before a single word has appeared — after this the
     bubble's height never changes again */
  scroll();
  return new Promise(resolve => setTimeout(resolve, total));
}

/* The model replies in light markdown. This renders the subset it
   actually emits — headings, both bullet styles, rules, bold, code and
   links — and escapes the whole string FIRST, so a reply can never
   inject markup into the page.

   Order matters: a line-leading "* " is a bullet and must be consumed
   before "*text*" is read as emphasis, or every list turns italic. */
function md(s){
  let h = esc(s);

  // fenced and inline code first, so nothing inside them is reinterpreted
  h = h.replace(/```[a-z]*\n?([\s\S]*?)```/g, (_, c) => `\u0000PRE${btoaSafe(c.trim())}\u0000`);
  h = h.replace(/`([^`\n]+)`/g, '<code>$1</code>');

  // headings
  h = h.replace(/^\s*#{3,6}\s+(.+)$/gm, '<h4>$1</h4>');
  h = h.replace(/^\s*#{1,2}\s+(.+)$/gm, '<h3>$1</h3>');

  // horizontal rule
  h = h.replace(/^\s*(?:---+|___+|\*\*\*+)\s*$/gm, '<hr>');

  // list items — both "-" and "*", before emphasis is parsed
  h = h.replace(/^\s*[-*•]\s+(.+)$/gm, '<li>$1</li>');
  h = h.replace(/^\s*\d+[.)]\s+(.+)$/gm, '<li>$1</li>');
  h = h.replace(/(<li>[\s\S]*?<\/li>)(?!\s*<li>)/g, '<ul>$1</ul>');

  // emphasis
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  /* A reply cut off by the token limit can leave an opening ** with no
     partner, which then shows as literal asterisks in the page. Close
     it rather than print it. */
  if ((h.match(/\*\*/g) || []).length === 1) h = h.replace(/\*\*(.*)$/s, '<strong>$1</strong>');
  h = h.replace(/\*\*/g, '');

  /* Links first, and the pattern has to accept mailto: as well as http.
     It did not, so "[addr](mailto:addr)" fell through to the bare-email
     rule below, which linked the bracket text and left "(mailto:addr)"
     sitting in the page as literal text. */
  h = h.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)/g, (_, label, url) =>
    url.startsWith('mailto:')
      ? `<a href="${url}">${label}</a>`
      : `<a href="${url}" target="_blank" rel="noopener">${label}</a>`);

  /* A reply can be cut off by the token limit anywhere inside a link,
     and each stopping point leaves a different wreck:
         "[label](http://..."   no closing paren
         "[label]"              no target at all
         "[label"               not even a closing bracket
     All three used to print their punctuation. Keep the label, drop
     the syntax — a visible "[Watch on YouTube" helps nobody. */
  h = h.replace(/\[([^\]]*)\]\((?:https?:\/\/|mailto:)[^)\s]*$/, '$1');
  h = h.replace(/\[([^\]]*)\]\s*$/, '$1');
  h = h.replace(/\[([^\]\n]*)$/, '$1');

  /* Bare URLs. The model often writes "Watch: https://youtu.be/..."
     with no markdown around it, and an unlinked video link is the one
     thing in a reply somebody actually wants to press. The lookahead
     keeps it from touching a URL that is already inside an href. */
  h = h.replace(/(^|[\s(\[])(https?:\/\/[^\s<)\]]+[^\s<)\].,;:!?])(?![^<]*<\/a>)/g,
                '$1<a href="$2" target="_blank" rel="noopener">$2</a>');

  // then any bare address left over, as long as it is not already linked
  h = h.replace(/(^|[\s(\[])([\w.+-]+@[\w.-]+\.\w{2,})(?![^<]*<\/a>)/g,
                '$1<a href="mailto:$2">$2</a>');

  // paragraphs, but never wrap a block element in one
  h = h.split(/\n{2,}/).map(block=>{
    const b = block.trim();
    if (!b) return '';
    if (/^<(h3|h4|ul|hr|pre)/.test(b)) return b;
    return '<p>' + b.replace(/\n/g, '<br>') + '</p>';
  }).join('');

  // restore code blocks
  h = h.replace(/\u0000PRE(.*?)\u0000/g, (_, b) => `<pre>${atobSafe(b)}</pre>`);
  return h;
}

/* base64 round-trip so block contents survive the replacements above
   without being re-parsed; both are unicode-safe */
const btoaSafe = s => btoa(unescape(encodeURIComponent(s)));
const atobSafe = s => decodeURIComponent(escape(atob(s)));

function autosize(el){
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 132) + 'px';
}

/* ---- suggestions ------------------------------------------------ */
export function renderSuggestions(){
  const host = $('#aiLog');
  if (!host || history.length) return;
  /* The greeting resolves word by word the first time the panel opens.
     Words, not characters — character typing breaks Arabic, where a
     letter's shape depends on the letter after it. */
  const hi = tr('ai.hi').split(/\s+/)
    .map((w, i) => `<span class="aw" style="--i:${i}">${esc(w)}</span>`).join(' ');

  host.innerHTML = `
    <div class="ai__intro" id="aiSuggest">
      <p class="ai__hi">${hi}</p>
      <p class="ai__sub">${esc(tr('ai.sub'))}</p>
      <button class="ai__tour" data-tour>
        <span class="ai__orb ai__orb--sm" aria-hidden="true"><i></i><i></i><i></i></span>
        ${esc(tr('ai.tour'))}
      </button>
      <div class="ai__chips">
        ${['ai.q1','ai.q2','ai.q3'].map((k, i) =>
          `<button class="ai__chip" data-ask style="--i:${i}">${esc(tr(k))}</button>`).join('')}
      </div>
    </div>`;
}

/* called by applyLang so the panel follows the page's language */
export function relabelAssistant(){
  setStatus($('#aiStatus')?.dataset.state || 'idle');
  if (!history.length) renderSuggestions();
}
