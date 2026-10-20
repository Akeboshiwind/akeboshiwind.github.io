import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';
import GithubSlugger from 'github-slugger';

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

export function render(target, text) {
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
