import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react';

const mermaidRender = vi.hoisted(() => vi.fn(async (id, source) => ({ svg: `<svg id="${id}"><title>${source.replaceAll(">", "&gt;")}</title></svg>` })));
const mermaidLoads = vi.hoisted(() => ({ count: 0 }));
vi.mock('mermaid', () => {
  mermaidLoads.count += 1;
  return { default: { initialize: vi.fn(), render: mermaidRender } };
});

import { App } from './app.jsx';

class FakeIntersectionObserver {
  static all = new Set();
  constructor(callback) {
    this.callback = callback;
    this.targets = new Set();
    FakeIntersectionObserver.all.add(this);
  }
  observe(el) { this.targets.add(el); }
  unobserve(el) { this.targets.delete(el); }
  disconnect() { this.targets.clear(); FakeIntersectionObserver.all.delete(this); }
}

class FakeResizeObserver {
  static all = new Set();
  constructor(callback) {
    this.callback = callback;
    this.targets = new Set();
    FakeResizeObserver.all.add(this);
  }
  observe(el) { this.targets.add(el); }
  unobserve(el) { this.targets.delete(el); }
  disconnect() { this.targets.clear(); FakeResizeObserver.all.delete(this); }
}

const resize = (el, { height, top }) => {
  Object.defineProperty(el, 'offsetHeight', { configurable: true, value: height });
  el.getBoundingClientRect = () => ({ top, bottom: top + height, height });
  FakeResizeObserver.all.forEach((o) => o.targets.has(el) && o.callback([{ target: el }], o));
};

const scrollNear = (...els) => FakeIntersectionObserver.all.forEach((o) => {
  const entries = els.filter((el) => o.targets.has(el)).map((target) => ({ target, isIntersecting: true }));
  if (entries.length) o.callback(entries, o);
});

const KEY = 'markdown-preview:text';

afterEach(() => {
  cleanup();
  history.replaceState(null, '', '/');
  vi.unstubAllGlobals();
});

beforeEach(() => {
  localStorage.clear();
  mermaidRender.mockClear();
  Element.prototype.scrollIntoView = vi.fn();
  FakeIntersectionObserver.all.clear();
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
  FakeResizeObserver.all.clear();
  vi.stubGlobal('ResizeObserver', FakeResizeObserver);
  window.scrollBy = vi.fn();
  window.scrollTo = vi.fn();
});

const write = (text) => fireEvent.change(
  screen.getByPlaceholderText('Write GitHub Flavoured Markdown here...'),
  { target: { value: text } },
);

const rendered = () => waitFor(() => expect(document.querySelector('.markdown-preview').getAttribute('aria-busy')).toBe('false'));

const preview = () => {
  fireEvent.click(screen.getByRole('button', { name: 'Preview' }));
  return rendered();
};

describe('Markdown Preview', () => {
  test('starts in the editor with an empty textarea and a Preview button', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Write GitHub Flavoured Markdown here...').value).toBe('');
    expect(screen.getByRole('button', { name: 'Preview' })).toBeTruthy();
  });

  test('Preview renders headings, emphasis, links and lists', async () => {
    render(<App />);
    write('# Title\n\nSome **bold** text and a [link](https://example.com).\n\n- one\n- two');
    await preview();
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeTruthy();
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'link' }).getAttribute('href')).toBe('https://example.com');
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['one', 'two']);
    expect(screen.queryByPlaceholderText('Write GitHub Flavoured Markdown here...')).toBeNull();
  });

  test('renders GitHub Flavoured tables and task lists', async () => {
    render(<App />);
    write('| A | B |\n| - | - |\n| 1 | 2 |\n\n- [x] done\n- [ ] todo');
    await preview();
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['A', 'B']);
    expect(within(table).getAllByRole('cell').map((td) => td.textContent)).toEqual(['1', '2']);
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes.map((b) => b.checked)).toEqual([true, false]);
  });

  test('fenced code keeps its source text', async () => {
    render(<App />);
    write('```js\nconst answer = 42;\n```');
    await preview();
    const code = document.querySelector('pre code');
    expect(code.textContent).toBe('const answer = 42;\n');
  });

  test('a mermaid block is handed to mermaid with its source', async () => {
    render(<App />);
    write('```mermaid\ngraph TD; A-->B\n```');
    await preview();
    scrollNear(document.querySelector('.mermaid'));
    await waitFor(() => expect(mermaidRender).toHaveBeenCalledTimes(1));
    expect(mermaidRender.mock.calls[0][1]).toBe('graph TD; A-->B');
    await waitFor(() => expect(document.querySelector('.mermaid svg title').textContent).toBe('graph TD; A-->B'));
  });

  test('rendered HTML is sanitised', async () => {
    render(<App />);
    write('<img src="x" onerror="alert(1)"><script>alert(2)</script>');
    await preview();
    const img = document.querySelector('img');
    expect(img.getAttribute('onerror')).toBeNull();
    expect(document.querySelector('script')).toBeNull();
  });

  test('← Back returns to the editor with the text intact', async () => {
    render(<App />);
    write('# Keep me');
    await preview();
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    expect(screen.getByPlaceholderText('Write GitHub Flavoured Markdown here...').value).toBe('# Keep me');
  });

  test('← Back sits in the bar along the bottom of the preview', async () => {
    render(<App />);
    await preview();
    expect(screen.getByRole('button', { name: '← Back' }).closest('.pixel-bar')).toBeTruthy();
  });
});

