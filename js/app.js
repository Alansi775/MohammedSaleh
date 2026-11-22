/* ==================================================================
   APP
   Language, theme, rendering, and the motion that is not a scene.
================================================================== */

import { T, LANGS, DIR, LANG_LEVELS } from './i18n.js';
import { LINKS, METRICS, PIPELINE, PROJECTS, FILTERS, SKILLS, EXPERIENCE } from './data.js';
import { initField } from './field.js';
import { initSystem } from './scenes.js';
import { initAssistant, relabelAssistant } from './assistant.js';
import { initLightbox } from './lightbox.js';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

const esc = s => String(s).replace(/[&<>"]/g,
  m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m]));

/* ========================= LANGUAGE ========================= */
const LS_LANG = 'ms.lang';

let lang = (()=>{
  try {
    const saved = localStorage.getItem(LS_LANG);
    if (LANGS.includes(saved)) return saved;
  } catch(e){}
  const n = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGS.includes(n) ? n : 'en';
})();

const t = k => (T[lang] && T[lang][k]) ?? (T.en[k] ?? '');

function applyLang(next, { rerender = true } = {}){
  lang = next;
  try { localStorage.setItem(LS_LANG, lang); } catch(e){}

  const root = document.documentElement;
  root.lang = lang;
  root.dir  = DIR[lang];
  document.title = t('meta.title');

  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-ph]').forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  document.body.dataset.tourhint = t('ai.stop');

  $$('[data-setlang]').forEach(b => b.classList.toggle('is-on', b.dataset.setlang === lang));
  const chip = $('#langbtn span');
  if (chip) chip.textContent = { en:'EN', ar:'ع', tr:'TR' }[lang] || lang.toUpperCase();
  movePill($('.seg'), $(`.seg [data-setlang="${lang}"]`));

  if (rerender){
    renderAll();
    initSystem({ t, PIPELINE });
    relabelAssistant();
    splitHeadlines();
    movePill($('#filters'), $('#filters .is-on'));
  }
}

/* A sliding pill, positioned from offsetLeft rather than a viewport
   rect: these strips scroll sideways on a phone, and a rect would be
   measured against a position that has scrolled away. */
function movePill(wrap, btn){
  if (!wrap || !btn) return;
  const pill = wrap.querySelector('.seg__pill, .filters__pill');
  if (!pill) return;
  const pad = parseFloat(getComputedStyle(wrap).paddingLeft) || 0;
  pill.style.width = btn.offsetWidth + 'px';
  pill.style.transform = `translateX(${btn.offsetLeft - pad}px)`;
  if (wrap.scrollWidth > wrap.clientWidth){
    wrap.scrollTo({ left: Math.max(0, btn.offsetLeft - (wrap.clientWidth - btn.offsetWidth) / 2), behavior:'smooth' });
  }
}

/* =========================== THEME ========================== */
const LS_THEME = 'ms.theme';
const DAY = [7, 19];

const clockTheme = () => {
  const h = new Date().getHours();
  return (h >= DAY[0] && h < DAY[1]) ? 'light' : 'dark';
};
const currentTheme = () => document.documentElement.dataset.theme || 'light';

/* iOS does not reliably repaint its status and toolbar strips when the
   content attribute of an existing theme-color meta changes. Replacing
   the element forces it, and every stale tag is removed first because
   Safari honours the first one it finds. */
function writeThemeColor(colour){
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => m.remove());
  const m = document.createElement('meta');
  m.setAttribute('name', 'theme-color');
  m.setAttribute('content', colour);
  m.id = 'themeColor';
  document.head.appendChild(m);
}

function setTheme(next){
  const root = document.documentElement;
  if (root.dataset.theme === next) return;

  const commit = ()=>{
    root.dataset.theme = next;
    writeThemeColor(next === 'dark' ? '#000000' : '#ffffff');
  };

  /* Where the platform supports it, let the browser cross-fade the two
     states: it snapshots both and dissolves between them, which beats
     transitioning colour on every element at once. */
  if (!RM && document.startViewTransition) document.startViewTransition(commit);
  else commit();
}

function initTheme(){
  let manual = null;
  try {
    const v = localStorage.getItem(LS_THEME);
    if (v === 'light' || v === 'dark') manual = v;
  } catch(e){}

  writeThemeColor(currentTheme() === 'dark' ? '#000000' : '#ffffff');

  $('#themebtn')?.addEventListener('click', ()=>{
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    manual = next;
    try { localStorage.setItem(LS_THEME, next); } catch(e){}
    setTheme(next);
  });

  /* keep following the clock until someone states a preference */
  setInterval(()=>{ if (!manual) setTheme(clockTheme()); }, 60000);
  document.addEventListener('visibilitychange', ()=>{
    if (!document.hidden && !manual) setTheme(clockTheme());
  });
}

