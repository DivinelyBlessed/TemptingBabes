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
const JF_COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda',
  'Argentina','Armenia','Australia','Austria','Azerbaijan','Bahamas','Bahrain',
  'Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
  'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
  'Burkina Faso','Burundi','Cabo Verde','Cambodia','Cameroon','Canada',
  'Central African Republic','Chad','Chile','China','Colombia','Comoros',
  'Congo (Republic)','Congo (DR)','Costa Rica','Croatia','Cuba','Cyprus',
  'Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia',
  'Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia',
  'Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau',
  'Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran',
  'Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan',
  'Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Lesotho',
  'Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar',
  'Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania',
  'Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro',
  'Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands',
  'New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia',
  'Norway','Oman','Pakistan','Palau','Panama','Papua New Guinea','Paraguay',
  'Peru','Philippines','Poland','Portugal','Qatar','Romania','Russia','Rwanda',
  'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines',
  'Samoa','San Marino','São Tomé and Príncipe','Saudi Arabia','Senegal','Serbia',
  'Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands',
  'Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka',
  'Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan','Tajikistan',
  'Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago',
  'Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine',
  'United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
  'Vanuatu','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
];

const JF_PLATFORMS = {
  hookups: {
    headline: '#1 Rated Platform For You',
    tag: 'Fast Connections & Hookups',
    stats: ['12,400+ women active in your area right now', 'Highest match rate for casual connections', 'Free access — no card needed to start'],
    url: 'https://t.mbjms.com/389314/3785/0?bo=2753,2754,2755,2756&po=6456&aff_sub5=SF_006OG000004lmDN'
  },
  dates: {
    headline: 'Your Best Match Tonight',
    tag: 'Real Conversations & Dates',
    stats: ['8,200+ singles active near you tonight', 'High reply rates — most respond within minutes', 'Free to browse — no commitment required'],
    url: 'https://t.mbjms.com/389314/3785/0?bo=2753,2754,2755,2756&po=6456&aff_sub5=SF_006OG000004lmDN'
  },
  live: {
    headline: 'Top Live Platform Right Now',
    tag: 'Live Cam & Visual Experiences',
    stats: ['3,800+ live streams happening right now', 'HD quality — instant access from your device', 'Free credits available for new members'],
    url: 'https://t.mbjms.com/389314/3785/0?bo=2753,2754,2755,2756&po=6456&aff_sub5=SF_006OG000004lmDN'
  },
  ai: {
    headline: 'Your AI Companion Is Ready',
    tag: 'Always-On AI Companion',
    stats: ['Available 24/7 — responds in seconds', 'Personalised to your exact preferences', 'Start free — no credit card required'],
    url: 'https://t.vlmai-1.com'
  }
};

