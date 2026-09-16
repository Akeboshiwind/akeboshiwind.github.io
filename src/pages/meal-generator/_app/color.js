// Turning a meal's hue into the colours of its band.
//
// Bands are as bright as white text allows: rather than a fixed lightness,
// each hue is solved for the lightness that lands on TARGET_CONTRAST against
// white. A fixed lightness has to be set for the worst hue — yellow, which
// carries far more luminance than blue at the same value — leaving every
// other band needlessly dark. Solving per hue also evens out the palette,
// since equal contrast against white reads as equal brightness.

export const SATURATION = 72;

// A hair above the 4.5:1 AA threshold for body text, so the 8-bit rounding
// on the way to a CSS colour can't drop a band under it.
export const TARGET_CONTRAST = 4.6;

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

// Contrast against white falls as lightness rises, so a binary search on
// lightness converges on the target from either side.
const solveLightness = hue => {
  let lo = 0;
  let hi = 100;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (contrastRatio(hslToRgb(hue, SATURATION, mid), PAPER) > TARGET_CONTRAST) lo = mid;
    else hi = mid;
  }
  return lo;
};

const lightnessCache = new Map();

export const lightnessFor = hue => {
  if (!lightnessCache.has(hue)) lightnessCache.set(hue, solveLightness(hue));
  return lightnessCache.get(hue);
};

const css = ([r, g, b]) => `rgb(${r} ${g} ${b})`;

export const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();

// The band's background, the text that sits on it, and a hex label for the
// colour itself.
export const swatch = hue => {
  const rgb = hslToRgb(hue, SATURATION, lightnessFor(hue));
  return { background: css(rgb), text: css(PAPER), hex: toHex(rgb) };
};