describe('loading only what a document needs', () => {
  test('a diagram is drawn only once it nears the viewport', async () => {
    render(<App />);
    write('```mermaid\ngraph TD; A-->B\n```\n\n```mermaid\ngraph TD; C-->D\n```');
    await preview();
    const [first, second] = document.querySelectorAll('.mermaid');
    scrollNear(second);
    await waitFor(() => expect(mermaidRender).toHaveBeenCalledTimes(1));
    expect(mermaidRender.mock.calls[0][1]).toBe('graph TD; C-->D');
    scrollNear(first);
    await waitFor(() => expect(mermaidRender).toHaveBeenCalledTimes(2));
    expect(mermaidRender.mock.calls[1][1]).toBe('graph TD; A-->B');
  });

  test('a progress bar shows until the preview has rendered', async () => {
    render(<App />);
    write('# Hello');
    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));
    expect(screen.getByRole('progressbar', { name: 'Loading the preview' })).toBeTruthy();
    await rendered();
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  test('a document without diagrams never loads mermaid', async () => {
    vi.resetModules();
    mermaidLoads.count = 0;
    const { App: FreshApp } = await import('./app.jsx');
    render(<FreshApp />);
    write('# No diagrams here');
    await preview();
    expect(mermaidLoads.count).toBe(0);
  });
});

