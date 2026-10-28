/**
 * Lets a reader click, tap or press Enter on an image in `article` to lift its height cap in place, and again to
 * restore it. Expanding on the page, rather than in a dialog, keeps the browser's own pinch-zoom working on it. An
 * image inside a link is left to the link.
 */
export function wireImageExpand(article) {
  const expandable = (target) => {
    const img = target.closest?.('img');
    return img && !img.closest('a') ? img : null;
  };
  const toggle = (img) => img.toggleAttribute('data-expanded');

  for (const img of article.querySelectorAll('img')) {
    if (expandable(img)) img.tabIndex = 0;
  }
  article.dataset.imageExpand = '';
  article.addEventListener('click', (e) => {
    const img = expandable(e.target);
    if (img) toggle(img);
  });
  article.addEventListener('keydown', (e) => {
    const img = e.key === 'Enter' && expandable(e.target);
    if (img) toggle(img);
  });
}
