const c3 = (n) => +n.toFixed(3);

/** Light and dark `--accent`/`--link` for an OKLCH hue, at the lightness each theme's background needs. */
export const fromHue = (hue, chroma = 0.19) => ({
  light: { accent: `oklch(0.62 ${chroma} ${hue})`, link: `oklch(0.47 ${c3(chroma * 0.85)} ${hue})` },
  dark: { accent: `oklch(0.72 ${c3(chroma * 0.9)} ${hue})`, link: `oklch(0.80 ${c3(chroma * 0.7)} ${hue})` },
});

export const DEFAULT_ACCENT = 'orange';

/** The light theme's page colour, for the places outside CSS that need it: theme-color and the icon set. */
export const PAGE_BACKGROUND = '#f1efe8';

const HUES = [
  ['Red', 25], ['Vermilion', 40], ['Amber', 70], ['Ochre', 90], ['Olive', 120], ['Green', 150],
  ['Teal', 185], ['Cyan', 215], ['Blue', 255], ['Indigo', 280], ['Violet', 305], ['Magenta', 335],
];

export const ACCENTS = [
  {
    id: DEFAULT_ACCENT,
    name: 'Orange',
    light: { accent: '#e5501c', link: '#b23b0e' },
    dark: { accent: '#ff6a33', link: '#ff8c5e' },
  },
  ...HUES.map(([name, hue]) => ({ id: `h${hue}`, name, ...fromHue(hue) })),
];

/**
 * A random accent id other than `current`; an unknown `current` counts as the default.
 *
 * @param {string} current
 * @param {() => number} [random] uniform in [0, 1)
 */
export function nextAccent(current, random = Math.random) {
  const from = ACCENTS.some((a) => a.id === current) ? current : DEFAULT_ACCENT;
  const others = ACCENTS.filter((a) => a.id !== from);
  return others[Math.floor(random() * others.length)].id;
}

const [L, M, R] = [5, 10, 15];

/** Pip corners for die faces 1–6 (face n is `DICE_FACES[n - 1]`); each pip is 4×4 on a 24-unit icon. */
export const DICE_FACES = [
  [[M, M]],
  [[L, L], [R, R]],
  [[L, L], [M, M], [R, R]],
  [[L, L], [R, L], [L, R], [R, R]],
  [[L, L], [R, L], [M, M], [L, R], [R, R]],
  [[L, L], [R, L], [L, M], [R, M], [L, R], [R, R]],
];

export const DEFAULT_FACE = 5;

const isFace = (face) => Number.isInteger(face) && face >= 1 && face <= DICE_FACES.length;

/**
 * A random die face other than `current`, for the re-roll button.
 *
 * @param {number} current
 * @param {() => number} [random] uniform in [0, 1)
 */
export function nextFace(current, random = Math.random) {
  const others = DICE_FACES.map((_, i) => i + 1).filter((f) => f !== current);
  return others[Math.floor(random() * others.length)];
}

/**
 * The remembered accent and dice face from their stored form; each part that is missing or invalid
 * falls back to its default independently.
 *
 * @param {string | null} raw as written by `serialiseChoice`
 * @returns {{ id: string, face: number }}
 */
export function parseChoice(raw) {
  let stored = null;
  try { stored = JSON.parse(raw); } catch {}
  const { id, face } = stored && typeof stored === 'object' ? stored : {};
  return {
    id: ACCENTS.some((a) => a.id === id) ? id : DEFAULT_ACCENT,
    face: isFace(face) ? face : DEFAULT_FACE,
  };
}

/** @param {{ id: string, face: number }} choice */
export const serialiseChoice = ({ id, face }) => JSON.stringify({ id, face });
