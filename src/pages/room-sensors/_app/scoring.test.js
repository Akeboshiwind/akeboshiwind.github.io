import { describe, test, expect } from 'vitest';
import { FP300, parseRoom, pointInPolygon } from './geometry.js';
import { sampleScene, seenBy, union, score, WEIGHTS, OUTSIDE_PENALTY } from './scoring.js';

const pt = (x, y) => ({ x, y });
const square = [pt(0, 0), pt(4, 0), pt(4, 4), pt(0, 4)];
const lShape = [pt(0, 0), pt(4, 0), pt(4, 2), pt(2, 2), pt(2, 4), pt(0, 4)];
const empty = { room: square, furniture: [], door: null, seats: [] };
const door = { edge: 0, t: 0.5, width: 1, hinge: 'start', swing: 'in' };

const UP = -Math.PI / 2;
const DOWN = Math.PI / 2;
const RIGHT = 0;

const sensor = (edge, t, facing) => ({ ...FP300, edge, t, facing });
const ofKind = (samples, kind) => samples.filter((s) => s.kind === kind);
const count = (samples, kind) => ofKind(samples, kind).length;
const near = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) < 1e-9;

const sees = (scene, s, kind, p) => {
  const samples = sampleScene(scene);
  const i = samples.findIndex((x) => x.kind === kind && near(x.point, p));
  expect(i).not.toBe(-1);
  return seenBy(scene.room, samples, s)[i] === 1;
};

describe('sampleScene', () => {
  test('samples the room on a 25 cm grid of cell centres', () => {
    const rooms = ofKind(sampleScene(empty), 'room');
    expect(rooms).toHaveLength(16 * 16);
    expect(rooms[0].point).toEqual(pt(0.125, 0.125));
  });

  test('samples only inside the room', () => {
    const rooms = ofKind(sampleScene({ ...empty, room: lShape }), 'room');
    expect(rooms).toHaveLength(12 * 16);
    rooms.forEach((s) => expect(pointInPolygon(s.point, lShape)).toBe(true));
  });

  test('no one stands in furniture, tall or not', () => {
    const furniture = [{ x: 1, y: 1, w: 1, h: 1, tall: false }, { x: 3, y: 3, w: 1, h: 1, tall: true }];
    expect(count(sampleScene({ ...empty, furniture }), 'room')).toBe(16 * 16 - 2 * 16);
  });

  test('each seat is a person, and the front of one', () => {
    const samples = sampleScene({ ...empty, seats: [{ x: 1, y: 1, facing: UP }, { x: 3, y: 3, facing: RIGHT }] });
    expect(ofKind(samples, 'people').map((s) => s.point)).toEqual([pt(1, 1), pt(3, 3)]);
    expect(ofKind(samples, 'front').map((s) => s.point)).toEqual([pt(1, 1), pt(3, 3)]);
  });

  test('without a door, there is no door area and no outside', () => {
    const samples = sampleScene(empty);
    expect(count(samples, 'door')).toBe(0);
    expect(count(samples, 'outside')).toBe(0);
  });

  test('the door area is the room within 1.5 m of the door', () => {
    const samples = sampleScene({ ...empty, door });
    const areas = ofKind(samples, 'door');
    const rooms = ofKind(samples, 'room');
    expect(areas.length).toBeGreaterThan(0);
    areas.forEach((s) => {
      expect(Math.hypot(s.point.x - 2, s.point.y)).toBeLessThanOrEqual(1.5);
      expect(rooms.some((r) => near(r.point, s.point))).toBe(true);
    });
    const within = rooms.filter((r) => Math.hypot(r.point.x - 2, r.point.y) <= 1.5);
    expect(areas).toHaveLength(within.length);
  });

  test('outside is within 1.5 m of the door, on the far side of its wall', () => {
    const outside = ofKind(sampleScene({ ...empty, door }), 'outside');
    expect(outside.length).toBeGreaterThan(0);
    outside.forEach((s) => {
      expect(Math.hypot(s.point.x - 2, s.point.y)).toBeLessThanOrEqual(1.5);
      expect(s.point.y).toBeLessThan(0);
    });
  });

  test('outside a door in an L-shape’s notch is not in the room', () => {
    const notchDoor = { edge: 2, t: 0.5, width: 0.8, hinge: 'start', swing: 'in' };
    const outside = ofKind(sampleScene({ ...empty, room: lShape, door: notchDoor }), 'outside');
    expect(outside.length).toBeGreaterThan(0);
    outside.forEach((s) => expect(pointInPolygon(s.point, lShape)).toBe(false));
  });
});

