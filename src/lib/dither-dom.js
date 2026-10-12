import { dither, imageDensity, rng, shapes } from './dither.js';

const IMAGE_TONES = { ui: 'equalise', image: 'paper' };

const watched = new WeakSet();

function imageField(el, cols, rows, repaint) {
  const img = el.parentElement.querySelector('img');
  if (!img) return null;
  if (!watched.has(img)) {
    watched.add(img);
    img.addEventListener('load', repaint);
  }
  if (!img.complete || !img.naturalWidth) return null;
  // naturalWidth is density-corrected for srcset candidates, but drawImage's source rect is in bitmap pixels,
  // so crop with the destination rect, which only depends on the aspect ratio.
  const s = Math.max(cols / img.naturalWidth, rows / img.naturalHeight);
  const [dw, dh] = [img.naturalWidth * s, img.naturalHeight * s];
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  ctx.canvas.width = cols;
  ctx.canvas.height = rows;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
  return imageDensity(ctx.getImageData(0, 0, cols, rows).data, cols, rows, { tone: IMAGE_TONES[el.dataset.ditherKind] });
}

function imageShape(el, seed) {
  const repaint = () => {
    const box = el.getBoundingClientRect();
    paint(el, seed, box.width, box.height);
  };
  return { method: 'atkinson', make: (cols, rows) => imageField(el, cols, rows, repaint) };
}

function maskUrl(mask, cols, rows, scale) {
  const cells = document.createElement('canvas');
  cells.width = cols;
  cells.height = rows;
  const pixels = new ImageData(cols, rows);
  mask.forEach((on, i) => { pixels.data[4 * i + 3] = on ? 255 : 0; });
  cells.getContext('2d').putImageData(pixels, 0, 0);

  // Mask images are resampled smoothly, so draw at device resolution to keep pixel edges hard.
  const canvas = document.createElement('canvas');
  canvas.width = cols * scale;
  canvas.height = rows * scale;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(cells, 0, 0, canvas.width, canvas.height);
  return `url(${canvas.toDataURL()})`;
}

function paint(el, seed, width, height) {
  const shape = el.dataset.dither || 'rule';
  const px = Number(el.dataset.px) || 2;
  const cols = Math.ceil(width / px);
  const rows = Math.ceil(height / px);
  if (!cols || !rows) return;

  const { method, make } = shape === 'image' ? imageShape(el, seed) : shapes[shape] ?? {};
  const random = rng(seed);
  const density = make?.(cols, rows, random);
  if (!density) return;

  const mask = dither(cols, rows, density, { method, seed: Math.floor(random() * 2 ** 32) });

  const url = maskUrl(mask, cols, rows, Math.max(1, Math.round(px * devicePixelRatio)));
  const size = `${cols * px}px ${rows * px}px`;
  Object.assign(el.style, {
    maskImage: url, webkitMaskImage: url,
    maskSize: size, webkitMaskSize: size,
  });
  el.dataset.dithered = '';
}

function markTouched({ target }) {
  target.closest?.('.dither-img')?.setAttribute('data-touched', '');
}

const DISSOLVES = { undither: 'in', redither: 'out' };
const settledAs = (animationName) => DISSOLVES[animationName.replace(/-\d+$/, '')];

// Covers a dissolve that starts but never fires animationend.
const SETTLE_SLACK_MS = 50;

/**
 * Mark each element whose dissolve has finished with `data-dissolved="in" | "out"`, so CSS can swap the
 * animation's held last frame for a plain resting style; WebKit sometimes leaves a dissolve painted mid-way.
 */
export function settleDissolves(root = document) {
  const timers = new WeakMap();
  const settle = (el, state) => {
    clearTimeout(timers.get(el));
    el.dataset.dissolved = state;
  };
  root.addEventListener('animationstart', ({ target, animationName }) => {
    const state = settledAs(animationName);
    if (!state) return;
    delete target.dataset.dissolved;
    clearTimeout(timers.get(target));
    const ms = (Number.parseFloat(getComputedStyle(target).animationDuration) || 0) * 1000;
    timers.set(target, setTimeout(() => settle(target, state), ms + SETTLE_SLACK_MS));
  });
  root.addEventListener('animationend', ({ target, animationName }) => {
    const state = settledAs(animationName);
    if (state) settle(target, state);
  });
}

const SELECTOR = 'hr, [data-dither]';

/** Paint every `hr` and `[data-dither]` element, including ones added later, repainting when its size changes. */
export function ditherAll(root = document) {
  let nextSeed = 1;
  const seeds = new WeakMap();
  const sizes = new WeakMap();
  const resizes = new ResizeObserver((entries) => {
    for (const { target, borderBoxSize: [box] } of entries) {
      const [width, height] = [box.inlineSize, box.blockSize];
      // Hidden elements report 0×0; keeping the last real size means showing them again doesn't re-dither.
      if (!width || !height) continue;
      const size = `${Math.round(width)}x${Math.round(height)}`;
      if (sizes.get(target) === size) continue;
      sizes.set(target, size);
      paint(target, seeds.get(target), width, height);
    }
  });
  const track = (el) => {
    if (seeds.has(el)) return;
    const inOrder = nextSeed++;
    const seed = Number.parseInt(el.dataset.seed ?? '', 10);
    seeds.set(el, Number.isNaN(seed) ? inOrder : seed);
    resizes.observe(el);
  };
  root.querySelectorAll(SELECTOR).forEach(track);
  root.addEventListener('pointerover', markTouched);
  root.addEventListener('focusin', markTouched);
  settleDissolves(root);
  new MutationObserver((records) => records.forEach(({ addedNodes }) => addedNodes.forEach((node) => {
    if (node.nodeType !== 1) return;
    if (node.matches(SELECTOR)) track(node);
    node.querySelectorAll(SELECTOR).forEach(track);
  }))).observe(root.body ?? root, { childList: true, subtree: true });
}
