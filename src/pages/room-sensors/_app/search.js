/**
 * Searching the walls of a scene for where to put one or two sensors of a given spec `{ fovDegrees, range }`.
 * Sensors are as `seenBy` takes them: `{ edge, t, facing, fovDegrees, range }`.
 */
import { perimeterPoint } from './geometry.js';
import { sampleScene, seenBy, union, score, shares } from './scoring.js';

export const POSITION_STEP = 0.25;
export const FACINGS = [-60, -40, -20, 0, 20, 40, 60].map((degrees) => (degrees * Math.PI) / 180);

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
 * Each view's flags as bits, 32 to a word, with the samples of each kind in words of their own,
 * so that the words of two views OR together into their union, and each word carries the share of the total of every sample in it.
 */
const packed = (samples, views) => {
  const share = shares(samples);
  const kinds = [...Map.groupBy(samples.keys(), (i) => samples[i].kind).values()];
  const words = kinds.reduce((n, kind) => n + Math.ceil(kind.length / 32), 0);
  const bits = new Uint32Array(views.length * words);
  const wordShares = new Float64Array(words);
  let start = 0;
  kinds.forEach((kind) => {
    const end = start + Math.ceil(kind.length / 32);
    wordShares.fill(share[kind[0]], start, end);
    views.forEach(({ flags }, v) =>
      kind.forEach((sample, k) => {
        bits[v * words + start + (k >>> 5)] |= flags[sample] << (k & 31);
      }),
    );
    start = end;
  });
  return { words, bits, wordShares };
};

const popcount = (n) => {
  n -= (n >>> 1) & 0x55555555;
  n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
  return Math.imul((n + (n >>> 4)) & 0x0f0f0f0f, 0x01010101) >>> 24;
};

/** The best pair of sensors, `{ sensors: [a, b], score }`, from every pair of candidates. */
export const bestPair = (scene, spec) => {
  const { samples, views } = viewsOf(scene, spec);
  const { words, bits, wordShares } = packed(samples, views);
  let top = { total: -Infinity, pair: null };
  for (let a = 0; a < views.length; a++)
    for (let b = a + 1; b < views.length; b++) {
      let total = 0;
      for (let w = 0; w < words; w++) total += wordShares[w] * popcount(bits[a * words + w] | bits[b * words + w]);
      if (total > top.total) top = { total, pair: [views[a], views[b]] };
    }
  const [a, b] = top.pair;
  return { sensors: [...a.sensors, ...b.sensors], score: score(samples, union(a.flags, b.flags)) };
};
