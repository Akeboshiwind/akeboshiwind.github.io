# XTDB SQL grammar

`Sql.g4` and `SqlLexer.g4` are [XTDB](https://github.com/xtdb/xtdb)'s SQL grammar at commit `f39c90176de7b01c03de09b968ff30a3b35d4610`, unchanged,
from [`core/src/main/antlr/xtdb/antlr`](https://github.com/xtdb/xtdb/tree/f39c90176de7b01c03de09b968ff30a3b35d4610/core/src/main/antlr/xtdb/antlr).
They, the patches to them in `patches/`, and the parser ANTLR generates here are under the Mozilla Public License 2.0 (`LICENSE`).

`npm run cte-grammar -- f39c90176de7b01c03de09b968ff30a3b35d4610` (`scripts/cte-grammar.js`) fetches the grammar and generates `Sql.ts` and `SqlLexer.ts`
from it with these patches applied, in order; each says at its top what it changes and why:

- `patches/1-typescript.patch`

Change the patches, not the generated files.