/* ========================= OBSERVER ========================= */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    if (e.target.classList.contains('metric__v')) runCount(e.target);
    io.unobserve(e.target);
  });
}, { threshold: .15, rootMargin: '0px 0px -8% 0px' });

const observe = sel => $$(sel).forEach(el => io.observe(el));

/* ========================== RENDER ========================== */

function renderMetrics(){
  const host = $('#metrics'); if (!host) return;
  host.innerHTML = METRICS.map(m => `
    <div class="metric">
      <b class="metric__v" data-to="${m.value}" data-dec="${m.decimals}" data-unit="${esc(m.unit)}">0</b>
      <span class="metric__k">${esc(t(m.key))}</span>
    </div>`).join('');
  observe('.metric__v');
}

/* ==================================================================
   THE NUMBERS

   The old version rewrote the whole element every frame, which meant
   the unit — B, ms, h, + — did not exist until the count finished and
   then appeared out of nowhere. And a linear-ish climb through four
   digits is a water meter, not a result.

   Both the number and its unit are built ONCE and never replaced, so
   each can be animated on its own. The count runs on an exponential
   ease-out: most of the distance is covered immediately and the last
   stretch is slow, so the value settles into place rather than
   stopping dead. The unit arrives on its own curve, timed to land
   with the number instead of after it.
================================================================== */
function runCount(el){
  const to   = parseFloat(el.dataset.to) || 0;
  const dec  = parseInt(el.dataset.dec, 10) || 0;
  const unit = el.dataset.unit || '';

  el.innerHTML = `<i class="metric__n"></i><span class="metric__u">${esc(unit)}</span>`;
  const num = el.firstElementChild;

  const land = ()=>{
    num.textContent = to.toFixed(dec);
    el.style.setProperty('--p', '1');
    el.style.setProperty('--u', '1');
    el.classList.add('is-done');
  };
  if (RM){ land(); return; }

  const dur = 1900, t0 = performance.now();

  /* exponential ease-out: fast away, slow home */
  const ease = x => x >= 1 ? 1 : 1 - Math.pow(2, -7 * x);
  /* the unit's own ramp, from 45% of the run to the end */
  const unitIn = x => {
    const u = Math.min(Math.max((x - 0.45) / 0.55, 0), 1);
    return u * u * (3 - 2 * u);
  };

  const tick = now=>{
    const raw = Math.min((now - t0) / dur, 1);
    if (raw >= 1){ land(); return; }

    const p = ease(raw);
    el.style.setProperty('--p', p.toFixed(4));
    el.style.setProperty('--u', unitIn(raw).toFixed(4));
    num.textContent = (to * p).toFixed(dec);
    requestAnimationFrame(tick);
  };

  el.style.setProperty('--p', '0');
  el.style.setProperty('--u', '0');
  num.textContent = (0).toFixed(dec);
  requestAnimationFrame(tick);
}

/* ---- work ------------------------------------------------------ */

const ARROW = '<svg viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg>';
const PLAY  = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none"/></svg>';

/* A row of identically-shaped buttons gives no clue that half of them
   open a video. The mark goes in front of the label, where it is read
   before the click rather than after it. */
const isVideo = url => /youtu\.be|youtube\.com|vimeo\.com/.test(url);

/* Projects with no screenshots would otherwise be a blank half-card.
   Each gets a drawn schematic instead — the shape of the system it
   describes, in the page's own line weight. */
/* Projects with no screenshots would otherwise be a blank half-card.
   Each gets a technical schematic instead — drawn in the page's own
   line weight, at the level of an assembly drawing rather than an
   icon. They are plan views, which is how these airframes and boards
   are actually documented. */
