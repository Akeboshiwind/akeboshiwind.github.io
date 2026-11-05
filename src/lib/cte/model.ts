/** Index into `Model.defs`. */
export type DefId = number;

/** What one body reads directly: base tables, and the CTEs it names with how many times it names each. */
interface Body {
  id: DefId;
  /** Base tables it names, each a scan. */
  scans: number;
  refs: Map<Cte, number>;
}

/** The statement's own query, outside every WITH. Always `defs[0]`. */
export interface Query extends Body {
  kind: 'query';
}

export interface Cte extends Body {
  kind: 'cte';
  name: string;
  /** The body whose WITH declares this CTE. */
  definer: DefId;
  materialized: boolean;
  /** Where its WITH entry starts in `Model.sql`, counted in code points as ANTLR counts them. */
  start: number;
}

export type Def = Query | Cte;

export interface Model {
  /** The text it was parsed from. */
  sql: string;
  defs: [Query, ...Cte[]];
}

export const declared = ({ defs }: Model): Set<Cte> =>
  new Set(defs.filter((d): d is Cte => d.kind === 'cte' && d.materialized));

/**
 * Copies of each body, by id, in the plan XTDB makes of the query with `materialized` MATERIALIZED — as written,
 * unless told otherwise. Inlining plans a CTE's body at each reference, so copies multiply along paths from the query;
 * a MATERIALIZED CTE is planned once inside its definer, wherever it's read.
 */
export function copies(model: Model, materialized: ReadonlySet<Cte> = declared(model)): number[] {
  const { defs } = model;
  const readers = defs.map((): [Def, number][] => []);
  for (const d of defs) for (const [cte, n] of d.refs) if (!materialized.has(cte)) readers[cte.id].push([d, n]);
  for (const cte of materialized) readers[cte.id].push([defs[cte.definer], 1]);

  const seen = new Map<DefId, number>();
  // A CTE can't read itself, so this ends.
  const of = (id: DefId): number => {
    if (!seen.has(id)) seen.set(id, id === 0 ? 1 : readers[id].reduce((sum, [d, n]) => sum + of(d.id) * n, 0));
    return seen.get(id)!;
  };
  return defs.map((d) => of(d.id));
}

/** Base-table scans in the plan with `materialized` MATERIALIZED: each body's scans, once per copy of it. */
export function scans(model: Model, materialized: ReadonlySet<Cte>): number {
  const n = copies(model, materialized);
  return model.defs.reduce((sum, d) => sum + n[d.id] * d.scans, 0);
}
