const clamp = (n, max) => Math.min(Math.max(n, 0), Math.max(max, 0));

/**
 * Where to scroll an image going from fitted (`rect`) to its `natural` size in `viewport`, so the point under the
 * pointer (`x`, `y`) stays under it.
 */
export function zoomScroll({ x, y, rect, natural, viewport }) {
  const left = ((x - rect.left) / rect.width) * natural.width - x;
  const top = ((y - rect.top) / rect.height) * natural.height - y;
  return {
    left: clamp(left, natural.width - viewport.width),
    top: clamp(top, natural.height - viewport.height),
  };
}

/**
 * Lets a reader click, tap or press Enter on an image in `article` to open it, fitted to the screen, in `dialog`.
 * Clicking it there toggles actual size, panned by scrolling the dialog alone; the close button, the backdrop or
 * Escape closes it. An image inside a link is left to the link.
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

  shown.addEventListener('click', (e) => {
    const rect = shown.getBoundingClientRect();
    if (dialog.toggleAttribute('data-zoomed')) {
      const { left, top } = zoomScroll({
        x: e.clientX,
        y: e.clientY,
        rect,
        natural: { width: shown.naturalWidth, height: shown.naturalHeight },
        viewport: { width: dialog.clientWidth, height: dialog.clientHeight },
      });
      dialog.scrollTo(left, top);
    }
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('button')) dialog.close();
  });
  dialog.addEventListener('close', () => dialog.removeAttribute('data-zoomed'));
}
