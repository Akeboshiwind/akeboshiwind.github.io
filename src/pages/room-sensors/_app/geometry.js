/**
 * Plan geometry for the room-sensors tool. Lengths are metres, and y grows downward, as on the canvas.
 *
 * A room is what `parseRoom` returns: a polygon of at least three distinct points with positive signed area,
 * so each edge's left-hand normal points into the room.
 * A perimeter placement `{ edge, t }` is a point on the wall from `room[edge]` (t = 0) to the next corner (t = 1).
 */

// https://us.aqara.com/products/presence-multi-sensor-fp300
export const FP300 = Object.freeze({ fovDegrees: 120, range: 6 });

const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y });
const dot = (a, b) => a.x * b.x + a.y * b.y;
const cross = (a, b) => a.x * b.y - a.y * b.x;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const signedArea = (poly) =>
  poly.reduce((s, p, i) => s + cross(p, poly[(i + 1) % poly.length]), 0) / 2;

/** The room drawn by `points`, or null where they enclose no area. Repeated points, such as a closing click on the first, are dropped. */
export const parseRoom = (points) => {
  const distinct = points.filter((p, i) => {
    const next = points[(i + 1) % points.length];
    return p.x !== next.x || p.y !== next.y;
  });
  if (distinct.length < 3) return null;
  const area = signedArea(distinct);
  if (Math.abs(area) < 1e-9) return null;
  return area > 0 ? distinct : [...distinct].reverse();
};

const wall = (room, i) => {
  const a = room[i];
  const b = room[(i + 1) % room.length];
  const length = distance(a, b);
  const u = { x: (b.x - a.x) / length, y: (b.y - a.y) / length };
  return { a, length, u, normal: { x: -u.y, y: u.x } };
};

const along = (w, d) => ({ x: w.a.x + w.u.x * d, y: w.a.y + w.u.y * d });

/** Even-odd test; a point exactly on the boundary may fall either way. */
export const pointInPolygon = (p, poly) => {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
};

/** Whether segments p–q and a–b cross at a point inside both. Touching at an end, and overlapping along a line, are not crossings. */
export const segmentsCross = (p, q, a, b) => {
  const r = sub(q, p);
  const s = sub(b, a);
  const den = cross(r, s);
  if (Math.abs(den) < 1e-12) return false;
  const t = cross(sub(a, p), s) / den;
  const u = cross(sub(a, p), r) / den;
  const e = 1e-6;
  return t > e && t < 1 - e && u > e && u < 1 - e;
};

/** The point at a perimeter placement, and the wall's unit normal there, pointing into the room. */
export const perimeterPoint = (room, { edge, t }) => {
  const w = wall(room, edge);
  return { point: along(w, t * w.length), normal: w.normal };
};

export const snapToPerimeter = (room, p) => {
  let best = null;
  room.forEach((_, edge) => {
    const w = wall(room, edge);
    const d = clamp(dot(sub(p, w.a), w.u), 0, w.length);
    const gap = distance(p, along(w, d));
    if (!best || gap < best.gap) best = { edge, t: d / w.length, gap };
  });
  return { edge: best.edge, t: best.t };
};

/** The placement nearest `{ edge, t }` where a door `width` wide fits within its wall, or null where the wall is shorter than the door. */
export const fitDoor = (room, { edge, t }, width) => {
  const { length } = wall(room, edge);
  if (length < width) return null;
  const margin = width / 2 / length;
  return { edge, t: clamp(t, margin, 1 - margin) };
};

/**
 * A door `{ edge, t, width, hinge, swing }` is centred on its placement. `hinge` is the end of the gap nearer the wall's
 * start ('start') or end ('end'); `swing` is 'in' or 'out' of the room. Each segment of the leaf runs from the hinge.
 */
export const doorGeometry = (room, { edge, t, width, hinge, swing }) => {
  const w = wall(room, edge);
  const centre = t * w.length;
  const start = along(w, centre - width / 2);
  const end = along(w, centre + width / 2);
  const [pivot, latch] = hinge === 'start' ? [start, end] : [end, start];
  const reach = swing === 'in' ? width : -width;
  const tip = { x: pivot.x + w.normal.x * reach, y: pivot.y + w.normal.y * reach };
  return { gap: [start, end], leaf: { closed: [pivot, latch], open: [pivot, tip] } };
};

/** The walls as segments, with a gap where `door` (or null) stands. */
export const wallSegments = (room, door) =>
  room.flatMap((a, edge) => {
    const b = room[(edge + 1) % room.length];
    if (door?.edge !== edge) return [[a, b]];
    const [start, end] = doorGeometry(room, door).gap;
    return [[a, start], [end, b]];
  });

/** Furniture stands as an axis-aligned rectangle `{ x, y, w, h }` from its top-left corner. */
export const inRect = (p, { x, y, w, h }) => p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h;

export const rectEdges = ({ x, y, w, h }) => {
  const corners = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];
  return corners.map((c, i) => [c, corners[(i + 1) % 4]]);
};
