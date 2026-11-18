import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

const paste = text => {
  fireEvent.change(screen.getByLabelText('Paste CSV'), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'View table' }));
};

const table = () => screen.getByRole('table');
const headers = () => within(table()).getAllByRole('columnheader').map(th => th.textContent);
const column = c => within(table()).getAllByRole('row').slice(1).map(tr => within(tr).getAllByRole('cell')[c].textContent);

const FRUIT = 'Fruit,Price\nBanana,0.25\nApple,10\nCherry,2';

describe('CSV Viewer', () => {
  beforeEach(() => { localStorage.clear(); });

  test('pasted CSV shows as a table under its header row', () => {
    render(<App />);
    paste(FRUIT);
    expect(headers()).toEqual(['#', 'Fruit', 'Price']);
    expect(column(1)).toEqual(['Banana', 'Apple', 'Cherry']);
    expect(screen.getByText('3 rows × 2 columns')).toBeTruthy();
  });

  test('CSV that does not parse says why and stays put', () => {
    render(<App />);
    paste('a,"b\nc');
    expect(screen.getByRole('alert').textContent).toMatch(/line 1/);
    expect(screen.queryByRole('table')).toBeNull();
  });

  test('works out the delimiter, and can be told another', () => {
    render(<App />);
    paste('a\tb,c\td\n1\t2,3\t4');
    expect(headers()).toEqual(['#', 'a', 'b,c', 'd']);
    fireEvent.change(screen.getByLabelText('Delimiter'), { target: { value: ',' } });
    expect(headers()).toEqual(['#', 'a\tb', 'c\td']);
  });

  test('without a header row, every row is data', () => {
    render(<App />);
    paste(FRUIT);
    fireEvent.click(screen.getByLabelText('First row is a header'));
    expect(headers()).toEqual(['#', 'Column 1', 'Column 2']);
    expect(column(1)).toEqual(['Fruit', 'Banana', 'Apple', 'Cherry']);
  });

  test('a header sorts its column up, then down, then back', () => {
    render(<App />);
    paste(FRUIT);
    const price = () => screen.getByRole('button', { name: /^Price/ });
    fireEvent.click(price());
    expect(column(2)).toEqual(['0.25', '2', '10']);
    expect(column(0)).toEqual(['1', '3', '2']);
    expect(price().closest('th').getAttribute('aria-sort')).toBe('ascending');
    fireEvent.click(price());
    expect(column(2)).toEqual(['10', '2', '0.25']);
    fireEvent.click(price());
    expect(column(2)).toEqual(['0.25', '10', '2']);
    expect(price().closest('th').getAttribute('aria-sort')).toBeNull();
  });

  test('the filter keeps matching rows and says how many', () => {
    render(<App />);
    paste(FRUIT);
    fireEvent.change(screen.getByLabelText('Filter rows'), { target: { value: 'an' } });
    expect(column(1)).toEqual(['Banana']);
    expect(screen.getByText('1 of 3 rows × 2 columns')).toBeTruthy();
  });

  test('a long table shows in pages', () => {
    render(<App />);
    paste(['n', ...Array.from({ length: 450 }, (_, i) => i)].join('\n'));
    expect(column(1)).toHaveLength(200);
    fireEvent.click(screen.getByRole('button', { name: 'Show 200 more' }));
    fireEvent.click(screen.getByRole('button', { name: 'Show 50 more' }));
    expect(column(1)).toHaveLength(450);
  });

  test('a chosen file opens, under its name', async () => {
    render(<App />);
    const file = new File(['x,y\n1,2'], 'points.csv', { type: 'text/csv' });
    fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [file] } });
    await waitFor(() => expect(headers()).toEqual(['#', 'x', 'y']));
    expect(screen.getByText('points.csv')).toBeTruthy();
  });

  test('the table is still there after a reload, until New', () => {
    const { unmount } = render(<App />);
    paste(FRUIT);
    unmount();
    render(<App />);
    expect(column(1)).toEqual(['Banana', 'Apple', 'Cherry']);
    fireEvent.click(screen.getByRole('button', { name: 'New' }));
    expect(screen.queryByRole('table')).toBeNull();
    expect(screen.getByLabelText('Paste CSV')).toBeTruthy();
  });

  test('can show a written \\n as a line break, and remembers to', () => {
    const { unmount } = render(<App />);
    paste('note\none\\ntwo');
    expect(column(1)).toEqual(['one\\ntwo']);
    fireEvent.click(screen.getByLabelText('Show \\n as a line break'));
    expect(column(1)).toEqual(['one\ntwo']);
    fireEvent.click(screen.getByRole('button', { name: 'New' }));
    unmount();
    render(<App />);
    paste('note\na\\nb');
    expect(column(1)).toEqual(['a\nb']);
  });
});
