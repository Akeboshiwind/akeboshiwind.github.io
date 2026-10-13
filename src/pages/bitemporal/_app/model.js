import { config, drawOrder } from './canvas.js';

/** Minimum width of a closed event, in normalised valid time. */
const MIN_DURATION = 0.05;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/** A room code typed or linked by a user, as 4–6 upper-case characters, or null if too short. */
export function normalizeRoomCode(raw) {
  const code = (raw ?? '').trim().toUpperCase().slice(0, 6);
  return code.length >= 4 ? code : null;
}

const ROOM_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export function generateRoomCode() {
  return Array.from({ length: 6 }, () => ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)]).join('');
}

export function snapToGrid(v) {
  const step = 1 / config.gridDivisions;
  return step * Math.round(v / step);
}

const maybeSnap = (v, snap) => (snap ? snapToGrid(v) : v);

/** The topmost event containing `(x, y)`, and whether `x` is on its resize handle; null if none. */
export function hitTest(events, x, y, drawWidth) {
  const handleWidth = config.handleWidth / drawWidth;
  for (const index of drawOrder(events).reverse()) {
    const { _valid_from, _valid_to, _system_from } = events[index];
    const open = _valid_to == null;
    const validTo = open ? 1 : _valid_to;
    if (x >= _valid_from && x <= validTo && y >= _system_from)
      return { index, onHandle: !open && x >= validTo - handleWidth };
  }
  return null;
}

/** The topmost point whose disc contains `(x, y)`, or null. */
export function pointHitTest(points, x, y, drawWidth, drawHeight) {
  const rx = config.pointRadius / drawWidth;
  const ry = config.pointRadius / drawHeight;
  for (let index = points.length - 1; index >= 0; index--) {
    const dx = x - points[index].x;
    const dy = y - points[index].y;
    if ((dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1) return { index };
  }
  return null;
}

/**
 * The items a context menu opened on `hit` acts on, as `{events, points}` Sets of indices.
 * `selection` has the same shape, and is returned itself, not a copy, when the hit item is in it; otherwise the hit item alone.
 * `hit` is `{point}` or `{event}`, as from `pointHitTest` and `hitTest`; null when it holds neither.
 */
export function menuTargets({ point, event }, selection) {
  if (point) return selection.points.has(point.index) ? selection : { events: new Set(), points: new Set([point.index]) };
  if (event) return selection.events.has(event.index) ? selection : { events: new Set([event.index]), points: new Set() };
  return null;
}

function bounds(a, b) {
  return { minX: Math.min(a.x, b.x), maxX: Math.max(a.x, b.x), minY: Math.min(a.y, b.y), maxY: Math.max(a.y, b.y) };
}

/** Indices of events overlapping the box with corners `a` and `b`; every event extends to system time ∞. */
export function eventsInSelection(events, a, b) {
  const { minX, maxX, minY, maxY } = bounds(a, b);
  const hits = new Set();
  events.forEach((e, i) => {
    if (e._valid_from < maxX && (e._valid_to ?? 1) > minX && e._system_from <= maxY && minY <= 1) hits.add(i);
  });
  return hits;
}

export function pointsInSelection(points, a, b) {
  const { minX, maxX, minY, maxY } = bounds(a, b);
  const hits = new Set();
  points.forEach((p, i) => {
    if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) hits.add(i);
  });
  return hits;
}

/** `event` moved to start at `(validFrom, systemFrom)`, keeping its width and staying inside the plot. */
export function moveEvent(event, validFrom, systemFrom, snap) {
  const open = event._valid_to == null;
  const width = open ? 0 : event._valid_to - event._valid_from;
  const from = clamp(maybeSnap(validFrom, snap), 0, 1 - width);
  const moved = { ...event, _valid_from: from, _system_from: clamp(maybeSnap(systemFrom, snap), 0, 1) };
  return open ? moved : { ...moved, _valid_to: from + width };
}

