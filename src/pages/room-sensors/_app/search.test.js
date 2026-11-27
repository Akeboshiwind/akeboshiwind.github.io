import { describe, test, expect } from 'vitest';
import { FP300, parseRoom, perimeterPoint } from './geometry.js';
import { sampleScene, seenBy, union, score } from './scoring.js';
import { candidates, bestSingle, bestPair, FACINGS } from './search.js';

const pt = (x, y) => ({ x, y });
const square = [pt(0, 0), pt(4, 0), pt(4, 4), pt(0, 4)];
const lShape = [pt(0, 0), pt(4, 0), pt(4, 2), pt(2, 2), pt(2, 4), pt(0, 4)];
const hall = parseRoom([pt(0, 0), pt(2, 0), pt(2, 14), pt(0, 14)]);
const empty = { room: square, furniture: [], door: null, seats: [] };
const DOWN = Math.PI / 2;

const rescore = (scene, sensors) => {
  const samples = sampleScene(scene);
  return score(samples, sensors.map((s) => seenBy(scene.room, samples, s)).reduce(union));
};

describe('candidates', () => {
  test('tries each 25 cm of wall at every facing', () => {
    expect(candidates(square, FP300)).toHaveLength(4 * 16 * FACINGS.length);
  });

  test('a wall shorter than a slot still gets one', () => {
    const nook = [pt(0, 0), pt(4, 0), pt(4, 0.1), pt(0, 0.1)];
    expect(candidates(nook, FP300).filter((c) => c.edge === 1)).toHaveLength(FACINGS.length);
  });

  test('each sits inside its wall, faces into the room within 60°, and carries the spec', () => {
    candidates(lShape, FP300).forEach((c) => {
      expect(c.t).toBeGreaterThan(0);
      expect(c.t).toBeLessThan(1);
      const { normal } = perimeterPoint(lShape, c);
      expect(Math.cos(c.facing) * normal.x + Math.sin(c.facing) * normal.y).toBeGreaterThanOrEqual(Math.cos(Math.PI / 3) - 1e-9);
      expect(c).toMatchObject(FP300);
    });
  });
});

describe('bestSingle', () => {
  test('scores the sensor it returns as scoring would', () => {
    const scene = { ...empty, room: lShape };
    const { sensors, score: s } = bestSingle(scene, FP300);
    expect(sensors).toHaveLength(1);
    expect(s).toEqual(rescore(scene, sensors));
  });

  test('is no worse than any candidate', () => {
    const scene = { ...empty, room: lShape };
    const { score: s } = bestSingle(scene, FP300);
    candidates(lShape, FP300).forEach((c) => expect(rescore(scene, [c]).total).toBeLessThanOrEqual(s.total));
  });

  test('goes where it sees the front of a person, at the far end of a hall', () => {
    const scene = { ...empty, room: hall, seats: [{ x: 1, y: 12, facing: DOWN }] };
    expect(bestSingle(scene, FP300).score.parts.front).toBe(1);
  });

  test('takes the spec it is given', () => {
    const narrow = { fovDegrees: 60, range: 3 };
    expect(bestSingle(empty, narrow).sensors[0]).toMatchObject(narrow);
  });
});

describe('bestPair', () => {
  test('scores the pair it returns as scoring would', () => {
    const scene = { ...empty, room: lShape };
    const { sensors, score: s } = bestPair(scene, FP300);
    expect(sensors).toHaveLength(2);
    expect(s).toEqual(rescore(scene, sensors));
  });

  test('covers a hall longer than one sensor can reach', () => {
    const scene = { ...empty, room: hall };
    const single = bestSingle(scene, FP300).score;
    const pair = bestPair(scene, FP300).score;
    expect(single.parts.room).toBeLessThan(0.8);
    expect(pair.parts.room).toBeGreaterThan(single.parts.room);
    expect(pair.total).toBeGreaterThan(single.total);
  });
});
