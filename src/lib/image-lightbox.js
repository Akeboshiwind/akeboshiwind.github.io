const clamp = (n, max) => Math.min(Math.max(n, 0), Math.max(max, 0));

/**
 * The zoom after `level` — 0 fitted to the screen, 1 actual size, 2 twice that — skipping actual size when the
 * `natural` width is no wider than the `fitted` one, so every step enlarges.
 */
export function nextZoom(level, { natural, fitted }) {
  if (level === 0) return natural > fitted ? 1 : 2;
  return level === 1 ? 2 : 0;
}

/**
 * Where to scroll an image growing from `rect` to `size` in `viewport`, so the point under the pointer (`x`, `y`)
 * stays under it.
 */
export function zoomScroll({ x, y, rect, size, viewport }) {
  const left = ((x - rect.left) / rect.width) * size.width - x;
  const top = ((y - rect.top) / rect.height) * size.height - y;
  return {
    left: clamp(left, size.width - viewport.width),
    top: clamp(top, size.height - viewport.height),
  };
}

/**
 * Lets a reader click, tap or press Enter on an image in `article` to open it, fitted to the screen, in `dialog`.
 * Clicking it there steps through actual size and 2x (see `nextZoom`), panned by scrolling the dialog alone; the
 * close button, the backdrop or Escape closes it. An image inside a link is left to the link.
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

  const zoomTo = (level) => {
    if (level === 0) {
      delete dialog.dataset.zoom;
      shown.style.width = '';
    } else {
      dialog.dataset.zoom = String(level);
      shown.style.width = `${shown.naturalWidth * level}px`;
    }
  };

  shown.addEventListener('click', (e) => {
    const rect = shown.getBoundingClientRect();
    const level = nextZoom(Number(dialog.dataset.zoom ?? 0), { natural: shown.naturalWidth, fitted: rect.width });
    zoomTo(level);
    if (level === 0) return;
    const { left, top } = zoomScroll({
      x: e.clientX,
      y: e.clientY,
      rect,
      size: { width: shown.naturalWidth * level, height: shown.naturalHeight * level },
      viewport: { width: dialog.clientWidth, height: dialog.clientHeight },
    });
    dialog.scrollTo(left, top);
  });
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.closest('button')) dialog.close();
  });
  dialog.addEventListener('close', () => zoomTo(0));
}
