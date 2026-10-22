// Small DOM helpers shared by the browser modules.

export const byId = (id) => document.getElementById(id);

/** Runs `fn` once the document has been parsed (immediately if it already has). */
export function onReady(fn) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
  else fn();
}

/** True while the build is pre-rendering pages in headless Chrome (set by build.mjs). */
export const isPrerendering = () => window.__THINKVISTAR_PRERENDER__ === true;

/** True when the delivered HTML was already rendered at build time (the normal production case). */
export const isPrerendered = () => document.documentElement.hasAttribute('data-prerendered');
