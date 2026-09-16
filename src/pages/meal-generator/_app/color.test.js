import { describe, test, expect } from 'vitest';
import { hslToRgb, relativeLuminance, contrastRatio, toHex, swatch } from './color.js';
import { MEALS } from './meals.js';

describe('hslToRgb', () => {
  test.each([
    [0, 100, 50, [255, 0, 0]],
    [120, 100, 50, [0, 255, 0]],
    [240, 100, 50, [0, 0, 255]],
    [0, 0, 100, [255, 255, 255]],
    [0, 0, 0, [0, 0, 0]],
    [0, 0, 50, [128, 128, 128]],
  ])('hsl(%i %i%% %i%%)', (h, s, l, expected) => {
    expect(hslToRgb(h, s, l)).toEqual(expected);
  });

  test('wraps hues outside 0–359', () => {
    expect(hslToRgb(360, 50, 50)).toEqual(hslToRgb(0, 50, 50));
    expect(hslToRgb(-60, 50, 50)).toEqual(hslToRgb(300, 50, 50));
  });
});

describe('contrast', () => {
  test('white on black is the maximum ratio', () => {
    expect(contrastRatio([255, 255, 255], [0, 0, 0])).toBeCloseTo(21, 5);
  });

  test('is symmetric', () => {
    expect(contrastRatio([10, 80, 200], [240, 240, 10]))
      .toBeCloseTo(contrastRatio([240, 240, 10], [10, 80, 200]), 10);
  });

  test('luminance is ordered by brightness', () => {
    expect(relativeLuminance([0, 0, 0])).toBeLessThan(relativeLuminance([128, 128, 128]));
    expect(relativeLuminance([128, 128, 128])).toBeLessThan(relativeLuminance([255, 255, 255]));
  });
});

describe('toHex', () => {
  test('pads and upper-cases', () => {
    expect(toHex([26, 20, 35])).toBe('#1A1423');
    expect(toHex([255, 255, 255])).toBe('#FFFFFF');
  });
});

describe('swatch', () => {
  test('every meal band clears 4.5:1 for its text', () => {
    for (const meal of MEALS) {
      const { background, text } = swatch(meal.hue);
      const parse = css => css.match(/\d+/g).map(Number);
      expect(contrastRatio(parse(background), parse(text)),
        `${meal.name} (hue ${meal.hue})`).toBeGreaterThanOrEqual(4.5);
    }
  });

  test('is a pure function of the hue', () => {
    expect(swatch(200)).toEqual(swatch(200));
    expect(swatch(200)).not.toEqual(swatch(40));
  });
});
