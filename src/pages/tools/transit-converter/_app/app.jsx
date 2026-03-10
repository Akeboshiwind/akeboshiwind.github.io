import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import transit from 'transit-js';

const reader = transit.reader('json');

function toJson(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return value;

  // transit-js Map
  if (value && typeof value.forEach === 'function' && value.constructor && value.constructor.name === 'Map') {
    const obj = {};
    value.forEach((v, k) => {
      obj[String(k)] = toJson(v);
    });
    return obj;
  }

  // Arrays
  if (Array.isArray(value)) return value.map(toJson);

  // transit-js keyword/symbol (have .name property)
  if (value && value.name !== undefined && typeof value.name === 'string') return value.name;

  // Plain objects
  if (typeof value === 'object') {
    const obj = {};
    for (const k of Object.keys(value)) {
      obj[k] = toJson(value[k]);
    }
    return obj;
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
      const json = toJson(parsed);
      setOutput(JSON.stringify(json, null, 2));
    } catch (e) {
      setError(e.message || 'Failed to parse transit data');
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 gap-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <a
        href="../"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        ← Tools
      </a>

      <h1 className="text-2xl font-bold">Transit Converter</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Paste Transit-encoded data below and click Convert to see the JSON output.
      </p>

      <textarea
        className="w-full h-48 resize-y rounded-lg p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
        placeholder='e.g. ["^ ","~:name","Alice","~:age",30]'
        value={input}
        onChange={e => setInput(e.target.value)}
        spellCheck={false}
      />

      <button
        onClick={handleConvert}
        className="self-start bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Convert
      </button>

      {error && (
        <div className="rounded-lg p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm font-mono">
          {error}
        </div>
      )}

      {output !== null && (
        <pre className="rounded-lg p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-mono overflow-auto whitespace-pre-wrap break-words">
          {output}
        </pre>
      )}
    </div>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
