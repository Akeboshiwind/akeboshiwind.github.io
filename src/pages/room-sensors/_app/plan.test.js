import { describe, test, expect } from 'vitest';
import { FP300 } from './geometry.js';
import { EMPTY, DOOR_WIDTH, SENSOR_LIMITS, edit } from './plan.js';

const pt = (x, y) => ({ x, y });
const corners = [pt(0, 0), pt(4, 0), pt(4, 4), pt(0, 4)];
const drawn = (points) => edit(points.reduce((plan, point) => edit(plan, { type: 'corner', point }), EMPTY), { type: 'close' });
const room = drawn(corners);

describe('drawing the room', () => {
  test('each corner adds to the draft', () => {
    const plan = edit(edit(EMPTY, { type: 'corner', point: pt(0, 0) }), { type: 'corner', point: pt(4, 0) });
    expect(plan.draft).toEqual([pt(0, 0), pt(4, 0)]);
    expect(plan.room).toBeNull();
  });

  test('closing the draft makes it the room', () => {
    expect(room.room).toEqual(corners);
    expect(room.draft).toEqual([]);
  });

  test('a draft that encloses no area stays a draft', () => {
    const line = [pt(0, 0), pt(1, 0), pt(2, 0)];
    expect(drawn(line)).toMatchObject({ room: null, draft: line });
  });

  test('a new room drops the door and sensors placed on the old one’s walls, and keeps the rest', () => {
    const furnished = [
      { type: 'furniture', rect: { x: 1, y: 1, w: 1, h: 1 } },
      { type: 'seat', seat: { x: 2, y: 3, facing: 0 } },
      { type: 'door', at: pt(2, 0) },
      { type: 'sensor', sensor: { edge: 1, t: 0.5, facing: Math.PI } },
    ].reduce(edit, room);
    const redrawn = [...[pt(0, 0), pt(5, 0), pt(5, 5), pt(0, 5)].map((point) => ({ type: 'corner', point })), { type: 'close' }]
      .reduce(edit, furnished);
    expect(redrawn).toMatchObject({ door: null, sensors: [], furniture: furnished.furniture, seats: furnished.seats });
  });
});

describe('placing things', () => {
  test('furniture is short until it is made tall', () => {
    expect(edit(room, { type: 'furniture', rect: { x: 1, y: 1, w: 1, h: 2 } }).furniture).toEqual([{ x: 1, y: 1, w: 1, h: 2, tall: false }]);
  });

  test('a door goes on the nearest wall, a door’s width wide, swinging in from the wall’s start', () => {
    expect(edit(room, { type: 'door', at: pt(2, 0.3) }).door).toEqual({ edge: 0, t: 0.5, width: DOOR_WIDTH, hinge: 'start', swing: 'in' });
  });

  test('a door near a corner slides along its wall until it fits', () => {
    expect(edit(room, { type: 'door', at: pt(0.1, -0.2) }).door).toMatchObject({ edge: 0, t: DOOR_WIDTH / 2 / 4 });
  });

  test('there is one door, and placing another moves it', () => {
    const plan = [{ type: 'door', at: pt(2, 0) }, { type: 'door', at: pt(4, 2) }].reduce(edit, room);
    expect(plan.door).toMatchObject({ edge: 1, t: 0.5 });
  });

  test('a door does not go on a wall shorter than it', () => {
    const nook = drawn([pt(0, 0), pt(4, 0), pt(4, 0.5), pt(0, 0.5)]);
    expect(edit(nook, { type: 'door', at: pt(4.2, 0.25) })).toBe(nook);
  });

  test('a seat goes inside the room, not outside it', () => {
    const seat = { x: 2, y: 2, facing: 0 };
    expect(edit(room, { type: 'seat', seat }).seats).toEqual([seat]);
    expect(edit(room, { type: 'seat', seat: { x: 5, y: 2, facing: 0 } })).toBe(room);
  });

  test('a sensor is an FP300 until it is told otherwise', () => {
    const sensor = { edge: 1, t: 0.25, facing: Math.PI };
    expect(edit(room, { type: 'sensor', sensor }).sensors).toEqual([{ ...FP300, ...sensor }]);
  });

  test.each(['door', 'seat', 'sensor'])('without a room there is nowhere for a %s', (type) => {
    const action = { type, at: pt(1, 1), seat: { x: 1, y: 1, facing: 0 }, sensor: { edge: 0, t: 0.5, facing: 0 } };
    expect(edit(EMPTY, action)).toBe(EMPTY);
  });
});

