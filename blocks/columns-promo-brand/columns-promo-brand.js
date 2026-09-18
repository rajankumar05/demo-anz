/**
 * columns-promo-brand — full-bleed brand-blue promotional tile.
 * Authored as one row, two columns: [text (heading + paragraphs + link) | image].
 * The image column is detected and tagged; the CTA link is styled as a button.
 * On narrow viewports the two columns stack (text first).
 */

/**
 * Restore alpha-preserving Dynamic Media formats on a <picture>.
 * The Scene7 auto-block (scripts.js) renders DM anchors as <picture> with
 * opaque `fmt=webp` / `fmt=jpg` sources, which paint a white box behind the
 * cut-out MyPhoto card artwork. Rewrite each source/img URL back to its
 * alpha-preserving variant so the artwork sits directly on the blue band.
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
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-promo-brand-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        col.classList.add('columns-promo-brand-img-col');
        preserveAlpha(pic);
      } else {
        col.classList.add('columns-promo-brand-text-col');
        const link = col.querySelector('a');
        if (link) link.classList.add('button');
      }
    });
  });
}