const GLYPH = {

  /* PCBAI: a panel of four boards under a camera on its rail. The
     dots are placements from the design file; the crosses are what
     the detector actually found on the copper. One board is marked
     with a missing part. A plan view, which is how a stencil or a
     placement program is drawn. */
  pcbai: `<svg class="glyph" viewBox="0 0 520 200" preserveAspectRatio="xMidYMax meet">
      <!-- the rail and the camera head -->
      <path d="M40 22 H480" opacity=".4"/>
      <rect x="226" y="10" width="54" height="24" rx="5"/>
      <circle cx="253" cy="22" r="6"/>
      <path d="M253 34 v16" opacity=".35"/>
      <path d="M235 50 L253 34 L271 50" opacity=".3"/>

      <!-- the panel -->
      <rect x="54" y="58" width="412" height="130" rx="8"/>
      <path d="M260 58 v130" opacity=".2"/>
      <path d="M54 123 h412" opacity=".2"/>

      <!-- four boards, each with its own placements -->
      <g opacity=".75">
        <rect x="70" y="70" width="176" height="44" rx="4" opacity=".5"/>
        <rect x="274" y="70" width="176" height="44" rx="4" opacity=".5"/>
        <rect x="70" y="132" width="176" height="44" rx="4" opacity=".5"/>
        <rect x="274" y="132" width="176" height="44" rx="4" opacity=".5"/>
      </g>

      <!-- placements: small pads -->
      <g opacity=".9">
        <rect x="86" y="86" width="13" height="7" rx="1.5"/><rect x="112" y="86" width="13" height="7" rx="1.5"/>
        <rect x="138" y="86" width="7" height="13" rx="1.5"/><rect x="164" y="86" width="13" height="7" rx="1.5"/>
        <rect x="196" y="86" width="13" height="7" rx="1.5"/><rect x="220" y="86" width="7" height="13" rx="1.5"/>

        <rect x="290" y="86" width="13" height="7" rx="1.5"/><rect x="316" y="86" width="7" height="13" rx="1.5"/>
        <rect x="342" y="86" width="13" height="7" rx="1.5"/><rect x="368" y="86" width="13" height="7" rx="1.5"/>
        <rect x="400" y="86" width="7" height="13" rx="1.5"/><rect x="424" y="86" width="13" height="7" rx="1.5"/>

        <rect x="86" y="148" width="13" height="7" rx="1.5"/><rect x="112" y="148" width="7" height="13" rx="1.5"/>
        <rect x="138" y="148" width="13" height="7" rx="1.5"/><rect x="164" y="148" width="13" height="7" rx="1.5"/>
        <rect x="196" y="148" width="7" height="13" rx="1.5"/><rect x="220" y="148" width="13" height="7" rx="1.5"/>

        <rect x="290" y="148" width="13" height="7" rx="1.5"/><rect x="316" y="148" width="13" height="7" rx="1.5"/>
        <rect x="342" y="148" width="7" height="13" rx="1.5"/><rect x="368" y="148" width="13" height="7" rx="1.5"/>
        <rect x="400" y="148" width="13" height="7" rx="1.5"/><rect x="424" y="148" width="7" height="13" rx="1.5"/>
      </g>

      <!-- the one that is not there -->
      <g opacity=".95">
        <rect x="136" y="146" width="17" height="11" rx="2" stroke-dasharray="3 3"/>
        <path d="M130 140 l29 23 M159 140 l-29 23" opacity=".6"/>
      </g>

      <!-- the matched point pattern that locates a board -->
      <path d="M86 86 L138 92 L196 86 L220 92 Z" opacity=".16"/>
      <path d="M290 148 L342 154 L400 148 L424 154 Z" opacity=".16"/>
    </svg>`,

  /* EMG: eight channels of raw signal, a detection window, and the
     classified gesture after it. */
  emg: `<svg class="glyph" viewBox="0 0 520 190" preserveAspectRatio="xMidYMax meet">
      <path d="M0 150 L30 150 L38 128 L46 168 L54 112 L62 158 L70 140 L96 140 L104 120 L112 164 L120 104 L128 152 L136 142 L170 142
               L178 118 L186 170 L194 100 L202 160 L210 138 L240 138"/>
      <path d="M0 110 L34 110 L42 96 L50 124 L58 86 L66 118 L74 106 L108 106 L116 92 L124 126 L132 84 L140 116 L148 104 L240 104" opacity=".55"/>
      <path d="M0 70 L40 70 L48 60 L56 82 L64 54 L72 78 L80 68 L240 68" opacity=".3"/>
      <rect x="150" y="40" width="92" height="130" rx="6" opacity=".55"/>
      <path d="M242 104 L286 104"/>
      <path d="M286 72 L286 136 M286 72 L300 72 M286 136 L300 136"/>
      <rect x="300" y="78" width="78" height="52" rx="8"/>
      <path d="M316 104 h10 M334 94 v20 M346 99 v10 M358 90 v28" />
      <path d="M378 104 L414 104"/>
      <path d="M430 128 v-22 a10 10 0 0 1 10-10 h2 a10 10 0 0 1 10 10 v22
               M452 106 v-14 a9 9 0 0 1 9-9 h2 a9 9 0 0 1 9 9 v36
               M414 128 h78 v26 a14 14 0 0 1-14 14 h-50 a14 14 0 0 1-14-14 z"/>
    </svg>`,

  /* A Matrice-class airframe in plan view: four arms off a central
     body, folding joints, two-blade props drawn as real tapered
     blades, landing legs, and a gimbal under the nose. */
  drone: `<svg class="glyph" viewBox="0 0 520 210" preserveAspectRatio="xMidYMax meet">
      <g>
        <!-- the disc each prop sweeps -->
        <circle cx="120" cy="45" r="58" opacity=".14"/>
        <circle cx="400" cy="45" r="58" opacity=".14"/>
        <circle cx="120" cy="165" r="58" opacity=".14"/>
        <circle cx="400" cy="165" r="58" opacity=".14"/>

        <!-- arms -->
        <path d="M212 86 L126 48 M308 86 L394 48 M212 124 L126 162 M308 124 L394 162" stroke-width="2.4"/>
        <!-- folding joints -->
        <circle cx="168" cy="67" r="5"/><circle cx="352" cy="67" r="5"/>
        <circle cx="168" cy="143" r="5"/><circle cx="352" cy="143" r="5"/>

        <!-- props -->
        <path d="M 120 45 C 100 36 75 37 62 43 C 77 52 103 51 120 45 Z"/><path d="M 120 45 C 140 54 165 53 178 47 C 163 38 137 39 120 45 Z"/>
        <path d="M 400 45 C 380 36 355 37 342 43 C 357 52 383 51 400 45 Z"/><path d="M 400 45 C 420 54 445 53 458 47 C 443 38 417 39 400 45 Z"/>
        <path d="M 120 165 C 100 156 75 157 62 163 C 77 172 103 171 120 165 Z"/><path d="M 120 165 C 140 174 165 173 178 167 C 163 158 137 159 120 165 Z"/>
        <path d="M 400 165 C 380 156 355 157 342 163 C 357 172 383 171 400 165 Z"/><path d="M 400 165 C 420 174 445 173 458 167 C 443 158 417 159 400 165 Z"/>

        <!-- motors sit above the blades -->
        <circle cx="120" cy="45" r="11"/><circle cx="400" cy="45" r="11"/>
        <circle cx="120" cy="165" r="11"/><circle cx="400" cy="165" r="11"/>
        <circle cx="120" cy="45" r="3.5"/><circle cx="400" cy="45" r="3.5"/>
        <circle cx="120" cy="165" r="3.5"/><circle cx="400" cy="165" r="3.5"/>

        <!-- fuselage -->
        <path d="M212 78 h96 a26 26 0 0 1 26 26 v2 a26 26 0 0 1-26 26 h-96
                 a26 26 0 0 1-26-26 v-2 a26 26 0 0 1 26-26 z"/>
        <!-- compute bay -->
        <rect x="226" y="92" width="68" height="26" rx="5" opacity=".7"/>
        <path d="M238 99 h18 M238 106 h30 M238 112 h12" opacity=".7"/>
        <!-- landing legs -->
        <path d="M206 130 L190 184 M314 130 L330 184 M178 184 h24 M318 184 h24" stroke-width="2"/>
        <!-- gimbal -->
        <path d="M260 131 v12" stroke-width="2"/>
        <circle cx="260" cy="154" r="13"/>
        <circle cx="260" cy="154" r="6"/>
        <path d="M260 167 L222 200 M260 167 L298 200" opacity=".35"/>
      </g>
    </svg>`,

  /* An answer sheet: the identity block, a grid of bubbles with a few
     filled, and the booklet-type box the reader learns to find. */
  omr: `<svg class="glyph" viewBox="0 0 520 200" preserveAspectRatio="xMidYMax meet">
      <rect x="86" y="18" width="348" height="176" rx="10"/>
      <!-- identity block -->
      <rect x="106" y="34" width="118" height="44" rx="5" opacity=".6"/>
      <g opacity=".75">
        <circle cx="120" cy="48" r="3.4"/><circle cx="134" cy="48" r="3.4"/><circle cx="148" cy="48" r="3.4"/>
        <circle cx="162" cy="48" r="3.4"/><circle cx="176" cy="48" r="3.4"/><circle cx="190" cy="48" r="3.4"/>
        <circle cx="120" cy="64" r="3.4"/><circle cx="134" cy="64" r="3.4"/><circle cx="148" cy="64" r="3.4"/>
        <circle cx="162" cy="64" r="3.4"/><circle cx="176" cy="64" r="3.4"/><circle cx="190" cy="64" r="3.4"/>
      </g>
      <!-- booklet-type box -->
      <rect x="310" y="34" width="56" height="26" rx="5"/>
      <circle cx="326" cy="47" r="5"/>
      <circle cx="350" cy="47" r="5" fill="currentColor" stroke="none"/>
      <!-- answer grid -->
      <g opacity=".85">
        <circle cx="118" cy="104" r="5"/><circle cx="136" cy="104" r="5" fill="currentColor" stroke="none"/><circle cx="154" cy="104" r="5"/><circle cx="172" cy="104" r="5"/>
        <circle cx="118" cy="126" r="5"/><circle cx="136" cy="126" r="5"/><circle cx="154" cy="126" r="5" fill="currentColor" stroke="none"/><circle cx="172" cy="126" r="5"/>
        <circle cx="118" cy="148" r="5" fill="currentColor" stroke="none"/><circle cx="136" cy="148" r="5"/><circle cx="154" cy="148" r="5"/><circle cx="172" cy="148" r="5"/>
        <circle cx="118" cy="170" r="5"/><circle cx="136" cy="170" r="5"/><circle cx="154" cy="170" r="5"/><circle cx="172" cy="170" r="5" fill="currentColor" stroke="none"/>

        <circle cx="236" cy="104" r="5"/><circle cx="254" cy="104" r="5"/><circle cx="272" cy="104" r="5" fill="currentColor" stroke="none"/><circle cx="290" cy="104" r="5"/>
        <circle cx="236" cy="126" r="5" fill="currentColor" stroke="none"/><circle cx="254" cy="126" r="5"/><circle cx="272" cy="126" r="5"/><circle cx="290" cy="126" r="5"/>
        <circle cx="236" cy="148" r="5"/><circle cx="254" cy="148" r="5"/><circle cx="272" cy="148" r="5"/><circle cx="290" cy="148" r="5" fill="currentColor" stroke="none"/>
        <circle cx="236" cy="170" r="5"/><circle cx="254" cy="170" r="5" fill="currentColor" stroke="none"/><circle cx="272" cy="170" r="5"/><circle cx="290" cy="170" r="5"/>

        <circle cx="354" cy="104" r="5"/><circle cx="372" cy="104" r="5"/><circle cx="390" cy="104" r="5"/><circle cx="408" cy="104" r="5" fill="currentColor" stroke="none"/>
        <circle cx="354" cy="126" r="5"/><circle cx="372" cy="126" r="5" fill="currentColor" stroke="none"/><circle cx="390" cy="126" r="5"/><circle cx="408" cy="126" r="5"/>
        <circle cx="354" cy="148" r="5" fill="currentColor" stroke="none"/><circle cx="372" cy="148" r="5"/><circle cx="390" cy="148" r="5"/><circle cx="408" cy="148" r="5"/>
        <circle cx="354" cy="170" r="5"/><circle cx="372" cy="170" r="5"/><circle cx="390" cy="170" r="5" fill="currentColor" stroke="none"/><circle cx="408" cy="170" r="5"/>
      </g>
      <!-- the detected column/row graph -->
      <path d="M118 92 v92 M236 92 v92 M354 92 v92" opacity=".22"/>
      <path d="M104 104 h316 M104 126 h316" opacity=".16"/>
    </svg>`,

  smarthome: `<svg class="glyph" viewBox="0 0 520 190" preserveAspectRatio="xMidYMax meet">
      <path d="M196 176 L196 92 L260 42 L324 92 L324 176 Z"/>
      <path d="M260 176 L260 124 M232 124 L288 124"/>
      <circle cx="260" cy="92" r="9"/><circle cx="260" cy="92" r="3.5" fill="currentColor" stroke="none"/>
      <path d="M236 70 a34 34 0 0 1 48 0" opacity=".45"/>
      <path d="M226 58 a48 48 0 0 1 68 0" opacity=".25"/>
      <rect x="86" y="120" width="72" height="46" rx="7"/>
      <path d="M100 134 h20 M100 144 h34 M100 154 h14" opacity=".6"/>
      <path d="M158 143 L196 143" opacity=".5"/>
      <rect x="362" y="120" width="72" height="46" rx="7"/>
      <path d="M376 134 h20 M376 144 h34 M376 154 h14" opacity=".6"/>
      <path d="M324 143 L362 143" opacity=".5"/>
    </svg>`,

  minibus: `<svg class="glyph" viewBox="0 0 520 180" preserveAspectRatio="xMidYMax meet">
      <path d="M134 60 h208 a30 30 0 0 1 28 19 l16 42 a14 14 0 0 1-13 19 H134 a14 14 0 0 1-14-14 V74 a14 14 0 0 1 14-14 z"/>
      <path d="M150 78 h44 v30 h-44 z M206 78 h44 v30 h-44 z M262 78 h44 v30 h-44 z" opacity=".55"/>
      <path d="M318 78 h26 l14 30 h-40 z" opacity=".55"/>
      <circle cx="182" cy="140" r="17"/><circle cx="182" cy="140" r="6"/>
      <circle cx="330" cy="140" r="17"/><circle cx="330" cy="140" r="6"/>
      <path d="M120 128 h40 M352 128 h30" opacity=".4"/>
      <path d="M402 44 a30 30 0 0 1 0 44" opacity=".35"/>
      <path d="M414 32 a46 46 0 0 1 0 68" opacity=".2"/>
      <circle cx="396" cy="66" r="5" fill="currentColor" stroke="none"/>
    </svg>`
};

