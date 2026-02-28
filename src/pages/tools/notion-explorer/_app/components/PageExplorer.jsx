import { useState } from 'react';
import { getPage, getBlockChildren } from '../notion.js';
import { extractNotionId, getTitle, formatDate } from '../utils.js';
import { BlockList } from './BlockRenderer.jsx';

export default function PageExplorer({ apiKey }) {
  const [input, setInput] = useState('');
  const [page, setPage] = useState(null);
  const [blocks, setBlocks] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showRaw, setShowRaw] = useState(false);

  const loadPage = async (idOrUrl, pushHistory = false) => {
    const id = extractNotionId(idOrUrl);
    if (!id) {
      setError(
        'Could not parse a Notion ID from that input. Paste a page URL or the 32-character ID.'
      );
      return;
    }

    setLoading(true);
    setError(null);
    setBlocks(null);
    setShowRaw(false);

    try {
      const [pageData, blocksData] = await Promise.all([
        getPage(apiKey, id),
        getBlockChildren(apiKey, id),
      ]);

      if (pushHistory && page) {
        setHistory(h => [...h, { id: page.id, title: getTitle(page) }]);
      }

      setPage(pageData);
      setBlocks(blocksData.results);
    } catch (err) {
      setError(err.message);
      setPage(null);
    } finally {
      setLoading(false);
    }
  };

  const navigateToChild = childId => {
    loadPage(childId, true);
  };

  const navigateBack = (item, idx) => {
    setHistory(h => h.slice(0, idx));
    loadPage(item.id, false);
  };

  const handleSubmit = e => {
    e.preventDefault();
    setHistory([]);
    loadPage(input.trim(), false);
  };

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Load any page by URL or ID to read its content and navigate child pages.{' '}
        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
          GET /pages/:id
        </span>{' '}
        +{' '}
        <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
          GET /blocks/:id/children
        </span>
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste a Notion page URL or ID…"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? 'Loading…' : 'Load'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {history.length > 0 && (
        <nav className="flex items-center gap-1 text-sm mb-4 flex-wrap">
          {history.map((item, i) => (
            <span key={item.id} className="flex items-center gap-1">
              <button
                onClick={() => navigateBack(item, i)}
                className="text-blue-500 hover:underline max-w-40 truncate"
              >
                {item.title}
              </button>
              <span className="text-gray-400">›</span>
            </span>
          ))}
          {page && (
            <span className="font-medium text-gray-700 dark:text-gray-300">
              {getTitle(page)}
            </span>
          )}
        </nav>
      )}

      {page && (
        <div>
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {getTitle(page)}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {page.object} · Created {formatDate(page.created_time)} ·
                  Edited {formatDate(page.last_edited_time)}
                </p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {page.id}
                </p>
              </div>
              <button
                onClick={() => setShowRaw(r => !r)}
                className="text-xs text-blue-500 hover:underline whitespace-nowrap shrink-0"
              >
                {showRaw ? 'Show content' : 'Raw JSON'}
              </button>
            </div>
          </div>

          {showRaw ? (
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-[32rem]">
              {JSON.stringify({ page, blocks }, null, 2)}
            </pre>
          ) : (
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
              <BlockList blocks={blocks} onNavigate={navigateToChild} />
            </div>
          )}
        </div>
      )}

      {!page && !loading && !error && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">📄</p>
          <p className="font-medium">Explore a Notion page</p>
          <p className="text-sm mt-1">
            Paste any page URL or ID above. Click child pages in the rendered
            content to navigate the hierarchy.
          </p>
        </div>
      )}
    </div>
  );
}
