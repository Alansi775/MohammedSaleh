/* ==================================================================
   CASE STUDY PAGE
   The portfolio's chrome without the portfolio: theme, reading
   progress, and nothing else. A long technical page does not need an
   assistant, a signal field or a scroll-scrubbed scene — it needs to
   get out of the way.
================================================================== */

/* Each case page names its own dictionary on <body data-copy="...">,
   so this one file drives all of them and a reader only ever
   downloads the prose for the page they opened. */
const { C } = await import(`./${document.body.dataset.copy || 'case-i18n'}.js`);

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ==================================================================
   LANGUAGE
   The same storage key the rest of the site uses, so a reader who
   switched to Arabic on the portfolio does not land here in English.
================================================================== */
const LANGS = ['en', 'ar', 'tr'];
const DIR = { en:'ltr', ar:'rtl', tr:'ltr' };
const LS_LANG = 'ms.lang';

let lang = (()=>{
  try {
    const saved = localStorage.getItem(LS_LANG);
    if (LANGS.includes(saved)) return saved;
  } catch(e){}
  const n = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return LANGS.includes(n) ? n : 'en';
})();

const t = k => (C[lang] && C[lang][k]) ?? (C.en[k] ?? '');

function movePill(wrap, btn){
  if (!wrap || !btn) return;
  const pill = wrap.querySelector('.seg__pill');
  if (!pill) return;
  const pad = parseFloat(getComputedStyle(wrap).paddingLeft) || 0;
  pill.style.width = btn.offsetWidth + 'px';
  pill.style.transform = `translateX(${btn.offsetLeft - pad}px)`;
}

function applyLang(next){
  lang = next;
  try { localStorage.setItem(LS_LANG, lang); } catch(e){}

  const root = document.documentElement;
  root.lang = lang;
  root.dir  = DIR[lang];

  $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });

  /* A handful of sentences carry <strong> or <em> inside them. Those
     strings come from this repository, never from user input, so
     inserting them as markup is safe here — splitting each one into
     three nodes to avoid it would make the dictionary unreadable. */
  $$('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });

  document.title = t('c.title');

  $$('[data-setlang]').forEach(b => b.classList.toggle('is-on', b.dataset.setlang === lang));
  const chip = $('#langbtn span');
  if (chip) chip.textContent = { en:'EN', ar:'\u0639', tr:'TR' }[lang] || lang.toUpperCase();
  movePill($('.seg'), $(`.seg [data-setlang="${lang}"]`));
}

function initLang(){
  document.addEventListener('click', e=>{
    const b = e.target.closest('[data-setlang]');
    if (b) applyLang(b.dataset.setlang);
  });
  $('#langbtn')?.addEventListener('click', ()=>{
    applyLang(LANGS[(LANGS.indexOf(lang) + 1) % LANGS.length]);
  });

  applyLang(lang);

  const settle = ()=> movePill($('.seg'), $(`.seg [data-setlang="${lang}"]`));
  if (document.fonts?.ready) document.fonts.ready.then(settle);
  if (window.ResizeObserver){
    const el = $('.seg');
    if (el) new ResizeObserver(settle).observe(el);
  }
}

const LS_THEME = 'ms.theme';
const DAY = [7, 19];

const clockTheme = () => {
  const h = new Date().getHours();
  return (h >= DAY[0] && h < DAY[1]) ? 'light' : 'dark';
};
const currentTheme = () => document.documentElement.dataset.theme || 'light';

/* iOS will not reliably repaint its bars when an existing theme-color
   meta changes, so the element is replaced; stale tags are removed
   first because Safari honours the first one it finds. */
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

  setInterval(()=>{ if (!manual) setTheme(clockTheme()); }, 60000);
}

/* How far through the piece you are. On a page this long it is the
   one bit of feedback worth having. */
function initProgress(){
  const nav = $('#nav');
  const bar = $('#progressBar');
  let ticking = false;

  const paint = ()=>{
    const y = scrollY;
    nav?.classList.toggle('is-stuck', y > 20);
    if (bar){
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = (max > 0 ? Math.min(y / max, 1) * 100 : 0) + '%';
    }
    ticking = false;
  };

  addEventListener('scroll', ()=>{
    if (!ticking){ ticking = true; requestAnimationFrame(paint); }
  }, { passive:true });
  paint();
}

initLang();
initTheme();
initProgress();
