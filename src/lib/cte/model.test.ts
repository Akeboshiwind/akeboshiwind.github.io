import { describe, test, expect } from 'vitest';
import { copies, type Model } from './model.ts';
import { parse } from './parse.ts';

const model = (sql: string): Model => {
  const parsed = parse(sql);
  if (!parsed.ok) throw new Error(parsed.error);
  return parsed.model;
};

/** Each body's name and copies, in the order defined. */
const copiesOf = (sql: string) => {
  const m = model(sql);
  const n = copies(m);
  return m.defs.map((d) => [d.kind === 'cte' ? d.name : 'query', n[d.id]]);
};

describe('copies', () => {
  test('multiply along paths from the query', () => {
    expect(copiesOf(`
      WITH a AS (SELECT * FROM t),
           b AS (SELECT * FROM a JOIN a AS a2 ON true),
           c AS (SELECT * FROM b JOIN b AS b2 ON true)
      SELECT * FROM c JOIN c AS c2 ON true`)).toEqual([['query', 1], ['a', 8], ['b', 4], ['c', 2]]);
  });

  test('add up across readers', () => {
    expect(copiesOf(`
      WITH a AS (SELECT * FROM t),
           b AS (SELECT * FROM a),
           c AS (SELECT * FROM a, a AS a2, b)
      SELECT * FROM c, c AS c2, a`)).toEqual([['query', 1], ['a', 7], ['b', 2], ['c', 2]]);
  });

  test('a MATERIALIZED CTE is planned once, however often it is read', () => {
    expect(copiesOf(`
      WITH MATERIALIZED a AS (SELECT * FROM t),
           b AS (SELECT * FROM a, a AS a2)
      SELECT * FROM b, b AS b2`)).toEqual([['query', 1], ['a', 1], ['b', 2]]);
  });

  test('an unread MATERIALIZED CTE is still planned; an unread inlined one is not', () => {
    expect(copiesOf(`
      WITH MATERIALIZED m AS (SELECT * FROM t),
           i AS (SELECT * FROM u)
      SELECT 1`)).toEqual([['query', 1], ['m', 1], ['i', 0]]);
  });

  test('a MATERIALIZED CTE in a nested WITH is planned once per copy of its definer', () => {
    expect(copiesOf(`
      WITH a AS (WITH MATERIALIZED m AS (SELECT * FROM t) SELECT * FROM m, m AS m2)
      SELECT * FROM a, a AS a2`)).toEqual([['query', 1], ['a', 2], ['m', 2]]);
  });
});

describe('parse resolves CTE names as XTDB does', () => {
  test('a WITH entry sees only earlier entries', () => {
    expect(copiesOf(`
      WITH a AS (SELECT * FROM b),
           b AS (SELECT * FROM t)
      SELECT * FROM a`)).toEqual([['query', 1], ['a', 1], ['b', 0]]);
  });

  test('a nested WITH shadows an outer CTE of the same name', () => {
    expect(copiesOf(`
      WITH a AS (SELECT * FROM t)
      SELECT * FROM (WITH a AS (SELECT * FROM u) SELECT * FROM a, a AS a2) AS x, a`))
      .toEqual([['query', 1], ['a', 1], ['a', 2]]);
  });

  test('a CTE matches only a one-part name', () => {
    expect(copiesOf('WITH a AS (SELECT * FROM t) SELECT * FROM s.a')).toEqual([['query', 1], ['a', 0]]);
  });

  test('unquoted names are case-folded; delimited names are verbatim', () => {
    expect(copiesOf('WITH Foo AS (SELECT * FROM t) SELECT * FROM FOO, "foo", "Foo"')).toEqual([['query', 1], ['foo', 2]]);
  });

  test('a dollar-quoted string is text, not SQL', () => {
    expect(copiesOf(`
      WITH a AS (SELECT $tag$ FROM a, a $tag$ AS s FROM t)
      SELECT * FROM a`)).toEqual([['query', 1], ['a', 1]]);
  });

  test('every table reference counts, including in subqueries and set operations', () => {
    expect(copiesOf(`
      WITH a AS (SELECT * FROM t)
      SELECT * FROM a WHERE x IN (SELECT y FROM a)
      UNION ALL SELECT * FROM a`)).toEqual([['query', 1], ['a', 3]]);
  });
});

describe('parse rejects', () => {
  test('a syntax error, with where it is', () => {
    expect(parse('SELECT * FROM')).toEqual({ ok: false, error: expect.stringMatching(/^Line 1:\d+: /) });
  });

  test('a statement that is not a query', () => {
    expect(parse('INSERT INTO t (a) VALUES (1)')).toEqual({ ok: false, error: 'Only a query can be analysed.' });
  });
});