describe('editing what is placed', () => {
  const placed = [
    { type: 'furniture', rect: { x: 1, y: 1, w: 1, h: 1 } },
    { type: 'furniture', rect: { x: 2, y: 2, w: 1, h: 1 } },
    { type: 'seat', seat: { x: 2, y: 3, facing: 0 } },
    { type: 'door', at: pt(2, 0) },
    { type: 'sensor', sensor: { edge: 1, t: 0.5, facing: Math.PI } },
    { type: 'sensor', sensor: { edge: 2, t: 0.5, facing: -Math.PI / 2 } },
  ].reduce(edit, room);

  test('furniture is made tall, and short again', () => {
    const tall = edit(placed, { type: 'tall', index: 1, tall: true });
    expect(tall.furniture.map((f) => f.tall)).toEqual([false, true]);
    expect(edit(tall, { type: 'tall', index: 1, tall: false }).furniture).toEqual(placed.furniture);
  });

  test('the door’s hinge flips to the other end of its gap, and back', () => {
    const flipped = edit(placed, { type: 'flip hinge' });
    expect(flipped.door).toEqual({ ...placed.door, hinge: 'end' });
    expect(edit(flipped, { type: 'flip hinge' }).door).toEqual(placed.door);
  });

  test('the door swings out of the room, or in', () => {
    const out = edit(placed, { type: 'swing', swing: 'out' });
    expect(out.door).toEqual({ ...placed.door, swing: 'out' });
    expect(edit(out, { type: 'swing', swing: 'in' }).door).toEqual(placed.door);
    expect(edit(placed, { type: 'swing', swing: 'sideways' })).toBe(placed);
  });

  test.each([{ type: 'flip hinge' }, { type: 'swing', swing: 'out' }])('without a door there is nothing to $type', (action) => {
    expect(edit(room, action)).toBe(room);
  });

  test('a sensor’s viewing angle and range change on their own', () => {
    const narrow = edit(placed, { type: 'spec', index: 1, spec: { fovDegrees: 90 } });
    expect(narrow.sensors).toEqual([placed.sensors[0], { ...placed.sensors[1], fovDegrees: 90 }]);
    expect(edit(narrow, { type: 'spec', index: 1, spec: { range: 3.5 } }).sensors[1]).toEqual({ ...placed.sensors[1], fovDegrees: 90, range: 3.5 });
  });

  test.each([
    { fovDegrees: SENSOR_LIMITS.fovDegrees.min - 1 },
    { fovDegrees: SENSOR_LIMITS.fovDegrees.max + 1 },
    { range: SENSOR_LIMITS.range.min - 0.1 },
    { range: SENSOR_LIMITS.range.max + 0.1 },
    { range: NaN },
    { facing: 0 },
  ])('a sensor refuses %o', (spec) => {
    expect(edit(placed, { type: 'spec', index: 0, spec })).toBe(placed);
  });

  test.each([
    ['furniture', 'furniture'],
    ['seat', 'seats'],
    ['sensor', 'sensors'],
  ])('a %s is removed, and the rest stay', (kind, list) => {
    const removed = edit(placed, { type: 'remove', kind, index: 0 });
    expect(removed[list]).toEqual(placed[list].slice(1));
    expect({ ...removed, [list]: placed[list] }).toEqual(placed);
  });

  test('the door is removed', () => {
    expect(edit(placed, { type: 'remove', kind: 'door' })).toEqual({ ...placed, door: null });
  });

  test.each([
    { type: 'tall', index: 2, tall: true },
    { type: 'spec', index: 2, spec: { range: 3 } },
    { type: 'remove', kind: 'seat', index: 1 },
    { type: 'remove', kind: 'window', index: 0 },
  ])('an edit of something not there changes nothing: %o', (action) => {
    expect(edit(placed, action)).toBe(placed);
  });
});

test('clearing starts again', () => {
  expect(edit(room, { type: 'clear' })).toBe(EMPTY);
});
