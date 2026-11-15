/* ==================================================================
   LIGHTBOX

   A viewer for the project screenshots. The one idea it is built on:
   the image grows FROM the thumbnail you pressed, and shrinks back
   INTO it. A viewer that fades in from nowhere loses the thread —
   you forget which of twenty shots you opened. FLIP keeps the thread.

   Everything else follows from that: the backdrop softens the page
   instead of hiding it, the shelf stays where it was, and closing
   returns the image to its place in the row.
================================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

let group = [];        // the shelf we opened from
let index = 0;
let open  = false;
let origin = null;     // the thumbnail that was pressed
let tr = k => k;

export function initLightbox({ t }){
  tr = t;

  const box = $('#lb');
  if (!box) return;

  /* delegated: the shelves are re-rendered on every language switch */
  document.addEventListener('click', e=>{
    const img = e.target.closest('.shelf img');
    if (!img) return;
    e.preventDefault();
    const shelf = img.closest('.shelf');
    group = $$('img', shelf);
    openAt(group.indexOf(img), img);
  });

  $('#lbClose')?.addEventListener('click', close);
  $('#lbPrev') ?.addEventListener('click', ()=> step(-1));
  $('#lbNext') ?.addEventListener('click', ()=> step(1));

  /* the backdrop closes; the image itself does not */
  box.addEventListener('click', e=>{
    if (e.target === box || e.target.classList.contains('lb__stage')) close();
  });

  addEventListener('keydown', e=>{
    if (!open) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft')  step(-1);
  });

  /* swipe, for the shelves on a phone */
  let x0 = null;
  box.addEventListener('touchstart', e=>{ x0 = e.touches[0].clientX; }, { passive:true });
  box.addEventListener('touchend', e=>{
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive:true });
}

function openAt(i, thumb){
  index  = i;
  origin = thumb;
  open   = true;

  const box = $('#lb');
  const img = $('#lbImg');

  img.src = thumb.currentSrc || thumb.src;
  img.alt = thumb.alt || '';
  paintMeta();

  document.body.classList.add('lb-on');
  box.classList.add('is-on');

  flipFrom(thumb);
  $('#lbClose')?.focus({ preventScroll:true });
}

/* FIRST / LAST / INVERT / PLAY, against the thumbnail's real box. */
function flipFrom(thumb){
  if (RM) return;
  const img = $('#lbImg');

  const from = thumb.getBoundingClientRect();
  // let the viewer lay the image out at its final size first
  requestAnimationFrame(()=>{
    const to = img.getBoundingClientRect();
    if (!to.width || !from.width) return;

    const sx = from.width  / to.width;
    const sy = from.height / to.height;
    const dx = (from.left + from.width  / 2) - (to.left + to.width  / 2);
    const dy = (from.top  + from.height / 2) - (to.top  + to.height / 2);

    img.animate(
      [{ transform:`translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, borderRadius:'18px' },
       { transform:'none', borderRadius:'14px' }],
      { duration:520, easing:'cubic-bezier(.22,1,.36,1)' }
    );
  });
}

function close(){
  if (!open) return;
  open = false;

  const box = $('#lb');
  const img = $('#lbImg');
  const back = origin;

  const finish = ()=>{
    box.classList.remove('is-on');
    document.body.classList.remove('lb-on');
    back?.focus?.({ preventScroll:true });
  };

  if (RM || !back){ finish(); return; }

  /* return it to the thumbnail it came from, so the row you were
     reading is still where you left it */
  const to   = back.getBoundingClientRect();
  const from = img.getBoundingClientRect();
  const sx = to.width  / from.width;
  const sy = to.height / from.height;
  const dx = (to.left + to.width  / 2) - (from.left + from.width  / 2);
  const dy = (to.top  + to.height / 2) - (from.top  + from.height / 2);

  const a = img.animate(
    [{ transform:'none', opacity:1 },
     { transform:`translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, opacity:.35 }],
    { duration:420, easing:'cubic-bezier(.4,0,.2,1)' }
  );
  box.classList.add('is-closing');
  a.finished.then(()=>{ box.classList.remove('is-closing'); finish(); }).catch(finish);
}

function step(d){
  if (!group.length) return;
  index = (index + d + group.length) % group.length;
  const next = group[index];
  const img  = $('#lbImg');

  img.animate(
    [{ opacity:0, transform:`translateX(${d * 26}px)` },
     { opacity:1, transform:'none' }],
    { duration:360, easing:'cubic-bezier(.22,1,.36,1)' }
  );
  img.src = next.currentSrc || next.src;
  origin  = next;
  paintMeta();

  // keep the shelf scrolled to whatever is on screen
  next.scrollIntoView({ block:'nearest', inline:'center', behavior:'smooth' });
}

function paintMeta(){
  const c = $('#lbCount');
  if (c) c.textContent =
    String(index + 1).padStart(2, '0') + ' / ' + String(group.length).padStart(2, '0');
  const nav = $('#lb .lb__nav');
  if (nav) nav.hidden = group.length < 2;
}
