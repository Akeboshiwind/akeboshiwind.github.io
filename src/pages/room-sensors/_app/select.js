/**
 * Selecting what is placed on the plan. A selection names one item: `{ kind: 'room' }`, `{ kind: 'door' }`,
 * or `{ kind: 'furniture' | 'seat' | 'sensor', index }`, the index into the plan's list of that kind.
 */
import { distanceToSegment, doorGeometry, inRect, perimeterPoint, rectEdges, wallSegments } from './geometry.js';

// How far ahead of a seat or sensor, in metres, the handle that turns it sits.
const FACING_AT = 0.6;

const LISTS = new Map([['furniture', 'furniture'], ['seat', 'seats'], ['sensor', 'sensors']]);

/** `selection` while it still names an item of `plan`, else null. */
export const current = (plan, selection) => {
  if (!selection) return null;
  const { kind, index } = selection;
  const there = kind === 'room' ? plan.room : kind === 'door' ? plan.door : plan[LISTS.get(kind)]?.[index];
  return there ? selection : null;
};

const near = (a, b, reach) => Math.hypot(a.x - b.x, a.y - b.y) <= reach;
const nearAny = (segments, p, reach) => segments.some((segment) => distanceToSegment(p, segment) <= reach);
const grown = ({ x, y, w, h }, by) => ({ x: x - by, y: y - by, w: w + 2 * by, h: h + 2 * by });
const ahead = (p, facing) => ({ x: p.x + Math.cos(facing) * FACING_AT, y: p.y + Math.sin(facing) * FACING_AT });
const sensorAt = (plan, sensor) => perimeterPoint(plan.room, sensor).point;

/**
 * What a click at `p` selects, or null: whatever is drawn on top within `reach` metres of it.
 * Of a kind, the last placed is drawn on top; sensors are drawn over seats, seats over the door, the door over the room's walls, and the walls over furniture.
 */
export const pick = (plan, p, reach) => {
  const { room, door } = plan;
  const listed = (kind, hit) => {
    const index = plan[LISTS.get(kind)].findLastIndex(hit);
    return index < 0 ? null : { kind, index };
  };
  if (room) {
    const sensor = listed('sensor', (s) => near(sensorAt(plan, s), p, reach));
    if (sensor) return sensor;
  }
  const seat = listed('seat', (s) => near(s, p, reach));
  if (seat) return seat;
  if (room && door) {
    const { gap, leaf } = doorGeometry(room, door);
    if (nearAny([gap, leaf.open], p, reach)) return { kind: 'door' };
  }
  if (room && nearAny(wallSegments(room, null), p, reach)) return { kind: 'room' };
  return listed('furniture', (f) => inRect(p, grown(f, reach)));
};

/**
 * The handles drawn on a selection that `current` keeps: `{ part, at }`, where `part` is 'corner' (with which `corner`),
 * 'body' or 'facing'. A room's corners are its points; furniture's run clockwise from its top left.
 */
export const handlesOf = (plan, selection) => {
  if (!selection) return [];
  const { kind, index } = selection;
  const turnable = (at, facing) => [{ part: 'body', at }, { part: 'facing', at: ahead(at, facing) }];
  switch (kind) {
    case 'room':
      return plan.room.map((at, corner) => ({ part: 'corner', corner, at }));
    case 'furniture':
      return rectEdges(plan.furniture[index]).map(([at], corner) => ({ part: 'corner', corner, at }));
    case 'door':
      return [{ part: 'body', at: perimeterPoint(plan.room, plan.door).point }];
    case 'seat': {
      const { x, y, facing } = plan.seats[index];
      return turnable({ x, y }, facing);
    }
    case 'sensor':
      return turnable(sensorAt(plan, plan.sensors[index]), plan.sensors[index].facing);
  }
};
