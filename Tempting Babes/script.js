// Tab switching
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Dots
const dots = document.querySelectorAll('.dot');
let current = 0;

function setDot(i) {
  dots[current].classList.remove('active');
  current = (i + dots.length) % dots.length;
  dots[current].classList.add('active');
}

dots.forEach((dot, i) => dot.addEventListener('click', () => setDot(i)));

function shift(dir) {
  setDot(current + dir);
}
