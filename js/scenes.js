/* ==================================================================
   THE SYSTEM LOOP

   A sticky stage with a tall runway above it. Scroll position is the
   transport: the four stages of the loop resolve one after another,
   the ring behind them draws its arc to match, and the node for the
   active stage lights.

   Nothing runs on a timer, so it scrubs in both directions and holds
   wherever the reader stops.
================================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ss  = t => { t = clamp(t); return t * t * t * (t * (t * 6 - 15) + 10); };
const seg = (p, a, b) => ss((p - a) / (b - a));

let stages = [], nodes = [], booted = false, rebuild = null;

export function initSystem({ t, PIPELINE }){
  if (booted){ rebuild?.(); return; }
  booted = true;

  const sec   = $('#system');
  const host  = $('#stages');
  const arc   = $('#loopArc');
  const nodeG = $('#loopNodes');
  const rail  = $('#sysRail');
  const count = $('#sysCount');
  const head  = $('.system__head');
  if (!sec || !host) return;

  const N = PIPELINE.length;

  /* ---- build ---------------------------------------------------- */
  const build = ()=>{
    host.innerHTML = PIPELINE.map(s => `
      <article class="stage">
        <span class="stage__n">${s.num}</span>
        <h3 class="stage__t">${esc(t(s.key))}</h3>
        <p class="stage__d">${esc(t(s.key + '.d'))}</p>
      </article>`).join('');
    stages = $$('.stage', host);

    /* one node per stage, placed around the ring */
    nodeG.innerHTML = PIPELINE.map((_, i) => {
      const a = -Math.PI / 2 + (i / N) * Math.PI * 2;
      const x = Math.cos(a) * 120, y = Math.sin(a) * 120;
      return `<circle class="loop__node" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>`;
    }).join('');
    nodes = $$('.loop__node', nodeG);
  };

  build();
  rebuild = build;

  if (RM){
    stages.forEach(s => { s.style.opacity = 1; });
    return;
  }

  /* ---- scrub ---------------------------------------------------- */
  let ticking = false;
  const onScroll = ()=>{
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(()=>{ paint(); ticking = false; });
  };
  addEventListener('scroll', onScroll, { passive:true });
  addEventListener('resize', onScroll);
  paint();

  function paint(){
    const r = sec.getBoundingClientRect();
    const runway = r.height - innerHeight;
    if (runway <= 0) return;
    const p = clamp(-r.top / runway);

    /* The heading leads, then steps back so the stages own the frame. */
    if (head) head.style.setProperty('--p', (1 - ss(clamp((p - 0.06) / 0.1))).toFixed(3));

    /* Each stage owns a slice, and neighbours overlap: one is always
       arriving while another leaves, so the cut never lands empty. */
    const each = 1 / N;
    let active = 0;

    stages.forEach((el, i) => {
      const last  = i === N - 1;
      const start = i * each;
      const inP   = seg(p, start - each * 0.45, start + each * 0.38);
      const outP  = last ? 0 : seg(p, start + each * 0.55, start + each * 1.05);
      const life  = inP * (1 - outP);

      if (life > 0.45) active = i;

      const z  = (1 - inP) * -620 + outP * 520;
      const y  = (1 - inP) * 46 - outP * 40;
      const sc = 0.92 + 0.08 * inP + outP * 0.1;

      el.style.opacity   = life.toFixed(3);
      el.style.transform = `translate3d(0,${y.toFixed(1)}px,${z.toFixed(1)}px) scale(${sc.toFixed(3)})`;
      el.style.filter    = `blur(${((1 - inP) * 10 + outP * 10).toFixed(2)}px)`;
    });

    /* the ring draws its arc to the reader's position in the loop */
    if (arc){
      const a0 = -Math.PI / 2;
      const a1 = a0 + Math.PI * 2 * clamp(p);
      arc.setAttribute('d', arcPath(120, a0, a1));
    }
    /* the live stage is accented; the ones behind it are merely filled,
       so the dial reads as a position rather than a progress bar */
    nodes.forEach((n, i) => {
      n.classList.toggle('is-on', i === active);
      n.classList.toggle('is-past', i < active);
    });

    if (rail)  rail.style.setProperty('--p', p.toFixed(4));
    if (count) count.textContent =
      String(active + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
  }
}

/* an SVG arc on a circle of radius r, from a0 to a1 */
function arcPath(r, a0, a1){
  const sweep = a1 - a0;
  if (Math.abs(sweep) < 0.001) return '';
  const x0 = Math.cos(a0) * r, y0 = Math.sin(a0) * r;
  const x1 = Math.cos(a1) * r, y1 = Math.sin(a1) * r;
  const large = Math.abs(sweep) > Math.PI ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

const esc = s => String(s).replace(/[&<>"]/g,
  m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m]));