let filter = 'all';

function renderWork(){
  const host = $('#workGrid'); if (!host) return;

  host.innerHTML = PROJECTS.map(p => {
    const wide = p.span === 6;
    const media = p.media.length
      ? `<div class="shelf ${p.orientation === 'portrait' ? 'shelf--portrait' : ''}">
           ${p.media.map(src => `<img src="${esc(src)}" alt="" loading="lazy" decoding="async">`).join('')}
         </div>`
      : (GLYPH[p.id] || '');

    return `
      <article class="card ${wide ? 'card--wide' : ''} ${p.media.length ? '' : 'card--text'}" data-cat="${esc(p.cat)}" data-id="${esc(p.id)}">
        ${p.stat ? `<span class="stat"><b>${esc(p.stat.v)}</b><span class="mono">${esc(t(p.stat.k))}</span></span>` : ''}
        <div class="card__body">
          <span class="card__top">
            <span class="mono">${esc(t('f.' + p.cat))}</span>
            <span class="mono card__year">· ${esc(p.year)}</span>
          </span>
          <h3 class="card__t">${esc(t(p.id + '.t'))}</h3>
          <p class="card__o">${esc(t(p.id + '.o'))}</p>
          <p class="card__d">${esc(t(p.id + '.d'))}</p>
          <div class="chips">${p.stack.map(s => `<span class="chip">${esc(s)}</span>`).join('')}</div>
          ${p.links.length ? `<div class="card__links">${p.links.map(l => {
            const v = isVideo(l.url);
            /* an internal page stays in the tab; only outbound links leave */
            const ext = /^https?:/.test(l.url);
            return `<a class="linkbtn${v ? ' linkbtn--v' : ''}" href="${esc(l.url)}"${ext ? ' target="_blank" rel="noopener"' : ''}>`
                 + (v ? PLAY : '') + esc(t(l.k)) + (v ? '' : ARROW) + `</a>`;
          }).join('')}</div>` : ''}
        </div>
        ${media}
      </article>`;
  }).join('');

  applyFilter(filter, true);
  observe('.card');
}

