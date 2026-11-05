import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, within, cleanup, fireEvent, act } from '@testing-library/react';
import { parse } from '../../../lib/cte/parse.ts';
import { App } from './app.jsx';

let worker;

class FakeWorker {
  constructor() {
    this.posted = [];
    this.listeners = { message: [], error: [] };
    worker = this;
  }
  addEventListener(type, fn) { this.listeners[type].push(fn); }
  postMessage(msg) { this.posted.push(msg); }
  terminate() {}
  emit(type, event) { act(() => this.listeners[type].forEach((fn) => fn(event))); }
  reply() { this.emit('message', { data: parse(this.posted.at(-1)) }); }
}

beforeEach(() => { vi.stubGlobal('Worker', FakeWorker); });

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const analyse = (sql) => {
  fireEvent.change(screen.getByLabelText('XTDB SQL'), { target: { value: sql } });
  fireEvent.click(screen.getByRole('button', { name: 'Analyse' }));
};

const laidOut = () => screen.findByRole('img', { name: /^Each CTE once/ });

const node = (container, name) => container.querySelector(`[data-node="${name}"]`);
const shows = (container, name) => [...node(container, name).querySelectorAll('text')].map((t) => t.textContent).join(' ');
const nodes = (container) => [...container.querySelectorAll('[data-node]')].map((g) => g.dataset.node);

describe('CTE Graph', () => {
  test('parses in the worker only when asked', () => {
    render(<App />);
    expect(worker.posted).toEqual([]);
    analyse('SELECT 1');
    expect(worker.posted).toEqual(['SELECT 1']);
    expect(screen.getByRole('button', { name: 'Analysing…' }).disabled).toBe(true);
  });

  test('loads a sample into the box and draws it', async () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Ladder' }));

    expect(worker.posted).toEqual([screen.getByLabelText('XTDB SQL').value]);
    worker.reply();
    await laidOut();
    expect(shows(container, 'l0')).toBe('l0 ×512');
    expect(screen.getByRole('button', { name: 'Analyse' }).disabled).toBe(false);
  });

  describe('as a graph', () => {
    const SQL = `
      WITH MATERIALIZED m AS (SELECT * FROM s),
           a AS (SELECT * FROM t, m),
           b AS (SELECT * FROM a JOIN a AS a2 ON true),
           c AS (SELECT * FROM b JOIN b AS b2 ON true)
      SELECT * FROM c JOIN c AS c2 ON true`;

    const graphed = async () => {
      const { container } = render(<App />);
      analyse(SQL);
      worker.reply();
      await laidOut();
      return container;
    };

    const thick = (container) => [...container.querySelectorAll('[data-node]')]
      .filter((g) => g.querySelector('rect').getAttribute('class').includes('stroke-accent'))
      .map((g) => g.dataset.node);
    const doubled = (container) => [...container.querySelectorAll('[data-node]')]
      .filter((g) => g.querySelector('[data-materialized]'))
      .map((g) => g.dataset.node);

    test('draws each CTE once with its copies, thick where it has more than one, double where MATERIALIZED', async () => {
      const container = await graphed();
      expect(nodes(container)).toEqual(['query', 'm', 'a', 'b', 'c']);
      expect(['query', 'm', 'a', 'b', 'c'].map((n) => shows(container, n)))
        .toEqual(['query ×1', 'm ×1', 'a ×8', 'b ×4', 'c ×2']);
      expect(thick(container)).toEqual(['a', 'b', 'c']);
      expect(doubled(container)).toEqual(['m']);
    });

    test('draws an edge from each reader to what it reads, labelled and heavier where it reads it more than once', async () => {
      const container = await graphed();
      const edge = (key) => container.querySelector(`[data-edge="${key}"]`);
      expect(container.querySelectorAll('[data-edge]')).toHaveLength(4);
      expect(edge('0>4').textContent).toBe('×2');
      expect(edge('0>4').querySelector('path').getAttribute('class')).toContain('[stroke-width:3px]');
      expect(edge('2>1').textContent).toBe('');
      expect(edge('2>1').querySelector('path').getAttribute('class')).toContain('[stroke-width:1px]');
    });

    test('heads each edge with an arrow at the reader, proportionate to the edge, and says which way they run', async () => {
      const container = await graphed();
      const path = (key) => container.querySelector(`[data-edge="${key}"] path`);
      const head = (key) => container.querySelector(path(key).getAttribute('marker-start').match(/^url\((#.+)\)$/)[1]);
      const start = (key) => path(key).getAttribute('d').match(/^M([\d.]+),([\d.]+)/).slice(1).map(Number);
      const rect = (name) => node(container, name).querySelector('rect');

      expect([...container.querySelectorAll('[data-edge] path')].map((p) => p.getAttribute('marker-end'))).toEqual([null, null, null, null]);
      expect(head('0>4').getAttribute('orient')).toBe('auto-start-reverse');
      expect(Number(head('0>4').getAttribute('markerWidth'))).toBeGreaterThan(Number(head('2>1').getAttribute('markerWidth')));
      expect(head('2>1').querySelector('path').getAttribute('class')).toBe('fill-text');

      const [, y] = start('0>4');
      expect(y).toBe(Number(rect('query').getAttribute('y')) + Number(rect('query').getAttribute('height')));
    });

    test('keys the graph with a swatch of each mark, drawn as the graph draws it', async () => {
      await graphed();
      const key = screen.getByRole('list', { name: 'Key' });
      const swatch = (label) => within(key).getByText(label).closest('li').querySelector('svg');

      expect(within(key).getAllByRole('listitem').map((li) => li.lastChild.textContent))
        .toEqual(['one copy', 'n copies', 'MATERIALIZED', 'rows flow', 'n reads']);
      expect(swatch('one copy').querySelector('rect').getAttribute('class')).toContain('stroke-text');
      expect(swatch('n copies').querySelector('rect').getAttribute('class')).toContain('stroke-accent');
      expect(swatch('MATERIALIZED').querySelector('[data-materialized]')).toBeTruthy();
      expect(swatch('rows flow').querySelector('path[marker-start]').getAttribute('class')).toContain('[stroke-width:1px]');
      expect(swatch('n reads').querySelector('path[marker-start]').getAttribute('class')).toContain('[stroke-width:3px]');
      expect(swatch('n reads').textContent).toBe('×n');
      expect(screen.queryByText(/^Arrows point the way rows flow/)).toBeNull();
    });
  });

  test('shows why a statement could not be analysed', () => {
    render(<App />);
    analyse('DELETE FROM t');
    worker.reply();

    expect(screen.getByText('Only a query can be analysed.')).toBeTruthy();
    expect(screen.queryByRole('img')).toBeNull();
  });

  test('shows a failure in the worker, and lets you try again', () => {
    render(<App />);
    analyse('SELECT 1');
    worker.emit('error', { message: 'Uncaught RangeError: Maximum call stack size exceeded' });

    expect(screen.getByText('The parser failed: Uncaught RangeError: Maximum call stack size exceeded')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Analyse' }).disabled).toBe(false);
  });

  test('shows a worker that failed to load', () => {
    render(<App />);
    analyse('SELECT 1');
    worker.emit('error', { message: '' });

    expect(screen.getByText('The parser failed to load.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Analyse' }).disabled).toBe(false);
  });
});
