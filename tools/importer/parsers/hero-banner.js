/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero. Model: standalone.
 * Source: https://www.anz.co.nz/personal/
 * Library convention (hero): 1 column, 3 rows.
 *   Row 1: block name (added by createBlock)
 *   Row 2: background/illustration image (optional)
 *   Row 3: title (heading) + subheading (paragraph) + CTA (text with link)
 */
export default function parse(element, { document }) {
  // --- Extraction (selectors validated against source.html) ---
  const heading = element.querySelector('.hero-banner-title, h1, h2');
  const descEl = element.querySelector('.hero-banner-description, .hero-banner-heading-body-section p');
  const ctaLink = element.querySelector('.hero-banner-actions a, a.btn, a[class*="btn--variation-primary"]');
  const img = element.querySelector('.hero-banner-image img, picture img, img');

  // --- Empty-block guard ---
  if (!heading && !descEl && !ctaLink) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  // Row 2: background / illustration image (optional)
  if (img) {
    const picture = img.closest('picture');
    cells.push([picture || img]);
  }

  // Row 3: text content — heading, subheading, CTA
  const contentCell = [];

  if (heading) {
    const h = document.createElement('h1');
    h.textContent = heading.textContent.trim();
    contentCell.push(h);
  }

  if (descEl) {
    const paras = descEl.querySelectorAll('p');
    if (paras.length) {
      paras.forEach((p) => {
        const np = document.createElement('p');
        np.textContent = p.textContent.trim();
        if (np.textContent) contentCell.push(np);
      });
    } else {
      const np = document.createElement('p');
      np.textContent = descEl.textContent.trim();
      if (np.textContent) contentCell.push(np);
    }
  }

  if (ctaLink && ctaLink.getAttribute('href')) {
    const a = document.createElement('a');
    a.setAttribute('href', ctaLink.getAttribute('href'));
    a.textContent = ctaLink.textContent.trim();
    const p = document.createElement('p');
    p.append(a);
    contentCell.push(p);
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
