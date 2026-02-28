import { useState } from 'react';
import { listDatabases, queryDatabase } from '../notion.js';
import { getTitle, formatDate, richTextToString } from '../utils.js';

function getCellValue(prop) {
  switch (prop?.type) {
    case 'title':
      return richTextToString(prop.title) || '—';
    case 'rich_text':
      return richTextToString(prop.rich_text) || '—';
    case 'number':
      return prop.number != null ? String(prop.number) : '—';
    case 'select':
      return prop.select?.name ?? '—';
    case 'multi_select':
      return prop.multi_select?.map(s => s.name).join(', ') || '—';
    case 'date':
      return prop.date?.start ?? '—';
    case 'checkbox':
      return prop.checkbox ? '✓' : '✗';
    case 'url':
      return prop.url ?? '—';
    case 'email':
      return prop.email ?? '—';
    case 'phone_number':
      return prop.phone_number ?? '—';
    case 'status':
      return prop.status?.name ?? '—';
    case 'people':
      return prop.people?.map(p => p.name || p.id).join(', ') || '—';
    case 'formula':
      return prop.formula?.string ?? prop.formula?.number ?? '—';
    default:
      return `[${prop?.type ?? '?'}]`;
  }
}

function DatabaseCard({ db, apiKey }) {
  const [expanded, setExpanded] = useState(false);
  const [entries, setEntries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showRaw, setShowRaw] = useState(false);

  const title = getTitle(db);
  const propNames = Object.keys(db.properties || {});

  const loadEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await queryDatabase(apiKey, db.id);
      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-left transition-colors"
      >
        <span className="text-xl">🗄️</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
            {title || 'Untitled'}
          </p>
          <p className="text-xs text-gray-400">
            {propNames.length} properties · edited {formatDate(db.last_edited_time)}
          </p>
        </div>
        <span className="text-gray-400 text-sm">{expanded ? '▲' : '▼'}</span>
      </button>

      {expanded && (
        <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Properties schema
          </h3>
          <div className="flex flex-wrap gap-1.5 mb-5">
            {propNames.map(name => (
              <span
                key={name}
                className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-2 py-0.5 text-gray-600 dark:text-gray-400"
              >
                <span className="text-gray-400">{db.properties[name].type}:</span>{' '}
                {name}
              </span>
            ))}
          </div>

          {entries === null ? (
            <button
              onClick={loadEntries}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
            >
              {loading ? 'Loading…' : 'Query entries'}
            </button>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-500">
                  {entries.results?.length ?? 0} entries
                  {entries.has_more && ' (more available)'}
                </span>
                <button
                  onClick={() => setShowRaw(r => !r)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  {showRaw ? 'Show table' : 'Show raw JSON'}
                </button>
                <button
                  onClick={loadEntries}
                  disabled={loading}
                  className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ↻ Refresh
                </button>
              </div>

              {showRaw ? (
                <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto max-h-96">
                  {JSON.stringify(entries, null, 2)}
                </pre>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        {propNames.slice(0, 6).map(name => (
                          <th
                            key={name}
                            className="text-left py-2 pr-4 text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap"
                          >
                            {name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(entries.results || []).map(row => (
                        <tr
                          key={row.id}
                          className="border-b border-gray-100 dark:border-gray-800"
                        >
                          {propNames.slice(0, 6).map(name => (
                            <td
                              key={name}
                              className="py-2 pr-4 text-gray-700 dark:text-gray-300 text-xs max-w-48 truncate"
                              title={getCellValue(row.properties[name])}
                            >
                              {getCellValue(row.properties[name])}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {propNames.length > 6 && (
                    <p className="text-xs text-gray-400 mt-2">
                      Showing first 6 of {propNames.length} columns
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function DatabasesView({ apiKey }) {
  const [databases, setDatabases] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDatabases(apiKey);
      setDatabases(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Browse all databases your integration can access. Expand one to see its
        property schema, then query its entries.{' '}
        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
          POST /search
        </span>{' '}
        +{' '}
        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
          POST /databases/:id/query
        </span>
      </p>

      {databases === null ? (
        <button
          onClick={load}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? 'Loading…' : 'Load databases'}
        </button>
      ) : (
        <button
          onClick={load}
          disabled={loading}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-4 block"
        >
          {loading ? 'Refreshing…' : '↻ Refresh'}
        </button>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {databases !== null && (
        <div className="mt-4 space-y-3">
          {databases.length === 0 ? (
            <p className="text-gray-400 italic text-sm">
              No databases found. Share databases with your integration in
              Notion via the "..." menu on each database.
            </p>
          ) : (
            databases.map(db => (
              <DatabaseCard key={db.id} db={db} apiKey={apiKey} />
            ))
          )}
        </div>
      )}

      {databases === null && !loading && !error && (
        <div className="text-center py-16 text-gray-400 mt-4">
          <p className="text-5xl mb-4">🗄️</p>
          <p className="font-medium">Browse your Notion databases</p>
          <p className="text-sm mt-1">
            Click "Load databases" to see all databases shared with your
            integration.
          </p>
        </div>
      )}
    </div>
  );
}
