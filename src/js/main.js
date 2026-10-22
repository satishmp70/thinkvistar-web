// Entry point loaded on every page. Pages are rendered at build time, so this only
// adds interaction. The (large) site data and the section renderer are loaded
// dynamically, and only when a page was NOT pre-rendered (build --no-prerender).
import { isPrerendered, isPrerendering, onReady } from './lib/dom.js';
import { initShell } from './shell.js';
import { initMotion } from './motion.js';
import { initContactForm } from './forms.js';
import { initEstimator } from './estimator.js';
import { initProjectFilter } from './projects.js';

async function start() {
  if (!isPrerendered()) {
    const { renderSections } = await import('./sections.js');
    renderSections();
  }
  initEstimator(); // also run while pre-rendering, so the saved HTML shows results for the default choices
  if (isPrerendering()) return; // interaction state (novalidate, listeners, inert) must not be saved into the HTML
  initShell();
  initContactForm();
  initProjectFilter();
  initMotion();
}

onReady(start);
