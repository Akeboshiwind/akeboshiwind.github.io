import { describe, it, expect, beforeEach } from 'vitest';
import { wireImageLightbox, zoomScroll } from './image-lightbox.js';

describe('wireImageLightbox', () => {
  let article, dialog, img, linked, shown, closeButton;

  beforeEach(() => {
    document.body.innerHTML = `
      <article>
        <p><img src="/a.webp" alt="A cat"></p>
        <a href="/elsewhere/"><img src="/b.webp" alt="A link"></a>
      </article>
      <dialog><button type="button" aria-label="Close"></button><img></dialog>`;
    article = document.querySelector('article');
    dialog = document.querySelector('dialog');
    dialog.showModal = function () { this.open = true; };
    dialog.close = function () { this.open = false; this.dispatchEvent(new Event('close')); };
    img = article.querySelector('img[alt="A cat"]');
    linked = article.querySelector('img[alt="A link"]');
    shown = dialog.querySelector('img');
    closeButton = dialog.querySelector('button');
    wireImageLightbox(article, dialog);
  });

  const zoomed = () => dialog.hasAttribute('data-zoomed');

  it('opens the clicked image in the dialog, fitted to the screen', () => {
    img.click();
    expect(dialog.open).toBe(true);
    expect(shown.src).toBe(new URL('/a.webp', location.href).href);
    expect(shown.alt).toBe('A cat');
    expect(zoomed()).toBe(false);
  });

  it('opens from the keyboard', () => {
    expect(img.tabIndex).toBe(0);
    img.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(dialog.open).toBe(true);
  });

  it('leaves an image inside a link to the link', () => {
    linked.click();
    expect(dialog.open).toBe(false);
    expect(linked.tabIndex).toBe(-1);
  });

  it('toggles between fitted and actual size when the shown image is clicked', () => {
    img.click();
    shown.click();
    expect(zoomed()).toBe(true);
    expect(dialog.open).toBe(true);
    shown.click();
    expect(zoomed()).toBe(false);
  });

  it('closes on the close button or the backdrop, and reopens fitted', () => {
    img.click();
    shown.click();
    closeButton.click();
    expect(dialog.open).toBe(false);

    img.click();
    expect(zoomed()).toBe(false);
    dialog.click();
    expect(dialog.open).toBe(false);
  });
});

describe('zoomScroll', () => {
  const viewport = { width: 400, height: 800 };
  const rect = { left: 0, top: 200, width: 400, height: 400 };
  const natural = { width: 2000, height: 2000 };

  it('keeps the clicked point of the image under the pointer', () => {
    // The middle of the fitted image is (1000, 1000) at actual size; it should land at the pointer (200, 400).
    expect(zoomScroll({ x: 200, y: 400, rect, natural, viewport })).toEqual({ left: 800, top: 600 });
  });

  it('stays within the scrollable range', () => {
    expect(zoomScroll({ x: 0, y: 200, rect, natural, viewport })).toEqual({ left: 0, top: 0 });
    expect(zoomScroll({ x: 400, y: 600, rect, natural, viewport })).toEqual({ left: 1600, top: 1200 });
  });

  it('does not scroll along an axis the image fits', () => {
    expect(zoomScroll({ x: 200, y: 400, rect, natural: { width: 300, height: 2000 }, viewport }).left).toBe(0);
  });
});
