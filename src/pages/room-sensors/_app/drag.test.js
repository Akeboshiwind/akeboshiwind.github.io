import { describe, test, expect } from 'vitest';
import { parseRoom } from './geometry.js';
import { EMPTY } from './plan.js';
import { dragTo, grab } from './drag.js';

const pt = (x, y) => ({ x, y });
const REACH = 0.2;

const plan = {
  ...EMPTY,
  room: parseRoom([pt(1, 1), pt(6, 1), pt(6, 6), pt(1, 6)]),
  furniture: [{ x: 2, y: 2, w: 1, h: 1, tall: false }, { x: 2.5, y: 2.5, w: 1, h: 1, tall: true }],
  seats: [{ x: 4.5, y: 4.5, facing: 0 }],
};
const first = { kind: 'furniture', index: 0 };

describe('grab', () => {
  test('takes a handle of the selection', () => {
    expect(grab(plan, first, pt(2.95, 2.05), REACH)).toEqual({ selection: first, part: 'corner', corner: 1, from: pt(2.95, 2.05) });
  });

  test('takes the selection’s handle over what lies under it', () => {
    expect(grab(plan, first, pt(3, 3), REACH)).toMatchObject({ selection: first, part: 'corner', corner: 2 });
  });

  test('takes what a click would select by its body, away from the selection’s handles', () => {
    expect(grab(plan, first, pt(3.2, 3.2), REACH)).toEqual({ selection: { kind: 'furniture', index: 1 }, part: 'body', from: pt(3.2, 3.2) });
    expect(grab(plan, null, pt(2.2, 2.2), REACH)).toEqual({ selection: first, part: 'body', from: pt(2.2, 2.2) });
  });

  test('takes nothing out of reach of everything', () => {
    expect(grab(plan, first, pt(5, 5), REACH)).toBeNull();
  });
});

describe('dragging furniture', () => {
  const by = (part, corner, from) => ({ selection: first, part, corner, from });

  test('by its body moves it as far as the pointer moves, to the grid', () => {
    expect(dragTo(plan, by('body', undefined, pt(2.2, 2.2)), pt(3.3, 2.6))).toEqual({ type: 'rect', index: 0, rect: { x: 3, y: 2.5, w: 1, h: 1 } });
  });

  test('by a corner moves that corner to the grid, and keeps the opposite one', () => {
    expect(dragTo(plan, by('corner', 2, pt(3.05, 2.95)), pt(4.05, 3.45))).toEqual({ type: 'rect', index: 0, rect: { x: 2, y: 2, w: 2, h: 1.5 } });
    expect(dragTo(plan, by('corner', 0, pt(2, 2)), pt(1.5, 2.5))).toEqual({ type: 'rect', index: 0, rect: { x: 1.5, y: 2.5, w: 1.5, h: 0.5 } });
  });

  test('by a corner past the opposite one turns it inside out', () => {
    expect(dragTo(plan, by('corner', 2, pt(3, 3)), pt(1, 1))).toEqual({ type: 'rect', index: 0, rect: { x: 1, y: 1, w: 1, h: 1 } });
  });

  test('by a corner makes no edit that leaves it narrower than the grid', () => {
    expect(dragTo(plan, by('corner', 2, pt(3, 3)), pt(2.1, 4))).toBeNull();
  });

  test('makes no edit until it would move', () => {
    expect(dragTo(plan, by('body', undefined, pt(2.2, 2.2)), pt(2.3, 2.1))).toBeNull();
    expect(dragTo(plan, by('corner', 2, pt(3, 3)), pt(3.1, 2.9))).toBeNull();
  });
});

describe('dragging a seat', () => {
  const seat = { kind: 'seat', index: 0 };
  const by = (part, from) => ({ selection: seat, part, from });

  test('takes the seat by its body, or by the handle ahead of it that turns it', () => {
    expect(grab(plan, seat, pt(4.5, 4.5), REACH)).toEqual(by('body', pt(4.5, 4.5)));
    expect(grab(plan, seat, pt(5.1, 4.5), REACH)).toEqual(by('facing', pt(5.1, 4.5)));
  });

  test('by its body moves it as far as the pointer moves, to the grid, facing the way it faced', () => {
    expect(dragTo(plan, by('body', pt(4.6, 4.4)), pt(3.1, 3.4))).toEqual({ type: 'set seat', index: 0, seat: { x: 3, y: 3.5, facing: 0 } });
  });

  test('by its facing handle turns it towards the pointer, where it stands', () => {
    expect(dragTo(plan, by('facing', pt(5.1, 4.5)), pt(4.5, 5.5))).toEqual({ type: 'set seat', index: 0, seat: { x: 4.5, y: 4.5, facing: Math.PI / 2 } });
  });

  test('makes no edit until it would move or turn', () => {
    expect(dragTo(plan, by('body', pt(4.5, 4.5)), pt(4.6, 4.4))).toBeNull();
    expect(dragTo(plan, by('facing', pt(5.1, 4.6)), pt(5.2, 4.5))).toBeNull();
  });
});

