import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { copies } from '../../../lib/cte/model.ts';
import { QueryInput } from '../../../lib/cte/QueryInput.jsx';
import { useParser } from '../../../lib/cte/useParser.js';
import { Dag, Key } from './dag.jsx';

function Graph({ model }) {
  const n = useMemo(() => copies(model), [model]);
  return (
    <section className="mt-6 flex flex-col gap-2">
      <Key />
      <Dag model={model} copies={n} />
    </section>
  );
}

export function App() {
  const [sql, setSql] = useState('');
  const [state, run] = useParser();

  return (
    <main className="flex flex-col gap-2">
      <h1 className="page-title">CTE Graph</h1>
      <p className="page-sub">
        XTDB copies a CTE into the plan at every reference, unless it's MATERIALIZED. Paste a query to see its CTEs as a
        graph, with how many copies of each the plan gets. It's parsed here, in your browser.
      </p>
      <QueryInput sql={sql} onChange={setSql} parsing={state.kind === 'parsing'} onAnalyse={run} />
      {state.kind === 'parsed' && (state.parsed.ok
        ? <Graph model={state.parsed.model} />
        : <p className="label"><span className="pixel-alert-text" data-variant="danger">{state.parsed.error}</span></p>)}
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
