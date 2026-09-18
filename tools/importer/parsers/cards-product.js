/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-product. Base: cards. Model: collection.
 * Source: https://www.anz.co.nz/personal/
 * Text-only product tiles (no images) → cards "no images" convention (verified):
 *   1 column, multiple rows.
 *   Row 1: block name (added by createBlock)
 *   Each subsequent row = one card in the single cell: heading + paragraph + CTA link.
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.navigation-card');

  // --- Empty-block guard ---
  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cards.forEach((card) => {
    const heading = card.querySelector('h2, h3, h4');
    const desc = card.querySelector('.navigation-card-content .rt-content, .navigation-card-content p');
    const cta = card.querySelector('.navigation-card-actions a, a.btn, a');

    const cell = [];

    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading.textContent.trim();
      cell.push(h);
    }

    if (desc) {
      const paras = desc.querySelectorAll('p');
      if (paras.length) {
        paras.forEach((p) => {
          const np = document.createElement('p');
          np.textContent = p.textContent.trim();
          if (np.textContent) cell.push(np);
        });
      } else {
        const np = document.createElement('p');
        np.textContent = desc.textContent.trim();
        if (np.textContent) cell.push(np);
      }
    }

    if (cta && cta.getAttribute('href')) {
      const a = document.createElement('a');
      a.setAttribute('href', cta.getAttribute('href'));
      a.textContent = cta.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      cell.push(p);
    }

    if (cell.length) cells.push([cell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-product', cells });
  element.replaceWith(block);
}