function renderFilters(){
  const host = $('#filters'); if (!host) return;
  const pill = host.querySelector('.filters__pill');
  host.innerHTML = '';
  if (pill) host.appendChild(pill);
  FILTERS.forEach((f, i) => {
    const b = document.createElement('button');
    b.dataset.filter = f;
    b.textContent = t('f.' + f);
    if (f === filter) b.classList.add('is-on');
    host.appendChild(b);
  });
}

/* FLIP. Measure where each card is, change the set, measure where it
   landed, then play each one from the old slot to the new one.
   Every pass cancels the previous one: filters get clicked faster than
   the sequence runs, and an exit left filled forwards pins opacity 0
   onto cards that later come back. */
let filterTimer = null;

function clearAnims(items){
  items.forEach(el=>{
    el.getAnimations?.().forEach(a => a.cancel());
    el.style.opacity = '';
    el.style.transform = '';
    el.style.filter = '';
  });
}

function applyFilter(cat, silent = false){
  filter = cat;
  const items = $$('#workGrid .card');
  const hit = el => cat === 'all' || el.dataset.cat === cat;

  clearTimeout(filterTimer); filterTimer = null;
  clearAnims(items);

  if (silent || RM){
    items.forEach(el=>{
      el.classList.toggle('is-out', !hit(el));
      if (hit(el) && !silent) el.classList.add('is-in');
    });
    return;
  }

  const before = new Map();
  items.forEach(el => { if (!el.classList.contains('is-out')) before.set(el, el.getBoundingClientRect()); });

  const leaving = items.filter(el => before.has(el) && !hit(el));
  leaving.forEach((el, i) => {
    el.animate([{ opacity:1, transform:'scale(1)' }, { opacity:0, transform:'scale(.95)' }],
               { duration:220, delay:i*16, easing:'cubic-bezier(.4,0,1,1)' });
    el.style.opacity = '0';
  });

  const commit = ()=>{
    filterTimer = null;
    clearAnims(items);
    items.forEach(el=>{
      el.classList.toggle('is-out', !hit(el));
      if (hit(el)) el.classList.add('is-in');
    });

    let step = 0;
    items.filter(hit).forEach(el=>{
      const after = el.getBoundingClientRect();
      const prev = before.get(el);
      if (prev){
        const dx = prev.left - after.left, dy = prev.top - after.top;
        if (Math.abs(dx) > .5 || Math.abs(dy) > .5){
          el.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }],
                     { duration:580, easing:'cubic-bezier(.22,1,.36,1)' });
        }
      } else {
        el.animate([{ opacity:0, transform:'translateY(22px) scale(.97)', filter:'blur(5px)' },
                    { opacity:1, transform:'none', filter:'blur(0)' }],
                   { duration:660, delay:140 + (step++ % 6) * 50,
                     easing:'cubic-bezier(.22,1,.36,1)', fill:'backwards' });
      }
    });
  };

  if (leaving.length) filterTimer = setTimeout(commit, 190);
  else commit();
}