describe('seenBy', () => {
  const seat = { x: 2, y: 3, facing: UP };
  const seated = { ...empty, seats: [seat] };
  const fromTop = sensor(0, 0.5, DOWN);

  test('sees a seat in its field of view and range', () => {
    expect(sees(seated, fromTop, 'people', seat)).toBe(true);
  });

  test('does not see a seat outside its field of view', () => {
    expect(sees({ ...empty, seats: [{ x: 0.2, y: 0.5, facing: UP }] }, fromTop, 'people', pt(0.2, 0.5))).toBe(false);
  });

  test('does not see a seat beyond its range', () => {
    const hall = { ...empty, room: parseRoom([pt(0, 0), pt(2, 0), pt(2, 10), pt(0, 10)]), seats: [{ x: 1, y: 9, facing: UP }] };
    expect(sees(hall, sensor(0, 0.5, DOWN), 'people', pt(1, 9))).toBe(false);
    expect(sees(hall, { ...sensor(0, 0.5, DOWN), range: 10 }, 'people', pt(1, 9))).toBe(true);
  });

  test('a wall hides what is round the corner', () => {
    const hidden = { ...empty, room: lShape, seats: [{ x: 3.5, y: 1, facing: UP }] };
    expect(sees(hidden, sensor(4, 0.5, UP), 'people', pt(3.5, 1))).toBe(false);
  });

  test('tall furniture hides a seat; short furniture does not', () => {
    const wardrobe = { x: 1.5, y: 1, w: 1, h: 1, tall: true };
    expect(sees({ ...seated, furniture: [wardrobe] }, fromTop, 'people', seat)).toBe(false);
    expect(sees({ ...seated, furniture: [{ ...wardrobe, tall: false }] }, fromTop, 'people', seat)).toBe(true);
  });

  test('a seat on tall furniture is not hidden by it', () => {
    const sofa = { x: 1.5, y: 2.8, w: 1, h: 0.5, tall: true };
    expect(sees({ ...seated, furniture: [sofa] }, fromTop, 'people', seat)).toBe(true);
  });

  test('sees the front of a seat only from the side it faces', () => {
    expect(sees(seated, fromTop, 'front', seat)).toBe(true);
    const fromBottom = sensor(2, 0.5, UP);
    expect(sees(seated, fromBottom, 'people', seat)).toBe(true);
    expect(sees(seated, fromBottom, 'front', seat)).toBe(false);
  });

  describe('with a door', () => {
    const fromLeft = sensor(3, 0.875, RIGHT);
    const pastLeaf = pt(2.125, 0.375);

    test('the door’s leaf, swung in, hides the door area behind it', () => {
      expect(sees({ ...empty, door }, fromLeft, 'door', pastLeaf)).toBe(false);
    });

    test('the room is scored with the door shut, so the leaf hides none of it', () => {
      expect(sees({ ...empty, door }, fromLeft, 'room', pastLeaf)).toBe(true);
    });

    test('the door’s leaf, swung out, hides none of the door area', () => {
      expect(sees({ ...empty, door: { ...door, swing: 'out' } }, fromLeft, 'door', pastLeaf)).toBe(true);
    });

    test('sees outside only through the doorway', () => {
      const scene = { ...empty, door };
      const samples = sampleScene(scene);
      const flags = seenBy(square, samples, sensor(2, 0.5, UP));
      const seen = samples.filter((s, i) => s.kind === 'outside' && flags[i]);
      expect(seen.length).toBeGreaterThan(0);
      expect(seen.length).toBeLessThan(count(samples, 'outside'));
      seen.forEach(({ point }) => {
        const crossing = 2 + ((point.x - 2) * 4) / (4 - point.y);
        expect(crossing).toBeGreaterThanOrEqual(1.5);
        expect(crossing).toBeLessThanOrEqual(2.5);
      });
    });

    test('a sensor sees nothing behind its own wall, even facing it', () => {
      const samples = sampleScene({ ...empty, door });
      const flags = seenBy(square, samples, sensor(0, 0.2, UP));
      expect(samples.filter((s, i) => s.kind === 'outside' && flags[i])).toEqual([]);
    });
  });
});

describe('union', () => {
  test('a sample is seen when either sensor sees it', () => {
    expect(union(Uint8Array.of(1, 0, 1, 0), Uint8Array.of(1, 1, 0, 0))).toEqual(Uint8Array.of(1, 1, 1, 0));
  });
});

describe('score', () => {
  const samples = ['room', 'room', 'room', 'room', 'people', 'front', 'door', 'door', 'outside', 'outside'].map((kind) => ({ kind }));

  test('each part is the fraction of its samples seen', () => {
    const flags = Uint8Array.of(1, 1, 1, 0, 1, 0, 1, 0, 1, 0);
    expect(score(samples, flags).parts).toEqual({ room: 0.75, people: 1, front: 0, door: 0.5, outside: 0.5 });
  });

  test('seeing everything inside and nothing outside scores 1', () => {
    expect(score(samples, Uint8Array.of(1, 1, 1, 1, 1, 1, 1, 1, 0, 0)).total).toBeCloseTo(1);
  });

  test('seeing all of outside costs the outside penalty', () => {
    expect(score(samples, new Uint8Array(samples.length).fill(1)).total).toBeCloseTo(1 - OUTSIDE_PENALTY);
    expect(score(samples, Uint8Array.of(0, 0, 0, 0, 0, 0, 0, 0, 1, 1)).total).toBeCloseTo(-OUTSIDE_PENALTY);
  });

  test('the total weighs the parts inside', () => {
    const flags = Uint8Array.of(1, 1, 1, 1, 0, 0, 0, 0, 0, 0);
    const inside = WEIGHTS.room + WEIGHTS.people + WEIGHTS.front + WEIGHTS.door;
    expect(score(samples, flags).total).toBeCloseTo(WEIGHTS.room / inside);
  });

  test('a part with nothing to see is null, and leaves the total', () => {
    const roomOnly = [{ kind: 'room' }, { kind: 'room' }];
    const { parts, total } = score(roomOnly, Uint8Array.of(1, 0));
    expect(parts).toEqual({ room: 0.5, people: null, front: null, door: null, outside: null });
    expect(total).toBeCloseTo(0.5);
  });
});
