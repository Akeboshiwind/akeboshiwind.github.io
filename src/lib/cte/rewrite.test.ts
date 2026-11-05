import { describe, test, expect } from 'vitest';
import { declared, scans, type Cte, type Model } from './model.ts';
import { parse } from './parse.ts';
import { withMaterialized } from './rewrite.ts';

const model = (sql: string): Model => {
  const parsed = parse(sql);
  if (!parsed.ok) throw new Error(parsed.error);
  return parsed.model;
};

const ctes = (m: Model) => m.defs.filter((d): d is Cte => d.kind === 'cte');
const ids = (set: Set<Cte>) => [...set].map((c) => c.id).sort();

describe('withMaterialized', () => {
  const SQL = `-- 🪨 a comment before the WITH
WITH a AS (SELECT * FROM t),  /* a's readers: 🌱 */
     MATERIALIZED "B" AS (SELECT * FROM a, a AS a2),
     c AS (
       WITH d AS (SELECT * FROM "B") SELECT * FROM d, d AS d2
     )
SELECT * FROM c, c AS c2, "B"`;

  test('writes MATERIALIZED into the CTEs given that lack it, keeping the rest of the text as it is', () => {
    const m = model(SQL);
    const [a, b, , d] = ctes(m);
    expect(withMaterialized(m, new Set([a, b, d]))).toBe(`-- 🪨 a comment before the WITH
WITH MATERIALIZED a AS (SELECT * FROM t),  /* a's readers: 🌱 */
     MATERIALIZED "B" AS (SELECT * FROM a, a AS a2),
     c AS (
       WITH MATERIALIZED d AS (SELECT * FROM "B") SELECT * FROM d, d AS d2
     )
SELECT * FROM c, c AS c2, "B"`);
  });

  test('reparses to a query declaring exactly those CTEs, with the same scans, for every set of them', () => {
    const m = model(SQL);
    const all = ctes(m);
    for (let bits = 0; bits < 1 << all.length; bits++) {
      const set = new Set([...declared(m), ...all.filter((_, i) => bits & (1 << i))]);
      const again = model(withMaterialized(m, set));
      expect(ids(declared(again))).toEqual(ids(set));
      expect(scans(again, declared(again))).toBe(scans(m, set));
    }
  });
});