/* ---- stack, path, profile, contact ----------------------------- */

function renderStack(){
  const host = $('#stackGrid'); if (!host) return;
  host.innerHTML = SKILLS.map(s => `
    <div class="stackcard">
      <span class="mono">${esc(s.num)}</span>
      <h3>${esc(t(s.key))}</h3>
      <ul>${s.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`).join('');
  observe('.stackcard');
}

function renderPath(){
  const host = $('#pathList'); if (!host) return;
  host.innerHTML = EXPERIENCE.map(j => `
    <div class="job">
      <div>
        <h3 class="job__t">${esc(t(j.id + '.t'))}</h3>
        <p class="job__o">${esc(j.org)}</p>
        <div class="job__meta">
          <span class="mono">${esc(j.range)}</span>
          <span class="dot"></span>
          <span class="mono">${esc(t(j.type))}</span>
        </div>
      </div>
      <ul>${j.bullets.map(b => `<li>${esc(t(b))}</li>`).join('')}</ul>
    </div>`).join('');
  observe('.job');
}

function renderLangs(){
  const host = $('#langList'); if (!host) return;
  host.innerHTML = LANG_LEVELS.map(l => `
    <div class="lrow">
      <span>${esc(t(l.key))}</span>
      <b class="mono">${esc(t(l.lv))}</b>
      <i class="bar" style="--v:${l.v}%"></i>
    </div>`).join('');
}

