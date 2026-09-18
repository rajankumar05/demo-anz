/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-promo-dark. Base: columns. Model: standalone.
 * Source: https://www.anz.co.nz/personal/
 * Columns convention (verified): first row = block name; content rows equal
 * column counts. This dark promo is one content row, two columns:
 *   Column 1: product/app image (image--left)
 *   Column 2: text (heading + paragraphs + CTA link)
 */
export default function parse(element, { document }) {
  const tile = element.querySelector('.promotion-tile, section');
  const scope = tile || element;

  const img = scope.querySelector('.promotion-tile-image img, picture img, img');
  const heading = scope.querySelector('.promotion-tile-title, h2, h3');
  const bodyContainer = scope.querySelector('.promotion-tile-content .rt-content, .promotion-tile-content');
  const cta = scope.querySelector('.promotion-tile-actions a, a.btn, a');

  // --- Empty-block guard ---
  if (!heading && !bodyContainer && !img) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Column 1: image
  const imgCell = img ? (img.closest('picture') || img) : '';

  // Column 2: text
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

  const cells = [];
  cells.push([imgCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo-dark', cells });
  element.replaceWith(block);
}
