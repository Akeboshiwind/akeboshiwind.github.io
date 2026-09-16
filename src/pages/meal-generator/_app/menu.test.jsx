import { describe, test, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { Menu } from './menu.jsx';
import { MEALS } from './meals.js';

afterEach(() => {
  cleanup();
  delete window.__setTheme;
  delete document.documentElement.dataset.themePref;
});

const slots = [
  { id: 'pasta', locked: false },
  { id: 'rajma', locked: true },
  { id: 'bhindi', locked: false },
  { id: 'sambar', locked: false },
  { id: 'palak-tofu', locked: false },
];

const openMenu = () => fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
const openMeals = () => {
  openMenu();
  fireEvent.click(screen.getByRole('button', { name: 'All meals' }));
};

describe('Menu', () => {
  test('starts closed', () => {
    render(<Menu slots={slots} />);
    const button = screen.getByRole('button', { name: 'Menu' });

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  test('opens on the menu button and closes again', () => {
    render(<Menu slots={slots} />);
    openMenu();

    expect(screen.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'All meals' })).toBeTruthy();

    openMenu();
    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  test('closes on a click outside and on Escape', () => {
    render(<Menu slots={slots} />);

    openMenu();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('radiogroup')).toBeNull();

    openMenu();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  describe('theme', () => {
    beforeEach(() => { window.__setTheme = vi.fn(); });

    test('offers the three settings, marking the current one', () => {
      document.documentElement.dataset.themePref = 'dark';
      render(<Menu slots={slots} />);
      openMenu();

      const group = screen.getByRole('radiogroup', { name: 'Theme' });
      const labels = within(group).getAllByRole('radio').map(r => r.textContent);
      expect(labels).toEqual(['Auto', 'Light', 'Dark']);
      expect(within(group).getByRole('radio', { name: 'Dark' }).getAttribute('aria-checked')).toBe('true');
    });

    test('defaults to auto when nothing is stored', () => {
      render(<Menu slots={slots} />);
      openMenu();
      expect(screen.getByRole('radio', { name: 'Auto' }).getAttribute('aria-checked')).toBe('true');
    });

    test('choosing one applies it site-wide', () => {
      render(<Menu slots={slots} />);
      openMenu();
      fireEvent.click(screen.getByRole('radio', { name: 'Light' }));

      expect(window.__setTheme).toHaveBeenCalledWith('light');
      expect(screen.getByRole('radio', { name: 'Light' }).getAttribute('aria-checked')).toBe('true');
      expect(screen.getByRole('radio', { name: 'Auto' }).getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('unlock all', () => {
    test('is offered, and disabled when nothing is locked', () => {
      render(<Menu slots={slots.map(s => ({ ...s, locked: false }))} anyLocked={false} />);
      openMenu();
      expect(screen.getByRole('button', { name: 'Unlock all' }).disabled).toBe(true);
    });

    test('runs and closes the menu when something is locked', () => {
      const onUnlockAll = vi.fn();
      render(<Menu slots={slots} anyLocked onUnlockAll={onUnlockAll} />);
      openMenu();

      const item = screen.getByRole('button', { name: 'Unlock all' });
      expect(item.disabled).toBe(false);
      fireEvent.click(item);

      expect(onUnlockAll).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('radiogroup')).toBeNull();
    });
  });

  describe('all meals', () => {
    test('lists every meal the generator draws from', () => {
      render(<Menu slots={slots} />);
      openMeals();

      const dialog = screen.getByRole('dialog', { name: 'All meals' });
      const listed = within(dialog).getAllByRole('listitem').map(li => li.textContent);
      expect(listed).toHaveLength(MEALS.length);
      for (const meal of MEALS) {
        expect(listed.some(text => text.startsWith(meal.name)), meal.name).toBe(true);
      }
    });

    test('marks the meals in the current palette, locked ones apart', () => {
      render(<Menu slots={slots} />);
      openMeals();

      const dialog = screen.getByRole('dialog', { name: 'All meals' });
      expect(within(dialog).getAllByText('in this set')).toHaveLength(4);
      expect(within(dialog).getByText('locked').closest('li').textContent).toContain('Rajma');
      expect(within(dialog).queryAllByText(/in this set|locked/)).toHaveLength(slots.length);
    });

    test('the list can shrink and scroll inside the sheet', () => {
      render(<Menu slots={slots} />);
      openMeals();

      const list = screen.getByRole('dialog', { name: 'All meals' }).querySelector('ul');
      // Without min-h-0 the list refuses to shrink in the flex column and
      // overflows the sheet rather than scrolling within it.
      expect(list.className).toContain('min-h-0');
      expect(list.className).toContain('overflow-y-auto');
      expect(list.className).toContain('flex-1');
    });

    test('closes on its close button, the backdrop and Escape', () => {
      render(<Menu slots={slots} />);

      openMeals();
      fireEvent.click(screen.getByRole('button', { name: 'Close' }));
      expect(screen.queryByRole('dialog')).toBeNull();

      openMeals();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByRole('dialog')).toBeNull();

      openMeals();
      fireEvent.click(screen.getByRole('dialog').parentElement);
      expect(screen.queryByRole('dialog')).toBeNull();
    });

    test('a click inside the dialog leaves it open', () => {
      render(<Menu slots={slots} />);
      openMeals();

      fireEvent.click(screen.getByText('Pasta'));
      expect(screen.queryByRole('dialog')).toBeTruthy();
    });
  });

  test('reports whether anything is open', () => {
    const onOpenChange = vi.fn();
    render(<Menu slots={slots} onOpenChange={onOpenChange} />);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    openMenu();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    // The popover closes as the dialog opens — still open, as far as the app
    // is concerned.
    fireEvent.click(screen.getByRole('button', { name: 'All meals' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