describe('dragging a sensor', () => {
  const aimed = Math.PI / 2 + 0.25;
  const onTop = { ...plan, sensors: [{ edge: 0, t: 0.5, facing: aimed, fovDegrees: 120, range: 6 }] };
  const sensor = { kind: 'sensor', index: 0 };
  const by = (part, from) => ({ selection: sensor, part, from });

  test('takes the sensor by its body, or by the handle ahead of it that turns it', () => {
    expect(grab(onTop, sensor, pt(3.5, 1), REACH)).toEqual(by('body', pt(3.5, 1)));
    expect(grab(onTop, sensor, pt(3.5 + 0.6 * Math.cos(aimed), 1 + 0.6 * Math.sin(aimed)), REACH)).toMatchObject({ selection: sensor, part: 'facing' });
  });

  test('by its body slides it along its wall as far as the pointer moves along it, aimed as it was', () => {
    expect(dragTo(onTop, by('body', pt(3.6, 1.1)), pt(4.85, 1.4))).toEqual({ type: 'set sensor', index: 0, sensor: { edge: 0, t: 0.75, facing: aimed } });
  });

  test('by its body keeps it on the walls, at the nearest point to where the pointer takes it', () => {
    expect(dragTo(onTop, by('body', pt(3.5, 1)), pt(0, 0))).toMatchObject({ sensor: { edge: 0, t: 0 } });
  });

  test('by its body takes it round onto another wall, turned with the wall', () => {
    const { sensor: moved } = dragTo(onTop, by('body', pt(3.5, 1)), pt(5.8, 3.5));
    expect(moved).toMatchObject({ edge: 1, t: 0.5 });
    expect(moved.facing).toBeCloseTo(aimed + Math.PI / 2);
  });

  test('by its facing handle turns it towards the pointer, where it stands', () => {
    expect(dragTo(onTop, by('facing', pt(3.5, 1.6)), pt(4.5, 1))).toEqual({ type: 'set sensor', index: 0, sensor: { edge: 0, t: 0.5, facing: 0 } });
  });

  test('makes no edit until it would move or turn', () => {
    expect(dragTo(onTop, by('body', pt(3.5, 1)), pt(3.5, 1.4))).toBeNull();
    expect(dragTo(onTop, by('facing', pt(3.5, 1.6)), pt(3.5 + Math.cos(aimed), 1 + Math.sin(aimed)))).toBeNull();
  });
});

describe('dragging the door', () => {
  const door = { kind: 'door' };
  const by = (from) => ({ selection: door, part: 'body', from });
  const hung = (room) => ({ ...plan, room: parseRoom(room), door: { edge: 0, t: 0.5, width: 1, hinge: 'end', swing: 'out' } });
  const square = hung([pt(1, 1), pt(6, 1), pt(6, 6), pt(1, 6)]);

  test('takes the door by its body, by the middle of its gap or by its leaf', () => {
    expect(grab(square, door, pt(3.5, 1), REACH)).toEqual(by(pt(3.5, 1)));
    expect(grab(square, null, pt(4, 0.5), REACH)).toEqual(by(pt(4, 0.5)));
  });

  test('slides it along its wall as far as the pointer moves along it', () => {
    expect(dragTo(square, by(pt(3.6, 0.9)), pt(4.85, 1.2))).toEqual({ type: 'move door', at: { edge: 0, t: 0.75 } });
  });

  test('takes it round onto another wall', () => {
    expect(dragTo(square, by(pt(3.5, 1)), pt(5.8, 3.5))).toEqual({ type: 'move door', at: { edge: 1, t: 0.5 } });
  });

  test('keeps it fitted in its wall, short of the corner', () => {
    expect(dragTo(square, by(pt(3.5, 1)), pt(6, 0.5))).toEqual({ type: 'move door', at: { edge: 0, t: 0.9 } });
  });

  test('makes no edit onto a wall shorter than the door, or until it would move', () => {
    const cornered = hung([pt(1, 1), pt(6, 1), pt(6, 6), pt(1.5, 6), pt(1, 5.5)]);
    expect(dragTo(cornered, by(pt(3.5, 1)), pt(1.1, 5.9))).toBeNull();
    expect(dragTo(square, by(pt(3.5, 1)), pt(3.5, 1.4))).toBeNull();
  });
});

describe('dragging a room corner', () => {
  const room = { kind: 'room' };
  const by = (part, corner, from) => ({ selection: room, part, corner, from });

  test('takes a corner of the selected room', () => {
    expect(grab(plan, room, pt(6.05, 5.95), REACH)).toEqual(by('corner', 2, pt(6.05, 5.95)));
  });

  test('moves the corner as far as the pointer moves, to the grid', () => {
    expect(dragTo(plan, by('corner', 2, pt(6.05, 5.95)), pt(7.1, 6.4))).toEqual({ type: 'move corner', index: 2, to: pt(7, 6.5) });
  });

  test('makes no edit until it would move, nor by a wall', () => {
    expect(dragTo(plan, by('corner', 2, pt(6, 6)), pt(6.1, 5.9))).toBeNull();
    expect(dragTo(plan, by('body', undefined, pt(6, 3)), pt(7, 3))).toBeNull();
  });
});