const ICON = {
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="4.5" width="19" height="15" rx="2.5"/><path d="m3.5 7 7.3 5.2a2 2 0 0 0 2.4 0L20.5 7"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7.6 3.5h-2A2.1 2.1 0 0 0 3.5 5.8C3.5 14 10 20.5 18.2 20.5a2.1 2.1 0 0 0 2.3-2.1v-2a1.4 1.4 0 0 0-1.1-1.4l-3-.6a1.4 1.4 0 0 0-1.4.6l-.8 1.2a12.3 12.3 0 0 1-5.4-5.4l1.2-.8a1.4 1.4 0 0 0 .6-1.4l-.6-3a1.4 1.4 0 0 0-1.4-1.1z"/></svg>',
  github: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.1 4.8 18.1 5.1 18.1 5.1c.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zm1.78 13.02H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
  x: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41z"/></svg>'
};



function renderContact(){
  const host = $('#contactCards'); if (!host) return;
  const items = [
    { k:'c.email',    v:LINKS.email,       href:'mailto:' + LINKS.email, icon:'email', copy:LINKS.email },
    { k:'c.phone',    v:LINKS.phone,       href:'tel:' + LINKS.phone,    icon:'phone', copy:LINKS.phone },
    { k:'c.github',   v:'/Alansi775',      href:LINKS.github,            icon:'github' },
    { k:'c.linkedin', v:'/mohamed-saleh',  href:LINKS.linkedin,          icon:'linkedin' }
  ];
  host.innerHTML = items.map(i => `
    <a class="ccard" href="${esc(i.href)}" ${i.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}
       ${i.copy ? `data-copy="${esc(i.copy)}"` : ''}>
      ${ICON[i.icon]}
      <span class="mono">${esc(t(i.k))}</span>
      <span class="ccard__v" dir="ltr">${esc(i.v)}</span>
      <span class="ccard__ar">↗</span>
    </a>`).join('');
  observe('.ccard');

  const soc = $('#social');
  if (soc) soc.innerHTML = ['github','linkedin','youtube','x'].map(k =>
    `<a class="iconbtn" href="${esc(LINKS[k])}" target="_blank" rel="noopener" aria-label="${k}">${ICON[k]}</a>`).join('');
}

function renderAll(){
  renderMetrics();
  renderFilters();
  renderWork();
  renderStack();
  renderPath();
  renderLangs();
  renderContact();
}

/* ====================== HEADLINE SPLITTING ================== */
/* Arabic is cursive: a letter's shape depends on its neighbours and it
   joins them, so per-character boxes would force isolated forms and
   break every join. The word is the smallest unit that survives in
   every script here, so everything splits at the word. */

