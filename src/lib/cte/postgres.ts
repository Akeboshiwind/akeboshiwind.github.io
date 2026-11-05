import type { Cte, Model } from './model.ts';

/**
 * What Postgres's rule does with a CTE: one the query declares MATERIALIZED stays so; one referenced twice or more is
 * materialised; one referenced once is inlined; one never referenced is left alone, as materialising it would force
 * its evaluation.
 */
export type Action = 'declared' | 'materialize' | 'inline' | 'unread';

export interface Ruling {
  cte: Cte;
  /** Places the statement names it, wherever they are: a reference inside an unread CTE still counts. */
  references: number;
  action: Action;
}

const actionFor = (cte: Cte, references: number): Action => {
  if (cte.materialized) return 'declared';
  if (references >= 2) return 'materialize';
  return references === 1 ? 'inline' : 'unread';
};

/** Each CTE, in the order defined, with what Postgres's rule does with it. */
export function postgresRule({ defs }: Model): Ruling[] {
  const references = new Map<Cte, number>();
  for (const d of defs) for (const [cte, n] of d.refs) references.set(cte, (references.get(cte) ?? 0) + n);
  return defs.flatMap((d) => {
    if (d.kind !== 'cte') return [];
    const n = references.get(d) ?? 0;
    return [{ cte: d, references: n, action: actionFor(d, n) }];
  });
}

/** The CTEs MATERIALIZED once the rule is applied: those it materialises, and those already declared so. */
export const materializedBy = (rulings: Ruling[]): Set<Cte> =>
  new Set(rulings.filter((r) => r.action === 'declared' || r.action === 'materialize').map((r) => r.cte));
