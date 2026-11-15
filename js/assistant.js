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
    launcher.setAttribute('aria-expanded', String(v));
    if (v){
      wake();
      setTimeout(()=> input?.focus({ preventScroll:true }), 360);
    }
  };

  launcher.addEventListener('click', ()=> setOpen(!open));
  $('#aiClose')?.addEventListener('click', ()=> setOpen(false));
  addEventListener('keydown', e=>{ if (e.key === 'Escape' && open) setOpen(false); });

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
    if (chip && !busy) ask(chip.textContent.trim());
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

    typing.remove();
    if (!answer) throw new Error('empty');

    history.push({ role:'user', content:text }, { role:'assistant', content:answer });
    await typeOut(addMsg('ai', ''), answer);
    setStatus('ready');

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
  scroll();
  return el;
}

function addTyping(){
  const log = $('#aiLog');
  const el = document.createElement('div');
  el.className = 'msg msg--ai';
  el.innerHTML = `<div class="msg__b msg__typing"><i></i><i></i><i></i></div>`;
  log.appendChild(el);
  scroll();
  return el;
}

function note(text){
  const log = $('#aiLog');
  const el = document.createElement('p');
  el.className = 'ai__note mono';
  el.textContent = text;
  log.appendChild(el);
  scroll();
}

function scroll(){
  const log = $('#aiLog');
  if (log) log.scrollTop = log.scrollHeight;
}

/* Type the answer in at reading pace. Whole words, not characters:
   character-typing mangles Arabic, because a letter's form depends on
   the letter that has not been appended yet. */
function typeOut(el, text){
  const body = el.querySelector('.msg__b');
  if (RM){ body.innerHTML = md(text); scroll(); return Promise.resolve(); }

  const words = text.split(/(\s+)/);
  let i = 0;
  return new Promise(resolve=>{
    const step = ()=>{
      const chunk = words.slice(0, i += 2).join('');
      body.innerHTML = md(chunk);
      scroll();
      if (i < words.length) setTimeout(step, 24);
      else resolve();
    };
    step();
  });
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

  /* Links first, and the pattern has to accept mailto: as well as http.
     It did not, so "[addr](mailto:addr)" fell through to the bare-email
     rule below, which linked the bracket text and left "(mailto:addr)"
     sitting in the page as literal text. */
  h = h.replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)\s]+)\)/g, (_, label, url) =>
    url.startsWith('mailto:')
      ? `<a href="${url}">${label}</a>`
      : `<a href="${url}" target="_blank" rel="noopener">${label}</a>`);

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
  host.innerHTML = `
    <div class="ai__intro" id="aiSuggest">
      <p class="ai__hi">${esc(tr('ai.hi'))}</p>
      <p class="ai__sub">${esc(tr('ai.sub'))}</p>
      <div class="ai__chips">
        ${['ai.q1','ai.q2','ai.q3'].map(k =>
          `<button class="ai__chip" data-ask>${esc(tr(k))}</button>`).join('')}
      </div>
    </div>`;
}

/* called by applyLang so the panel follows the page's language */
export function relabelAssistant(){
  setStatus($('#aiStatus')?.dataset.state || 'idle');
  if (!history.length) renderSuggestions();
}