function splitHeadlines(){
  /* Read the CURRENT text every time. Caching it on the first run stored
     the English copy, and re-splitting after a language switch then wrote
     that cached English back over the translation. applyLang sets
     textContent from the dictionary immediately before this runs, so
     textContent is always the correct source. */
  $$('[data-split]').forEach(el=>{
    const text = el.textContent.trim();
    if (!text) return;
    /* A word wrapped in ~tildes~ in the dictionary is the accent word.
       Marking it in the copy rather than by index means each language
       can place its own emphasis where the sentence actually wants it. */
    el.innerHTML = text.split(/\s+/)
      .map((w, i) => {
        const hit = /^~.+~[.,،؛!?]?$/.test(w);
        const clean = w.replace(/~/g, '');
        return `<span class="w${hit ? ' w--accent' : ''}" style="--i:${i}">${esc(clean)}</span>`;
      })
      .join(' ');
  });

  $$('.reveal-lines').forEach(el=>{
    const text = el.textContent.trim();
    if (!text) return;
    el.innerHTML = text.split(/\s+/)
      .map((w, i) => `<span class="rw"><i style="--i:${i}">${esc(w)}</i></span>`)
      .join(' ');
    el.classList.remove('is-in');
    io.observe(el);
  });
}

/* ========================== CHROME ========================== */

function initNav(){
  const nav = $('#nav');
  const bar = $('#progressBar');

  const onScroll = ()=>{
    const y = scrollY;
    nav?.classList.toggle('is-stuck', y > 20);
    if (bar){
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
  };
  addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  const links = $$('.nav__links a');
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver(es=>{
    es.forEach(e=>{
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { threshold:.2, rootMargin:'-40% 0px -50% 0px' });
  secs.forEach(s => spy.observe(s));
}

function closeMenu(){
  $('#burger')?.classList.remove('is-on');
  $('#menu')?.classList.remove('is-on');
  document.body.classList.remove('is-locked');
}

function initMenu(){
  const burger = $('#burger'), menu = $('#menu');
  if (!burger || !menu) return;

  burger.addEventListener('click', ()=>{
    const on = !menu.classList.contains('is-on');
    burger.classList.toggle('is-on', on);
    menu.classList.toggle('is-on', on);
    document.body.classList.toggle('is-locked', on);
  });

  /* Delegated: a bound listener is tied to the element that existed
     when it was attached, and language switching re-runs a lot of the
     page. Delegation matches on the way up, for the page's lifetime. */
  document.addEventListener('click', e=>{
    if (!menu.classList.contains('is-on')) return;
    if (e.target.closest('#menuClose') || e.target.closest('.menu__links a')) closeMenu();
    else if (e.target === menu) closeMenu();
  });

  addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
}

/* copy-to-clipboard on the email and phone cards */
function initCopy(){
  document.addEventListener('click', e=>{
    const card = e.target.closest('[data-copy]');
    if (!card) return;
    const value = card.dataset.copy;
    if (!navigator.clipboard) return;          // let the link do its job
    e.preventDefault();
    navigator.clipboard.writeText(value)
      .then(()=> toast(t('c.copied') + ' · ' + value))
      .catch(()=> { location.href = card.getAttribute('href'); });
  });
}

let toastTimer;
function toast(msg){
  const el = $('#toast'); if (!el) return;
  el.textContent = msg;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> el.classList.remove('is-on'), 2600);
}

/* ============================ BOOT ========================== */
function boot(){
  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  document.addEventListener('click', e=>{
    const b = e.target.closest('[data-setlang]');
    if (b) applyLang(b.dataset.setlang);
  });

  $('#langbtn')?.addEventListener('click', ()=>{
    applyLang(LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]);
  });

  $('#filters')?.addEventListener('click', e=>{
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    $$('#filters [data-filter]').forEach(x => x.classList.toggle('is-on', x === b));
    movePill($('#filters'), b);
    applyFilter(b.dataset.filter);
  });

  applyLang(lang, { rerender:false });
  renderAll();
  splitHeadlines();
  observe('.reveal');

  initTheme();
  initNav();
  initMenu();
  initCopy();
  initField($('#field'));
  initSystem({ t, PIPELINE });
  initAssistant({ t, lang: () => lang });
  initLightbox({ t });

  document.body.classList.add('is-ready');

  const settle = ()=>{
    movePill($('.seg'), $(`.seg [data-setlang="${lang}"]`));
    movePill($('#filters'), $('#filters .is-on'));
  };
  settle();
  if (document.fonts?.ready) document.fonts.ready.then(settle);
  if (window.ResizeObserver){
    const ro = new ResizeObserver(settle);
    [$('.seg'), $('#filters')].forEach(el => el && ro.observe(el));
  }
}

if (document.readyState === 'loading') addEventListener('DOMContentLoaded', boot);
else boot();
