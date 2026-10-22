// Header and mobile navigation behaviour. The markup itself (links, active state,
// footer, social icons) is produced at build time by layout.mjs; this module only
// adds interaction.
import { byId } from './lib/dom.js';
import { CLOSE_ICON, HAMBURGER_ICON } from './lib/nav-icons.js';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Elements that must not be reachable while the drawer is open. */
const backgroundRegions = () => document.querySelectorAll('.top-bar, main, .site-footer, .skip-link, .site-header .brand-logo, .site-header nav, .site-header .nav-actions .btn');

function initScrolledHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/**
 * Mobile drawer as a modal dialog: while open, Tab/Shift+Tab cycle between the
 * menu button and the drawer links, the rest of the page is inert, Escape closes
 * it, and focus returns to the menu button.
 */
function initDrawer() {
  const button = byId('hamburgerBtn');
  const drawer = byId('mobileNavDrawer');
  if (!button || !drawer) return;

  const focusables = () => [button, ...drawer.querySelectorAll(FOCUSABLE)];
  const setOpen = (open, { restoreFocus = true } = {}) => {
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    drawer.inert = !open;
    if (open) {
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-label', 'Navigation menu');
    } else {
      drawer.removeAttribute('role');
      drawer.removeAttribute('aria-modal');
      drawer.removeAttribute('aria-label');
    }
    backgroundRegions().forEach((el) => { el.inert = open; });
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    button.innerHTML = open ? CLOSE_ICON : HAMBURGER_ICON;
    document.body.classList.toggle('no-scroll', open);
    if (open) drawer.querySelector(FOCUSABLE)?.focus();
    else if (restoreFocus) button.focus();
  };

  setOpen(false, { restoreFocus: false });

  button.addEventListener('click', () => setOpen(!drawer.classList.contains('open')));
  drawer.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false, { restoreFocus: false });
  });
  document.addEventListener('keydown', (event) => {
    if (!drawer.classList.contains('open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !items.includes(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !items.includes(active))) {
      event.preventDefault();
      first.focus();
    }
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches && drawer.classList.contains('open')) setOpen(false, { restoreFocus: false });
  });
}

export function initShell() {
  initScrolledHeader();
  initDrawer();
}
