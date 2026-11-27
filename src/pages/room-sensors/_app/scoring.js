/**
 * Scoring a scene `{ room, furniture, door, seats }` for the sensors watching it. Angles are radians from +x towards +y.
 *
 * A scene is sampled once into points of five kinds, each carrying what blocks the view of it.
 * A sensor's view of them is a flag per sample, so several sensors' views combine by OR-ing flags.
 */
import { perimeterPoint, doorGeometry, pointInPolygon, segmentsCross, wallSegments, inRect, rectEdges } from './geometry.js';

export const SAMPLE_STEP = 0.25;
export const DOOR_AREA_RADIUS = 1.5;

/** How much each part inside the room counts towards the total, against the others present. */
export const WEIGHTS = Object.freeze({ room: 0.3, people: 0.25, front: 0.2, door: 0.15 });
/** What seeing all of outside the door takes off the total. */
export const OUTSIDE_PENALTY = 0.3;

const KINDS = ['room', 'people', 'front', 'door', 'outside'];

const roomCells = (room, furniture) => {
  const xs = room.map((p) => p.x);
  const ys = room.map((p) => p.y);
  const [x0, y0] = [Math.min(...xs), Math.min(...ys)];
  const nx = Math.ceil((Math.max(...xs) - x0) / SAMPLE_STEP);
  const ny = Math.ceil((Math.max(...ys) - y0) / SAMPLE_STEP);
  const cells = [];
  for (let i = 0; i < nx; i++)
    for (let j = 0; j < ny; j++) {
      const p = { x: x0 + (i + 0.5) * SAMPLE_STEP, y: y0 + (j + 0.5) * SAMPLE_STEP };
      if (pointInPolygon(p, room) && !furniture.some((f) => inRect(p, f))) cells.push(p);
    }
  return cells;
};

const outsideCells = (room, door) => {
  const { point: centre, normal } = perimeterPoint(room, door);
  const along = { x: normal.y, y: -normal.x };
  const n = Math.ceil(DOOR_AREA_RADIUS / SAMPLE_STEP);
  const cells = [];
  for (let i = -n; i < n; i++)
    for (let j = 0; j < n; j++) {
      const [a, b] = [(i + 0.5) * SAMPLE_STEP, (j + 0.5) * SAMPLE_STEP];
      if (Math.hypot(a, b) > DOOR_AREA_RADIUS) continue;
      const p = { x: centre.x + along.x * a - normal.x * b, y: centre.y + along.y * a - normal.y * b };
      if (!pointInPolygon(p, room)) cells.push(p);
    }
  return cells;
};

/**
 * The scene's samples, each `{ kind, point, blockers }`, front samples with the unit vector `faces` too.
 * The room, its people and their fronts are seen with the door shut; the door area and outside with it open.
 * Nothing is hidden by the furniture it is in, so a seat on a tall sofa is seen.
 */
export const sampleScene = ({ room, furniture, door, seats }) => {
  const tall = furniture.filter((f) => f.tall);
  const blockersFrom = (walls) => (point) => [...walls, ...tall.filter((f) => !inRect(point, f)).flatMap(rectEdges)];
  const shut = blockersFrom(wallSegments(room, null));
  const open = door && blockersFrom([...wallSegments(room, door), doorGeometry(room, door).leaf.open]);

  const sample = (kind, blockers) => (point) => ({ kind, point, blockers: blockers(point) });
  const cells = roomCells(room, furniture);
  const doorCentre = door && perimeterPoint(room, door).point;
  const nearDoor = (p) => Math.hypot(p.x - doorCentre.x, p.y - doorCentre.y) <= DOOR_AREA_RADIUS;

  return [
    ...cells.map(sample('room', shut)),
    ...seats.map(({ x, y }) => sample('people', shut)({ x, y })),
    ...seats.map(({ x, y, facing }) => ({
      ...sample('front', shut)({ x, y }),
      faces: { x: Math.cos(facing), y: Math.sin(facing) },
    })),
    ...(door ? cells.filter(nearDoor).map(sample('door', open)) : []),
    ...(door ? outsideCells(room, door).map(sample('outside', open)) : []),
  ];
};

/**
 * One flag per sample: 1 where `sensor` `{ edge, t, facing, fovDegrees, range }` sees it.
 * A sensor on a wall sees nothing behind that wall, whichever way it faces.
 */
export const seenBy = (room, samples, { edge, t, facing, fovDegrees, range }) => {
  const { point: at, normal } = perimeterPoint(room, { edge, t });
  const aim = { x: Math.cos(facing), y: Math.sin(facing) };
  const minCos = Math.cos((fovDegrees * Math.PI) / 360);
  return Uint8Array.from(samples, ({ kind, point, blockers, faces }) => {
    const d = { x: point.x - at.x, y: point.y - at.y };
    const length = Math.hypot(d.x, d.y);
    const sees =
      length <= range &&
      d.x * normal.x + d.y * normal.y > 0 &&
      (d.x * aim.x + d.y * aim.y) / length >= minCos &&
      (kind !== 'front' || d.x * faces.x + d.y * faces.y < 0) &&
      !blockers.some(([a, b]) => segmentsCross(at, point, a, b));
    return sees ? 1 : 0;
  });
};

/** The flags of two views together: seen by either. */
export const union = (a, b) => a.map((v, i) => v | b[i]);

/**
 * The fraction seen of each kind — null where there is none — and the total: the weighted mean of the parts
 * inside the room that are present, less the outside penalty for the fraction of outside seen.
 */
export const score = (samples, flags) => {
  const counts = Object.fromEntries(KINDS.map((k) => [k, 0]));
  const seen = { ...counts };
  samples.forEach(({ kind }, i) => {
    counts[kind] += 1;
    seen[kind] += flags[i];
  });
  const parts = Object.fromEntries(KINDS.map((k) => [k, counts[k] ? seen[k] / counts[k] : null]));
  const inside = Object.keys(WEIGHTS).filter((k) => parts[k] !== null);
  const weight = inside.reduce((s, k) => s + WEIGHTS[k], 0);
  const gain = weight ? inside.reduce((s, k) => s + WEIGHTS[k] * parts[k], 0) / weight : 0;
  return { parts, total: gain - OUTSIDE_PENALTY * (parts.outside ?? 0) };
};
