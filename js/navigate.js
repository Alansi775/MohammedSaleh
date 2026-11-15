/* ==================================================================
   PAGE NAVIGATION FOR THE ASSISTANT

   The assistant knows the work; the page holds it. This connects the
   two: when an answer is about a specific project, the reply carries
   controls that take you to that card on the page, and open its
   screenshots.

   The matching is done HERE, in the client, not by asking the model to
   emit commands. Two reasons:
     - the model is behind a fallback chain of three providers, and
       none of them can be relied on to return a strict format
     - a wrong scroll is worse than no scroll, so the trigger has to be
       something verifiable: the project's own name, its stack, or the
       words the page already uses for it
================================================================== */

import { PROJECTS } from './data.js';

const $ = (s, r = document) => r.querySelector(s);

/* Terms that identify a project with near-certainty. Deliberately
   narrow: a shared word like "AI" or "app" matches everything, so
   only distinctive names are listed. */
const TERMS = {
  omr: ['omr', 'optical mark', 'answer sheet', 'exam', 'deneme', 'msg', 'bubble sheet',
        'أوبتك', 'ورقة الإجابة', 'اختبار', 'امتحان', 'optik', 'sınav', 'cevap'],
  emg: ['emg', 'gesture', 'myo', 'prosthetic', 'armband', 'muscle', 'biomechatronic',
        'إيماء', 'العضلات', 'الذراع', 'طرف صناعي', 'jest', 'protez', 'kas'],
  noota: ['noota', 'voice translation', 'voice clone', 'translation app', 'timbre',
          'نوتا', 'ترجمة صوتية', 'استنساخ', 'ses çeviri', 'seslendirme'],
  drone: ['drone', 'px4', 'pixhawk', 'mavsdk', 'quadcopter', 'uav', 'orange cube',
          'jetson', 'xavier', 'arducam', 'here4', 'rtk', 'flight',
          'درون', 'طائرة', 'الطيران', 'insansız', 'uçuş'],
  yshop: ['yshop', 'y-shop', 'commerce', 'e-commerce', 'recommendation', 'rag',
          'vector', 'embedding', 'courier', 'delivery',
          'تجارة', 'توصيات', 'توصيل', 'ticaret', 'öneri'],
  marin: ['marin', 'iotrocop', 'yacht', 'boat', 'marine',
          'يخت', 'بحري', 'yat', 'tekne'],
  smarthome: ['smart home', 'smarthome', 'home automation', 'face recognition',
              'rfid', 'nfc', 'stm32',
              'منزل ذكي', 'أتمتة', 'التعرف على الوجه', 'akıllı ev', 'yüz tanıma'],
  minibus: ['minibus', 'fleet', 'crm', 'telemetry', 'routes',
            'أسطول', 'مركبات', 'filo', 'araç']
};

/* Which projects is this text about?
   Returns every project with real evidence, strongest first — people
   ask broad questions ("what has he built?") far more often than they
   name one project, and answering those with a single jump throws away
   most of what was discussed. */
export function detectProjects(...texts){
  const hay = texts.join(' \n ').toLowerCase();
  const scored = [];

  for (const [id, terms] of Object.entries(TERMS)){
    let score = 0;
    for (const term of terms){
      if (hay.includes(term.toLowerCase())){
        // a longer term is a stronger signal than a three-letter one
        score += term.length >= 6 ? 3 : 1;
      }
    }
    if (score >= 3) scored.push({ id, score });
  }

  return scored.sort((a, b) => b.score - a.score).map(x => x.id).slice(0, 3);
}

/* kept for the single-answer case */
export function detectProject(...texts){
  return detectProjects(...texts)[0] || null;
}

/* The order a tour walks: the flagship first, then the rest as the
   page lists them. */
export const TOUR = PROJECTS.map(p => p.id);

export function projectTitleKey(id){ return id + '.t'; }

export function projectHasMedia(id){
  const p = PROJECTS.find(x => x.id === id);
  return !!(p && p.media && p.media.length);
}

/* Take the reader to the card, and make it obvious which one it is.
   The filter is reset first, because the card may be hidden behind a
   category the reader selected earlier. */
export function goToProject(id, { openGallery = false } = {}){
  const reset = $('#filters [data-filter="all"]');
  if (reset && !reset.classList.contains('is-on')) reset.click();

  // the filter animation re-lays the grid out, so wait for it
  setTimeout(()=>{
    const card = document.querySelector(`.card[data-cat][data-id="${id}"]`)
              || [...document.querySelectorAll('.card')].find(c => c.dataset.id === id);
    if (!card) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block:'center' });

    /* a single pulse on the card, so the eye lands on the right one
       after a long scroll */
    card.classList.remove('is-found');
    void card.offsetWidth;
    card.classList.add('is-found');
    setTimeout(()=> card.classList.remove('is-found'), 2400);

    if (openGallery){
      const first = card.querySelector('.shelf img');
      if (first) setTimeout(()=> first.click(), reduce ? 0 : 900);
    }
  }, 260);
}


/* ------------------------------------------------------------------
   THE TOUR

   Most people open a portfolio out of curiosity, not with a question
   ready. This walks them through the work: each project in turn, the
   card marked as it arrives, screenshots opened where there are any.

   It is interruptible. A scroll, a key or a click stops it — being
   driven somewhere you did not ask to go is only charming for about
   four seconds.
------------------------------------------------------------------ */
let tourTimer = null;
let touring = false;

export function tourRunning(){ return touring; }

export function stopTour(){
  if (!touring) return;
  touring = false;
  clearTimeout(tourTimer);
  document.body.classList.remove('is-touring');
  window.dispatchEvent(new CustomEvent('tour:end'));
}

export function startTour({ onStep } = {}){
  if (touring) { stopTour(); return; }

  touring = true;
  document.body.classList.add('is-touring');

  const reset = document.querySelector('#filters [data-filter="all"]');
  if (reset && !reset.classList.contains('is-on')) reset.click();

  /* any input from the reader hands control back to them */
  const bail = ()=> stopTour();
  ['wheel','touchstart','keydown','pointerdown'].forEach(ev =>
    addEventListener(ev, bail, { once:true, passive:true }));

  let i = 0;
  const step = ()=>{
    if (!touring) return;
    if (i >= TOUR.length){ stopTour(); return; }

    const id = TOUR[i++];
    onStep?.(id, i, TOUR.length);
    goToProject(id, { openGallery:false });

    tourTimer = setTimeout(step, 3400);
  };

  setTimeout(step, 420);
}
