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
  iframe.style.opacity   = '0';
  iframe.style.transition = 'opacity 0.5s ease';
  return iframe;
}

function makeThumb(videoId) {
  const img = document.createElement('img');
  img.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
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
  }
  return wrap;
}

// Slot became center: remove VIP, add iframe loading in bg + play button
function activateCenter(slot) {
  const vip = slot.querySelector('.slot-vip');
  if (vip) vip.remove();

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
}

function initCarousel() {
  const stage = document.getElementById('carouselStage');
  stage.innerHTML = '';

  const left   = makeSlot(VIDEOS[vi(-1)], 'pos-left',  false);
  const center = makeSlot(VIDEOS[vi(0)],  'pos-center', true);
  const right  = makeSlot(VIDEOS[vi(1)],  'pos-right',  false);

  stage.appendChild(left);
  stage.appendChild(center);
  stage.appendChild(right);
  slots = [left, center, right];

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
const AFFILIATE_URL = '#'; // Replace # with your affiliate link

const matchCounts = { Alabama:38,Alaska:29,Arizona:52,Arkansas:34,California:74,Colorado:48,Connecticut:41,Delaware:31,Florida:68,Georgia:57,Hawaii:27,Idaho:33,Illinois:61,Indiana:44,Iowa:36,Kansas:35,Kentucky:39,Louisiana:43,Maine:28,Maryland:49,Massachusetts:53,Michigan:55,Minnesota:46,Mississippi:32,Missouri:47,Montana:26,Nebraska:34,Nevada:51,NewHampshire:30,NewJersey:58,NewMexico:35,NewYork:72,NorthCarolina:56,NorthDakota:24,Ohio:59,Oklahoma:40,Oregon:45,Pennsylvania:62,RhodeIsland:31,SouthCarolina:42,SouthDakota:25,Tennessee:50,Texas:71,Utah:37,Vermont:23,Virginia:54,Washington:60,WestVirginia:29,Wisconsin:44,Wyoming:21 };

function getMatchCount(state) {
  const key = state.replace(/\s+/g, '');
  return matchCounts[key] || Math.floor(Math.random() * 30) + 35;
}

function initQuiz() {
  const overlay  = document.getElementById('quizOverlay');
  const closeBtn = document.getElementById('quizClose');
  const findBtn  = document.getElementById('quizFindBtn');
  const ctaBtn   = document.getElementById('quizCtaBtn');
  const ctaMain  = document.querySelector('.cta-btn');

  function openQuiz() { overlay.classList.add('open'); }
  function closeQuiz() { overlay.classList.remove('open'); resetQuiz(); }

  function goToStep(n) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.quiz-dot').forEach(d => d.classList.remove('active'));
    document.getElementById('quizStep' + n).classList.add('active');
    if (n <= 3) document.getElementById('dot' + n).classList.add('active');
  }

  function resetQuiz() {
    goToStep(1);
    document.getElementById('quizLocation').value = '';
  }

  // Open on CLICK HERE
  if (ctaMain) ctaMain.addEventListener('click', openQuiz);

  // Close on X or overlay click
  closeBtn.addEventListener('click', closeQuiz);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeQuiz(); });

  // Step options (step 1 & 2)
  document.querySelectorAll('.quiz-option').forEach(btn => {
    btn.addEventListener('click', () => goToStep(Number(btn.dataset.step)));
  });

  // Step 3 → results
  findBtn.addEventListener('click', () => {
    const loc = document.getElementById('quizLocation').value;
    if (!loc) { document.getElementById('quizLocation').style.borderColor = 'var(--accent)'; return; }
    const count = getMatchCount(loc);
    document.getElementById('matchCount').textContent  = count;
    document.getElementById('matchLocation').textContent = loc;
    document.getElementById('extraCount').textContent  = count - 4;
    goToStep(4);
  });

  // Results CTA → affiliate
  ctaBtn.href = AFFILIATE_URL;
  ctaBtn.addEventListener('click', () => { setTimeout(closeQuiz, 300); });
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  initQuiz();
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
