import { describe, expect, test } from 'vitest';
import { copies } from './model.ts';
import { parse } from './parse.ts';
import { SAMPLES } from './samples.ts';

/** Each CTE's name and copies, in the order defined. */
const copiesIn = (name: string): [string, number][] => {
  const parsed = parse(SAMPLES.find((s) => s.name === name)!.sql);
  if (!parsed.ok) throw new Error(parsed.error);
  const [, ...ctes] = parsed.model.defs;
  const n = copies(parsed.model);
  return ctes.map((c) => [c.name, n[c.id]]);
};

describe('the samples parse to', () => {
  test('a diamond: three CTEs, each read twice', () => {
    expect(copiesIn('Diamond')).toEqual([['a', 8], ['b', 4], ['c', 2]]);
  });

  test('a ladder: nine CTEs, each read twice', () => {
    expect(copiesIn('Ladder').map(([, n]) => n)).toEqual([512, 256, 128, 64, 32, 16, 8, 4, 2]);
  });

  test('a realistic query: 40 CTEs', () => {
    const counts = copiesIn('Realistic').map(([, n]) => n);
    expect({ ctes: counts.length, most: Math.max(...counts) }).toEqual({ ctes: 40, most: 34 });
  });
});
