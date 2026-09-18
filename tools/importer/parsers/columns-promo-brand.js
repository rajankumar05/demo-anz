/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo-brand. Base: columns. Model: standalone.
 * Source: https://www.anz.co.nz/personal/
 * Columns convention (verified): first row = block name; content rows equal
 * column counts. This promo is one content row, two columns:
 *   Column 1: text (heading + paragraphs + CTA link)
 *   Column 2: product image
 */
export default function parse(element, { document }) {
  const tile = element.querySelector('.promotion-tile, section');
  const scope = tile || element;

  const heading = scope.querySelector('.promotion-tile-title, h2, h3');
  const bodyContainer = scope.querySelector('.promotion-tile-content .rt-content, .promotion-tile-content');
  const cta = scope.querySelector('.promotion-tile-actions a, a.btn, a');
  const img = scope.querySelector('.promotion-tile-image img, picture img, img');

  // --- Empty-block guard ---
  if (!heading && !bodyContainer && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Column 1: text
  const textCell = [];
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    textCell.push(h);
  }
  if (bodyContainer) {
    const paras = bodyContainer.querySelectorAll('p');
    paras.forEach((p) => {
      const np = document.createElement('p');
      np.textContent = p.textContent.trim();
      if (np.textContent) textCell.push(np);
    });
  }
  if (cta && cta.getAttribute('href')) {
    const a = document.createElement('a');
    a.setAttribute('href', cta.getAttribute('href'));
    a.textContent = cta.textContent.trim();
    const p = document.createElement('p');
    p.append(a);
    textCell.push(p);
  }

  // Column 2: image
  const imgCell = img ? (img.closest('picture') || img) : '';

  const cells = [];
  cells.push([textCell, imgCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo-brand', cells });
  element.replaceWith(block);
}
