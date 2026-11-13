export const insertAt = (items, index, item) => [...items.slice(0, index), item, ...items.slice(index)];

export const move = (items, id, index) =>
  insertAt(items.filter(i => i.id !== id), index, items.find(i => i.id === id));

/** The states a to-do can be dropped into: the list with it at each index. */
export const reorders = (items, id) => items.map((_, j) => ({ items: move(items, id, j) }));

/** The states a new to-do can be dropped into: the list with it inserted at each index. */
export const insertions = (items, item) =>
  Array.from({ length: items.length + 1 }, (_, j) => ({ items: insertAt(items, j, item) }));

export const EDGE = 64;
export const MAX_SPEED = 18;

/** Pixels per frame to scroll when the pointer is at `y` in a view; negative scrolls up. */
export function edgeSpeed(y, { top, bottom }, edge = EDGE, max = MAX_SPEED) {
  const depth = d => Math.min(1, Math.max(0, (edge - d) / edge));
  return Math.round(max * (depth(bottom - y) - depth(y - top)));
}
