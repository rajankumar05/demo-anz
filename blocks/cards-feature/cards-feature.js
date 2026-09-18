import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-feature — grey tiles each led by a large illustration.
 * Each authored row is one card: an image cell + a text cell
 * (heading + paragraph(s) + link). Renders as a responsive <ul> grid;
 * illustration on top, body below, CTA pinned to the tile's bottom edge.
 */

/**
 * Restore alpha-preserving Dynamic Media formats on a <picture>.
 * createOptimizedPicture() swaps Scene7 `fmt=png-alpha`/`webp-alpha` requests
 * for opaque `fmt=webp`/`fmt=jpg`, which paints a white box behind cut-out
 * illustrations. Rewrite each source/img URL back to its alpha variant.
 */
function preserveAlpha(picture) {
  const fix = (url) => {
    if (!url || !/assets\.anz\.co\.nz|\/is\/image\//.test(url)) return url;
    return url
      .replace(/fmt=webp(?!-alpha)/g, 'fmt=webp-alpha')
      .replace(/fmt=(?:jpe?g|png)(?!-alpha)/g, 'fmt=png-alpha');
  };
  picture.querySelectorAll('source').forEach((s) => {
    if (s.srcset) s.srcset = fix(s.srcset);
    // opaque JPEG fallbacks can't carry alpha — drop them
    if (s.type === 'image/jpeg') s.remove();
  });
  const img = picture.querySelector('img');
  if (img) {
    const src = img.getAttribute('src');
    if (src) img.setAttribute('src', fix(src));
  }
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    const cells = [...li.children];
    cells.forEach((div) => {
      // The image cell holds a picture; the leading cell may be authored
      // empty (illustration omitted) — treat a text-less cell as the slot too.
      const hasText = div.textContent.trim().length > 0;
      if (div.querySelector('picture') || !hasText) {
        div.className = 'cards-feature-image';
      } else {
        div.className = 'cards-feature-body';
      }
    });

    // Style the trailing link as a button.
    const link = li.querySelector('.cards-feature-body a');
    if (link) link.classList.add('button');

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    // Only run EDS optimization on same-origin images. Cross-origin illustrations
    // (e.g. anz.co.nz DAM) don't honour the ?width/format/optimize params, so
    // optimizing them yields a broken src — leave those <img> as-is.
    let sameOrigin = false;
    try {
      sameOrigin = new URL(img.src, window.location.href).origin === window.location.origin;
    } catch { sameOrigin = false; }
    if (!sameOrigin) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
    // Scene7 illustrations are cut-outs — keep their transparency.
    preserveAlpha(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
