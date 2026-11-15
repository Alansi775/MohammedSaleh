/* ==================================================================
   SIGNAL FIELD

   The hero's backdrop is not decoration borrowed from a template: it
   is the thing the work is about. Eight traces of noisy signal — the
   shape of an EMG array — drift until they are "inferred", at which
   point they collapse onto a clean, coherent waveform and a decision
   boundary resolves across them.

   It runs the convergence continuously and slowly, so the hero is
   never static, and it reads as an instrument rather than an effect.

   Everything here is one canvas and one rAF loop. No library.
================================================================== */

const TRACES = 8;
const PTS    = 150;           // samples per trace

export function initField(canvas){
  if (!canvas) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  let w = 0, h = 0, dpr = 1, raf = null;
  let running = true;

  /* Per-trace noise seeds. Keeping them fixed means the "noisy" state
     is stable rather than flickering: the signal looks recorded, not
     randomised every frame. */
  const seeds = Array.from({ length: TRACES }, () => ({
    a: Math.random() * 6.283,
    b: Math.random() * 6.283,
    c: 0.6 + Math.random() * 1.8,
    d: 1.2 + Math.random() * 2.4,
    j: Array.from({ length: PTS }, () => (Math.random() * 2 - 1))
  }));

  const resize = ()=>{
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width  = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  /* The ink has to follow the theme: the field is drawn, not themed by
     CSS, so it reads the resolved foreground colour each frame. */
  const ink = ()=>
    getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#111';

  const accent = ()=>
    getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#0071e3';

  /* 0 = raw noise, 1 = fully converged. A long, eased triangle wave so
     the scene breathes between the two states. */
  const conv = t => {
    const period = 11000;
    const x = (t % period) / period;
    const tri = x < 0.5 ? x * 2 : (1 - x) * 2;
    return tri * tri * (3 - 2 * tri);          // smoothstep
  };

  const frame = now=>{
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    const k = conv(now);
    const mid = h * 0.52;
    const spread = Math.min(h * 0.30, 220);
    const colour = ink();

    /* --- the traces ------------------------------------------- */
    for (let s = 0; s < TRACES; s++){
      const sd = seeds[s];

      /* noisy: fanned out across the band. converged: all collapsing
         toward one shared waveform at the centre. */
      const lane = (s / (TRACES - 1) - 0.5) * 2;        // -1..1
      const baseY = mid + lane * spread * (1 - k * 0.86);

      ctx.beginPath();
      for (let i = 0; i < PTS; i++){
        const u = i / (PTS - 1);
        const x = u * w;

        /* the shared signal every trace resolves onto */
        const signal =
          Math.sin(u * 9 + now / 1400) * 26 +
          Math.sin(u * 23 - now / 900) * 9;

        /* this trace's own noise */
        const noise =
          Math.sin(u * sd.d * 18 + sd.a + now / 700) * 20 +
          Math.cos(u * sd.c * 29 + sd.b - now / 520) * 13 +
          sd.j[i] * 16;

        const y = baseY + noise * (1 - k) + signal * k;

        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }

      ctx.strokeStyle = colour;
      /* converged traces overlap, so they fade as they merge —
         otherwise eight stacked lines read as one heavy stroke */
      ctx.globalAlpha = (0.10 + 0.16 * (1 - k)) * (s === 0 ? 1.6 : 1);
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    /* --- the decision line, drawn only once inference holds ---- */
    if (k > 0.55){
      const a = (k - 0.55) / 0.45;
      ctx.beginPath();
      for (let i = 0; i < PTS; i++){
        const u = i / (PTS - 1);
        const x = u * w;
        const y = mid +
          Math.sin(u * 9 + now / 1400) * 26 +
          Math.sin(u * 23 - now / 900) * 9;
        i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
      }
      ctx.strokeStyle = accent();
      ctx.globalAlpha = a * 0.5;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  };

  const start = ()=>{ if (!raf){ running = true; raf = requestAnimationFrame(frame); } };
  const stop  = ()=>{ running = false; if (raf){ cancelAnimationFrame(raf); raf = null; } };

  resize();
  start();

  addEventListener('resize', ()=>{ resize(); }, { passive:true });

  /* A canvas painting 1 200 points a frame has no business running
     while it is off-screen or the tab is hidden. */
  document.addEventListener('visibilitychange', ()=> document.hidden ? stop() : start());

  const io = new IntersectionObserver(es=>{
    es.forEach(e => e.isIntersecting ? start() : stop());
  }, { threshold: 0 });
  io.observe(canvas);
}
