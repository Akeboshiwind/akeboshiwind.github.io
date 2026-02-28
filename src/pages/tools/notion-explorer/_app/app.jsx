import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocalStorage } from './hooks.js';
import { ApiKeyView } from './components/ApiKeyView.jsx';
import SearchView from './components/SearchView.jsx';
import DatabasesView from './components/DatabasesView.jsx';
import PageExplorer from './components/PageExplorer.jsx';
import './app.css';

const TABS = [
  { id: 'search', label: 'Search' },
  { id: 'databases', label: 'Databases' },
  { id: 'pages', label: 'Page Explorer' },
];

function App() {
  const [apiKey, setApiKey] = useLocalStorage('notion_explorer_apiKey', '');
  const [tab, setTab] = useState('search');

  if (!apiKey) {
    return <ApiKeyView onSave={setApiKey} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Notion API Explorer
            </h1>
            <button
              onClick={() => setApiKey('')}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Disconnect
            </button>
          </div>
          <div className="flex -mb-px">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 text-sm border-b-2 transition-colors whitespace-nowrap ${
                  tab === t.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400 font-medium'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {tab === 'search' && <SearchView apiKey={apiKey} />}
        {tab === 'databases' && <DatabasesView apiKey={apiKey} />}
        {tab === 'pages' && <PageExplorer apiKey={apiKey} />}
      </div>
    </div>
  );
}

createRoot(document.getElementById('app')).render(<App />);
