/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-quicklinks. Base: cards. Model: collection.
 * Source: https://www.anz.co.nz/personal/
 * Library convention (cards): 2 columns, multiple rows.
 *   Row 1: block name (added by createBlock)
 *   Each subsequent row = one card: cell 1 = image/icon, cell 2 = text (label link).
 */
export default function parse(element, { document }) {
  const items = element.querySelectorAll('.quick-links-item');

  // --- Empty-block guard ---
  if (!items.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  items.forEach((item) => {
    const link = item.querySelector('a.quick-links-link, a');
    const img = item.querySelector('picture img, img');
    const labelEl = item.querySelector('.link-text');
    const href = link && link.getAttribute('href');
    const label = (labelEl ? labelEl.textContent : (link ? link.textContent : '')).trim();

    if (!href && !img) return;

    // Cell 1: image / icon
    const imgCell = img ? (img.closest('picture') || img) : '';

    // Cell 2: text content — the link label
    let textCell = '';
    if (href) {
      const a = document.createElement('a');
      a.setAttribute('href', href);
      a.textContent = label || href;
      textCell = a;
    } else if (label) {
      const p = document.createElement('p');
      p.textContent = label;
      textCell = p;
    }

    cells.push([imgCell, textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-quicklinks', cells });
  element.replaceWith(block);
}
