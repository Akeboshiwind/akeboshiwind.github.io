import { describe, test, expect } from 'vitest';
import { FP300 } from './geometry.js';
import { EMPTY, DOOR_WIDTH, SENSOR_LIMITS, edit, parsePlan } from './plan.js';

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

  test('sensors found by a search replace those placed', () => {
    const placed = edit(room, { type: 'sensor', sensor: { edge: 1, t: 0.25, facing: Math.PI } });
    const found = [{ ...FP300, edge: 0, t: 0.5, facing: Math.PI / 2 }, { ...FP300, edge: 2, t: 0.5, facing: -Math.PI / 2 }];
    expect(edit(placed, { type: 'found', sensors: found }).sensors).toEqual(found);
  });

  test.each(['door', 'seat', 'sensor', 'found'])('without a room there is nowhere for a %s', (type) => {
    const action = { type, at: pt(1, 1), seat: { x: 1, y: 1, facing: 0 }, sensor: { edge: 0, t: 0.5, facing: 0 }, sensors: [{ ...FP300, edge: 0, t: 0.5, facing: 0 }] };
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

  test('furniture moves and changes size, and stays as tall as it was', () => {
    const tall = edit(placed, { type: 'tall', index: 1, tall: true });
    const moved = edit(tall, { type: 'rect', index: 1, rect: { x: 0.5, y: 2, w: 2, h: 0.5 } });
    expect(moved.furniture).toEqual([placed.furniture[0], { x: 0.5, y: 2, w: 2, h: 0.5, tall: true }]);
  });

  test.each([
    ['no width', { x: 1, y: 1, w: 0, h: 1 }],
    ['no height', { x: 1, y: 1, w: 1, h: 0 }],
  ])('furniture is not made %s', (_, rect) => {
    expect(edit(placed, { type: 'rect', index: 0, rect })).toBe(placed);
  });

  test('a seat moves and turns, inside the room, not outside it', () => {
    const seat = { x: 3, y: 1, facing: Math.PI };
    expect(edit(placed, { type: 'set seat', index: 0, seat }).seats).toEqual([seat]);
    expect(edit(placed, { type: 'set seat', index: 0, seat: { ...seat, x: 5 } })).toBe(placed);
  });

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
    { type: 'rect', index: 2, rect: { x: 0, y: 0, w: 1, h: 1 } },
    { type: 'set seat', index: 1, seat: { x: 2, y: 2, facing: 0 } },
    { type: 'spec', index: 2, spec: { range: 3 } },
    { type: 'remove', kind: 'seat', index: 1 },
    { type: 'remove', kind: 'window', index: 0 },
  ])('an edit of something not there changes nothing: %o', (action) => {
    expect(edit(placed, action)).toBe(placed);
  });
});

describe('the sensor a search looks for', () => {
  test('is an FP300 until it is told otherwise', () => {
    expect(EMPTY.searchWith).toEqual(FP300);
  });

  test('changes its viewing angle and range on their own', () => {
    const narrow = edit(room, { type: 'search with', spec: { fovDegrees: 90 } });
    expect(narrow.searchWith).toEqual({ ...FP300, fovDegrees: 90 });
    expect(edit(narrow, { type: 'search with', spec: { range: 3.5 } }).searchWith).toEqual({ fovDegrees: 90, range: 3.5 });
  });

  test.each([
    { fovDegrees: SENSOR_LIMITS.fovDegrees.max + 1 },
    { range: SENSOR_LIMITS.range.min - 0.1 },
    { facing: 0 },
  ])('refuses %o', (spec) => {
    expect(edit(room, { type: 'search with', spec })).toBe(room);
  });

  test('is kept when a new room is drawn', () => {
    const narrow = edit(room, { type: 'search with', spec: { range: 2 } });
    const redrawn = [...corners.map((point) => ({ type: 'corner', point })), { type: 'close' }].reduce(edit, narrow);
    expect(redrawn.searchWith).toEqual({ ...FP300, range: 2 });
  });
});

test('clearing starts again', () => {
  expect(edit(room, { type: 'clear' })).toBe(EMPTY);
});

describe('loading a stored plan', () => {
  const furnished = [
    { type: 'corner', point: pt(9, 9) },
    { type: 'furniture', rect: { x: 1, y: 1, w: 1, h: 2 } },
    { type: 'tall', index: 0, tall: true },
    { type: 'door', at: pt(2, 0) },
    { type: 'swing', swing: 'out' },
    { type: 'seat', seat: { x: 2, y: 3, facing: 0 } },
    { type: 'sensor', sensor: { edge: 1, t: 0.5, facing: Math.PI } },
    { type: 'spec', index: 0, spec: { fovDegrees: 90, range: 3.5 } },
    { type: 'search with', spec: { fovDegrees: 60, range: 4 } },
  ].reduce(edit, room);
  const stored = (plan) => JSON.parse(JSON.stringify(plan));

  test('a plan comes back as it was stored', () => {
    expect(parsePlan(stored(furnished))).toEqual(furnished);
    expect(parsePlan(stored(EMPTY))).toEqual(EMPTY);
  });

  test('fields it does not know are dropped', () => {
    const extra = stored(furnished);
    extra.colour = 'red';
    extra.sensors[0].brand = 'Aqara';
    expect(parsePlan(extra)).toEqual(furnished);
  });

  const broken = (change) => {
    const plan = stored(furnished);
    change(plan);
    return plan;
  };

  test.each([
    ['nothing', null],
    ['a number', 42],
    ['a list', []],
    ['an empty object', {}],
    ['a draft corner that is not a point', broken((p) => { p.draft = [{ x: 1 }]; })],
    ['a room of two corners', broken((p) => { p.room = p.room.slice(0, 2); })],
    ['a room wound the other way', broken((p) => { p.room.reverse(); })],
    ['a room with a repeated corner', broken((p) => { p.room.push(p.room[0]); })],
    ['furniture with no size', broken((p) => { delete p.furniture[0].w; })],
    ['furniture neither tall nor short', broken((p) => { p.furniture[0].tall = 'yes'; })],
    ['a door with no room', broken((p) => { p.room = null; p.sensors = []; })],
    ['a door on a wall that is not there', broken((p) => { p.door.edge = 4; })],
    ['a door hanging off the end of its wall', broken((p) => { p.door.t = 0.05; })],
    ['a door wider than its wall', broken((p) => { p.door.width = 5; })],
    ['a door hinged sideways', broken((p) => { p.door.hinge = 'middle'; })],
    ['a door swinging sideways', broken((p) => { p.door.swing = 'up'; })],
    ['a seat facing nowhere', broken((p) => { p.seats[0].facing = null; })],
    ['a sensor with no room', broken((p) => { p.room = null; p.door = null; })],
    ['a sensor off its wall', broken((p) => { p.sensors[0].t = 1.5; })],
    ['a sensor on a fractional wall', broken((p) => { p.sensors[0].edge = 0.5; })],
    ['a sensor wider than the limits', broken((p) => { p.sensors[0].fovDegrees = SENSOR_LIMITS.fovDegrees.max + 1; })],
    ['a sensor with no range', broken((p) => { delete p.sensors[0].range; })],
    ['a search for a sensor beyond the limits', broken((p) => { p.searchWith.range = SENSOR_LIMITS.range.max + 1; })],
    ['a search for no sensor', broken((p) => { delete p.searchWith; })],
  ])('%s loads as an empty plan', (_, value) => {
    expect(parsePlan(value)).toBe(EMPTY);
  });
});