function initJoinFreeQuiz() {
  const overlay  = document.getElementById('joinFreeOverlay');
  const closeBtn = document.getElementById('joinFreeClose');
  if (!overlay) return;

  let craving = 'hookups';
  let currentStep = 'jfAgeGate';
  let stepHistory = [];

  // Steps where Next (skip) button is shown
  const SKIP_STEPS = ['jfStep1', 'jfStep2', 'jfStep3'];
  const SKIP_NEXT  = { jfStep1: ['jfStep2', 35], jfStep2: ['jfStep3', 60], jfStep3: ['jfStepLocation', 80] };
  // Steps with no nav row
  const NO_NAV = ['jfAgeGate', 'jfStepScan', 'jfResult'];

  // ── Helpers ──
  function resetJF() {
    craving = 'hookups';
    currentStep = 'jfAgeGate';
    stepHistory = [];
    overlay.querySelectorAll('.jf-option-card.selected').forEach(el => el.classList.remove('selected'));
    const emailEl = document.getElementById('jfEmailInput');
    if (emailEl) { emailEl.value = ''; emailEl.style.borderColor = ''; }
    const locEl = document.getElementById('jfLocation');
    if (locEl) locEl.value = '';
    const countryLabel = document.getElementById('jfCountryLabel');
    if (countryLabel) countryLabel.textContent = 'Select your country…';
    const countryTrigger = document.getElementById('jfCountryTrigger');
    if (countryTrigger) { countryTrigger.classList.remove('has-value'); countryTrigger.style.borderColor = ''; }
    const countryDropdown = document.getElementById('jfCountryDropdown');
    if (countryDropdown) countryDropdown.classList.remove('open');
    const bar = document.getElementById('jfScanBar');
    if (bar) bar.style.width = '0%';
    ['jfCheck1','jfCheck2','jfCheck3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('lit');
    });
  }

  function openJF() {
    resetJF();
    overlay.style.display = 'flex';
    showStep('jfAgeGate');
    setProgress(0);
    document.getElementById('jfProgressWrap').style.display = 'none';
    document.getElementById('jfNavRow').style.display = 'none';
    if (typeof gtag !== 'undefined') gtag('event', 'join_free_open');
  }

  function closeJF() {
    overlay.style.display = 'none';
    resetJF();
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

  function updateNav(stepId) {
    const navRow  = document.getElementById('jfNavRow');
    const backBtn = document.getElementById('jfBackBtn');
    const fwdBtn  = document.getElementById('jfFwdBtn');
    if (NO_NAV.includes(stepId)) {
      navRow.style.display = 'none';
      return;
    }
    navRow.style.display = 'flex';
    backBtn.classList.toggle('hidden', stepHistory.length === 0);
    fwdBtn.classList.toggle('hidden', !SKIP_STEPS.includes(stepId));
  }

  function advanceTo(stepId, progressPct) {
    if (currentStep !== stepId) stepHistory.push(currentStep);
    currentStep = stepId;
    showStep(stepId);
    const wrap = document.getElementById('jfProgressWrap');
    if (wrap) wrap.style.display = stepId === 'jfAgeGate' ? 'none' : 'block';
    setProgress(progressPct || 0);
    updateNav(stepId);
  }

  // ── Scan animation ──
  function runScan(onDone) {
    const bar = document.getElementById('jfScanBar');
    const checks = ['jfCheck1', 'jfCheck2', 'jfCheck3'];
    if (bar) bar.style.width = '0%';
    checks.forEach(id => { const el = document.getElementById(id); if (el) el.classList.remove('lit'); });
    setTimeout(() => { if (bar) bar.style.width = '100%'; }, 50);
    setTimeout(() => { const el = document.getElementById('jfCheck1'); if (el) el.classList.add('lit'); }, 700);
    setTimeout(() => { const el = document.getElementById('jfCheck2'); if (el) el.classList.add('lit'); }, 1600);
    setTimeout(() => { const el = document.getElementById('jfCheck3'); if (el) el.classList.add('lit'); }, 2600);
    setTimeout(() => onDone(), 3200);
  }

  // ── Build result card ──
  function buildResult() {
    const p        = JF_PLATFORMS[craving] || JF_PLATFORMS.hookups;
    const location = document.getElementById('jfLocation').value || 'your area';
    const count    = Math.floor(Math.random() * 35) + 22;

    document.getElementById('jfResultHeading').textContent = count + ' Women Online Near You';
    document.getElementById('jfResultSub').textContent =
      'Your preferences are locked in. We\'ve lined up the most active women in ' + location +
      ' — expect some of the hottest profiles heading straight to your inbox. Don\'t say we didn\'t warn you.';

    const cta = document.getElementById('jfCtaBtn');
    cta.href = p.url;

    if (typeof gtag !== 'undefined') gtag('event', 'jf_quiz_complete', { craving });
  }

  // ── Wire FIND MY MATCH to join free quiz ──
  const findBtn = document.getElementById('findMyMatchBtn');
  if (findBtn) findBtn.addEventListener('click', () => openJF());

  // JOIN FREE button — no funnel assigned yet

  // Close
  closeBtn.addEventListener('click', closeJF);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeJF(); });

  // Age gate
  document.getElementById('jfEnterBtn').addEventListener('click', () => {
    if (typeof gtag !== 'undefined') gtag('event', 'jf_age_confirmed');
    advanceTo('jfStep1', 10);
  });
  document.getElementById('jfExitBtn').addEventListener('click', closeJF);

  // Back button
  document.getElementById('jfBackBtn').addEventListener('click', () => {
    if (stepHistory.length === 0) return;
    const prev = stepHistory.pop();
    currentStep = prev;
    showStep(prev);
    const wrap = document.getElementById('jfProgressWrap');
    if (wrap) wrap.style.display = prev === 'jfAgeGate' ? 'none' : 'block';
    updateNav(prev);
  });

  // Next (skip) button — only active on Q1–Q3
  document.getElementById('jfFwdBtn').addEventListener('click', () => {
    const entry = SKIP_NEXT[currentStep];
    if (!entry) return;
    advanceTo(entry[0], entry[1]);
  });

  // Card option buttons — auto-advance on click
  overlay.querySelectorAll('.jf-option-card').forEach(btn => {
    btn.addEventListener('click', () => {
      // Store craving from Q1
      if (btn.dataset.craving) craving = btn.dataset.craving;

      // Visual flash
      btn.classList.add('selected');
      const next = btn.dataset.next;
      const progressMap = { jfStep2: 35, jfStep3: 60, jfStepLocation: 80, jfStepScan: 88, jfStepEmail: 95 };
      setTimeout(() => advanceTo(next, progressMap[next] || 50), 180);
    });
  });

  // ── Custom country picker ──
  (function initCountryPicker() {
    const trigger  = document.getElementById('jfCountryTrigger');
    const dropdown = document.getElementById('jfCountryDropdown');
    const search   = document.getElementById('jfCountrySearch');
    const opts     = document.getElementById('jfCountryOpts');
    const hidden   = document.getElementById('jfLocation');
    const label    = document.getElementById('jfCountryLabel');
    if (!trigger) return;

    function renderOpts(filter) {
      opts.innerHTML = '';
      const f = filter.toLowerCase();
      JF_COUNTRIES.filter(c => c.toLowerCase().includes(f)).forEach(c => {
        const div = document.createElement('div');
        div.className = 'jf-country-opt';
        div.textContent = c;
        div.addEventListener('mousedown', e => {
          e.preventDefault();
          hidden.value = c;
          label.textContent = c;
          trigger.classList.add('has-value');
          trigger.style.borderColor = '';
          dropdown.classList.remove('open');
        });
        opts.appendChild(div);
      });
    }

    trigger.addEventListener('click', () => {
      dropdown.classList.toggle('open');
      if (dropdown.classList.contains('open')) {
        search.value = '';
        renderOpts('');
        setTimeout(() => search.focus(), 50);
      }
    });

    search.addEventListener('input', () => renderOpts(search.value));

    document.addEventListener('click', e => {
      const wrap = document.getElementById('jfCountryWrap');
      if (wrap && !wrap.contains(e.target)) dropdown.classList.remove('open');
    });

    renderOpts('');
  })();

  // Location → scan → email
  document.getElementById('jfFindBtn').addEventListener('click', () => {
    const locVal  = document.getElementById('jfLocation').value;
    const trigger = document.getElementById('jfCountryTrigger');
    if (!locVal) { if (trigger) trigger.style.borderColor = 'var(--accent)'; return; }
    if (trigger) trigger.style.borderColor = '';
    advanceTo('jfStepScan', 88);
    runScan(() => advanceTo('jfStepEmail', 92));
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

function initGetAccessPopup() {
  const overlay = document.getElementById('getAccessOverlay');
  const form    = document.getElementById('gaForm');
  const emailEl = document.getElementById('gaEmail');
  if (!overlay || !form) return;

  const AFFILIATE_URL = 'https://t.mbjms.com/visit/?bta=36027&nci=5349&afp=getaccess';

  function openGA() {
    overlay.style.display = 'flex';
    if (emailEl) emailEl.value = '';
    if (typeof gtag !== 'undefined') gtag('event', 'ga_popup_open');
  }
  function closeGA() { overlay.style.display = 'none'; }

  const btn = document.getElementById('getAccessBtn');
  if (btn) btn.addEventListener('click', openGA);

  document.getElementById('gaClose')?.addEventListener('click', closeGA);
  document.getElementById('gaCloseRight')?.addEventListener('click', closeGA);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeGA(); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.style.display !== 'none') closeGA();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = emailEl ? emailEl.value.trim() : '';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      if (emailEl) { emailEl.focus(); emailEl.style.borderColor = '#ff3d6b'; }
      return;
    }
    if (typeof gtag !== 'undefined') gtag('event', 'ga_email_submit');
    window.open(AFFILIATE_URL + '&email=' + encodeURIComponent(email), '_blank', 'noopener,noreferrer');
    closeGA();
  });
}

function initHeroWord() {
  const el = document.getElementById('heroWild');
  if (!el) return;

  const WORDS = ['Spicy', 'Flirty', 'Teasing', 'Naughty', 'Seductive', 'Irresistible', 'Tempting'];
  const HOLDS = [400, 450, 500, 600, 800, 1200, 3000];
  let idx = 0;

  el.textContent = WORDS[0];

  function cycle() {
    // Fade out — layout shift happens while invisible
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px) scale(0.92)';

    setTimeout(() => {
      idx = (idx + 1) % WORDS.length;
      el.textContent = WORDS[idx];

      el.style.transition = 'none';
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px) scale(1.06)';

      requestAnimationFrame(() => requestAnimationFrame(() => {
        el.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0) scale(1)';
      }));

      setTimeout(cycle, HOLDS[idx]);
    }, 260);
  }

  setTimeout(cycle, HOLDS[0]);
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initQuiz();
  initJoinFreeQuiz();
  initABTest();
  initExitIntent();
  initGetAccessPopup();
  initHeroWord();
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
