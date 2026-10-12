import { outline, fadeLit, disc, lineCells } from './pixel.js';

export const config = {
  padding: 60,
  gridDivisions: 10,
  handleWidth: 8,
  pointRadius: 8,
  // CSS pixels per drawn pixel
  cell: 2,
  // Cells over which an edge that runs to infinity fades out
  fade: 16,
  font: "11px 'Departure Mono', ui-monospace, monospace",
};

function themeColors() {
  const style = getComputedStyle(document.documentElement);
  const cssVar = (name) => style.getPropertyValue(name).trim();
  return {
    bg: cssVar('--bg'),
    text: cssVar('--text'),
    heading: cssVar('--heading'),
    border: cssVar('--border'),
    accent: cssVar('--accent'),
  };
}

const toCell = (px) => Math.round(px / config.cell);

function fillCell(ctx, col, row) {
  const { cell } = config;
  ctx.fillRect(col * cell, row * cell, cell, cell);
}

/** Fill the cells from `(col1, row1)` up to but excluding `(col2, row2)`. */
function fillCells(ctx, col1, row1, col2, row2) {
  const { cell } = config;
  ctx.fillRect(col1 * cell, row1 * cell, (col2 - col1) * cell, (row2 - row1) * cell);
}

const range = (from, to, step = 1) => {
  const out = [];
  for (let i = from; step > 0 ? i < to : i > to; i += step) out.push(i);
  return out;
};

function plotArea(width, height, padding) {
  return {
    left: toCell(padding),
    right: toCell(width - padding),
    top: toCell(padding),
    bottom: toCell(height - padding),
  };
}

export const rgbToCss = ([r, g, b]) => `rgb(${r},${g},${b})`;

function drawGrid(ctx, width, height, padding, divisions, color) {
  const { left, right, top, bottom } = plotArea(width, height, padding);
  const stepX = (width - 2 * padding) / divisions;
  const stepY = (height - 2 * padding) / divisions;
  ctx.fillStyle = color;
  for (let i = 0; i <= divisions; i++) {
    const col = toCell(padding + i * stepX);
    const row = toCell(height - padding - i * stepY);
    for (const r of range(top, bottom, 2)) fillCell(ctx, col, r);
    for (const c of range(left, right, 2)) fillCell(ctx, c, row);
  }
}

function drawAxes(ctx, width, height, padding, colors) {
  const { left, right, top, bottom } = plotArea(width, height, padding);
  ctx.fillStyle = colors.heading;
  fillCells(ctx, left, bottom, right + 1, bottom + 1);
  fillCells(ctx, left, top, left + 1, bottom + 1);
  for (let k = 0; k < 4; k++) {
    fillCells(ctx, right - k, bottom - k, right + 1 - k, bottom + k + 1);
    fillCells(ctx, left - k, top + k, left + k + 1, top + k + 1);
  }
}

