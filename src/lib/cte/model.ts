/** Index into `Model.defs`. */
export type DefId = number;

/** What one body reads directly: the CTEs it names, with how many times it names each. */
interface Body {
  id: DefId;
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
}

export type Def = Query | Cte;

export interface Model {
  defs: [Query, ...Cte[]];
}

/**
 * Copies of each body, by id, in the plan XTDB makes of the query as written. Inlining plans a CTE's body at each
 * reference, so copies multiply along paths from the query; a MATERIALIZED CTE is planned once inside its definer,
 * wherever it's read.
 */
export function copies({ defs }: Model): number[] {
  const readers = defs.map((): [Def, number][] => []);
  for (const d of defs) for (const [cte, n] of d.refs) if (!cte.materialized) readers[cte.id].push([d, n]);
  for (const d of defs) if (d.kind === 'cte' && d.materialized) readers[d.id].push([defs[d.definer], 1]);

  const seen = new Map<DefId, number>();
  // A CTE can't read itself, so this ends.
  const of = (id: DefId): number => {
    if (!seen.has(id)) seen.set(id, id === 0 ? 1 : readers[id].reduce((sum, [d, n]) => sum + of(d.id) * n, 0));
    return seen.get(id)!;
  };
  return defs.map((d) => of(d.id));
}
