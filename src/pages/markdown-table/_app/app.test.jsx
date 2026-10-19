import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

const output = () => screen.getByLabelText('Markdown').textContent;
const cell = (r, c) => screen.getByLabelText(`Row ${r + 1}, column ${c + 1}`);

const pasteTable = text => {
  fireEvent.change(screen.getByLabelText('Paste a Markdown table'), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Edit table' }));
};

describe('Markdown Table Tools', () => {
  beforeEach(() => { localStorage.clear(); });

  test('a pasted table opens in the editor', () => {
    render(<App />);
    pasteTable('|a|b|\n|-|-|\n|1|2|');
    expect(cell(1, 1).value).toBe('2');
    expect(output()).toBe('| a   | b   |\n| --- | --- |\n| 1   | 2   |');
  });

  test('a paste that is not a table says why and stays put', () => {
    render(<App />);
    pasteTable('just some text');
    expect(screen.getByRole('alert').textContent).toMatch(/delimiter/);
    expect(screen.queryByLabelText('Markdown')).toBeNull();
  });

  test('a new table has the chosen size', () => {
    render(<App />);
    fireEvent.change(screen.getByLabelText('Rows'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Columns'), { target: { value: '4' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create table' }));
    expect(screen.getAllByLabelText(/^Row \d+, column \d+$/)).toHaveLength(12);
  });

  test('editing a cell updates the Markdown', () => {
    render(<App />);
    pasteTable('|a|\n|-|');
    fireEvent.change(cell(0, 0), { target: { value: 'name' } });
    expect(output()).toBe('| name |\n| ---- |');
  });

  test('transpose swaps rows and columns, and undo brings them back', () => {
    render(<App />);
    pasteTable('|a|b|\n|-|-|\n|1|2|');
    fireEvent.click(screen.getByRole('button', { name: 'Transpose' }));
    expect(cell(0, 1).value).toBe('1');
    expect(cell(1, 0).value).toBe('b');
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(cell(0, 1).value).toBe('b');
  });

  test("a row's handle moves it", () => {
    render(<App />);
    pasteTable('|a|\n|-|\n|1|\n|2|');
    fireEvent.click(screen.getByRole('button', { name: 'Row 3' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Move up' }));
    expect([0, 1, 2].map(r => cell(r, 0).value)).toEqual(['a', '2', '1']);
  });

  test("a column's handle sets its alignment", () => {
    render(<App />);
    pasteTable('|a|\n|-|');
    fireEvent.click(screen.getByRole('button', { name: 'Column 1' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Align right' }));
    expect(output()).toBe('|   a |\n| --: |');
  });

  test('add row sits under the table and appends a row', () => {
    render(<App />);
    pasteTable('|a|\n|-|');
    const add = screen.getByRole('button', { name: 'Add row' });
    expect(add.closest('tbody')).toBeTruthy();
    fireEvent.click(add);
    expect(output()).toBe('| a   |\n| --- |\n|     |');
  });

  test('add column sits beside the table and appends a column', () => {
    render(<App />);
    pasteTable('|a|\n|-|');
    const add = screen.getByRole('button', { name: 'Add column' });
    expect(add.closest('table')).toBeTruthy();
    fireEvent.click(add);
    expect(output()).toBe('| a   |     |\n| --- | --- |');
  });

  test('a newline in a cell becomes a space, since a Markdown cell is one line', () => {
    render(<App />);
    pasteTable('|a|\n|-|');
    fireEvent.change(cell(0, 0), { target: { value: 'two\nlines' } });
    expect(cell(0, 0).value).toBe('two lines');
  });

  test('Enter moves to the cell below', () => {
    render(<App />);
    pasteTable('|a|\n|-|\n|1|');
    cell(0, 0).focus();
    fireEvent.keyDown(cell(0, 0), { key: 'Enter' });
    expect(document.activeElement).toBe(cell(1, 0));
  });

  test('the table survives a reload', () => {
    const { unmount } = render(<App />);
    pasteTable('|kept|\n|-|');
    unmount();
    render(<App />);
    expect(cell(0, 0).value).toBe('kept');
  });

  test('New goes back to the start', () => {
    render(<App />);
    pasteTable('|a|\n|-|');
    fireEvent.click(screen.getByRole('button', { name: 'New' }));
    expect(screen.getByLabelText('Paste a Markdown table')).toBeTruthy();
  });
});
