import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act, within } from '@testing-library/react';
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
  worker.reply();
};

const SQL = `
  WITH a AS (SELECT * FROM t),
       b AS (SELECT * FROM a, a AS a2),
       MATERIALIZED m AS (SELECT * FROM u),
       c AS (SELECT * FROM s)
  SELECT * FROM b, m`;

const AFTER = `
  WITH MATERIALIZED a AS (SELECT * FROM t),
       b AS (SELECT * FROM a, a AS a2),
       MATERIALIZED m AS (SELECT * FROM u),
       c AS (SELECT * FROM s)
  SELECT * FROM b, m`;

describe('Materialise Like Postgres', () => {
  test('writes MATERIALIZED into each CTE referenced more than once, keeping the rest of the text', () => {
    render(<App />);
    analyse(SQL);
    expect(screen.getByLabelText('The query after the rule').value).toBe(AFTER);
  });

  test('counts the table scans as written and after the rule', () => {
    render(<App />);
    analyse(SQL);
    expect(screen.getByText(/table scans as written/).closest('p').textContent)
      .toBe('3 table scans as written → 2 after the rule.');
  });

  test('lists each CTE with its references and what the rule did', () => {
    render(<App />);
    analyse(SQL);
    const rows = within(screen.getByRole('table')).getAllByRole('row').slice(1)
      .map((r) => within(r).getAllByRole('cell').map((c) => c.textContent));
    expect(rows).toEqual([
      ['a', '2', 'MATERIALIZED'],
      ['b', '1', 'inlined'],
      ['m', '1', 'already MATERIALIZED'],
      ['c', '0', 'left alone: never read'],
    ]);
  });

  test('copies the query after the rule', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    render(<App />);
    analyse(SQL);

    await act(() => fireEvent.click(screen.getByRole('button', { name: 'Copy SQL' })));

    expect(writeText).toHaveBeenCalledWith(AFTER);
    expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy();
  });

  test('loads a sample and applies the rule to it', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Diamond' }));
    worker.reply();

    expect(screen.getByText(/table scans as written/).closest('p').textContent)
      .toBe('8 table scans as written → 1 after the rule.');
  });

  test('shows why a statement could not be analysed', () => {
    render(<App />);
    analyse('DELETE FROM t');

    expect(screen.getByText('Only a query can be analysed.')).toBeTruthy();
    expect(screen.queryByRole('table')).toBeNull();
  });
});
