/**
 * cards-product — grey text-only product tiles.
 * Each authored row is one card: heading + paragraph + link. No images.
 * Renders as a responsive <ul> grid of card bodies.
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      div.className = 'cards-product-body';
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}
