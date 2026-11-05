import { describe, test, expect } from 'vitest';
import { declared, type Cte, type Model } from './model.ts';
import { parse } from './parse.ts';
import { materializedBy, postgresRule } from './postgres.ts';
import { withMaterialized } from './rewrite.ts';
import { SAMPLES } from './samples.ts';

const model = (sql: string): Model => {
  const parsed = parse(sql);
  if (!parsed.ok) throw new Error(parsed.error);
  return parsed.model;
};

const ruled = (sql: string) => postgresRule(model(sql)).map((r) => [r.cte.name, r.references, r.action]);
const names = (set: Set<Cte>) => [...set].map((c) => c.name).sort();

describe('postgresRule', () => {
  test('materialises a CTE named twice or more, inlines one named once, and leaves an unnamed one alone', () => {
    expect(ruled(`
      WITH a AS (SELECT * FROM t),
           b AS (SELECT * FROM a, a AS a2),
           c AS (SELECT * FROM u)
      SELECT * FROM b`)).toEqual([['a', 2, 'materialize'], ['b', 1, 'inline'], ['c', 0, 'unread']]);
  });

  test('keeps a CTE declared MATERIALIZED, however often it is named', () => {
    expect(ruled(`
      WITH MATERIALIZED a AS (SELECT * FROM t),
           MATERIALIZED b AS (SELECT * FROM a, a AS a2)
      SELECT 1`)).toEqual([['a', 2, 'declared'], ['b', 0, 'declared']]);
  });

  test('counts names in the statement, not copies in the plan', () => {
    expect(ruled(`
      WITH a AS (SELECT * FROM t),
           b AS (SELECT * FROM a)
      SELECT * FROM b, b AS b2`)).toEqual([['a', 1, 'inline'], ['b', 2, 'materialize']]);
  });

  test('counts names across every body, including inside a CTE nothing reads', () => {
    expect(ruled(`
      WITH a AS (SELECT * FROM t),
           unread AS (SELECT * FROM a)
      SELECT * FROM a`)).toEqual([['a', 2, 'materialize'], ['unread', 0, 'unread']]);
  });

  test('counts a name only where it resolves to that CTE', () => {
    expect(ruled(`
      WITH a AS (SELECT * FROM t)
      SELECT * FROM (WITH a AS (SELECT * FROM u) SELECT * FROM a, a AS a2) AS x, a`))
      .toEqual([['a', 1, 'inline'], ['a', 2, 'materialize']]);
  });

  test('applied to each sample, writes SQL that reparses declaring exactly the CTEs it materialises', () => {
    for (const { sql } of SAMPLES) {
      const m = model(sql);
      const set = materializedBy(postgresRule(m));
      expect(names(declared(model(withMaterialized(m, set))))).toEqual(names(set));
    }
  });

  test('applied to a query that declares some already, writes SQL that reparses declaring exactly the rule\'s set', () => {
    const m = model(`
      WITH MATERIALIZED a AS (SELECT * FROM t),
           b AS (SELECT * FROM a, a AS a2),
           c AS (SELECT * FROM b, b AS b2),
           d AS (SELECT * FROM c)
      SELECT * FROM d`);
    const set = materializedBy(postgresRule(m));
    expect(names(set)).toEqual(['a', 'b']);
    expect(names(declared(model(withMaterialized(m, set))))).toEqual(['a', 'b']);
  });
});
