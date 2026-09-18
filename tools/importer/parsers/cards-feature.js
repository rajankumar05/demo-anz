/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature. Base: cards. Model: collection.
 * Source: https://www.anz.co.nz/personal/
 * Image-led feature cards → cards convention (verified): 2 columns, multiple rows.
 *   Row 1: block name (added by createBlock)
 *   Each subsequent row = one card: cell 1 = image, cell 2 = heading + paragraph(s) + CTA.
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('.navigation-card');

  // --- Empty-block guard ---
  if (!cards.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Resolve an image URL defensively (handles lazy-loading: src / data-src / <source srcset>).
  function resolveImage(scope) {
    const rawImg = scope.querySelector('.navigation-card-image img, figure img, picture img, img');
    let src = '';
    if (rawImg) {
      src = rawImg.getAttribute('src') || rawImg.getAttribute('data-src') || '';
    }
    if (!src) {
      const source = scope.querySelector('picture source[srcset], source[srcset]');
      if (source) src = (source.getAttribute('srcset') || '').split(',')[0].trim().split(' ')[0];
    }
    if (!src) return '';
    const img = document.createElement('img');
    img.src = src;
    img.alt = rawImg ? (rawImg.getAttribute('alt') || '') : '';
    return img;
  }

  const cells = [];

  cards.forEach((card) => {
    const heading = card.querySelector('h2, h3, h4');
    const desc = card.querySelector('.navigation-card-content .rt-content, .navigation-card-content p');
    const cta = card.querySelector('.navigation-card-actions a, a.btn, a');

    // Cell 1: image
    const imgCell = resolveImage(card);

    // Cell 2: text content
    const textCell = [];

    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading.textContent.trim();
      textCell.push(h);
    }

    if (desc) {
      const paras = desc.querySelectorAll('p');
      if (paras.length) {
        paras.forEach((p) => {
          const np = document.createElement('p');
          np.textContent = p.textContent.trim();
          if (np.textContent) textCell.push(np);
        });
      } else {
        const np = document.createElement('p');
        np.textContent = desc.textContent.trim();
        if (np.textContent) textCell.push(np);
      }
    }

    if (cta && cta.getAttribute('href')) {
      const a = document.createElement('a');
      a.setAttribute('href', cta.getAttribute('href'));
      a.textContent = cta.textContent.trim();
      const p = document.createElement('p');
      p.append(a);
      textCell.push(p);
    }

    if (imgCell || textCell.length) cells.push([imgCell, textCell]);
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
