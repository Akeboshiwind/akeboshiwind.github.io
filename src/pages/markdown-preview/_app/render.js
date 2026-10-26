import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import hljs from 'highlight.js/lib/common';
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
  target.querySelectorAll('a[href]').forEach((a) => {
    if (!leadsSomewhere(a.getAttribute('href'), target)) {
      a.addEventListener('click', ignore);
      a.addEventListener('auxclick', ignore);
    }
  });
  target.querySelectorAll('table').forEach((table) => {
    const scroller = document.createElement('div');
    scroller.className = 'markdown-preview-table';
    table.replaceWith(scroller);
    scroller.append(table);
  });
  return drawDiagramsNearViewport(target.querySelectorAll('.mermaid'));
}

const isExternal = (href) => /^([a-z][a-z\d+.-]*:|\/\/)/i.test(href);

// A local link points into the repo the Markdown came from, which isn't here; only its own sections are.
function leadsSomewhere(href, root) {
  if (isExternal(href)) return true;
  if (!href.startsWith('#')) return false;
  const id = decodeURIComponent(href.slice(1));
  return [...root.querySelectorAll('[id]')].some((el) => el.id === id);
}

const ignore = (e) => e.preventDefault();

let mermaidModule;
let mermaidTheme;
async function loadMermaid(theme) {
  const mermaid = await (mermaidModule ??= import('mermaid').then((m) => m.default));
  if (mermaidTheme !== theme) {
    mermaid.initialize({ startOnLoad: false, theme });
    mermaidTheme = theme;
  }
  return mermaid;
}

const CACHE_KEY = 'markdown-preview:diagrams';

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? {};
  } catch {
    return {};
  }
}

function writeCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {}
}

// FNV-1a. An SVG's id scopes its CSS, so a cached SVG must carry the id a fresh render of it would.
function hash(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 0x01000193);
  return (h >>> 0).toString(36);
}

function show(node, svg) {
  node.innerHTML = svg;
  node.dataset.processed = 'true';
}

// Returns a cleanup that stops drawing diagrams for this render.
function drawDiagramsNearViewport(diagrams) {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'neutral';
  const keyOf = (node) => `${theme}\n${node.textContent}`;
  const previous = readCache();
  const kept = {};
  const pending = [];
  diagrams.forEach((node) => {
    const svg = previous[keyOf(node)];
    if (svg) {
      kept[keyOf(node)] = svg;
      show(node, svg);
    } else {
      pending.push(node);
    }
  });
  writeCache(kept);

  const draw = async (node) => {
    const key = keyOf(node);
    try {
      const mermaid = await loadMermaid(theme);
      const { svg } = await mermaid.render(`mermaid-${hash(key)}`, node.textContent);
      show(node, svg);
      writeCache({ ...readCache(), [key]: svg });
    } catch {
      node.dataset.processed = 'error';
    }
  };
  const near = new IntersectionObserver((entries) => {
    entries.filter((e) => e.isIntersecting).forEach(({ target }) => {
      near.unobserve(target);
      draw(target);
    });
  }, { rootMargin: '100% 0px' });
  const keepPlace = keepReadingPlace();
  pending.forEach((node) => {
    near.observe(node);
    keepPlace.observe(node);
  });
  return () => {
    near.disconnect();
    keepPlace.disconnect();
  };
}

// A diagram drawn above the viewport would push down what you're reading, so scroll by as much before it paints.
function keepReadingPlace() {
  const heights = new WeakMap();
  return new ResizeObserver((entries) => {
    let shift = 0;
    entries.forEach(({ target }) => {
      const before = heights.get(target);
      heights.set(target, target.offsetHeight);
      if (before !== undefined && target.getBoundingClientRect().top < 0) shift += target.offsetHeight - before;
    });
    if (shift) window.scrollBy(0, shift);
  });
}
