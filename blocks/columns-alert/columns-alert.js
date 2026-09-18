/**
 * columns-alert — notice band: a small icon beside a heading + paragraph.
 * Authored as one row, two columns: [icon | heading + paragraph].
 *
 * Content contract:
 *   - cell 1 → the alert icon (image). May be omitted by the author, in which
 *     case a default shield-alert glyph is injected so the band never renders
 *     iconless.
 *   - cell 2 → heading + paragraph (with an optional inline link).
 * Decorate defensively: authors add/omit cells.
 */

// Inline shield-alert glyph (ANZ "Shield alert fill", brand blue #0572E6).
// Inlined so it renders on the coloured band without a Dynamic Media round-trip
// and without alpha-flattening to a white box.
const SHIELD_ALERT_SVG = `<svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Alert" focusable="false">
  <path d="M12 9C12 7.34315 13.3431 6 15 6H81C82.6569 6 84 7.34315 84 9V51.191C84 63.2672 77.4037 74.3789 66.8021 80.1615L49.4366 89.6337C48.5411 90.1221 47.4589 90.1221 46.5634 89.6337L29.1979 80.1615C18.5963 74.3789 12 63.2672 12 51.191V9ZM45 48H51V24H45V48ZM50.1213 54.8787C48.9497 53.7071 47.0503 53.7071 45.8787 54.8787C44.7071 56.0503 44.7071 57.9498 45.8787 59.1213C47.0503 60.2929 48.9497 60.2929 50.1213 59.1213C51.2929 57.9498 51.2929 56.0503 50.1213 54.8787Z" fill="#0572E6"/>
</svg>`;

export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-alert-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    cells.forEach((col, i) => {
      const pic = col.querySelector('picture, img, svg');
      const isEmpty = !col.textContent.trim() && !pic;
      // The icon lives in a dedicated cell: it holds only an image, or (when
      // the author left it empty) it is the leading empty cell of the row.
      if ((pic && col.children.length === 1) || (isEmpty && i === 0 && cells.length > 1)) {
        col.classList.add('columns-alert-icon-col');
        if (isEmpty) col.innerHTML = SHIELD_ALERT_SVG;
      } else {
        col.classList.add('columns-alert-text-col');
      }
    });
  });
}
