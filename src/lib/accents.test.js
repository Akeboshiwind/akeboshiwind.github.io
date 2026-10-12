import { describe, it, expect } from 'vitest';
import { ACCENTS, DEFAULT_ACCENT, DEFAULT_FACE, DICE_FACES, fromHue, nextAccent, nextFace, parseChoice, serialiseChoice } from './accents.js';

describe('ACCENTS', () => {
  it('starts with the original orange, which is the default', () => {
    expect(DEFAULT_ACCENT).toBe('orange');
    expect(ACCENTS[0]).toEqual({
      id: 'orange',
      name: 'Orange',
      light: { accent: '#e5501c', link: '#b23b0e' },
      dark: { accent: '#ff6a33', link: '#ff8c5e' },
    });
  });

  it('has unique ids', () => {
    const ids = ACCENTS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('builds every other accent from an OKLCH hue', () => {
    for (const a of ACCENTS.slice(1)) {
      const hue = Number(a.id.slice(1));
      expect(a, a.id).toMatchObject(fromHue(hue));
    }
  });
});

describe('DICE_FACES', () => {
  it('has six faces, face n having n pips, all inside the 24-unit icon', () => {
    expect(DICE_FACES.map((pips) => pips.length)).toEqual([1, 2, 3, 4, 5, 6]);
    for (const [x, y] of DICE_FACES.flat()) {
      expect(x).toBeGreaterThanOrEqual(4);
      expect(y).toBeGreaterThanOrEqual(4);
      expect(x + 4).toBeLessThanOrEqual(20);
      expect(y + 4).toBeLessThanOrEqual(20);
    }
  });
});

describe('parseChoice', () => {
  const fallback = { id: DEFAULT_ACCENT, face: DEFAULT_FACE };

  it('round-trips a choice through serialiseChoice', () => {
    expect(parseChoice(serialiseChoice({ id: 'h150', face: 3 }))).toEqual({ id: 'h150', face: 3 });
  });

  it('falls back to the defaults when nothing usable is stored', () => {
    for (const raw of [null, '', 'h150', '{', '[]', 'null']) expect(parseChoice(raw), String(raw)).toEqual(fallback);
  });

  it('replaces only the part that is invalid', () => {
    expect(parseChoice('{"id":"constructor","face":3}')).toEqual({ id: DEFAULT_ACCENT, face: 3 });
    expect(parseChoice('{"id":"h150","face":2.5}')).toEqual({ id: 'h150', face: DEFAULT_FACE });
    expect(parseChoice('{"id":"h150","face":7}')).toEqual({ id: 'h150', face: DEFAULT_FACE });
  });
});

describe('fromHue', () => {
  it('gives light and dark accent and link colours at that hue', () => {
    expect(fromHue(150, 0.19)).toEqual({
      light: { accent: 'oklch(0.62 0.19 150)', link: 'oklch(0.47 0.162 150)' },
      dark: { accent: 'oklch(0.72 0.171 150)', link: 'oklch(0.80 0.133 150)' },
    });
  });
});

describe('nextFace', () => {
  it('rolls a die face other than the current one', () => {
    for (let current = 1; current <= 6; current++) {
      for (const r of [0, 0.3, 0.6, 0.999]) {
        const face = nextFace(current, () => r);
        expect(face).not.toBe(current);
        expect(face).toBeGreaterThanOrEqual(1);
        expect(face).toBeLessThanOrEqual(6);
      }
    }
  });

  it('can reach every other face', () => {
    const seen = new Set([0, 1, 2, 3, 4].map((i) => nextFace(5, () => (i + 0.5) / 5)));
    expect([...seen].sort()).toEqual([1, 2, 3, 4, 6]);
  });
});

describe('nextAccent', () => {
  it('never re-rolls to the current accent', () => {
    for (const current of ACCENTS.map((a) => a.id)) {
      for (const r of [0, 0.25, 0.5, 0.75, 0.999]) {
        expect(nextAccent(current, () => r)).not.toBe(current);
      }
    }
  });

  it('can reach every other accent', () => {
    const seen = new Set();
    const n = ACCENTS.length - 1;
    for (let i = 0; i < n; i++) seen.add(nextAccent('orange', () => (i + 0.5) / n));
    expect(seen.size).toBe(n);
  });

  it('treats an unknown current id like the default', () => {
    expect(nextAccent('nope', () => 0)).not.toBe(DEFAULT_ACCENT);
  });
});
