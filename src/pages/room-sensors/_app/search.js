/**
 * Searching the walls of a scene for where to put one or two sensors of a given spec `{ fovDegrees, range }`.
 * Sensors are as `seenBy` takes them: `{ edge, t, facing, fovDegrees, range }`.
 */
import { perimeterPoint } from './geometry.js';
import { sampleScene, seenBy, union, score } from './scoring.js';

export const POSITION_STEP = 0.25;
export const FACINGS = [-60, -40, -20, 0, 20, 40, 60].map((degrees) => (degrees * Math.PI) / 180);
export const PAIR_POOL = 60;

const wallLength = (room, edge) => {
  const [a, b] = [room[edge], room[(edge + 1) % room.length]];
  return Math.hypot(b.x - a.x, b.y - a.y);
};

/** Every sensor the search tries: one per 25 cm of wall, at the slot's centre, at each of FACINGS from the wall's normal. */
export const candidates = (room, spec) =>
  room.flatMap((_, edge) => {
    const slots = Math.max(1, Math.round(wallLength(room, edge) / POSITION_STEP));
    const { normal } = perimeterPoint(room, { edge, t: 0 });
    const square = Math.atan2(normal.y, normal.x);
    return Array.from({ length: slots }, (_, i) => (i + 0.5) / slots).flatMap((t) =>
      FACINGS.map((turn) => ({ ...spec, edge, t, facing: square + turn })),
    );
  });

const viewsOf = (scene, spec) => {
  const samples = sampleScene(scene);
  const views = candidates(scene.room, spec).map((sensor) => {
    const flags = seenBy(scene.room, samples, sensor);
    return { sensors: [sensor], flags, score: score(samples, flags) };
  });
  return { samples, views };
};

const best = (views) => views.reduce((a, b) => (b.score.total > a.score.total ? b : a));

/** The best single sensor, `{ sensors: [sensor], score }`, from every candidate. */
export const bestSingle = (scene, spec) => {
  const { sensors, score } = best(viewsOf(scene, spec).views);
  return { sensors, score };
};

/**
 * The best pair of sensors, `{ sensors: [a, b], score }`, from the PAIR_POOL best single sensors.
 * A sensor that scores poorly alone but fills another's gaps can be missed.
 */
export const bestPair = (scene, spec) => {
  const { samples, views } = viewsOf(scene, spec);
  const pool = [...views].sort((a, b) => b.score.total - a.score.total).slice(0, PAIR_POOL);
  const pairs = pool.flatMap((a, i) =>
    pool.slice(i + 1).map((b) => {
      const flags = union(a.flags, b.flags);
      return { sensors: [...a.sensors, ...b.sensors], score: score(samples, flags) };
    }),
  );
  return best(pairs);
};
