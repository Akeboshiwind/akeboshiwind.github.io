import { describe, it, expect, beforeEach } from 'vitest';
import { wireImageLightbox } from './image-lightbox.js';

describe('wireImageLightbox', () => {
  let article, dialog;

  beforeEach(() => {
    document.body.innerHTML = `
      <article>
        <p><img src="/a.webp" alt="A cat"></p>
        <a href="/elsewhere/"><img src="/b.webp" alt="A link"></a>
      </article>
      <dialog><img></dialog>`;
    article = document.querySelector('article');
    dialog = document.querySelector('dialog');
    dialog.showModal = function () { this.open = true; };
    dialog.close = function () { this.open = false; };
    wireImageLightbox(article, dialog);
  });

  const shown = () => dialog.querySelector('img');

  it('opens the clicked image in the dialog', () => {
    article.querySelector('img[alt="A cat"]').click();
    expect(dialog.open).toBe(true);
    expect(shown().src).toBe(new URL('/a.webp', location.href).href);
    expect(shown().alt).toBe('A cat');
  });

  it('opens from the keyboard', () => {
    const img = article.querySelector('img[alt="A cat"]');
    expect(img.tabIndex).toBe(0);
    img.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(dialog.open).toBe(true);
  });

  it('leaves an image inside a link to the link', () => {
    article.querySelector('img[alt="A link"]').click();
    expect(dialog.open).toBe(false);
  });

  it('closes on any click in the dialog', () => {
    article.querySelector('img[alt="A cat"]').click();
    shown().click();
    expect(dialog.open).toBe(false);
  });
});
