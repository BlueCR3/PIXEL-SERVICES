// ── Modals ──
function openModal(id) {
  const tpl = document.getElementById('tpl-' + id);
  const content = document.getElementById('modal-content');
  const overlay = document.getElementById('modal-overlay');
  content.innerHTML = '';
  content.appendChild(tpl.content.cloneNode(true));
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Focus le bouton fermer
  setTimeout(() => overlay.querySelector('.modal-close').focus(), 50);
}
function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
  // Piège le focus dans la modale
  if (e.key === 'Tab' && document.getElementById('modal-overlay').classList.contains('open')) {
    const modal = document.querySelector('.modal-box');
    const focusable = modal.querySelectorAll('button, a, input, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0]; const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// ── Cursor (desktop seulement) ──
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  cursor.style.opacity = '0';
  ring.style.opacity = '0';
  document.addEventListener('mousemove', e => {
    cursor.style.opacity = '1';
    ring.style.opacity = '0.6';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    }, 80);
  });
} else {
  // Sur mobile/tactile : on supprime complètement les éléments curseur
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (cursor) cursor.remove();
  if (ring) ring.remove();
}

// ── Nav scroll ──
const nav = document.getElementById('main-nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const closeMenuBtn = document.getElementById('close-menu');
const mmLinks = document.querySelectorAll('.mm-link');

function openMobileMenu() {
  mobileMenu.classList.add('open');
  closeMenuBtn.classList.add('visible');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Fermer le menu');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  closeMenuBtn.classList.remove('visible');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Ouvrir le menu');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMobileMenu);

// Croix : on gère click ET touchstart pour mobile
closeMenuBtn.addEventListener('click', closeMobileMenu);
closeMenuBtn.addEventListener('touchstart', function(e) {
  e.stopPropagation();
  closeMobileMenu();
}, { passive: true });

mmLinks.forEach(l => l.addEventListener('click', closeMobileMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMobileMenu();
});

// ── Reveal on scroll ──
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));
} else {
  reveals.forEach(el => el.classList.add('visible'));
}

// ── Counter animation ──
function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(update);
}
const counters = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); counterObs.unobserve(e.target); } });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObs.observe(c));
}
