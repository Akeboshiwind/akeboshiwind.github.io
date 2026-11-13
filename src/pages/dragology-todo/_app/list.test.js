import { describe, test, expect } from 'vitest';
import { move, insertAt, reorders, insertions, edgeSpeed } from './list.js';

const items = ['a', 'b', 'c', 'd'].map(id => ({ id, title: id, done: false }));
const ids = xs => xs.map(x => x.id).join('');

describe('move', () => {
  test('puts the item at an index in the list without it', () => {
    expect(ids(move(items, 'a', 2))).toBe('bcad');
    expect(ids(move(items, 'd', 0))).toBe('dabc');
    expect(ids(move(items, 'b', 1))).toBe('abcd');
  });
});

describe('insertAt', () => {
  test('puts a new item at the index', () => {
    expect(ids(insertAt(items, 0, { id: 'x' }))).toBe('xabcd');
    expect(ids(insertAt(items, 4, { id: 'x' }))).toBe('abcdx');
  });
});

describe('reorders', () => {
  test('is every list with the item somewhere else', () => {
    expect(reorders(items.slice(0, 3), 'a').map(s => ids(s.items))).toEqual(['abc', 'bac', 'bca']);
  });
});

describe('insertions', () => {
  test('is every list with the new item in it', () => {
    expect(insertions(items.slice(0, 2), { id: 'x' }).map(s => ids(s.items))).toEqual(['xab', 'axb', 'abx']);
  });
});

describe('edgeSpeed', () => {
  const view = { top: 0, bottom: 1000 };
  test('is still away from the edges', () => {
    expect(edgeSpeed(500, view)).toBe(0);
  });
  test('scrolls up near the top and down near the bottom, faster nearer the edge', () => {
    expect(edgeSpeed(40, view)).toBeLessThan(0);
    expect(edgeSpeed(5, view)).toBeLessThan(edgeSpeed(40, view));
    expect(edgeSpeed(960, view)).toBeGreaterThan(0);
    expect(edgeSpeed(995, view)).toBeGreaterThan(edgeSpeed(960, view));
  });
  test('is capped past the edge', () => {
    expect(edgeSpeed(-50, view)).toBe(edgeSpeed(0, view));
  });
});
