export const GRAPH_DAYS = 30;
export const PAGE_DAYS = 15;
export const GRAPH_PADDING = { top: 20, right: 10, bottom: 40, left: 35 };

const DAY_MS = 1000 * 60 * 60 * 24;

/**
 * The 30 days shown, ending at local midnight tomorrow when `offset` is 0 and `offset` days earlier
 * otherwise. `endOfEnd` closes the last day so its results are included.
 */
export function graphWindow(now, offset) {
  const end = new Date(now);
  end.setDate(end.getDate() + 1 - offset);
  end.setHours(0, 0, 0, 0);
  const start = new Date(end);
  start.setDate(start.getDate() - (GRAPH_DAYS - 1));
  const endOfEnd = new Date(end);
  endOfEnd.setHours(23, 59, 59, 999);
  return { start, end, endOfEnd };
}

export function inWindow(entry, { start, endOfEnd }) {
  const d = new Date(entry.timestamp);
  return d >= start && d <= endOfEnd;
}

export function yMax(entries) {
  return Math.max(1, entries.length > 0 ? Math.max(...entries.map((e) => e.score)) : 0);
}

export function formatRange({ start, end }) {
  const format = (d) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  return `${format(start)} – ${format(end)}`;
}

export const plotArea = (w, h) => ({
  w: w - GRAPH_PADDING.left - GRAPH_PADDING.right,
  h: h - GRAPH_PADDING.top - GRAPH_PADDING.bottom,
});

export const xOf = (timestamp, { start }, area) =>
  GRAPH_PADDING.left + ((new Date(timestamp) - start) / DAY_MS / (GRAPH_DAYS - 1)) * area.w;

export const yOf = (score, top, area) => GRAPH_PADDING.top + area.h - (score / top) * area.h;

/** The index in `entries` of the first point in view within `radius` of the click, or -1. */
export function hitTest(entries, win, w, h, clickX, clickY, radius = 15) {
  const area = plotArea(w, h);
  const top = yMax(entries.filter((e) => inWindow(e, win)));
  return entries.findIndex((e) => inWindow(e, win)
    && Math.hypot(clickX - xOf(e.timestamp, win, area), clickY - yOf(e.score, top, area)) < radius);
}
