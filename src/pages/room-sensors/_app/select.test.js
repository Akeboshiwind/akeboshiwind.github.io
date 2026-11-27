import { describe, test, expect } from 'vitest';
import { FP300, parseRoom } from './geometry.js';
import { EMPTY } from './plan.js';
import { current, handlesOf, pick } from './select.js';

const pt = (x, y) => ({ x, y });
const UP = -Math.PI / 2;
const DOWN = Math.PI / 2;
const REACH = 0.2;

const room = parseRoom([pt(1, 1), pt(6, 1), pt(6, 6), pt(1, 6)]);
const plan = {
  ...EMPTY,
  room,
  furniture: [{ x: 2, y: 2, w: 1, h: 1, tall: false }, { x: 2.5, y: 2.5, w: 1, h: 1, tall: true }],
  door: { edge: 2, t: 0.5, width: 0.9, hinge: 'start', swing: 'in' },
  seats: [{ x: 4, y: 4, facing: UP }],
  sensors: [{ ...FP300, edge: 0, t: 0.4, facing: DOWN }, { ...FP300, edge: 0, t: 0.42, facing: DOWN }],
};

describe('pick', () => {
  test.each([
    ['a sensor, over the wall it stands on', pt(3, 1.1), { kind: 'sensor', index: 1 }],
    ['a seat', pt(4.1, 3.9), { kind: 'seat', index: 0 }],
    ['the door, by its gap', pt(3.5, 6), { kind: 'door' }],
    ['the door, by its open leaf', pt(3.95, 5.5), { kind: 'door' }],
    ['the room, by a wall', pt(5.9, 3), { kind: 'room' }],
    ['the room, by a corner', pt(1, 1), { kind: 'room' }],
    ['furniture, anywhere over it', pt(2.2, 2.2), { kind: 'furniture', index: 0 }],
    ['furniture, just beside it', pt(1.9, 2.2), { kind: 'furniture', index: 0 }],
  ])('picks %s', (_, at, selection) => {
    expect(pick(plan, at, REACH)).toEqual(selection);
  });

  test('of what overlaps, picks what was placed last, as it is drawn on top', () => {
    expect(pick(plan, pt(2.75, 2.75), REACH)).toEqual({ kind: 'furniture', index: 1 });
    expect(pick(plan, pt(3, 1), REACH)).toEqual({ kind: 'sensor', index: 1 });
  });

  test('picks nothing out of reach of everything', () => {
    expect(pick(plan, pt(5, 2.5), REACH)).toBeNull();
    expect(pick(plan, pt(4.25, 4), REACH)).toBeNull();
    expect(pick(plan, pt(4.25, 4), 0.3)).toEqual({ kind: 'seat', index: 0 });
  });

  test('picks nothing from an empty plan', () => {
    expect(pick(EMPTY, pt(1, 1), REACH)).toBeNull();
  });
});

describe('current', () => {
  test.each([
    [{ kind: 'room' }],
    [{ kind: 'door' }],
    [{ kind: 'furniture', index: 1 }],
    [{ kind: 'seat', index: 0 }],
    [{ kind: 'sensor', index: 1 }],
  ])('keeps %o while the plan has it', (selection) => {
    expect(current(plan, selection)).toBe(selection);
  });

  test.each([
    ['the room has gone', { ...EMPTY }, { kind: 'room' }],
    ['the door has gone', { ...plan, door: null }, { kind: 'door' }],
    ['its index is past the end of the list', { ...plan, sensors: plan.sensors.slice(0, 1) }, { kind: 'sensor', index: 1 }],
  ])('clears a selection once %s', (_, after, selection) => {
    expect(current(after, selection)).toBeNull();
  });

  test('has nothing to clear', () => {
    expect(current(plan, null)).toBeNull();
  });
});

describe('handlesOf', () => {
  test('a room has one at each corner', () => {
    expect(handlesOf(plan, { kind: 'room' })).toEqual(room.map((at, corner) => ({ part: 'corner', corner, at })));
  });

  test('furniture has one at each corner, clockwise from the top left', () => {
    expect(handlesOf(plan, { kind: 'furniture', index: 0 }).map(({ part, corner, at }) => [part, corner, at])).toEqual([
      ['corner', 0, pt(2, 2)], ['corner', 1, pt(3, 2)], ['corner', 2, pt(3, 3)], ['corner', 3, pt(2, 3)],
    ]);
  });

  test('the door has one on its middle', () => {
    expect(handlesOf(plan, { kind: 'door' })).toEqual([{ part: 'body', at: pt(3.5, 6) }]);
  });

  test('a seat has one on it, and one ahead of it the way it faces', () => {
    const [body, facing] = handlesOf(plan, { kind: 'seat', index: 0 });
    expect(body).toEqual({ part: 'body', at: pt(4, 4) });
    expect(facing.part).toBe('facing');
    expect(facing.at.x).toBeCloseTo(4);
    expect(facing.at.y).toBeLessThan(4);
  });

  test('a sensor has one on it, and one ahead of it the way it faces', () => {
    const [body, facing] = handlesOf(plan, { kind: 'sensor', index: 0 });
    expect(body.part).toBe('body');
    expect(body.at.x).toBeCloseTo(3);
    expect(body.at.y).toBeCloseTo(1);
    expect(facing.part).toBe('facing');
    expect(facing.at.x).toBeCloseTo(3);
    expect(facing.at.y).toBeGreaterThan(1);
  });

  test('nothing selected has none', () => {
    expect(handlesOf(plan, null)).toEqual([]);
  });
});
