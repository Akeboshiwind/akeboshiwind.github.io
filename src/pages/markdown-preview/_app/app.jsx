import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';
import GithubSlugger from 'github-slugger';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import '../../../styles/global.css';
import './preview.css';

marked.use(
  markedHighlight({
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      if (lang === 'mermaid') return code;
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    },
  }),
);

// marked tries the last-registered renderer first, so this must come after markedHighlight.
marked.use({
  gfm: true,
  renderer: {
    code({ text, lang }) {
      if (lang === 'mermaid') {
        const escaped = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<pre class="mermaid">${escaped}</pre>`;
      }
      return false;
    },
  },
});

// The classes a note's <article> carries in [...slug].astro, so the preview reads like a note.
const NOTE_PROSE = `markdown-preview prose prose-sm font-sans max-w-none leading-relaxed
  prose-a:no-underline prose-a:hover:underline
  prose-code:font-mono prose-code:bg-code-bg prose-code:text-code-text prose-code:px-1 prose-code:rounded-none prose-code:font-normal prose-code:before:content-none prose-code:after:content-none
  prose-pre:font-mono prose-pre:rounded-none`;

const Heading = () => (
  <>
    <h1 className="page-title mt-4 mb-2">Markdown Preview</h1>
    <p className="page-sub mt-0 mb-6">Write GitHub Flavoured Markdown, with Mermaid diagrams. Saved as you type.</p>
  </>
);

function render(target, text) {
  target.innerHTML = DOMPurify.sanitize(marked.parse(text));
  target.querySelectorAll('input[type="checkbox"]').forEach((box) => box.classList.add('pixel-check'));
  const slugger = new GithubSlugger();
  target.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((h) => { h.id = slugger.slug(h.textContent); });
  target.querySelectorAll('table').forEach((table) => {
    const scroller = document.createElement('div');
    scroller.className = 'markdown-preview-table';
    table.replaceWith(scroller);
    scroller.append(table);
  });
  const dark = document.documentElement.dataset.theme === 'dark';
  mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral' });
  return Promise.resolve(mermaid.run({ nodes: target.querySelectorAll('.mermaid') }));
}

function scrollToHash() {
  const id = decodeURIComponent(window.location.hash.slice(1));
  if (id) document.getElementById(id)?.scrollIntoView();
}

export function App() {
  const [text, setText] = useLocalStorage('markdown-preview:text', '');
  const [view, setView] = useState(() => (text && window.location.hash ? 'preview' : 'editor'));
  const [pasteFailed, setPasteFailed] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    if (view === 'preview' && previewRef.current) {
      scrollToHash();
      render(previewRef.current, text).finally(scrollToHash);
    }
  }, [view, text]);

  const replaceWith = (pasted) => {
    setPasteFailed(false);
    setText(pasted);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (view !== 'preview') return;
    const onPaste = (e) => replaceWith(e.clipboardData.getData('text/plain'));
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [view]);

  const pasteFromClipboard = () =>
    navigator.clipboard.readText().then(replaceWith, () => setPasteFailed(true));

  if (view === 'editor') {
    return (
      <div className="flex flex-1 flex-col gap-3">
        <Heading />
        <textarea
          className="pixel-field flex-1 min-h-[50vh] w-full resize-none p-3 font-mono text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write GitHub Flavoured Markdown here..."
          spellCheck={false}
        />
        <button className="pixel-button w-full py-2" data-variant="primary" onClick={() => setView('preview')}>
          Preview
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-24">
      <Heading />
      <div ref={previewRef} className={NOTE_PROSE} />
      <div className="pixel-bar flex items-center gap-2">
        <button className="pixel-button" onClick={() => setView('editor')}>
          ← Back
        </button>
        <button className="pixel-button" onClick={pasteFromClipboard}>
          Paste
        </button>
        {pasteFailed && (
          <span role="status" className="label">Can't read the clipboard. Paste with Ctrl+V or ⌘V.</span>
        )}
      </div>
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
