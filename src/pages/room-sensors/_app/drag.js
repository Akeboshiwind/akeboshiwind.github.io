/**
 * Dragging what is placed on the plan. A grab is `{ selection, part, corner?, from }`: the item taken hold of,
 * which of its handles (or its 'body'), and where the pointer was when it took hold.
 */
import { rectEdges } from './geometry.js';
import { GRID, rectBetween, snap } from './grid.js';
import { handlesOf, pick } from './select.js';

const near = (a, b, reach) => Math.hypot(a.x - b.x, a.y - b.y) <= reach;
const plus = (p, by) => ({ x: p.x + by.x, y: p.y + by.y });
const sameRect = (a, b) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h;

/** What a press at `p` takes hold of, or null: a handle of `selection` within `reach` metres, else what `pick` selects, by its body. */
export const grab = (plan, selection, p, reach) => {
  const handle = handlesOf(plan, selection).find(({ at }) => near(at, p, reach));
  if (handle) {
    const { at, ...part } = handle;
    return { selection, ...part, from: p };
  }
  const picked = pick(plan, p, reach);
  return picked && { selection: picked, part: 'body', from: p };
};

function dragFurniture(plan, { selection: { index }, part, corner, from }, by) {
  const furniture = plan.furniture[index];
  const corners = rectEdges(furniture).map(([at]) => at);
  const rect =
    part === 'body'
      ? { ...snap(plus(furniture, by)), w: furniture.w, h: furniture.h }
      : rectBetween(corners[(corner + 2) % 4], snap(plus(corners[corner], by)));
  return rect.w >= GRID && rect.h >= GRID && !sameRect(rect, furniture) ? { type: 'rect', index, rect } : null;
}

function dragSeat(plan, { selection: { index }, part }, by, p) {
  const seat = plan.seats[index];
  const moved =
    part === 'body'
      ? { ...snap(plus(seat, by)), facing: seat.facing }
      : { x: seat.x, y: seat.y, facing: Math.atan2(p.y - seat.y, p.x - seat.x) };
  return moved.x === seat.x && moved.y === seat.y && moved.facing === seat.facing ? null : { type: 'set seat', index, seat: moved };
}

/** The one edit that dragging `grab`, taken of `plan`, to `p` makes; null where it changes nothing. */
export const dragTo = (plan, grab, p) => {
  const by = { x: p.x - grab.from.x, y: p.y - grab.from.y };
  switch (grab.selection.kind) {
    case 'furniture':
      return dragFurniture(plan, grab, by);
    case 'seat':
      return dragSeat(plan, grab, by, p);
  }
  return null;
};
