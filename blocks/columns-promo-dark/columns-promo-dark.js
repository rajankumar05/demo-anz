/**
 * columns-promo-dark — full-bleed dark promotional tile.
 * Authored as one row, two columns: [image | text (heading + paragraphs + link)].
 * The image column is detected and tagged; the CTA link is styled as a button.
 */
export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-promo-dark-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic && col.children.length === 1) {
        col.classList.add('columns-promo-dark-img-col');
      } else {
        col.classList.add('columns-promo-dark-text-col');
        const link = col.querySelector('a');
        if (link) link.classList.add('button');
      }
    });
  });
}
