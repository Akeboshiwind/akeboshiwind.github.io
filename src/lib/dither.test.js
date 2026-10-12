import { describe, it, expect } from 'vitest';
import { bayer, dither, imageDensity, rng, shapes } from './dither.js';

const count = (mask) => mask.reduce((n, on) => n + on, 0);

describe('bayer', () => {
  it('is a permutation of 0..n²-1', () => {
    const m = bayer(8).flat().sort((a, b) => a - b);
    expect(m).toEqual([...Array(64).keys()]);
  });
});

describe('dither', () => {
  for (const method of ['bayer', 'noise']) {
    it(`${method}: density 0 lights nothing, density 1 lights everything`, () => {
      expect(count(dither(10, 4, () => 0, { method }))).toBe(0);
      expect(count(dither(10, 4, () => 1, { method }))).toBe(40);
    });

    it(`${method}: density 0.5 lights roughly half`, () => {
      const lit = count(dither(64, 64, () => 0.5, { method }));
      expect(lit / 4096).toBeCloseTo(0.5, 1);
    });
  }

  it('noise is deterministic per seed', () => {
    const half = () => 0.5;
    const a = dither(32, 8, half, { method: 'noise', seed: 1 });
    const b = dither(32, 8, half, { method: 'noise', seed: 1 });
    const c = dither(32, 8, half, { method: 'noise', seed: 2 });
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });
});

describe('shapes', () => {
  it('every shape stays within [0, 1]', () => {
    for (const [name, { make }] of Object.entries(shapes)) {
      const shape = make(40, 16, rng(1));
      for (let y = 0; y < 16; y++)
        for (let x = 0; x < 40; x++) {
          const d = shape(x + 0.5, y + 0.5);
          expect(d, name).toBeGreaterThanOrEqual(0);
          expect(d, name).toBeLessThanOrEqual(1);
        }
    }
  });

  it('cairn is a different stack of stones for each seed', () => {
    const cairn = (seed) => dither(36, 36, shapes.cairn.make(36, 36, rng(seed)));
    expect(cairn(2)).toEqual(cairn(2));
    expect(cairn(2)).not.toEqual(cairn(3));
    expect([cairn(2)[0], cairn(2)[35]]).toEqual([0, 0]);
  });
});

describe('ripples', () => {
  const lit = (seed) => dither(120, 16, shapes.ripples.make(120, 16, rng(seed)));

  it('draws something, the same way for the same seed', () => {
    expect(count(lit(3))).toBeGreaterThan(0);
    expect(lit(3)).toEqual(lit(3));
  });

  it('moves the drops with the seed', () => {
    expect(lit(3)).not.toEqual(lit(4));
  });
});

describe('imageDensity', () => {
  const rgba = (...greys) => new Uint8ClampedArray(greys.flatMap((g) => [g, g, g, 255]));

  it('maps the darkest pixel to 1 and the lightest to 0', () => {
    const d = imageDensity(rgba(40, 200), 2, 1);
    expect(d(0.5, 0.5)).toBeCloseTo(1);
    expect(d(1.5, 0.5)).toBeCloseTo(0);
  });

  it('does not stretch a flat image', () => {
    const d = imageDensity(rgba(255, 255), 2, 1);
    expect(d(0.5, 0.5)).toBe(0);
  });
});

describe('imageDensity tones', () => {
  const rgba = (...greys) => new Uint8ClampedArray(greys.flatMap((g) => [g, g, g, 255]));
  const row = (d, n) => Array.from({ length: n }, (_, i) => d(i + 0.5, 0.5));

  it('equalise spaces distinct greys evenly, however close their values', () => {
    const d = row(imageDensity(rgba(10, 100, 110, 250), 4, 1, { tone: 'equalise' }), 4);
    expect(d.map((v) => +v.toFixed(2))).toEqual([1, 0.67, 0.33, 0]);
  });

  it('equalise keeps a dominant white background empty', () => {
    const d = row(imageDensity(rgba(255, 255, 255, 255, 255, 255, 30), 7, 1, { tone: 'equalise' }), 7);
    expect(d[0]).toBe(0);
    expect(d[6]).toBe(1);
  });
});

describe('imageDensity paper tone', () => {
  const rgba = (...greys) => new Uint8ClampedArray(greys.flatMap((g) => [g, g, g, 255]));
  const row = (d, n) => Array.from({ length: n }, (_, i) => d(i + 0.5, 0.5));

  it('treats off-white as paper', () => {
    const [white, offWhite] = row(imageDensity(rgba(255, 245, 20), 3, 1, { tone: 'paper' }), 3);
    expect(white).toBe(0);
    expect(offWhite).toBe(0);
  });

  it('keeps the lightest ink visible and the darkest solid', () => {
    const [light, mid, dark] = row(imageDensity(rgba(200, 120, 20, 255), 4, 1, { tone: 'paper' }), 4);
    expect(light).toBeCloseTo(0.15);
    expect(dark).toBe(1);
    expect(mid).toBeGreaterThan(light);
    expect(mid).toBeLessThan(dark);
  });

  it('draws a lone ink colour solid', () => {
    const [ink, paper] = row(imageDensity(rgba(30, 255), 2, 1, { tone: 'paper' }), 2);
    expect(ink).toBe(1);
    expect(paper).toBe(0);
  });
});

