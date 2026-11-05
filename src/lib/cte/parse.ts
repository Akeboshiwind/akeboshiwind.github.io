import { BaseErrorListener, CharStream, CommonTokenStream, type ParseTree } from 'antlr4ng';
import {
  BaseTableContext, DelimitedIdentifierContext, QueryExprContext, QueryExpressionContext, Sql, type IdentifierContext,
} from './xtdb-sql/Sql.ts';
import { SqlLexer } from './xtdb-sql/SqlLexer.ts';
import type { Cte, Def, Model, Query } from './model.ts';

export type Parsed = { ok: true; model: Model } | { ok: false; error: string };

// xtdb.util.NormalForm/normalForm0, at the commit in xtdb-sql/README.md.
const normalForm = (s: string): string =>
  s.replaceAll('-', '_').replace(/^xt\//, '_').split(/[./$]/).join('$').toLowerCase();

// xtdb.sql/identifier-sym: delimited identifiers keep their text verbatim, quotes stripped.
const identifierName = (id: IdentifierContext): string => {
  const text = id.getText();
  return id instanceof DelimitedIdentifierContext ? text.slice(1, -1) : normalForm(text);
};

class FirstError extends BaseErrorListener {
  error: string | null = null;

  override syntaxError(_r: unknown, _s: unknown, line: number, column: number, msg: string): void {
    this.error ??= `Line ${line}:${column}: ${msg}`;
  }
}

export function parse(sql: string): Parsed {
  const errors = new FirstError();
  const lexer = new SqlLexer(CharStream.fromString(sql));
  const parser = new Sql(new CommonTokenStream(lexer));
  for (const recognizer of [lexer, parser]) {
    recognizer.removeErrorListeners();
    recognizer.addErrorListener(errors);
  }
  const statement = parser.directSqlStatement().directlyExecutableStatement();

  if (errors.error) return { ok: false, error: errors.error };
  if (!(statement instanceof QueryExprContext)) return { ok: false, error: 'Only a query can be analysed.' };

  const query: Query = { kind: 'query', id: 0, refs: new Map() };
  const defs: Model['defs'] = [query];
  type Scope = ReadonlyMap<string, Cte>;

  const walk = (node: ParseTree, scope: Scope, body: Def): void => {
    if (node instanceof QueryExpressionContext && node.withClause()) {
      let inner = scope;
      for (const element of node.withClause()!.withListElement()) {
        const cte: Cte = {
          kind: 'cte', id: defs.length, name: identifierName(element._queryName!), definer: body.id,
          materialized: element.MATERIALIZED() !== null, refs: new Map(),
        };
        defs.push(cte);
        walk(element.subquery()!, inner, cte);
        inner = new Map(inner).set(cte.name, cte);
      }
      walk(node.queryExpressionNoWith(), inner, body);
      return;
    }
    if (node instanceof BaseTableContext) {
      const parts = node.fromTableRef().identifier();
      const cte = parts.length === 1 ? scope.get(identifierName(parts[0])) : undefined;
      if (cte) body.refs.set(cte, (body.refs.get(cte) ?? 0) + 1);
    }
    for (let i = 0; i < node.getChildCount(); i++) walk(node.getChild(i)!, scope, body);
  };

  walk(statement, new Map(), query);
  return { ok: true, model: { defs } };
}
