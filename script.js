const VIDEOS = [
  'Asset/Videos/1.mp4',
  'Asset/Videos/2.mp4',
  'Asset/Videos/3.mp4',
  'Asset/Videos/4.mp4',
  'Asset/Videos/5.mp4',
  'Asset/Videos/6.mp4'
];

const INTERVAL  = 4500;  // ms between advances
const TRANS_MS  = 720;   // must match CSS transition duration

let centerIdx  = 1;
let slots      = [];     // [leftEl, centerEl, rightEl]
let advTimer   = null;
let isAnimating = false;

function vi(offset) {
  return (centerIdx + offset + VIDEOS.length) % VIDEOS.length;
}

function makeSlot(src, posClass, vip, playIcon) {
  const wrap = document.createElement('div');
  wrap.className = 'vid-slot ' + posClass;

  const vid = document.createElement('video');
  vid.src = src;
  vid.muted = true;
  vid.loop  = true;
  vid.playsInline = true;
  vid.preload = 'metadata';
  wrap.appendChild(vid);

  if (vip) {
    const ov = document.createElement('div');
    ov.className = 'slot-vip';
    ov.innerHTML =
      '<div class="slot-vip-title"><span>💎</span> VIP Membership</div>' +
      '<div class="slot-vip-sub">Unlock everything now</div>' +
      '<button class="slot-vip-btn">Join VIP</button>';
    wrap.appendChild(ov);
  }

  if (playIcon) {
    const pb = document.createElement('div');
    pb.className = 'slot-play-btn';
    pb.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
    wrap.appendChild(pb);
  }

  return wrap;
}

function initCarousel() {
  const stage = document.getElementById('carouselStage');
  stage.innerHTML = '';

  const left   = makeSlot(VIDEOS[vi(-1)], 'pos-left',   true,  false);
  const center = makeSlot(VIDEOS[vi(0)],  'pos-center',  false, true);
  const right  = makeSlot(VIDEOS[vi(1)],  'pos-right',   true,  false);

  stage.appendChild(left);
  stage.appendChild(center);
  stage.appendChild(right);

  slots = [left, center, right];
  center.querySelector('video').play();

  startProgress();
  scheduleNext();
}

function advance() {
  if (isAnimating) return;
  isAnimating = true;
  clearTimeout(advTimer);
  stopProgress();

  const stage = document.getElementById('carouselStage');
  const [leftEl, centerEl, rightEl] = slots;

  // New video enters from the left (the one "behind" current left)
  const incoming = makeSlot(VIDEOS[vi(-2)], 'pos-enter-left', true, false);
  stage.appendChild(incoming);

  // Force reflow so the enter-left position is painted before transitioning
  incoming.getBoundingClientRect();

  // Pause old center; new center will be the old left
  centerEl.querySelector('video').pause();

  // Kick off all transitions in next frame
  requestAnimationFrame(() => {
    incoming.className = 'vid-slot pos-left';
    leftEl.className   = 'vid-slot pos-center';
    centerEl.className = 'vid-slot pos-right';
    rightEl.className  = 'vid-slot pos-exit-right';

    // Add play icon to new center, remove from old
    if (!leftEl.querySelector('.slot-play-btn')) {
      const pb = document.createElement('div');
      pb.className = 'slot-play-btn';
      pb.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>';
      leftEl.appendChild(pb);
    }
    const oldPb = centerEl.querySelector('.slot-play-btn');
    if (oldPb) oldPb.remove();

    leftEl.querySelector('video').play();
  });

  setTimeout(() => {
    rightEl.remove();
    slots      = [incoming, leftEl, centerEl];
    centerIdx  = vi(-1);
    isAnimating = false;
    startProgress();
    scheduleNext();
  }, TRANS_MS + 60);
}

function scheduleNext() {
  clearTimeout(advTimer);
  advTimer = setTimeout(advance, INTERVAL);
}

function stopProgress() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  bar.style.transition = 'none';
  bar.style.width = '0%';
}

function startProgress() {
  const bar = document.getElementById('progressBar');
  if (!bar) return;
  bar.style.transition = 'none';
  bar.style.width = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    bar.style.transition = 'width ' + INTERVAL + 'ms linear';
    bar.style.width = '100%';
  }));
}

document.addEventListener('DOMContentLoaded', initCarousel);
