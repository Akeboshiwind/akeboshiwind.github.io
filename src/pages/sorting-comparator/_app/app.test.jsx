import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { App } from './app.jsx';
import ALGORITHMS from './algorithms/index.js';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const sortButtons = () => screen.getAllByRole('button', { name: 'Sort' });
const startSort = (name) => fireEvent.click(sortButtons()[Object.values(ALGORITHMS).findIndex(a => a.name === name)]);

const editItems = (text) => {
  fireEvent.click(screen.getByRole('button', { name: 'Edit items' }));
  fireEvent.change(screen.getByRole('textbox'), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Save' }));
};

const choices = (items) => screen.getAllByRole('button').filter(b => items.includes(b.textContent));

// Always picks the item that comes first alphabetically, so the result reads A→Z.
const finish = (items) => {
  let guard = 100;
  while (screen.queryByText('Which should rank first?') && guard--) {
    const [a, b] = choices(items);
    fireEvent.click(a.textContent < b.textContent ? a : b);
  }
};

describe('Sorting Comparator', () => {
  describe('choosing an algorithm', () => {
    test('shows the title, the item count and every algorithm', () => {
      render(<App />);
      expect(screen.getByText('Sorting Comparator')).toBeTruthy();
      expect(screen.getByText('10 items to sort')).toBeTruthy();
      expect(screen.getByText('Choose an algorithm')).toBeTruthy();
      for (const algo of Object.values(ALGORITHMS)) expect(screen.getByText(algo.name)).toBeTruthy();
      expect(sortButtons()).toHaveLength(Object.keys(ALGORITHMS).length);
    });

    test('each row shows its estimate, stability and whether pairs repeat', () => {
      render(<App />);
      expect(screen.getByText(`~${ALGORITHMS.selection.estimates.avg(10)} comps`)).toBeTruthy();
      expect(screen.getAllByText('stable').length).toBeGreaterThan(0);
      expect(screen.getAllByText('unstable').length).toBeGreaterThan(0);
      expect(screen.getAllByText('no repeats').length).toBeGreaterThan(0);
      expect(screen.getAllByText('may repeat').length).toBeGreaterThan(0);
    });

    test('clicking a row expands its description and scenarios, and clicking again collapses it', () => {
      render(<App />);
      const algo = ALGORITHMS.bubble;
      expect(screen.queryByText(algo.description)).toBeNull();

      fireEvent.click(screen.getByText(algo.name));
      expect(screen.getByText(algo.description)).toBeTruthy();
      for (const s of algo.scenarios) expect(screen.getByTitle(s.note).textContent).toContain(s.label);
      expect(screen.getByText('↻ may repeat pairs')).toBeTruthy();

      fireEvent.click(screen.getByText(algo.name));
      expect(screen.queryByText(algo.description)).toBeNull();
    });

    test('only one row is expanded at a time', () => {
      render(<App />);
      fireEvent.click(screen.getByText(ALGORITHMS.bubble.name));
      fireEvent.click(screen.getByText(ALGORITHMS.merge.name));
      expect(screen.queryByText(ALGORITHMS.bubble.description)).toBeNull();
      expect(screen.getByText(ALGORITHMS.merge.description)).toBeTruthy();
      expect(screen.getByText('✓ no repeated pairs')).toBeTruthy();
    });
  });

  describe('editing items', () => {
    test('saving a list of items replaces the items to sort', () => {
      render(<App />);
      editItems('Apple\n  Banana \n\nCherry');
      expect(screen.queryByText('Edit Items')).toBeNull();
      expect(screen.getByText('3 items to sort')).toBeTruthy();
    });

    test('Save is disabled with fewer than two items', () => {
      render(<App />);
      fireEvent.click(screen.getByRole('button', { name: 'Edit items' }));
      expect(screen.getByText('Edit Items')).toBeTruthy();
      expect(screen.getByText('One item per line. Minimum 2 items.')).toBeTruthy();
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Only one' } });
      expect(screen.getByRole('button', { name: 'Save' }).disabled).toBe(true);
    });

    test('Cancel closes the editor', () => {
      render(<App />);
      fireEvent.click(screen.getByRole('button', { name: 'Edit items' }));
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByText('Edit Items')).toBeNull();
    });
  });

  describe('sorting', () => {
    test('asks which of two items ranks first, counting comparisons against the total', () => {
      render(<App />);
      startSort('Selection Sort');
      expect(screen.getByText('Selection Sort')).toBeTruthy();
      expect(screen.getByText('Which should rank first?')).toBeTruthy();
      expect(screen.getByText('Comparison 1 of 45')).toBeTruthy();
      expect(screen.getByText('45 left')).toBeTruthy();
      expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();

      fireEvent.click(screen.getByRole('button', { name: '= Equal' }));
      expect(screen.getByText('Comparison 2 of 45')).toBeTruthy();
      expect(screen.getByText('44 left')).toBeTruthy();
    });

    test('an algorithm without an exact count shows an upper bound', () => {
      render(<App />);
      startSort('Merge Sort');
      const total = ALGORITHMS.merge.getTotal(10);
      expect(screen.getByText(`Comparison 1 / ≤ ${total}`)).toBeTruthy();
      expect(screen.getByText(`≤ ${total} left`)).toBeTruthy();
    });

    test('Undo steps back one comparison', () => {
      render(<App />);
      startSort('Selection Sort');
      fireEvent.click(screen.getByRole('button', { name: '= Equal' }));
      fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
      expect(screen.getByText('Comparison 1 of 45')).toBeTruthy();
      expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();
    });

    test('Show progress lists the known order, marking the pair being compared', () => {
      const items = ['Apple', 'Banana', 'Cherry', 'Damson'];
      render(<App />);
      editItems(items.join('\n'));
      startSort('Selection Sort');
      fireEvent.click(choices(items)[0]);

      fireEvent.click(screen.getByRole('button', { name: 'Show progress' }));
      expect(screen.getAllByText('comparing')).toHaveLength(2);
      fireEvent.click(screen.getByRole('button', { name: 'Hide progress' }));
      expect(screen.queryByText('comparing')).toBeNull();
    });

    test('Back before any comparison returns to the algorithm list without asking', () => {
      const confirm = vi.fn();
      vi.stubGlobal('confirm', confirm);
      render(<App />);
      startSort('Selection Sort');
      fireEvent.click(screen.getByRole('button', { name: '← Back' }));
      expect(confirm).not.toHaveBeenCalled();
      expect(screen.getByText('Choose an algorithm')).toBeTruthy();
    });

    test('Back after a comparison asks before abandoning the sort', () => {
      const confirm = vi.fn().mockReturnValue(false);
      vi.stubGlobal('confirm', confirm);
      render(<App />);
      startSort('Selection Sort');
      fireEvent.click(screen.getByRole('button', { name: '= Equal' }));

      fireEvent.click(screen.getByRole('button', { name: '← Back' }));
      expect(confirm).toHaveBeenCalledWith('Abandon current sort?');
      expect(screen.getByText('Comparison 2 of 45')).toBeTruthy();

      confirm.mockReturnValue(true);
      fireEvent.click(screen.getByRole('button', { name: '← Back' }));
      expect(screen.getByText('Choose an algorithm')).toBeTruthy();
    });
  });

  describe('results', () => {
    const items = ['Damson', 'Banana', 'Cherry', 'Apple'];

    test('lists the items in the order chosen, with the comparison count', () => {
      render(<App />);
      editItems(items.join('\n'));
      startSort('Selection Sort');
      finish(items);

      expect(screen.getByText('Done!')).toBeTruthy();
      expect(screen.getByText('6 comparisons with Selection Sort')).toBeTruthy();
      const ranks = screen.getAllByText(/^#\d+$/).map(r => r.parentElement.textContent);
      expect(ranks).toEqual(['#1Apple', '#2Banana', '#3Cherry', '#4Damson']);
    });

    test('Try another algorithm returns to the list, keeping the items', () => {
      render(<App />);
      editItems(items.join('\n'));
      startSort('Selection Sort');
      finish(items);
      fireEvent.click(screen.getByRole('button', { name: 'Try another algorithm' }));
      expect(screen.getByText('Choose an algorithm')).toBeTruthy();
      expect(screen.getByText('4 items to sort')).toBeTruthy();
    });

    test('Sort again restarts the same algorithm', () => {
      render(<App />);
      editItems(items.join('\n'));
      startSort('Selection Sort');
      finish(items);
      fireEvent.click(screen.getByRole('button', { name: 'Sort again' }));
      expect(screen.getByText('Selection Sort')).toBeTruthy();
      expect(screen.getByText('Comparison 1 of 6')).toBeTruthy();
    });
  });
});
