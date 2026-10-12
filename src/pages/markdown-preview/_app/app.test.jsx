import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';

const mermaidRun = vi.hoisted(() => vi.fn());
vi.mock('mermaid', () => ({ default: { initialize: vi.fn(), run: mermaidRun } }));

import { App } from './app.jsx';

const KEY = 'markdown-preview:text';

afterEach(cleanup);

beforeEach(() => {
  localStorage.clear();
  mermaidRun.mockClear();
});

const write = (text) => fireEvent.change(
  screen.getByPlaceholderText('Write GitHub Flavoured Markdown here...'),
  { target: { value: text } },
);

const preview = () => fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

describe('Markdown Preview', () => {
  test('starts in the editor with an empty textarea and a Preview button', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Write GitHub Flavoured Markdown here...').value).toBe('');
    expect(screen.getByRole('button', { name: 'Preview' })).toBeTruthy();
  });

  test('Preview renders headings, emphasis, links and lists', () => {
    render(<App />);
    write('# Title\n\nSome **bold** text and a [link](https://example.com).\n\n- one\n- two');
    preview();
    expect(screen.getByRole('heading', { level: 1, name: 'Title' })).toBeTruthy();
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByRole('link', { name: 'link' }).getAttribute('href')).toBe('https://example.com');
    expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual(['one', 'two']);
    expect(screen.queryByPlaceholderText('Write GitHub Flavoured Markdown here...')).toBeNull();
  });

  test('renders GitHub Flavoured tables and task lists', () => {
    render(<App />);
    write('| A | B |\n| - | - |\n| 1 | 2 |\n\n- [x] done\n- [ ] todo');
    preview();
    const table = screen.getByRole('table');
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['A', 'B']);
    expect(within(table).getAllByRole('cell').map((td) => td.textContent)).toEqual(['1', '2']);
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes.map((b) => b.checked)).toEqual([true, false]);
  });

  test('fenced code keeps its source text', () => {
    render(<App />);
    write('```js\nconst answer = 42;\n```');
    preview();
    const code = document.querySelector('pre code');
    expect(code.textContent).toBe('const answer = 42;\n');
  });

  test('a mermaid block is handed to mermaid with its source', () => {
    render(<App />);
    write('```mermaid\ngraph TD; A-->B\n```');
    preview();
    expect(mermaidRun).toHaveBeenCalledTimes(1);
    const [{ nodes }] = mermaidRun.mock.calls[0];
    expect([...nodes].map((n) => n.textContent)).toEqual(['graph TD; A-->B']);
  });

  test('rendered HTML is sanitised', () => {
    render(<App />);
    write('<img src="x" onerror="alert(1)"><script>alert(2)</script>');
    preview();
    const img = document.querySelector('img');
    expect(img.getAttribute('onerror')).toBeNull();
    expect(document.querySelector('script')).toBeNull();
  });

  test('← Back returns to the editor with the text intact', () => {
    render(<App />);
    write('# Keep me');
    preview();
    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    expect(screen.getByPlaceholderText('Write GitHub Flavoured Markdown here...').value).toBe('# Keep me');
  });
});

describe('storage contract', () => {
  test(`loads the text saved as a JSON string under ${KEY}`, () => {
    localStorage.setItem(KEY, JSON.stringify('# Saved draft\n\nhello'));
    render(<App />);
    expect(screen.getByPlaceholderText('Write GitHub Flavoured Markdown here...').value).toBe('# Saved draft\n\nhello');
    preview();
    expect(screen.getByRole('heading', { level: 1, name: 'Saved draft' })).toBeTruthy();
  });

  test(`saves edits as a JSON string under ${KEY}`, () => {
    render(<App />);
    write('*new*');
    expect(localStorage.getItem(KEY)).toBe(JSON.stringify('*new*'));
  });
});
