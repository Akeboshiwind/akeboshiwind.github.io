import { useState } from 'react';

export function ApiKeyView({ onSave }) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed) {
      setError('Please enter your integration token.');
      return;
    }
    if (!trimmed.startsWith('secret_') && !trimmed.startsWith('ntn_')) {
      setError('Notion tokens typically start with "secret_" or "ntn_".');
      return;
    }
    onSave(trimmed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Notion API Explorer
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          Explore your Notion workspace interactively — search content, browse
          databases, and read page blocks.
        </p>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-5 text-sm">
          <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">
            Dev-mode only
          </p>
          <p className="text-amber-700 dark:text-amber-400">
            The Notion API blocks direct browser requests (CORS). This tool
            routes calls through a local Vite proxy, so it only works when
            running{' '}
            <code className="bg-amber-100 dark:bg-amber-900 px-1 rounded">
              npm run dev
            </code>
            .
          </p>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-sm">
          <p className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
            Get your integration token
          </p>
          <ol className="text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
            <li>
              Go to{' '}
              <a
                href="https://www.notion.so/my-integrations"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                notion.so/my-integrations
              </a>
            </li>
            <li>Create a new internal integration</li>
            <li>Copy the "Internal Integration Token"</li>
            <li>
              In Notion, share the pages/databases you want to access with the
              integration (via the "..." menu)
            </li>
          </ol>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={key}
            onChange={e => {
              setKey(e.target.value);
              setError('');
            }}
            placeholder="secret_..."
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <p className="text-xs text-gray-400">
            Stored in browser localStorage. Only sent via your local proxy to
            the Notion API — never to any third-party server.
          </p>
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            Connect
          </button>
        </form>
      </div>
    </div>
  );
}
