import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';
import { useLocalStorage } from './hooks.js';
import './app.css';

marked.use({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      if (lang === 'mermaid') {
        const escaped = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<pre class="mermaid not-prose">${escaped}</pre>`;
      }
      return false;
    },
  },
});

mermaid.initialize({ startOnLoad: false });

function App() {
  const [text, setText] = useLocalStorage('markdown-preview:text', '');
  const [view, setView] = useState('editor');
  const previewRef = useRef(null);

  useEffect(() => {
    if (view === 'preview' && previewRef.current) {
      const html = marked.parse(text);
      previewRef.current.innerHTML = DOMPurify.sanitize(html);
      mermaid.run({ nodes: previewRef.current.querySelectorAll('.mermaid') });
    }
  }, [view]);

  if (view === 'editor') {
    return (
      <div className="flex flex-col h-screen p-4 gap-3 bg-white dark:bg-gray-900">
        <a
          href="../"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← Home
        </a>
        <textarea
          className="flex-1 w-full resize-none rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write GitHub Flavoured Markdown here..."
          spellCheck={false}
        />
        <button
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 font-medium transition-colors"
          onClick={() => setView('preview')}
        >
          Preview
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6">
      <button
        className="mb-6 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
        onClick={() => setView('editor')}
      >
        ← Back
      </button>
      <div
        ref={previewRef}
        className="prose dark:prose-invert max-w-4xl mx-auto"
      />
    </div>
  );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
