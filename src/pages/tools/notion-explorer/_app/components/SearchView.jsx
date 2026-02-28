import { useState } from 'react';
import { searchNotion } from '../notion.js';
import { getTitle, formatDate } from '../utils.js';

const FILTERS = [
  { label: 'All', value: null },
  { label: 'Pages', value: 'page' },
  { label: 'Databases', value: 'database' },
];

export default function SearchView({ apiKey }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async e => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await searchNotion(apiKey, query, filter);
      setResults(data.results);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Search across all pages and databases your integration has access to.
        Leave the query empty to list everything.{' '}
        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
          POST /search
        </span>
      </p>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search your workspace…"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      <div className="flex gap-2 mb-6">
        {FILTERS.map(opt => (
          <button
            key={String(opt.value)}
            onClick={() => setFilter(opt.value)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              filter === opt.value
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {results !== null && (
        <div>
          <p className="text-sm text-gray-400 mb-3">{results.length} results</p>
          {results.length === 0 ? (
            <p className="text-gray-400 italic text-sm">
              No results. Make sure pages are shared with your integration in
              Notion.
            </p>
          ) : (
            <div className="space-y-2">
              {results.map(item => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2">
                    <span>{item.object === 'database' ? '🗄️' : '📄'}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {getTitle(item) || 'Untitled'}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                      {item.object}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    Last edited {formatDate(item.last_edited_time)} ·{' '}
                    <code className="font-mono">{item.id}</code>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {results === null && !loading && !error && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-medium">Search your Notion workspace</p>
          <p className="text-sm mt-1">
            Leave the query empty and click Search to see all accessible
            content.
          </p>
        </div>
      )}
    </div>
  );
}
