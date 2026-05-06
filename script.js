const VIDEOS = [
  'EOyHy-aV8aQ',
  'KwYnD5akv_0',
  'YoR_ui5RBho',
  'kYMZpVg9lCA',
  'uyq-pcxnbWo',
  'k2pfh_XeoT8'
];

const INTERVAL = 10000;
const TRANS_MS = 720;

let centerIdx   = 1;
let slots       = [];
let advTimer    = null;
let isAnimating = false;

function vi(offset) {
  return (centerIdx + offset + VIDEOS.length) % VIDEOS.length;
}

function makeEmbed(videoId) {
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&playsinline=1&modestbranding=1&showinfo=0&iv_load_policy=3&fs=0`;
  iframe.setAttribute('allow', 'autoplay; encrypted-media');
  iframe.setAttribute('frameborder', '0');
  iframe.title = 'Video preview';
  iframe.style.opacity   = '0';
  iframe.style.transition = 'opacity 0.5s ease';
  return iframe;
}

function makeThumb(videoId) {
  const img = document.createElement('img');
  img.src = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  img.alt = '';
  return img;
}

function vipOverlay() {
  const ov = document.createElement('div');
  ov.className = 'slot-vip';
  ov.innerHTML =
    '<div class="slot-vip-title"><span>💎</span> VIP Membership</div>' +
    '<div class="slot-vip-sub">Unlock everything now</div>' +
    '<button class="slot-vip-btn">Join VIP</button>';
  return ov;
}

function makePlayBtn(slot) {
  const btn = document.createElement('div');
  btn.className = 'slot-center-play-btn';
  btn.innerHTML = '<svg width="26" height="26" viewBox="0 0 24 24" fill="white"><polygon points="6,3 20,12 6,21"/></svg>';
  btn.addEventListener('click', () => {
    const thumb  = slot.querySelector('img');
    const iframe = slot.querySelector('iframe');
    btn.remove();
    if (thumb)  { thumb.style.opacity  = '0'; }
    if (iframe) { iframe.style.opacity = '1'; }
  });
  return btn;
}

function makeSidePlayBtn() {
  const btn = document.createElement('div');
  btn.className = 'slot-side-play-btn';
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="6,3 20,12 6,21"/></svg>';
  return btn;
}

// Center slot: iframe loads silently in background, thumbnail + red play button on top.
// User clicks play when ready — by then the video has had time to buffer.
// Side slots: thumbnail + VIP overlay only, no iframe.
function makeSlot(videoId, posClass, isCenter) {
  const wrap = document.createElement('div');
  wrap.className      = 'vid-slot ' + posClass;
  wrap.dataset.videoId = videoId;

  if (isCenter) {
    wrap.appendChild(makeEmbed(videoId)); // loads silently in background
    wrap.appendChild(makeThumb(videoId)); // covers iframe while loading
    wrap.appendChild(makePlayBtn(wrap));  // red play button on top
  } else {
    wrap.appendChild(makeThumb(videoId));
    wrap.appendChild(vipOverlay());
    wrap.appendChild(makeSidePlayBtn());
  }
  return wrap;
}

// Slot became center: remove VIP, add iframe loading in bg + play button
function activateCenter(slot) {
  const vip = slot.querySelector('.slot-vip');
  if (vip) vip.remove();
  const sidePlay = slot.querySelector('.slot-side-play-btn');
  if (sidePlay) sidePlay.remove();

  if (!slot.querySelector('iframe')) {
    slot.insertBefore(makeEmbed(slot.dataset.videoId), slot.firstChild);
  }

  if (!slot.querySelector('.slot-center-play-btn')) {
    slot.appendChild(makePlayBtn(slot));
  }
}

// Slot left center: remove iframe + play button, restore thumbnail + VIP
function deactivateCenter(slot) {
  const iframe  = slot.querySelector('iframe');
  const playBtn = slot.querySelector('.slot-center-play-btn');
  if (iframe)  iframe.remove();
  if (playBtn) playBtn.remove();

  const thumb = slot.querySelector('img');
  if (thumb) {
    thumb.style.transition = 'none';
    thumb.style.opacity    = '1';
    requestAnimationFrame(() => requestAnimationFrame(() => {
      thumb.style.transition = '';
    }));
  }
  if (!slot.querySelector('.slot-vip')) slot.appendChild(vipOverlay());
  if (!slot.querySelector('.slot-side-play-btn')) slot.appendChild(makeSidePlayBtn());
}

function initCarousel() {
  const stage = document.getElementById('carouselStage');
  stage.innerHTML = '';
  stage.classList.add('carousel-loading');

  const left   = makeSlot(VIDEOS[vi(-1)], 'pos-left',  false);
  const center = makeSlot(VIDEOS[vi(0)],  'pos-center', true);
  const right  = makeSlot(VIDEOS[vi(1)],  'pos-right',  false);

  stage.appendChild(left);
  stage.appendChild(center);
  stage.appendChild(right);
  slots = [left, center, right];

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      stage.classList.remove('carousel-loading');
    });
  });

  scheduleNext();
}

function advance() {
  if (isAnimating) return;
  isAnimating = true;
  clearTimeout(advTimer);

  const stage = document.getElementById('carouselStage');
  const [leftEl, centerEl, rightEl] = slots;

  const incoming = makeSlot(VIDEOS[vi(-2)], 'pos-enter-left', false);
  stage.appendChild(incoming);
  incoming.getBoundingClientRect();

  requestAnimationFrame(() => {
    incoming.className = 'vid-slot pos-left';
    leftEl.className   = 'vid-slot pos-center';
    centerEl.className = 'vid-slot pos-right';
    rightEl.className  = 'vid-slot pos-exit-right';
    activateCenter(leftEl);
    deactivateCenter(centerEl);
  });

  setTimeout(() => {
    rightEl.remove();
    slots       = [incoming, leftEl, centerEl];
    centerIdx   = vi(-1);
    isAnimating = false;
    scheduleNext();
  }, TRANS_MS + 60);
}

function reverse() {
  if (isAnimating) return;
  isAnimating = true;
  clearTimeout(advTimer);

  const stage = document.getElementById('carouselStage');
  const [leftEl, centerEl, rightEl] = slots;

  const incoming = makeSlot(VIDEOS[vi(2)], 'pos-exit-right', false);
  stage.appendChild(incoming);
  incoming.getBoundingClientRect();

  requestAnimationFrame(() => {
    incoming.className = 'vid-slot pos-right';
    rightEl.className  = 'vid-slot pos-center';
    centerEl.className = 'vid-slot pos-left';
    leftEl.className   = 'vid-slot pos-enter-left';
    activateCenter(rightEl);
    deactivateCenter(centerEl);
  });

  setTimeout(() => {
    leftEl.remove();
    slots       = [centerEl, rightEl, incoming];
    centerIdx   = vi(1);
    isAnimating = false;
    scheduleNext();
  }, TRANS_MS + 60);
}

function scheduleNext() {
  clearTimeout(advTimer);
  advTimer = setTimeout(advance, INTERVAL);
}

// ── QUIZ POPUP ──
const DATING_URL = 'https://t.mbjms.com';
const AI_URL     = 'https://t.vlmai-1.com';

const matchCounts = { Alabama:38,Alaska:29,Arizona:52,Arkansas:34,California:74,Colorado:48,Connecticut:41,Delaware:31,Florida:68,Georgia:57,Hawaii:27,Idaho:33,Illinois:61,Indiana:44,Iowa:36,Kansas:35,Kentucky:39,Louisiana:43,Maine:28,Maryland:49,Massachusetts:53,Michigan:55,Minnesota:46,Mississippi:32,Missouri:47,Montana:26,Nebraska:34,Nevada:51,NewHampshire:30,NewJersey:58,NewMexico:35,NewYork:72,NorthCarolina:56,NorthDakota:24,Ohio:59,Oklahoma:40,Oregon:45,Pennsylvania:62,RhodeIsland:31,SouthCarolina:42,SouthDakota:25,Tennessee:50,Texas:71,Utah:37,Vermont:23,Virginia:54,Washington:60,WestVirginia:29,Wisconsin:44,Wyoming:21 };

function getMatchCount(state) {
  const key = state.replace(/\s+/g, '');
  return matchCounts[key] || Math.floor(Math.random() * 30) + 35;
}

function initQuiz() {
  const overlay  = document.getElementById('quizOverlay');
  const closeBtn = document.getElementById('quizClose');
  const findBtn  = document.getElementById('quizFindBtn');

  let datingScore = 0;
  let aiScore     = 0;

  function openQuiz() { overlay.style.display = 'flex'; }

  function closeQuiz() {
    overlay.style.display = 'none';
    resetQuiz();
  }

  function showStep(id) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function updateDots(n) {
    document.querySelectorAll('.quiz-dot').forEach(d => d.classList.remove('active'));
    const dot = document.getElementById('dot' + n);
    if (dot) dot.classList.add('active');
  }

  function resetQuiz() {
    datingScore = 0;
    aiScore     = 0;
    showStep('quizStep1');
    updateDots(1);
    document.getElementById('quizLocation').value = '';
  }

  function route() {
    if (datingScore >= aiScore) {
      showStep('quizStep5');
    } else {
      if (typeof gtag !== 'undefined') gtag('event', 'quiz_routed_ai', { dating: datingScore, ai: aiScore });
      showStep('quizResultAI');
    }
  }

  function showDatingResult(loc) {
    const count = getMatchCount(loc);
    document.getElementById('matchCount').textContent    = count;
    document.getElementById('matchLocation').textContent = loc;
    document.getElementById('extraCount').textContent    = count - 4;
    if (typeof gtag !== 'undefined') gtag('event', 'quiz_routed_dating', { dating: datingScore, ai: aiScore, state: loc });
    showStep('quizResultDating');
  }

  // Open triggers
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', openQuiz);
  });

  // Close
  closeBtn.addEventListener('click', closeQuiz);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeQuiz(); });

  // Option buttons — accumulate scores, advance step
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => {
      datingScore += Number(btn.dataset.dating || 0);
      aiScore     += Number(btn.dataset.ai     || 0);

      const next = btn.dataset.next;
      if (next === 'route') {
        route();
      } else {
        const n = Number(next);
        showStep('quizStep' + n);
        updateDots(n);
      }
    });
  });

  // Location step → dating result
  findBtn.addEventListener('click', () => {
    const loc = document.getElementById('quizLocation').value;
    if (!loc) { document.getElementById('quizLocation').style.borderColor = 'var(--accent)'; return; }
    showDatingResult(loc);
  });

  // Result CTAs
  document.getElementById('quizCtaBtn').addEventListener('click', () => { setTimeout(closeQuiz, 300); });
  document.getElementById('quizCtaBtnAI').addEventListener('click', () => { setTimeout(closeQuiz, 300); });
}

// ── JOIN FREE POPUP v2 ──
const JF_PLATFORMS = {
  hookups: {
    name: 'AdultFriendFinder',
    tag: 'Hookups & Fast Connections',
    stats: ['12,400+ active members right now', 'Real engagement — verified profiles', 'Special access link for TB users'],
    url: 'https://t.mbjms.com/389314/3785/0?bo=2753,2754,2755,2756&po=6456&aff_sub5=SF_006OG000004lmDN'
  },
  dates: {
    name: 'Match',
    tag: 'Real Conversations & Dates',
    stats: ['8,200+ active tonight in your area', 'High reply rates — no ghost town', 'No card needed to start browsing'],
    url: 'https://t.mbjms.com/389314/3785/0?bo=2753,2754,2755,2756&po=6456&aff_sub5=SF_006OG000004lmDN'
  },
  live: {
    name: 'LiveJasmin',
    tag: 'Live Cam & Visual Experiences',
    stats: ['3,800+ performers streaming live now', 'HD quality, instant access', 'Free credits for new Tempting Babes users'],
    url: 'https://t.mbjms.com/389314/3785/0?bo=2753,2754,2755,2756&po=6456&aff_sub5=SF_006OG000004lmDN'
  },
  ai: {
    name: 'DreamGF AI',
    tag: 'AI Companion — Zero Ghosting',
    stats: ['Always available — 24/7, no waiting', 'Personalised to your exact vibe', 'Start free, no commitment required'],
    url: 'https://t.vlmai-1.com'
  }
};

function initJoinFreeQuiz() {
  const overlay  = document.getElementById('joinFreeOverlay');
  const closeBtn = document.getElementById('joinFreeClose');
  if (!overlay) return;

  let craving = 'hookups';

  // ── Helpers ──
  function openJF() {
    overlay.style.display = 'flex';
    showStep('jfAgeGate');
    setProgress(0);
    document.getElementById('jfProgressWrap').style.display = 'none';
    if (typeof gtag !== 'undefined') gtag('event', 'join_free_open');
  }

  function closeJF() {
    overlay.style.display = 'none';
    craving = 'hookups';
    const emailEl = document.getElementById('jfEmailInput');
    if (emailEl) { emailEl.value = ''; emailEl.style.borderColor = ''; }
    const locEl = document.getElementById('jfLocation');
    if (locEl) locEl.value = '';
  }

  function showStep(id) {
    overlay.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  function setProgress(pct) {
    const bar = document.getElementById('jfBar');
    if (bar) bar.style.width = pct + '%';
  }

  function advanceTo(stepId, progressPct) {
    showStep(stepId);
    const wrap = document.getElementById('jfProgressWrap');
    if (wrap) wrap.style.display = stepId === 'jfAgeGate' ? 'none' : 'block';
    setProgress(progressPct || 0);
  }

  // ── Build result card ──
  function buildResult() {
    const p = JF_PLATFORMS[craving] || JF_PLATFORMS.hookups;
    const cravingLabels = {
      hookups: 'fast & flirty hookups',
      dates:   'real conversations & dates',
      live:    'live cam experiences',
      ai:      'an always-on AI companion'
    };
    document.getElementById('jfResultSub').textContent =
      'Since you\'re looking for ' + (cravingLabels[craving] || 'the right connection') +
      ', ' + p.name + ' is the top match for you right now.';
    document.getElementById('jfResultName').textContent = p.name;
    document.getElementById('jfResultTag').textContent  = p.tag;

    const list = document.getElementById('jfResultStats');
    list.innerHTML = '';
    p.stats.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      list.appendChild(li);
    });

    const cta = document.getElementById('jfCtaBtn');
    cta.href        = p.url;
    cta.textContent = 'Go to ' + p.name + ' Now →';

    if (typeof gtag !== 'undefined') gtag('event', 'jf_quiz_complete', { craving });
  }

  // ── Wire join-btn across the page ──
  document.querySelectorAll('.join-btn').forEach(btn => {
    btn.addEventListener('click', () => openJF());
  });

  // Close
  closeBtn.addEventListener('click', closeJF);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeJF(); });

  // Age gate
  document.getElementById('jfEnterBtn').addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'jf_age_confirmed');
    advanceTo('jfStep1', 10);
  });
  document.getElementById('jfExitBtn').addEventListener('click', closeJF);

  // Card option buttons — auto-advance on click
  overlay.querySelectorAll('.jf-option-card').forEach(btn => {
    btn.addEventListener('click', () => {
      // Store craving from Q1
      if (btn.dataset.craving) craving = btn.dataset.craving;

      // Visual flash
      btn.classList.add('selected');
      const next = btn.dataset.next;
      const progressMap = { jfStep2: 35, jfStep3: 60, jfStepLocation: 80, jfStepEmail: 95 };
      setTimeout(() => advanceTo(next, progressMap[next] || 50), 180);
    });
  });

  // Location → email
  document.getElementById('jfFindBtn').addEventListener('click', () => {
    const loc = document.getElementById('jfLocation');
    if (!loc.value) { loc.style.borderColor = 'var(--accent)'; return; }
    loc.style.borderColor = '';
    advanceTo('jfStepEmail', 92);
  });

  // Email → result
  document.getElementById('jfEmailBtn').addEventListener('click', () => {
    const emailEl = document.getElementById('jfEmailInput');
    const val = emailEl.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    if (!valid) {
      emailEl.style.borderColor = 'var(--accent)';
      emailEl.placeholder = 'Please enter a valid email';
      return;
    }
    emailEl.style.borderColor = '';
    if (typeof gtag !== 'undefined') gtag('event', 'jf_email_submitted');
    buildResult();
    advanceTo('jfResult', 100);
  });
}

// ── A/B TEST ──
function initABTest() {
  let variant = localStorage.getItem('cta_variant');
  if (!variant) {
    variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem('cta_variant', variant);
  }
  if (variant === 'B') {
    document.querySelectorAll('.cta-btn').forEach(btn => {
      if (btn.textContent.trim() === 'CLICK HERE') btn.textContent = 'SEE WHO\'S ONLINE NOW';
    });
  }
  document.querySelectorAll('.cta-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (typeof gtag !== 'undefined') gtag('event', 'cta_click', { cta_variant: variant });
    });
  });
}

// ── EXIT INTENT ──
function initExitIntent() {
  const overlay = document.getElementById('exitOverlay');
  const closeBtn = document.getElementById('exitClose');
  if (!overlay) return;

  let shown = sessionStorage.getItem('exit_shown');

  function showExit() {
    if (shown) return;
    shown = true;
    sessionStorage.setItem('exit_shown', '1');
    overlay.classList.add('open');
    if (typeof gtag !== 'undefined') gtag('event', 'exit_intent_shown');
  }

  document.addEventListener('mouseleave', e => {
    if (e.clientY < 10) showExit();
  });

  closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('open'); });

  document.getElementById('exitCta').addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'exit_intent_cta_click');
    setTimeout(() => overlay.classList.remove('open'), 300);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initQuiz();
  initJoinFreeQuiz();
  initABTest();
  initExitIntent();
  document.getElementById('scrollLeft').addEventListener('click', reverse);
  document.getElementById('scrollRight').addEventListener('click', advance);

  const menuBtn    = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
  }
});
