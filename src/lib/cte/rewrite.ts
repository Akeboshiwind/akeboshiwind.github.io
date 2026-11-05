import type { Cte, Model } from './model.ts';

/**
 * The query's text with MATERIALIZED written into each CTE in `materialized` that doesn't declare it, and nothing
 * else changed. Offsets count code points, as ANTLR does, so an emoji earlier in the text doesn't shift them.
 */
export function withMaterialized({ sql }: Model, materialized: ReadonlySet<Cte>): string {
  const chars = [...sql];
  const starts = [...materialized].filter((cte) => !cte.materialized).map((cte) => cte.start);
  for (const at of starts.sort((x, y) => y - x)) chars.splice(at, 0, 'MATERIALIZED ');
  return chars.join('');
}
