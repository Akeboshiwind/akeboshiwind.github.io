import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import ALGORITHMS from './index.js';

const INPUTS = {
  random: [23, 7, 45, 12, 89, 34, 56, 1, 78, 90],
  sorted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  reversed: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  duplicates: [3, 1, 3, 2, 1, 2, 3, 1],
};

const COUNTS = {
  fordJohnson:     { random: 21, sorted: 19, reversed: 20, duplicates: 17 },
  mergeAdaptive:   { random: 28, sorted: 9,  reversed: 19, duplicates: 18 },
  powersort:       { random: 30, sorted: 9,  reversed: 9,  duplicates: 19 },
  binaryInsertion: { random: 21, sorted: 19, reversed: 25, duplicates: 15 },
  merge:           { random: 26, sorted: 21, reversed: 15, duplicates: 17 },
  quick:           { random: 24, sorted: 21, reversed: 23, duplicates: 12 },
  insertion:       { random: 21, sorted: 9,  reversed: 45, duplicates: 19 },
  bubble:          { random: 44, sorted: 9,  reversed: 45, duplicates: 27 },
  selection:       { random: 45, sorted: 45, reversed: 45, duplicates: 28 },
};

const drive = (fn, items) => {
  const gen = fn(items);
  const pairs = [];
  let step = gen.next();
  while (!step.done) {
    pairs.push(step.value);
    step = gen.next(Math.sign(step.value.a - step.value.b));
  }
  return { sorted: step.value, pairs };
};

// Quicksort picks random pivots; a fixed LCG makes its comparisons repeatable.
let seed;
beforeEach(() => {
  seed = 0;
  vi.spyOn(Math, 'random').mockImplementation(() => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  });
});
afterEach(() => vi.restoreAllMocks());

test('every algorithm is listed', () => {
  expect(Object.keys(ALGORITHMS)).toEqual(Object.keys(COUNTS));
});

describe.each(Object.keys(COUNTS))('%s', (key) => {
  const algo = ALGORITHMS[key];

  test.each(Object.keys(INPUTS))('sorts %s input ascending', (input) => {
    const items = INPUTS[input];
    expect(drive(algo.fn, items).sorted).toEqual([...items].sort((a, b) => a - b));
  });

  test.each(Object.keys(INPUTS))('asks a fixed number of comparisons on %s input', (input) => {
    expect(drive(algo.fn, INPUTS[input]).pairs).toHaveLength(COUNTS[key][input]);
  });

  test('asks the same comparisons each time for the same input', () => {
    const first = drive(algo.fn, INPUTS.random).pairs;
    seed = 0;
    expect(drive(algo.fn, INPUTS.random).pairs).toEqual(first);
  });

  test('does not mutate its input', () => {
    const items = [...INPUTS.random];
    drive(algo.fn, items);
    expect(items).toEqual(INPUTS.random);
  });

  test('sorts zero, one and two items', () => {
    expect(drive(algo.fn, []).sorted).toEqual([]);
    expect(drive(algo.fn, [5]).sorted).toEqual([5]);
    expect(drive(algo.fn, [2, 1]).sorted).toEqual([1, 2]);
  });

  if (algo.noRepeatPairs) {
    // Known bug: powersort claims no repeats, but merging runs re-asks pairs its run detection already asked.
    (key === 'powersort' ? test.fails : test)('never asks about the same pair of distinct values twice', () => {
      for (const input of ['random', 'sorted', 'reversed']) {
        const keys = drive(algo.fn, INPUTS[input]).pairs.map(({ a, b }) => [a, b].sort((x, y) => x - y).join());
        expect(new Set(keys).size).toBe(keys.length);
      }
    });
  }

  if (algo.exact) {
    test('asks exactly getTotal(n) comparisons', () => {
      for (const items of Object.values(INPUTS)) {
        expect(drive(algo.fn, items).pairs).toHaveLength(algo.getTotal(items.length));
      }
    });
  }
});

// The sorting screen shows "Comparison k / ≤ getTotal(n)", so getTotal must bound every run.
describe('getTotal bounds the comparisons asked', () => {
  const withinBound = (key, items) =>
    expect(drive(ALGORITHMS[key].fn, items).pairs.length).toBeLessThanOrEqual(ALGORITHMS[key].getTotal(items.length));

  const bounded = Object.keys(COUNTS).filter(key => !['mergeAdaptive', 'fordJohnson'].includes(key));
  test.each(bounded)('%s', (key) => {
    for (const items of Object.values(INPUTS)) withinBound(key, items);
  });

  test('fordJohnson on distinct items', () => {
    for (const input of ['random', 'sorted', 'reversed']) withinBound('fordJohnson', INPUTS[input]);
  });

  // Known bug: with equal items fordJohnson asks one more than its worst-case total (17 > 16 for n=8).
  test.fails('fordJohnson on duplicates', () => withinBound('fordJohnson', INPUTS.duplicates));

  // Known bug: the pre-merge check costs an extra comparison that getTotal (mergeUpperBound) doesn't count.
  test.fails('mergeAdaptive', () => withinBound('mergeAdaptive', INPUTS.random));
});
