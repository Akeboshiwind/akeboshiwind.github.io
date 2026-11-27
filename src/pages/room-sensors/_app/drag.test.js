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
