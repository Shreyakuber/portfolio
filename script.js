// ── Custom cursor ─────────────────────────────────────
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%,-50%)`;
});

function animateCursor() {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.transform = `translate(${curX}px, ${curY}px) translate(-50%,-50%)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale cursor on hover
document.querySelectorAll('a, button, .proj-card, .fl-card, .wm-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.style.transform += ' scale(1.6)');
  el.addEventListener('mouseleave', () => cursor.style.transform = cursor.style.transform.replace(' scale(1.6)', ''));
});

// ── Nav scroll ────────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ── Mobile menu ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobMenu   = document.getElementById('mobMenu');

hamburger.addEventListener('click', () => mobMenu.classList.toggle('open'));

function closeMob() { mobMenu.classList.remove('open'); }

document.addEventListener('click', e => {
  if (!nav.contains(e.target) && !mobMenu.contains(e.target)) closeMob();
});

// ── Active nav link on scroll ─────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 160) cur = s.id;
  });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${cur}`));
}, { passive: true });

// ── Scroll reveal ─────────────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 100);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll(
  '.hs-item, .wm-card, .proj-card, .fl-card, .id-tag, ' +
  '.about-pills, .about-intro, .exp-item, .ig-strip'
).forEach(el => {
  el.classList.add('reveal');
  revealObs.observe(el);
});

// ── Contact form → Formspree ──────────────────────────
async function handleSubmit(e) {
  e.preventDefault();

  const form   = e.target;
  const btn    = document.getElementById('cfSubmitBtn');
  const ok     = document.getElementById('cfOk');
  const err    = document.getElementById('cfErr');
  const formId = form.dataset.formspreeId;

  // Hide previous messages
  ok.style.display  = 'none';
  err.style.display = 'none';

  // Loading state
  btn.disabled    = true;
  btn.textContent = 'Sending…';

  try {
    const res = await fetch(`https://formspree.io/f/${formId}`, {
      method:  'POST',
      body:    new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      ok.style.display = 'block';
      form.reset();
      setTimeout(() => ok.style.display = 'none', 6000);
    } else {
      const data = await res.json();
      throw new Error(data?.errors?.map(e => e.message).join(', ') || 'Submit failed');
    }
  } catch (ex) {
    console.error('Form error:', ex);
    err.style.display = 'block';
    setTimeout(() => err.style.display = 'none', 8000);
  } finally {
    btn.disabled    = false;
    btn.textContent = 'Send Message →';
  }
}

// ── Smooth section number counter ────────────────────
function countUp(el, target, duration = 1200) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target + (el.dataset.suffix || '');
  };
  requestAnimationFrame(step);
}

// Trigger counters when hero stats visible
const statsObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    statsObs.disconnect();
  }
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObs.observe(statsEl);

// ── Parallax subtle on hero image ────────────────────
window.addEventListener('scroll', () => {
  const heroImg = document.querySelector('.hero-img-frame img');
  if (heroImg) {
    const scrolled = window.scrollY;
    heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
  }
}, { passive: true });
