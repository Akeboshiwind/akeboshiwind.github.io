import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import ALGORITHMS from './index.js';

const INPUTS = {
  random: [23, 7, 45, 12, 89, 34, 56, 1, 78, 90],
  sorted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  reversed: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
  duplicates: [3, 1, 3, 2, 1, 2, 3, 1],
};

const COUNTS = {
  fordJohnson:     { random: 21, sorted: 19, reversed: 20, duplicates: 16 },
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

  if (algo.exact) {
    test('asks exactly getTotal(n) comparisons', () => {
      for (const items of Object.values(INPUTS)) {
        expect(drive(algo.fn, items).pairs).toHaveLength(algo.getTotal(items.length));
      }
    });
  }
});

const permutations = (n) => n === 0 ? [[]]
  : permutations(n - 1).flatMap(p => Array.from({ length: n }, (_, i) => [...p.slice(0, i), n, ...p.slice(i)]));
const lists = (n, values) => n === 0 ? [[]]
  : lists(n - 1, values).flatMap(l => Array.from({ length: values }, (_, v) => [...l, v + 1]));
const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

// Every ordering of up to 7 distinct items, and every list of up to 6 drawn from three values.
const DISTINCT = range(2, 7).flatMap(permutations);
const WITH_TIES = range(2, 6).flatMap(n => lists(n, 3));

// Known bugs, each fixed by the commit that removes it from its list.
const OVER_BOUND = ['mergeAdaptive'];
const REPEATS_PAIRS = ['powersort'];

// The sorting screen shows "Comparison k / ≤ getTotal(n)", so getTotal must bound every run.
describe('getTotal bounds the comparisons asked', () => {
  for (const key of Object.keys(COUNTS)) {
    const algo = ALGORITHMS[key];
    (OVER_BOUND.includes(key) ? test.fails : test)(`${key}, on every input`, () => {
      for (const items of [...DISTINCT, ...WITH_TIES]) {
        expect(drive(algo.fn, items).pairs.length).toBeLessThanOrEqual(algo.getTotal(items.length));
      }
    });
  }
});

describe('an algorithm claiming no repeats never asks the same pair of distinct values twice', () => {
  for (const key of Object.keys(COUNTS).filter(k => ALGORITHMS[k].noRepeatPairs)) {
    (REPEATS_PAIRS.includes(key) ? test.fails : test)(`${key}, on every ordering`, () => {
      for (const items of DISTINCT) {
        const keys = drive(ALGORITHMS[key].fn, items).pairs.map(({ a, b }) => [a, b].sort((x, y) => x - y).join());
        expect(new Set(keys).size).toBe(keys.length);
      }
    });
  }
});
