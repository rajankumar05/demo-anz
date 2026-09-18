/**
 * hero-banner — full-bleed intro banner.
 * Layout topology: a decorative illustration on one side and a text panel
 * (heading + paragraph + CTA) on the other. On narrow viewports the two
 * stack vertically (text first).
 *
 * Content contract (base block: hero):
 *   - one image cell   → the decorative illustration
 *   - heading + paragraph(s) + link(s) → the text panel
 * Any of these may be omitted by the author; decorate defensively.
 */

// Option class tokens this block understands (excludes the block name itself).
const OPTION_CLASSES = ['reverse'];

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
      .replace(/fmt=webp-alpha/g, 'fmt=webp-alpha')
      .replace(/fmt=webp/g, 'fmt=webp-alpha')
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
  const active = [...block.classList].filter((c) => OPTION_CLASSES.includes(c));

  // The hero content is authored as a single row/column. Flatten to the
  // inner-most content wrapper so we can regroup image vs. text.
  const rows = [...block.children];
  const cells = rows.flatMap((row) => [...row.children]);
  const source = cells.length ? cells : rows;

  const picture = block.querySelector('picture');

  // Media side: the illustration.
  const media = document.createElement('div');
  media.className = 'hero-banner-media';
  if (picture) {
    // EDS's createOptimizedPicture rewrites Dynamic Media (Scene7) URLs to
    // fmt=webp / fmt=jpg, which flatten PNG transparency to a solid white box.
    // Restore the alpha-preserving formats so the illustration sits directly
    // on the coloured band.
    preserveAlpha(picture);
    // keep the picture's own wrapper (usually a <p>) out of the flow
    media.append(picture);
  }

  // Text side: everything that isn't the picture.
  const content = document.createElement('div');
  content.className = 'hero-banner-content';
  source.forEach((node) => {
    // skip nodes that only held the picture (now empty)
    if (node.querySelector && node.querySelector('picture')) return;
    if (!node.textContent.trim() && !node.querySelector('a')) return;
    content.append(node);
  });

  // Group CTA links into a dedicated actions row for consistent styling.
  const links = [...content.querySelectorAll('a')];
  if (links.length) {
    const actions = document.createElement('p');
    actions.className = 'hero-banner-actions';
    links.forEach((a) => {
      a.classList.add('button');
      // lift the anchor out of its original paragraph wrapper
      const wrapper = a.closest('p');
      actions.append(a);
      if (wrapper && !wrapper.textContent.trim() && wrapper.parentElement) {
        wrapper.remove();
      }
    });
    content.append(actions);
  }

  block.textContent = '';
  // Default order: text then media (reverse swaps via CSS below).
  block.append(content);
  if (picture) block.append(media);

  if (!picture) block.classList.add('no-image');
  if (active.includes('reverse')) block.classList.add('hero-banner-reverse');
}
