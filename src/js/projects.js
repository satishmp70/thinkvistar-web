// Project category filter. The cards are rendered at build time with a data-category
// attribute, so filtering only toggles `hidden` and needs no data at runtime.
import { byId } from './lib/dom.js';

export function initProjectFilter() {
  const filters = byId('projectFilterContainer');
  const grid = byId('projectsContainer');
  if (!filters || !grid) return;

  filters.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-btn');
    if (!button) return;
    const category = button.dataset.category;
    filters.querySelectorAll('.filter-btn').forEach((other) => {
      const on = other === button;
      other.classList.toggle('active', on);
      other.setAttribute('aria-pressed', String(on));
    });
    grid.querySelectorAll('[data-category]').forEach((card) => {
      const show = category === 'All' || card.dataset.category.toLowerCase() === category.toLowerCase();
      card.hidden = !show;
      if (show) card.classList.add('active'); // never leave a newly shown card faded out
    });
  });
}
