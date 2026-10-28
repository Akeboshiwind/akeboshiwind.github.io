/**
 * Lets a reader click, tap or press Enter on an image in `article` to see it at full size in `dialog`, and click
 * anywhere to close it again. An image inside a link is left to the link.
 */
export function wireImageLightbox(article, dialog) {
  const shown = dialog.querySelector('img');
  const expandable = (target) => {
    const img = target.closest?.('img');
    return img && !img.closest('a') ? img : null;
  };
  const open = (img) => {
    shown.src = img.currentSrc || img.src;
    shown.alt = img.alt;
    dialog.showModal();
  };

  for (const img of article.querySelectorAll('img')) {
    if (expandable(img)) img.tabIndex = 0;
  }
  article.dataset.lightbox = '';
  article.addEventListener('click', (e) => {
    const img = expandable(e.target);
    if (img) open(img);
  });
  article.addEventListener('keydown', (e) => {
    const img = e.key === 'Enter' && expandable(e.target);
    if (img) open(img);
  });
  dialog.addEventListener('click', () => dialog.close());
}
