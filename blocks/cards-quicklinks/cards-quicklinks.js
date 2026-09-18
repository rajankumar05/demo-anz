import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * cards-quicklinks — horizontal strip of small icon-over-label links.
 * Each authored row is one quick link: an icon (image) plus link text.
 * Renders as a <ul> of <li>, icon stacked above the label, separated by
 * vertical dividers on wider viewports.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-quicklinks-icon';
      } else {
        div.className = 'cards-quicklinks-label';
      }
    });
    // If the whole item is wrapped in a link, keep it clickable end to end.
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '120' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.textContent = '';
  block.append(ul);
}
