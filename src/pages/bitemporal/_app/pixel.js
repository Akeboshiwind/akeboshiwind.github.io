import { bayer } from '../../../lib/dither.js';

const BAYER_8 = bayer(8);

/** A darker shade of `[r, g, b]` with the same hue, for a shape's edge. */
export const outline = (rgb) => rgb.map((c) => Math.round(c * 0.6));

/**
 * Whether the cell at `(x, y)` is lit in an ordered-dither fade that is empty at its edge and solid
 * `length` cells in.
 *
 * @param {number} x cell column, in canvas cells, so neighbouring shapes share one pattern
 * @param {number} y cell row
 * @param {number} depth cells from the fading edge, 0 being the outermost
 * @param {number} length cells the fade spans
 */
export function fadeLit(x, y, depth, length) {
  const density = (depth + 0.5) / length;
  return density > (BAYER_8[y % 8][x % 8] + 0.5) / 64;
}

/** `[dx, dy]` offsets of the cells within `r` cells of a centre cell. */
export function disc(r) {
  const cells = [];
  const span = Math.floor(r);
  const from = 0 - span;
  for (let dy = from; dy <= span; dy++)
    for (let dx = from; dx <= span; dx++)
      if (dx * dx + dy * dy <= r * r) cells.push([dx, dy]);
  return cells;
}

// Bresenham's line algorithm: https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm
/** `[x, y]` cells of a one-cell-wide line between two integer cells, both ends included. */
export function lineCells(x0, y0, x1, y1) {
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  const cells = [];
  let [x, y, err] = [x0, y0, dx + dy];
  for (;;) {
    cells.push([x, y]);
    if (x === x1 && y === y1) return cells;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}