describe('caching drawn diagrams', () => {
  const DOC = '```mermaid\ngraph TD; A-->B\n```';

  test('a diagram drawn before appears with the text on the next visit, without loading mermaid', async () => {
    render(<App />);
    write(DOC);
    await preview();
    scrollNear(document.querySelector('.mermaid'));
    await waitFor(() => expect(document.querySelector('.mermaid svg')).toBeTruthy());
    cleanup();

    vi.resetModules();
    mermaidLoads.count = 0;
    mermaidRender.mockClear();
    const { App: FreshApp } = await import('./app.jsx');
    render(<FreshApp />);
    await preview();
    expect(document.querySelector('.mermaid svg title').textContent).toBe('graph TD; A-->B');
    expect(mermaidRender).not.toHaveBeenCalled();
    expect(mermaidLoads.count).toBe(0);
  });

  test('an edited diagram is drawn afresh', async () => {
    render(<App />);
    write(DOC);
    await preview();
    scrollNear(document.querySelector('.mermaid'));
    await waitFor(() => expect(mermaidRender).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    write('```mermaid\ngraph TD; A-->C\n```');
    await preview();
    scrollNear(document.querySelector('.mermaid'));
    await waitFor(() => expect(mermaidRender).toHaveBeenCalledTimes(2));
    expect(mermaidRender.mock.calls[1][1]).toBe('graph TD; A-->C');
  });

  test('the cache keeps only the current document\'s diagrams', async () => {
    render(<App />);
    write(DOC);
    await preview();
    scrollNear(document.querySelector('.mermaid'));
    await waitFor(() => expect(mermaidRender).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    write('# No diagrams now');
    await preview();
    expect(Object.keys(JSON.parse(localStorage.getItem('markdown-preview:diagrams')))).toEqual([]);
  });
});

describe('keeping the page still while diagrams draw', () => {
  const twoDiagrams = async () => {
    render(<App />);
    write('```mermaid\ngraph TD; A-->B\n```\n\ntext\n\n```mermaid\ngraph TD; C-->D\n```');
    await preview();
    return document.querySelectorAll('.mermaid');
  };

  test('a diagram above the viewport that grows scrolls the page by as much, so what you are reading stays put', async () => {
    const [above] = await twoDiagrams();
    resize(above, { height: 150, top: -400 });
    resize(above, { height: 230, top: -400 });
    expect(window.scrollBy).toHaveBeenCalledWith(0, 80);
  });

  test('a diagram in or below the viewport grows without scrolling the page', async () => {
    const [, below] = await twoDiagrams();
    resize(below, { height: 150, top: 300 });
    resize(below, { height: 230, top: 300 });
    expect(window.scrollBy).not.toHaveBeenCalled();
  });
});

describe('tables', () => {
  test('each table sits in a scroller that can break out of the column', async () => {
    render(<App />);
    write('| A | B |\n| - | - |\n| 1 | 2 |');
    await preview();
    expect(screen.getByRole('table').parentElement.classList.contains('markdown-preview-table')).toBe(true);
  });
});

describe('heading links', () => {
  test('headings get GitHub-style ids, numbered when repeated', async () => {
    render(<App />);
    write('## Three ways to frame a transaction\n\n## Notes\n\n## Notes');
    await preview();
    expect(screen.getAllByRole('heading', { level: 2 }).map((h) => h.id))
      .toEqual(['three-ways-to-frame-a-transaction', 'notes', 'notes-1']);
  });

  test('a link to a heading in the URL opens the preview and scrolls to it', async () => {
    localStorage.setItem(KEY, JSON.stringify('# Top\n\n## Three ways to frame a transaction'));
    history.replaceState(null, '', '/#three-ways-to-frame-a-transaction');
    render(<App />);
    const heading = await screen.findByRole('heading', { name: 'Three ways to frame a transaction' });
    await waitFor(() => expect(heading.scrollIntoView).toHaveBeenCalled());
    expect(heading.scrollIntoView.mock.contexts.at(-1)).toBe(heading);
  });

  test('with nothing written, a hash still opens the editor', () => {
    history.replaceState(null, '', '/#anything');
    render(<App />);
    expect(screen.getByPlaceholderText('Write GitHub Flavoured Markdown here...')).toBeTruthy();
  });
});

describe('pasting into the preview', () => {
  test('Paste in the bar replaces the text with the clipboard and re-renders', async () => {
    vi.stubGlobal('navigator', { clipboard: { readText: () => Promise.resolve('# Pasted') } });
    render(<App />);
    write('# Old');
    await preview();
    const paste = screen.getByRole('button', { name: 'Paste' });
    expect(paste.closest('.pixel-bar')).toBeTruthy();
    fireEvent.click(paste);
    expect(await screen.findByRole('heading', { name: 'Pasted' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Old' })).toBeNull();
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify('# Pasted'));
  });

  test('when the clipboard cannot be read, Paste says to paste with the keyboard', async () => {
    vi.stubGlobal('navigator', { clipboard: { readText: () => Promise.reject(new Error('denied')) } });
    render(<App />);
    write('# Old');
    await preview();
    fireEvent.click(screen.getByRole('button', { name: 'Paste' }));
    expect((await screen.findByRole('status')).textContent).toMatch(/paste/i);
    expect(screen.getByRole('heading', { name: 'Old' })).toBeTruthy();
  });

  test('pasting anywhere on the preview re-renders with the pasted text', async () => {
    render(<App />);
    write('# Old');
    await preview();
    const event = new Event('paste', { bubbles: true });
    event.clipboardData = { getData: (type) => (type === 'text/plain' ? '# From keys' : '') };
    fireEvent(document, event);
    expect(await screen.findByRole('heading', { name: 'From keys' })).toBeTruthy();
  });
});

describe('storage contract', () => {
  test(`loads the text saved as a JSON string under ${KEY}`, async () => {
    localStorage.setItem(KEY, JSON.stringify('# Saved draft\n\nhello'));
    render(<App />);
    expect(screen.getByPlaceholderText('Write GitHub Flavoured Markdown here...').value).toBe('# Saved draft\n\nhello');
    await preview();
    expect(screen.getByRole('heading', { level: 1, name: 'Saved draft' })).toBeTruthy();
  });

  test(`saves edits as a JSON string under ${KEY}`, () => {
    render(<App />);
    write('*new*');
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify('*new*'));
  });
});
