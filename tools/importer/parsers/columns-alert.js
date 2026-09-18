/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-alert. Base: columns. Model: standalone.
 * Source: https://www.anz.co.nz/personal/
 * Columns convention (verified): first row = block name; content rows have
 * equal column counts. This alert is one content row, two columns:
 *   Column 1: icon image
 *   Column 2: heading + paragraph (with inline link)
 */
export default function parse(element, { document }) {
  const callout = element.querySelector('.callout, section');
  const scope = callout || element;

  const iconImg = scope.querySelector('.callout-image img, .callout-left-wrap img, picture img, img');
  const heading = scope.querySelector('h2, h3, .callout h2');
  // The body paragraph — keep it intact (preserves the inline link).
  const bodyPara = scope.querySelector('.rt-content p, p');

  // --- Empty-block guard ---
  if (!heading && !bodyPara) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Column 1: icon
  const iconCell = iconImg ? (iconImg.closest('picture') || iconImg) : '';

  // Column 2: text
  const textCell = [];
  if (heading) {
    const h = document.createElement('h2');
    h.textContent = heading.textContent.trim();
    textCell.push(h);
  }
  if (bodyPara) {
    // Clone to keep inline anchors intact
    const p = bodyPara.cloneNode(true);
    textCell.push(p);
  }

  const cells = [];
  cells.push([iconCell, textCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-alert', cells });
  element.replaceWith(block);
}
