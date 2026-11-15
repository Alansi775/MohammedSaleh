/* ==================================================================
   CASE STUDY PAGE
   The portfolio's chrome without the portfolio: theme, reading
   progress, and nothing else. A long technical page does not need an
   assistant, a signal field or a scroll-scrubbed scene — it needs to
   get out of the way.
================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

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

initTheme();
initProgress();
