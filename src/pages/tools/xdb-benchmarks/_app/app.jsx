import React, { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import { fetchAllBenchmarkRuns, BENCHMARK_WORKFLOWS } from './github.js';
import {
  queryLogAnalytics,
  getWorkspaceId,
  laResultToRows,
  SAMPLE_QUERIES,
  WORKSPACE_NAME,
} from './azure.js';

// ── Small UI primitives ────────────────────────────────────────────────────

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {children}
    </div>
  );
}

function Badge({ label, variant = 'gray' }) {
  const colors = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failure: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    gray:    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
    blue:    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    yellow:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[variant]}`}>
      {label}
    </span>
  );
}

function conclusionBadge(conclusion) {
  if (conclusion === 'success') return <Badge label="success" variant="success" />;
  if (conclusion === 'failure') return <Badge label="failure" variant="failure" />;
  if (!conclusion) return <Badge label="running" variant="yellow" />;
  return <Badge label={conclusion} variant="gray" />;
}

function eventBadge(event) {
  if (event === 'schedule') return <Badge label="nightly" variant="blue" />;
  if (event === 'workflow_dispatch') return <Badge label="manual" variant="gray" />;
  return <Badge label={event} variant="gray" />;
}

function fmtDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

// ── GitHub runs section ────────────────────────────────────────────────────

function WorkflowRunsTable({ wf, runs }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? runs : runs.slice(0, 5);
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-sm mb-2 text-gray-700 dark:text-gray-300">
        {wf.name}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="py-1 pr-3">Date</th>
              <th className="py-1 pr-3">Trigger</th>
              <th className="py-1 pr-3">Result</th>
              <th className="py-1 pr-3">Branch</th>
              <th className="py-1">Run ID</th>
            </tr>
          </thead>
          <tbody>
            {visible.map(r => (
              <tr key={r.id} className="border-b border-gray-100 dark:border-gray-700/50">
                <td className="py-1 pr-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {fmtDate(r.createdAt)}
                </td>
                <td className="py-1 pr-3">{eventBadge(r.event)}</td>
                <td className="py-1 pr-3">{conclusionBadge(r.conclusion)}</td>
                <td className="py-1 pr-3 text-gray-600 dark:text-gray-400 font-mono">{r.headBranch}</td>
                <td className="py-1">
                  <a href={r.htmlUrl} target="_blank" rel="noreferrer"
                     className="text-blue-600 dark:text-blue-400 hover:underline font-mono">
                    #{r.runNumber}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {runs.length > 5 && (
        <button onClick={() => setExpanded(!expanded)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1">
          {expanded ? 'Show less' : `Show all ${runs.length} runs`}
        </button>
      )}
    </div>
  );
}

function GitHubSection() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchAllBenchmarkRuns({ perPage: 14 });
      setData(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Card className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            GitHub Actions — Benchmark Runs
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Public API · xtdb/xtdb · No auth required
          </p>
        </div>
        <button onClick={load} disabled={loading}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-md">
          {loading ? 'Loading…' : data ? 'Refresh' : 'Fetch Runs'}
        </button>
      </div>

      {error && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 rounded p-3 mb-4">
          {error}
        </div>
      )}

      {data && (
        <div>
          {data.map(({ workflow: wf, runs, error: wfErr }) => (
            <div key={wf.id}>
              {wfErr ? (
                <p className="text-xs text-red-500 mb-2">{wf.name}: {wfErr}</p>
              ) : (
                <WorkflowRunsTable wf={wf} runs={runs} />
              )}
            </div>
          ))}
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-xs text-gray-600 dark:text-gray-400">
            <strong>What we get:</strong> Run IDs, dates, trigger type (nightly schedule vs manual),
            branch, status. The run ID links benchmark runs to Log Analytics log entries
            via the <code>github-run-id</code> field.
          </div>
        </div>
      )}
    </Card>
  );
}

// ── Azure Log Analytics section ────────────────────────────────────────────

function AzureSection() {
  const [token, setToken] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState(null);
  const [selectedQuery, setSelectedQuery] = useState('overview');
  const [customKql, setCustomKql] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [querying, setQuerying] = useState(false);

  const resolveWorkspace = useCallback(async () => {
    if (!token) return;
    setResolving(true);
    setResolveError(null);
    try {
      const id = await getWorkspaceId(token);
      if (!id) throw new Error('Could not find workspace ID in response');
      setWorkspaceId(id);
    } catch (e) {
      setResolveError(e.message);
    } finally {
      setResolving(false);
    }
  }, [token]);

  const runQuery = useCallback(async () => {
    if (!token || !workspaceId) return;
    setQuerying(true);
    setQueryError(null);
    setQueryResult(null);
    const kql = selectedQuery === 'custom'
      ? customKql
      : SAMPLE_QUERIES[selectedQuery];
    try {
      const raw = await queryLogAnalytics(workspaceId, kql, token);
      const rows = laResultToRows(raw);
      setQueryResult({ raw, rows });
    } catch (e) {
      setQueryError(e.message);
    } finally {
      setQuerying(false);
    }
  }, [token, workspaceId, selectedQuery, customKql]);

  return (
    <Card className="mb-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Azure Log Analytics — Benchmark Metrics
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Workspace: <code className="font-mono">{WORKSPACE_NAME}</code> · Requires Azure token
        </p>
      </div>

      {/* Token input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Azure Bearer Token
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          Get one with:{' '}
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">
            az account get-access-token --resource https://api.loganalytics.io --query accessToken -o tsv
          </code>
        </p>
        <textarea
          className="w-full h-20 font-mono text-xs border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
          placeholder="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6Ik..."
          value={token}
          onChange={e => setToken(e.target.value.trim())}
        />
      </div>

      {/* Workspace ID */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Workspace GUID
        </label>
        <div className="flex gap-2">
          <input
            className="flex-1 font-mono text-xs border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            value={workspaceId}
            onChange={e => setWorkspaceId(e.target.value.trim())}
          />
          <button onClick={resolveWorkspace} disabled={!token || resolving}
                  className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white text-sm rounded-md whitespace-nowrap">
            {resolving ? 'Resolving…' : 'Resolve from token'}
          </button>
        </div>
        {resolveError && (
          <p className="text-xs text-red-500 mt-1">{resolveError}</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Or get it with:{' '}
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">
            az monitor log-analytics workspace show --workspace-name {WORKSPACE_NAME} --resource-group cloud-benchmark-resources --query customerId -o tsv
          </code>
        </p>
      </div>

      {/* Query selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sample Query
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {Object.keys(SAMPLE_QUERIES).map(k => (
            <button key={k} onClick={() => setSelectedQuery(k)}
                    className={`px-3 py-1 text-sm rounded-md border ${
                      selectedQuery === k
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}>
              {k}
            </button>
          ))}
          <button onClick={() => setSelectedQuery('custom')}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    selectedQuery === 'custom'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}>
            custom
          </button>
        </div>

        <pre className={`text-xs font-mono bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3 overflow-x-auto whitespace-pre-wrap ${selectedQuery === 'custom' ? 'hidden' : ''}`}>
          {SAMPLE_QUERIES[selectedQuery]}
        </pre>

        {selectedQuery === 'custom' && (
          <textarea
            className="w-full h-40 font-mono text-xs border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-y"
            placeholder="ContainerLog | ..."
            value={customKql}
            onChange={e => setCustomKql(e.target.value)}
          />
        )}
      </div>

      <button onClick={runQuery} disabled={!token || !workspaceId || querying}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm rounded-md mb-4">
        {querying ? 'Querying…' : 'Run Query'}
      </button>

      {queryError && (
        <div className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 rounded p-3 mb-4">
          {queryError}
        </div>
      )}

      {queryResult && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Results — {queryResult.rows.length} rows
            </h3>
          </div>

          {queryResult.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                    {Object.keys(queryResult.rows[0]).map(col => (
                      <th key={col} className="py-1 pr-3 font-medium">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {queryResult.rows.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-700/50">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="py-1 pr-3 text-gray-600 dark:text-gray-400 font-mono">
                          {typeof val === 'number' ? val.toFixed(3) : String(val ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No rows returned.</p>
          )}

          <details className="mt-3">
            <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
              Raw JSON response
            </summary>
            <pre className="text-xs font-mono bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-3 mt-2 overflow-x-auto max-h-64">
              {JSON.stringify(queryResult.raw, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </Card>
  );
}

// ── Data architecture notes ────────────────────────────────────────────────

function ArchitectureCard() {
  return (
    <Card className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Data Architecture
      </h2>
      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
        <p>
          <strong className="text-gray-800 dark:text-gray-200">Benchmark runs</strong>
          {' '}deploy on Azure Kubernetes via Helm. Each benchmark binary outputs structured
          JSON logs that get shipped to <strong className="text-gray-800 dark:text-gray-200">Azure Log Analytics</strong>
          {' '}(ContainerLog table).
        </p>
        <p>
          <strong className="text-gray-800 dark:text-gray-200">Log entry schema:</strong>
          {' '}Each entry has <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">benchmark</code>,{' '}
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">step</code>,{' '}
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">metric</code>,{' '}
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">time-taken-ms</code>,{' '}
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">github-run-id</code>,{' '}
          <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">git-branch</code>,{' '}
          plus benchmark-specific <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">parameters</code>.
        </p>
        <p>
          <strong className="text-gray-800 dark:text-gray-200">Linking:</strong>
          {' '}GitHub run IDs from the Actions API can be cross-referenced with
          {' '}<code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">log['github-run-id']</code>
          {' '}in Log Analytics to join run metadata (trigger type, date) with actual metrics.
        </p>
        <p>
          <strong className="text-gray-800 dark:text-gray-200">Nightly vs manual:</strong>
          {' '}GitHub Actions <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">event</code>
          {' '}field distinguishes <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">schedule</code>
          {' '}(nightly) from <code className="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">workflow_dispatch</code>
          {' '}(manual) runs — exactly what's needed to filter "daily runs" vs one-off comparisons.
        </p>
      </div>
    </Card>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            XTDB Benchmark Dashboard — Data Validation
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Validates that benchmark data can be queried from the browser.
          </p>
        </div>

        <ArchitectureCard />
        <GitHubSection />
        <AzureSection />
      </div>
    </div>
  );
}

createRoot(document.getElementById('app')).render(<App />);
