import { describe, expect, it } from 'vitest';
import { disc, fadeLit, lineCells, outline } from './pixel.js';

describe('outline', () => {
  it('darkens every channel by the same factor, so the hue holds', () => {
    expect(outline([200, 100, 50])).toEqual([120, 60, 30]);
  });

  it('keeps black black', () => {
    expect(outline([0, 0, 0])).toEqual([0, 0, 0]);
  });
});

describe('fadeLit', () => {
  const litIn8x8 = (depth, length) => {
    let n = 0;
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) if (fadeLit(x, y, depth, length)) n++;
    return n;
  };

  it('lights every cell at or beyond the fade length', () => {
    expect(litIn8x8(8, 8)).toBe(64);
    expect(litIn8x8(20, 8)).toBe(64);
  });

  it('lights more cells the deeper into the fade', () => {
    const counts = Array.from({ length: 8 }, (_, d) => litIn8x8(d, 8));
    counts.slice(1).forEach((n, i) => expect(n).toBeGreaterThan(counts[i]));
  });

  it('keeps the outermost row sparse', () => {
    expect(litIn8x8(0, 8)).toBeLessThanOrEqual(8);
  });

  it('only lights a cell deeper in once it is lit further out', () => {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      if (fadeLit(x, y, 3, 8)) expect(fadeLit(x, y, 4, 8)).toBe(true);
    }
  });
});

describe('disc', () => {
  it('is a single cell at radius 0.5', () => {
    expect(disc(0.5)).toEqual([[0, 0]]);
  });

  it('is symmetric in both axes', () => {
    const cells = new Set(disc(4).map(([x, y]) => `${x},${y}`));
    for (const key of cells) {
      const [x, y] = key.split(',').map(Number);
      expect(cells.has(`${-x},${y}`)).toBe(true);
      expect(cells.has(`${x},${-y}`)).toBe(true);
    }
  });

  it('covers about πr² cells', () => {
    expect(disc(4).length).toBeGreaterThan(40);
    expect(disc(4).length).toBeLessThan(60);
  });
});

describe('lineCells', () => {
  it('runs from one end to the other', () => {
    const cells = lineCells(0, 0, 5, 3);
    expect(cells[0]).toEqual([0, 0]);
    expect(cells.at(-1)).toEqual([5, 3]);
  });

  it('steps at most one cell in each axis', () => {
    const cells = lineCells(10, 2, 0, 9);
    cells.slice(1).forEach(([x, y], i) => {
      expect(Math.abs(x - cells[i][0])).toBeLessThanOrEqual(1);
      expect(Math.abs(y - cells[i][1])).toBeLessThanOrEqual(1);
    });
  });

  it('has one cell per step along the longer axis', () => {
    expect(lineCells(0, 0, 7, 2)).toHaveLength(8);
    expect(lineCells(0, 0, 2, -7)).toHaveLength(8);
  });
});
