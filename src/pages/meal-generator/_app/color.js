// Turning a meal's hue into the colours of its band.
//
// Every band uses the same saturation and lightness so a meal keeps its
// identity wherever it lands in the palette. Text colour is picked per band
// by contrast, because a fixed white would fail on the yellows.

// Muted and deep enough that white text clears 4.5:1 at every hue — the
// mid-lightness band where neither white nor ink reaches 4.5 sits just above
// this (see color.test.js).
export const SATURATION = 34;
export const LIGHTNESS = 33;

const INK = [26, 20, 35]; // near-black with a hint of purple, as in the mock
const PAPER = [255, 255, 255];

export const hslToRgb = (h, s, l) => {
  const sat = s / 100;
  const lum = l / 100;
  const c = (1 - Math.abs(2 * lum - 1)) * sat;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const [r, g, b] = (
    hp < 1 ? [c, x, 0] :
    hp < 2 ? [x, c, 0] :
    hp < 3 ? [0, c, x] :
    hp < 4 ? [0, x, c] :
    hp < 5 ? [x, 0, c] :
             [c, 0, x]
  );
  const m = lum - c / 2;
  return [r + m, g + m, b + m].map(v => Math.round(v * 255));
};

// WCAG relative luminance.
export const relativeLuminance = ([r, g, b]) => {
  const [rl, gl, bl] = [r, g, b].map(v => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
};

export const contrastRatio = (a, b) => {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const css = ([r, g, b]) => `rgb(${r} ${g} ${b})`;

export const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

// The band's background, the text colour that reads best on it, and a hex
// label for the colour itself.
export const swatch = hue => {
  const rgb = hslToRgb(hue, SATURATION, LIGHTNESS);
  const text = contrastRatio(rgb, PAPER) >= contrastRatio(rgb, INK) ? PAPER : INK;
  return { background: css(rgb), text: css(text), hex: toHex(rgb) };
};