function drawAxisLabels(ctx, width, height, padding, colors) {
  ctx.fillStyle = colors.text;
  ctx.font = config.font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('VALID TIME', width / 2, height - padding + 32);
  ctx.save();
  ctx.translate(padding - 40, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'bottom';
  ctx.fillText('SYSTEM TIME', 0, 0);
  ctx.restore();
}

function drawTicks(ctx, width, height, padding, divisions, colors) {
  const { left, bottom } = plotArea(width, height, padding);
  const { cell } = config;
  const stepX = (width - 2 * padding) / divisions;
  const stepY = (height - 2 * padding) / divisions;
  const tickCells = 3;
  ctx.font = config.font;
  for (let i = 0; i <= divisions; i++) {
    const col = toCell(padding + i * stepX);
    const row = toCell(height - padding - i * stepY);
    ctx.fillStyle = colors.heading;
    fillCells(ctx, col, bottom, col + 1, bottom + tickCells + 1);
    fillCells(ctx, left - tickCells, row, left, row + 1);
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(`t${i}`, col * cell, (bottom + tickCells + 2) * cell);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(`t${i}`, (left - tickCells - 1) * cell, row * cell);
  }
}

function eventCells(event, width, height, padding) {
  const drawWidth = width - 2 * padding;
  const drawHeight = height - 2 * padding;
  return {
    left: toCell(padding + event._valid_from * drawWidth),
    right: toCell(padding + (event._valid_to ?? 1) * drawWidth),
    top: toCell(padding),
    bottom: toCell(height - padding - event._system_from * drawHeight),
  };
}

function drawEvent(ctx, event, width, height, padding, selected, colors) {
  const { left, right, top, bottom } = eventCells(event, width, height, padding);
  if (!(left < right && top < bottom)) return;
  const open = event._valid_to == null;
  const { fade } = config;
  const edgeWidth = selected ? 2 : 1;
  const fill = rgbToCss(event.color);
  const edge = selected ? colors.heading : rgbToCss(outline(event.color));
  const handleCells = toCell(config.handleWidth);
  const isEdge = (c, r) =>
    c < left + edgeWidth || r >= bottom - edgeWidth || (!open && c >= right - edgeWidth);
  // The top runs to system time ∞, and an open event's right edge to valid time ∞.
  const depth = (c, r) => Math.min(r - top, open ? right - 1 - c : fade);

  const fading = [];
  for (const r of range(top, Math.min(bottom, top + fade)))
    for (const c of range(left, right)) if (depth(c, r) < fade) fading.push([c, r]);
  if (open)
    for (const r of range(top + fade, bottom))
      for (const c of range(Math.max(left, right - fade), right)) fading.push([c, r]);

  ctx.fillStyle = fill;
  fillCells(ctx, left, top, right, bottom);
  if (!open) {
    ctx.fillStyle = edge;
    for (const r of range(top, bottom))
      for (const c of range(right - handleCells, right)) if ((c + r) % 2 === 0) fillCell(ctx, c, r);
  }
  ctx.fillStyle = edge;
  fillCells(ctx, left, top, left + edgeWidth, bottom);
  fillCells(ctx, left, bottom - edgeWidth, right, bottom);
  if (!open) fillCells(ctx, right - edgeWidth, top, right, bottom);

  ctx.fillStyle = colors.bg;
  for (const [c, r] of fading) fillCell(ctx, c, r);
  const lit = fading.filter(([c, r]) => fadeLit(c, r, depth(c, r), fade));
  ctx.fillStyle = fill;
  for (const [c, r] of lit) if (!isEdge(c, r)) fillCell(ctx, c, r);
  ctx.fillStyle = edge;
  for (const [c, r] of lit) if (isEdge(c, r)) fillCell(ctx, c, r);
}

/** Event indices in draw order: earliest system time first, so later ones sit on top. */
export function drawOrder(events) {
  return events.map((_, i) => i).sort((a, b) => events[a]._system_from - events[b]._system_from);
}

function drawPoint(ctx, point, width, height, padding, selected, colors) {
  const drawWidth = width - 2 * padding;
  const drawHeight = height - 2 * padding;
  const col = toCell(padding + point.x * drawWidth);
  const row = toCell(height - padding - point.y * drawHeight);
  const radius = config.pointRadius / config.cell;
  const fillDisc = (r, style) => {
    ctx.fillStyle = style;
    for (const [dx, dy] of disc(r)) fillCell(ctx, col + dx, row + dy);
  };
  if (selected) fillDisc(radius + 1, colors.heading);
  fillDisc(radius, selected ? colors.heading : rgbToCss(outline(point.color)));
  fillDisc(radius - 1, rgbToCss(point.color));
}

/** Cell bounds of a box given as two corners in 0..1 coordinates. */
function normalizedBox({ x1, y1, x2, y2 }, width, height, padding) {
  const drawWidth = width - 2 * padding;
  const drawHeight = height - 2 * padding;
  return {
    left: toCell(padding + Math.min(x1, x2) * drawWidth),
    right: toCell(padding + Math.max(x1, x2) * drawWidth),
    top: toCell(height - padding - Math.max(y1, y2) * drawHeight),
    bottom: toCell(height - padding - Math.min(y1, y2) * drawHeight),
  };
}

function drawDashedOutline(ctx, { left, right, top, bottom }, on, off) {
  const perimeter = [
    ...range(left, right).map((c) => [c, top]),
    ...range(top, bottom).map((r) => [right - 1, r]),
    ...range(right - 1, left - 1, -1).map((c) => [c, bottom - 1]),
    ...range(bottom - 1, top - 1, -1).map((r) => [left, r]),
  ];
  perimeter.forEach(([c, r], i) => {
    if (i % (on + off) < on) fillCell(ctx, c, r);
  });
}

function drawSelectionBox(ctx, width, height, padding, { start, end }, colors) {
  const box = normalizedBox({ x1: start.x, y1: start.y, x2: end.x, y2: end.y }, width, height, padding);
  ctx.fillStyle = colors.accent;
  for (const r of range(box.top, box.bottom))
    for (const c of range(box.left, box.right)) if (c % 2 === 0 && r % 2 === 0) fillCell(ctx, c, r);
  drawDashedOutline(ctx, box, 2, 2);
}

function drawVtEqStLine(ctx, width, height, padding, colors) {
  const { left, right, top, bottom } = plotArea(width, height, padding);
  ctx.fillStyle = colors.heading;
  lineCells(left, bottom, right, top).forEach(([c, r], i) => {
    if (i % 6 < 3) fillCell(ctx, c, r);
  });
}

function drawZoomRect(ctx, rect, width, height, padding, colors) {
  ctx.fillStyle = colors.accent;
  drawDashedOutline(ctx, normalizedBox(rect, width, height, padding), 3, 2);
}

/**
 * Draw the plot onto `canvas` at its current size.
 *
 * @param {HTMLCanvasElement} canvas
 * @param {Array<{_valid_from: number, _valid_to: number | null, _system_from: number, color: number[]}>} events
 *   in 0..1 coordinates; a null `_valid_to` is open to valid time ∞
 * @param {object} opts
 * @param {boolean} [opts.showGrid]
 * @param {boolean} [opts.showTicks]
 * @param {boolean} [opts.showVtEqSt]
 * @param {{start: {x, y}, end: {x, y}} | null} [opts.selectionBox]
 * @param {{x1, y1, x2, y2} | null} [opts.zoomRect] drawn when there is no `zoomRectDraft`
 * @param {{x1, y1, x2, y2} | null} [opts.zoomRectDraft]
 * @param {Set<number>} [opts.selected] event indices
 * @param {Array<{x: number, y: number, color: number[]}>} [opts.points]
 * @param {Set<number>} [opts.selectedPoints]
 */
export function renderCanvas(canvas, events, opts) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const { padding, gridDivisions } = config;
  const colors = themeColors();
  const selected = opts.selected ?? new Set();
  const points = opts.points ?? [];
  const selectedPoints = opts.selectedPoints ?? new Set();
  const zoomRect = opts.zoomRectDraft ?? opts.zoomRect;

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  drawGrid(ctx, width, height, padding, gridDivisions, colors.border);
  drawAxes(ctx, width, height, padding, colors);
  drawAxisLabels(ctx, width, height, padding, colors);
  if (opts.showTicks) drawTicks(ctx, width, height, padding, gridDivisions, colors);
  for (const i of drawOrder(events)) drawEvent(ctx, events[i], width, height, padding, selected.has(i), colors);
  points.forEach((point, i) => drawPoint(ctx, point, width, height, padding, selectedPoints.has(i), colors));
  if (opts.showGrid) drawGrid(ctx, width, height, padding, gridDivisions, colors.text);
  if (opts.selectionBox) drawSelectionBox(ctx, width, height, padding, opts.selectionBox, colors);
  if (zoomRect) drawZoomRect(ctx, zoomRect, width, height, padding, colors);
  if (opts.showVtEqSt) drawVtEqStLine(ctx, width, height, padding, colors);
}
