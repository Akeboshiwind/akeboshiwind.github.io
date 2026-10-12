import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import transit from 'transit-js';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';

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
    <div className="text-text">
      <h1 className="page-title mt-4 mb-2">Transit → JSON</h1>
      <p className="page-sub mt-0 mb-8">Convert Transit format data to JSON.</p>

      <section className="mb-8">
        <SectionLabel className="mb-3">Transit</SectionLabel>
        <textarea
          className="pixel-field w-full block resize-y font-pixel text-pixel"
          rows={8}
          placeholder={'Paste Transit-encoded data here...\n\ne.g. ["^ ","name","Alice","age",30]'}
          value={input}
          onChange={e => setInput(e.target.value)}
          spellCheck={false}
        />
        <button onClick={handleConvert} className="pixel-button w-full sm:w-auto mt-3" data-variant="primary">
          Convert
        </button>
      </section>

      <section className="mb-8">
        <SectionLabel className="mb-3">JSON</SectionLabel>
        {error && (
          <p className="pixel-panel border-danger text-danger font-pixel text-pixel p-3 mb-3 break-words">{error}</p>
        )}
        {output !== null ? (
          <pre className="bg-code-bg text-code-text font-pixel text-pixel p-3 overflow-auto max-h-[60vh]">{output}</pre>
        ) : (
          <p className="label opacity-60 bg-code-bg p-6 text-center">JSON output will appear here</p>
        )}
      </section>
    </div>
  );
}

const mount = document.getElementById('app');
createRoot(mount).render(<App />);
