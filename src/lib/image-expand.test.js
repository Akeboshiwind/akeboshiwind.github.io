import { describe, it, expect, beforeEach } from 'vitest';
import { wireImageExpand } from './image-expand.js';

describe('wireImageExpand', () => {
  let article, img, linked;

  beforeEach(() => {
    document.body.innerHTML = `
      <article>
        <p><img src="/a.webp" alt="A cat"></p>
        <a href="/elsewhere/"><img src="/b.webp" alt="A link"></a>
      </article>`;
    article = document.querySelector('article');
    img = article.querySelector('img[alt="A cat"]');
    linked = article.querySelector('img[alt="A link"]');
    wireImageExpand(article);
  });

  it('expands a clicked image, and a second click shrinks it again', () => {
    img.click();
    expect(img.hasAttribute('data-expanded')).toBe(true);
    img.click();
    expect(img.hasAttribute('data-expanded')).toBe(false);
  });

  it('expands from the keyboard', () => {
    expect(img.tabIndex).toBe(0);
    img.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(img.hasAttribute('data-expanded')).toBe(true);
  });

  it('leaves an image inside a link to the link', () => {
    linked.click();
    expect(linked.hasAttribute('data-expanded')).toBe(false);
    expect(linked.tabIndex).toBe(-1);
  });
});
