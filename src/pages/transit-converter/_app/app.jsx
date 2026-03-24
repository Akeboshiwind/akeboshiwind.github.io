import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import transit from 'transit-js';
import './app.css';

const reader = transit.reader('json');

function toJson(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.map(toJson);

  if (transit.isMap(value)) {
    const obj = {};
    value.forEach((v, k) => {
      obj[String(k)] = toJson(v);
    });
    return obj;
  }

  if (transit.isKeyword(value) || transit.isSymbol(value)) {
    return value.name;
  }

  return value;
}

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

  const handleConvert = () => {
    setError(null);
    setOutput(null);
    try {
      const parsed = reader.read(input.trim());
      setOutput(JSON.stringify(toJson(parsed), null, 2));
    } catch (e) {
      setError(e.message || 'Failed to parse transit data');
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 gap-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <a
        href="../"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        ← Home
      </a>

      <h1 className="text-xl font-semibold">Transit → JSON</h1>

      <div className="flex flex-col flex-1 gap-3 min-h-0 md:flex-row">
        <textarea
          className="flex-1 w-full resize-none rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
          placeholder={'Paste Transit-encoded data here...\n\ne.g. ["^ ","name","Alice","age",30]'}
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          {error && (
            <div className="rounded-lg p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm font-mono">
              {error}
            </div>
          )}
          {output !== null ? (
            <pre className="flex-1 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-mono overflow-auto dark:text-gray-100">
              {output}
            </pre>
          ) : (
            <div className="flex-1 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-400 dark:text-gray-500 flex items-center justify-center">
              JSON output will appear here
            </div>
          )}
        </div>
      </div>

      <button
        onClick={handleConvert}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 font-medium transition-colors"
      >
        Convert
      </button>
    </div>
  );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
