import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { declared, scans } from '../../../lib/cte/model.ts';
import { materializedBy, postgresRule } from '../../../lib/cte/postgres.ts';
import { QueryInput } from '../../../lib/cte/QueryInput.jsx';
import { withMaterialized } from '../../../lib/cte/rewrite.ts';
import { useParser } from '../../../lib/cte/useParser.js';

const DID = {
  declared: 'already MATERIALIZED',
  materialize: 'MATERIALIZED',
  inline: 'inlined',
  unread: 'left alone: never read',
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* the query is still in the box above it, to select by hand */ }
  };
  return <button className="pixel-button" onClick={copy}>{copied ? 'Copied' : 'Copy SQL'}</button>;
}

function Result({ model }) {
  const rulings = useMemo(() => postgresRule(model), [model]);
  const after = useMemo(() => materializedBy(rulings), [rulings]);
  const sql = useMemo(() => withMaterialized(model, after), [model, after]);

  return (
    <section className="mt-6 flex flex-col gap-2">
      <p>
        <span className="pixel-num text-heading">{scans(model, declared(model))}</span> table scans as written
        → <span className="pixel-num text-heading">{scans(model, after)}</span> after the rule.
      </p>
      <SectionLabel className="mt-4" action={<CopyButton text={sql} />}>After the rule</SectionLabel>
      <textarea className="pixel-field w-full font-pixel text-pixel block" rows={12} spellCheck={false} readOnly
        aria-label="The query after the rule" value={sql} />
      <SectionLabel className="mt-4">What the rule did</SectionLabel>
      {rulings.length === 0
        ? <p className="text-sm opacity-70">The query has no CTEs.</p>
        : (
          <table className="pixel-table">
            <thead>
              <tr>
                <th>CTE</th>
                <th className="text-right">referenced</th>
                <th>the rule</th>
              </tr>
            </thead>
            <tbody>
              {rulings.map(({ cte, references, action }) => (
                <tr key={cte.id}>
                  <td>{cte.name}</td>
                  <td className="text-right pixel-num">{references}</td>
                  <td>{DID[action]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
    </section>
  );
}

export function App() {
  const [sql, setSql] = useState('');
  const [state, run] = useParser();

  return (
    <main className="flex flex-col gap-2">
      <h1 className="page-title">Materialise Like Postgres</h1>
      <p className="page-sub">
        XTDB copies a CTE into the plan at every reference, unless it's MATERIALIZED. Postgres materialises a CTE that's
        referenced more than once, and inlines the rest. Paste a query to write that rule into it. It's parsed here, in
        your browser.
      </p>
      <QueryInput sql={sql} onChange={setSql} parsing={state.kind === 'parsing'} onAnalyse={run} />
      {state.kind === 'parsed' && (state.parsed.ok
        ? <Result model={state.parsed.model} />
        : <p className="label"><span className="pixel-alert-text" data-variant="danger">{state.parsed.error}</span></p>)}
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
