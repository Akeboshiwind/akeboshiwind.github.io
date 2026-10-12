// Ordered dithering: https://en.wikipedia.org/wiki/Ordered_dithering
export function bayer(n) {
  if (n === 1) return [[0]];
  const m = bayer(n / 2);
  const q = (k) => m.map((row) => row.map((v) => 4 * v + k));
  const [a, b, c, d] = [q(0), q(2), q(3), q(1)];
  return [
    ...a.map((row, i) => [...row, ...b[i]]),
    ...c.map((row, i) => [...row, ...d[i]]),
  ];
}

const BAYER_8 = bayer(8);

/**
 * CSS `url()`s of an ordered-dither dissolve, for animating a tiled 4×4 mask: frame k of `steps` has the
 * Bayer cells below level `16k / steps` on, so frame 0 shows nothing, the last shows everything,
 * and each frame keeps every cell the one before had.
 *
 * @param {number} steps
 * @returns {string[]} `steps + 1` frames
 */
export function dissolveFrames(steps) {
  const levels = bayer(4);
  return Array.from({ length: steps + 1 }, (_, k) => {
    let rects = '';
    levels.forEach((row, y) => row.forEach((level, x) => {
      if (level < (16 * k) / steps) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 4" shape-rendering="crispEdges">${rects}</svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  });
}

// mulberry32: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Threshold a density field into a 1-bit mask.
 *
 * @param {number} cols
 * @param {number} rows
 * @param {(x: number, y: number) => number} density
 *   Called with the cell centre in cell units; returns 0 (never lit) to 1 (always lit).
 * @param {{ method?: 'bayer' | 'noise' | 'atkinson', seed?: number }} [opts] `seed` only affects `noise`.
 * @returns {Uint8Array} row-major, 1 = lit
 */
export function dither(cols, rows, density, { method = 'bayer', seed = 1 } = {}) {
  if (method === 'atkinson') return atkinson(cols, rows, density);
  const mask = new Uint8Array(cols * rows);
  const random = rng(seed);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const threshold = method === 'noise'
        ? random()
        : (BAYER_8[y % 8][x % 8] + 0.5) / 64;
      mask[y * cols + x] = density(x + 0.5, y + 0.5) > threshold ? 1 : 0;
    }
  }
  return mask;
}

// Atkinson dithering: https://en.wikipedia.org/wiki/Atkinson_dithering
const ATKINSON_SPREAD = [[1, 0], [2, 0], [-1, 1], [0, 1], [1, 1], [0, 2]];

function atkinson(cols, rows, density) {
  const grid = new Float32Array(cols * rows);
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) grid[y * cols + x] = density(x + 0.5, y + 0.5);
  const mask = new Uint8Array(cols * rows);
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x;
      mask[i] = grid[i] >= 0.5 ? 1 : 0;
      const err = (grid[i] - mask[i]) / 8;
      for (const [dx, dy] of ATKINSON_SPREAD) {
        const [nx, ny] = [x + dx, y + dy];
        if (nx >= 0 && nx < cols && ny < rows) grid[ny * cols + nx] += err;
      }
    }
  }
  return mask;
}

const clamp = (v) => Math.min(1, Math.max(0, v));

const shade = (x, y, cx, cy, r) => clamp(0.12 + Math.hypot(x - (cx - r * 0.45), y - (cy - r * 0.5)) / (r * 1.6));

const facet = (d, steps = 4) => Math.round(d * steps) / steps;

function lumpy(random, wobble = 1) {
  const harmonics = [2, 3, 5].map((k, i) => ({ k, phase: random() * Math.PI * 2, amp: wobble * [0.18, 0.12, 0.07][i] * (0.6 + random() * 0.8) }));
  const tilt = (random() - 0.5) * 0.5;
  return (angle) => 1 + harmonics.reduce((s, { k, phase, amp }) => s + amp * Math.sin(k * (angle + tilt) + phase), 0);
}

function stone(x, y, { cx, cy, rx, ry, outline }) {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  if (Math.hypot(dx, dy) > outline(Math.atan2(dy, dx))) return null;
  return facet(shade(x, y, cx, cy, Math.max(rx, ry)));
}

/**
 * Shapes keyed by the `data-dither` value that selects them: the `dither` method each is drawn with, and
 * `make(cols, rows, random)`, which takes the grid size and a seeded `random` and returns its density function.
 */
