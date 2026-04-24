const VIDEOS = [
  'R8lQN39RKk8',
  'dtwlxmwCWGs',
  'YoR_ui5RBho',
  'kYMZpVg9lCA',
  'uyq-pcxnbWo',
  'k2pfh_XeoT8'
];

const INTERVAL = 4500;
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
  return iframe;
}

function makeThumb(videoId) {
  const img = document.createElement('img');
  img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
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

// Build a slot — thumbnail always present as fallback backdrop
function makeSlot(videoId, posClass, isCenter) {
  const wrap = document.createElement('div');
  wrap.className      = 'vid-slot ' + posClass;
  wrap.dataset.videoId = videoId;

  wrap.appendChild(makeThumb(videoId)); // backdrop for all slots

  if (isCenter) {
    const iframe = makeEmbed(videoId);
    iframe.style.opacity   = '0';
    iframe.style.transition = 'opacity 0.4s ease';
    wrap.appendChild(iframe);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      iframe.style.opacity = '1';
    }));
  } else {
    wrap.appendChild(vipOverlay());
  }
  return wrap;
}

// Start silently pre-loading the next center video inside a side slot
function preloadSlot(slot) {
  if (slot.querySelector('iframe')) return;
  const iframe = makeEmbed(slot.dataset.videoId);
  iframe.style.opacity   = '0';
  iframe.style.transition = 'opacity 0.4s ease';
  const vip = slot.querySelector('.slot-vip');
  slot.insertBefore(iframe, vip || null);
}

// Reveal the pre-loaded iframe (slot just became center)
function activateCenter(slot) {
  let iframe = slot.querySelector('iframe');
  if (!iframe) {
    iframe = makeEmbed(slot.dataset.videoId);
    iframe.style.opacity   = '0';
    iframe.style.transition = 'opacity 0.4s ease';
    slot.appendChild(iframe);
  }
  requestAnimationFrame(() => { iframe.style.opacity = '1'; });
  const vip = slot.querySelector('.slot-vip');
  if (vip) vip.remove();
}

// Strip iframe, restore VIP overlay (slot leaving center)
function deactivateCenter(slot) {
  const iframe = slot.querySelector('iframe');
  if (iframe) iframe.remove();
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

  preloadSlot(left); // silently start loading the next center
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
    slots     = [incoming, leftEl, centerEl];
    centerIdx = vi(-1);
    isAnimating = false;
    preloadSlot(incoming);
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
    slots     = [centerEl, rightEl, incoming];
    centerIdx = vi(1);
    isAnimating = false;
    preloadSlot(incoming);
    scheduleNext();
  }, TRANS_MS + 60);
}

function scheduleNext() {
  clearTimeout(advTimer);
  advTimer = setTimeout(advance, INTERVAL);
}

document.addEventListener('DOMContentLoaded', () => {
  initCarousel();
  document.getElementById('scrollLeft').addEventListener('click', reverse);
  document.getElementById('scrollRight').addEventListener('click', advance);
});
