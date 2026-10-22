// Scroll-reveal and other optional polish.
//
// Content is visible by default. Only elements that start below the fold are
// "armed" (hidden until scrolled into view), and only once the observer exists,
// so a blocked or failed script can never leave page content invisible.
import { isPrerendering } from './lib/dom.js';

const REVEAL_TARGETS = [
  'main .section-header', 'main .info-grid > *', '.cost-factors > li', '.service-steps > li',
  '.faq-item', '.service-included > li', '.about-highlight-card', '.table-wrap', '.industry-chip',
  '.service-detail-grid > *', '.contact-card', '.about-story-col', '.notice', '.project-filters',
];

function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.prepend(bar);
  const update = () => {
    const root = document.documentElement;
    bar.style.transform = `scaleX(${root.scrollTop / Math.max(1, root.scrollHeight - root.clientHeight)})`;
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

function initReveal() {
  // Staggered fade-up for content that is not already marked .reveal in the markup.
  document.querySelectorAll(REVEAL_TARGETS.join(',')).forEach((el) => {
    if (el.classList.contains('reveal')) return;
    const index = Array.prototype.indexOf.call(el.parentNode.children, el);
    el.classList.add('reveal');
    el.style.transitionDelay = `${Math.min(index, 8) * 70}ms`;
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('active');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  const viewportBottom = window.innerHeight;
  document.querySelectorAll('.reveal:not(.active)').forEach((el) => {
    if (el.getBoundingClientRect().top < viewportBottom) {
      el.classList.add('active'); // already on screen: never hide it
    } else {
      el.classList.add('reveal-armed');
      observer.observe(el);
    }
  });
}

function initCountUp() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      obs.unobserve(entry.target);
      const el = entry.target;
      const match = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!match) return;
      const end = Number(match[1]);
      const suffix = match[2];
      const start = performance.now();
      const duration = 1400;
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        el.textContent = Math.round(end * (1 - (1 - progress) ** 3)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('.stat-value').forEach((el) => observer.observe(el));
}

function initPointerEffects() {
  // Soft spotlight that follows the cursor across cards.
  document.addEventListener('pointermove', (event) => {
    const card = event.target.closest && event.target.closest('.card');
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  }, { passive: true });

  // Gentle 3D tilt of the hero mockup.
  const hero = document.querySelector('.hero-section');
  const frame = document.querySelector('.hero-visual-frame');
  if (!hero || !frame) return;
  hero.addEventListener('pointermove', (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    frame.style.transform = `rotateY(${-8 + x * 10}deg) rotateX(${4 - y * 8}deg)`;
  });
  hero.addEventListener('pointerleave', () => { frame.style.transform = ''; });
}

export function initMotion() {
  if (isPrerendering()) return; // keep the saved HTML free of runtime-only state
  initScrollProgress();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  initReveal();
  initCountUp();
  if (matchMedia('(hover: hover)').matches) initPointerEffects();
}