export function movePoint(point, x, y, snap) {
  return { ...point, x: maybeSnap(clamp(x, 0, 1), snap), y: maybeSnap(clamp(y, 0, 1), snap) };
}

export function resizeEvent(event, validTo, snap) {
  return { ...event, _valid_to: clamp(maybeSnap(validTo, snap), event._valid_from + MIN_DURATION, 1) };
}

/** Scale factor for a group of events spanning `span` from `anchor`, whose right edge is dragged to `validTo`. */
export function spanScale(validTo, anchor, span, snap) {
  return (clamp(maybeSnap(validTo, snap), anchor + MIN_DURATION, 1) - anchor) / span;
}

/** `original`'s valid-time span scaled by `scale` about `anchor`. */
export function scaleEvent(original, anchor, scale) {
  const from = anchor + (original._valid_from - anchor) * scale;
  const to = anchor + (original._valid_to - anchor) * scale;
  return { ...original, _valid_from: from, _valid_to: Math.min(1, Math.max(from + MIN_DURATION, to)) };
}

/** A new closed event from a drag between two corners, at least `MIN_DURATION` wide. */
export function eventFromDrag(a, b, color) {
  const { minX, maxX, minY } = bounds(a, b);
  const validFrom = Math.max(0, minX);
  return {
    _valid_from: validFrom,
    _valid_to: Math.min(1, validFrom + Math.max(MIN_DURATION, maxX - minX)),
    _system_from: clamp(minY, 0, 1),
    color,
  };
}

/** Whether a drag from `a` to `b` went far enough to count as a drag rather than a click. */
export function isDrag(a, b) {
  return Math.abs(b.x - a.x) > 0.02 || Math.abs(b.y - a.y) > 0.02;
}

export function toggleOpen(event, makeOpen) {
  return { ...event, _valid_to: makeOpen ? null : Math.min(1, event._valid_from + 0.2) };
}

export function removeIndices(items, indices) {
  return items.filter((_, i) => !indices.has(i));
}

export function updateIndices(items, indices, f) {
  return items.map((item, i) => (indices.has(i) ? f(item) : item));
}

/** @param {string} date as `YYYY-MM-DD` */
function parseDate(date) {
  const [year, month, day] = date.split('-').map((s) => parseInt(s, 10));
  return Date.UTC(year, month - 1, day);
}

function dateAt(normalized, startMs, endMs) {
  const date = new Date(startMs + (endMs - startMs) * normalized);
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

/**
 * An XTDB transaction inserting `event` as `docs` row 1, with 0..1 mapped onto `start`..`end`.
 *
 * @param {string} start as `YYYY-MM-DD`
 * @param {string} end as `YYYY-MM-DD`
 */
export function eventToDml(event, start, end) {
  const [startMs, endMs] = [parseDate(start), parseDate(end)];
  const { _valid_from, _valid_to, _system_from, color } = event;
  const validTo = _valid_to == null ? '' : `_valid_to: DATE '${dateAt(_valid_to, startMs, endMs)}', `;
  return (
    `BEGIN READ WRITE WITH (SYSTEM_TIME = DATE '${dateAt(_system_from, startMs, endMs)}');\n` +
    `INSERT INTO docs RECORDS {_id: 1, _valid_from: DATE '${dateAt(_valid_from, startMs, endMs)}', ${validTo}` +
    `color: [${color.join(', ')}]};\n` +
    'COMMIT;'
  );
}

const NON_TEXT_INPUTS = ['checkbox', 'radio', 'button', 'submit', 'reset', 'color', 'range', 'file', 'image'];

/** Whether `element` is a field where Delete and Backspace edit what's typed. */
export function isTextEntry(element) {
  if (element.isContentEditable || element.tagName === 'TEXTAREA') return true;
  return element.tagName === 'INPUT' && !NON_TEXT_INPUTS.includes(element.type);
}

export function generateDml(events, start, end) {
  return events.map((e) => eventToDml(e, start, end)).join('\n\n');
}