export const shapes = {
  rule: { method: 'noise', make: (w, h) => (x, y) => {
    const across = 1 - Math.abs((2 * y) / h - 1);
    const ends = clamp(Math.min(x, w - x) / (w * 0.2));
    return clamp(across * 1.4 * ends);
  } },

  'fade-x': { method: 'bayer', make: (w) => (x) => clamp(1 - x / w) },

  ripples: { method: 'bayer', make: (w, h, random) => {
    const squash = 3;
    const n = Math.max(3, Math.round(w / 30));
    const drops = Array.from({ length: n }, (_, i) => ({
      x: ((i + 0.2 + 0.6 * random()) / n) * w,
      y: h * (0.25 + 0.6 * random()),
      r: h * (0.6 + 1.6 * random()),
    }));
    return (x, y) => {
      let d = 0;
      for (const drop of drops) {
        const t = Math.hypot(x - drop.x, (y - drop.y) * squash) / drop.r;
        if (t >= 1) continue;
        const ring = (0.5 + 0.5 * Math.cos(t * Math.PI * 6)) ** 6;
        d = Math.max(d, ring * (1 - t) ** 1.5);
      }
      return clamp(d);
    };
  } },

  rings: { method: 'bayer', make: (w, h) => {
    const r = Math.min(w, h) / 2;
    return (x, y) => {
      const d = Math.hypot(x - w / 2, y - h / 2) / r;
      if (d > 1) return 0;
      return clamp((0.5 + 0.5 * Math.cos(d * Math.PI * 7)) * (1 - d));
    };
  } },

  cairn: { method: 'bayer', make: (w, h, random) => {
    const stones = [
      { cx: w * 0.5, cy: h * 0.24, rx: w * 0.2, ry: h * 0.12 },
      { cx: w * 0.52, cy: h * 0.5, rx: w * 0.31, ry: h * 0.14 },
      { cx: w * 0.48, cy: h * 0.78, rx: w * 0.46, ry: h * 0.16 },
    ].map((s) => ({ ...s, outline: lumpy(random, 0.6) }));
    return (x, y) => {
      for (const s of stones) {
        const d = stone(x, y, s);
        if (d !== null) return d;
      }
      return 0;
    };
  } },
};

const PAPER = 0.9;
const INK_FLOOR = 0.15;

const luminance = (rgba, i) => (0.2126 * rgba[4 * i] + 0.7152 * rgba[4 * i + 1] + 0.0722 * rgba[4 * i + 2]) / 255;

/**
 * Density field from an image: dark pixels light up.
 *
 * @param {Uint8ClampedArray} rgba `ImageData.data` for a `cols × rows` image
 * @param {number} cols
 * @param {number} rows
 * @param {{ tone?: 'stretch' | 'equalise' | 'paper' }} [opts]
 *   - `stretch`: contrast stretched to the image's own luminance range.
 *   - `equalise`: histogram equalisation, so each distinct luminance gets an evenly spaced density;
 *     a single-luminance image falls back to `stretch`.
 *   - `paper`: luminance ≥ `PAPER` is empty page; the remaining ink is equalised into [`INK_FLOOR`, 1],
 *     so off-white panels don't speckle and the lightest ink colour still shows.
 */
export function imageDensity(rgba, cols, rows, { tone = 'stretch' } = {}) {
  const lum = new Float32Array(cols * rows);
  for (let i = 0; i < lum.length; i++) lum[i] = luminance(rgba, i);
  const at = (x, y) => lum[Math.floor(y) * cols + Math.floor(x)];
  if (tone === 'equalise') {
    const equalised = equalise(lum);
    if (equalised) return (x, y) => equalised(at(x, y));
  }
  if (tone === 'paper') {
    const ink = lum.filter((v) => v < PAPER);
    const equalised = ink.length ? equalise(ink) : null;
    return (x, y) => {
      const v = at(x, y);
      if (v >= PAPER) return 0;
      return INK_FLOOR + (1 - INK_FLOOR) * (equalised ? equalised(v) : 1);
    };
  }
  const min = lum.reduce((a, v) => Math.min(a, v), Infinity);
  const range = lum.reduce((a, v) => Math.max(a, v), -Infinity) - min;
  const stretch = range < 0.05 ? (v) => v : (v) => (v - min) / range;
  return (x, y) => clamp(1 - stretch(at(x, y)));
}

function equalise(lum) {
  const bin = (v) => Math.round(v * 255);
  const cdf = new Float32Array(256);
  for (const v of lum) cdf[bin(v)]++;
  for (let b = 1; b < 256; b++) cdf[b] += cdf[b - 1];
  const cdfMin = cdf[bin(lum.reduce((a, v) => Math.min(a, v), Infinity))];
  const span = lum.length - cdfMin;
  if (span === 0) return null;
  return (v) => clamp(1 - (cdf[bin(v)] - cdfMin) / span);
}

