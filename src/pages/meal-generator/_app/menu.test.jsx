import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { Menu } from './menu.jsx';
import { MEALS } from './meals.js';

afterEach(cleanup);

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
  fireEvent.click(screen.getByRole('menuitem', { name: 'All meals' }));
};
const menuItems = () => screen.queryByRole('menuitem', { name: 'All meals' });

describe('Menu', () => {
  test('starts closed', () => {
    render(<Menu slots={slots} />);
    const button = screen.getByRole('button', { name: 'Menu' });

    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(menuItems()).toBeNull();
  });

  test('opens on the menu button and closes again', () => {
    render(<Menu slots={slots} />);
    openMenu();

    expect(screen.getByRole('button', { name: 'Menu' }).getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('menuitem', { name: 'Unlock all' })).toBeTruthy();
    expect(screen.getByRole('menuitem', { name: 'All meals' })).toBeTruthy();

    openMenu();
    expect(menuItems()).toBeNull();
  });

  test('closes on a click outside and on Escape', () => {
    render(<Menu slots={slots} />);

    openMenu();
    fireEvent.pointerDown(document.body);
    expect(menuItems()).toBeNull();

    openMenu();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(menuItems()).toBeNull();
  });

  test('leaves the theme to the app bar', () => {
    render(<Menu slots={slots} />);
    openMenu();
    expect(screen.queryByRole('radiogroup')).toBeNull();
  });

  describe('unlock all', () => {
    test('is offered, and disabled when nothing is locked', () => {
      render(<Menu slots={slots.map(s => ({ ...s, locked: false }))} anyLocked={false} />);
      openMenu();
      expect(screen.getByRole('menuitem', { name: 'Unlock all' }).disabled).toBe(true);
    });

    test('runs and closes the menu when something is locked', () => {
      const onUnlockAll = vi.fn();
      render(<Menu slots={slots} anyLocked onUnlockAll={onUnlockAll} />);
      openMenu();

      const item = screen.getByRole('menuitem', { name: 'Unlock all' });
      expect(item.disabled).toBe(false);
      fireEvent.click(item);

      expect(onUnlockAll).toHaveBeenCalledTimes(1);
      expect(menuItems()).toBeNull();
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

    test('hands focus back to the menu button, since the item that opened it has gone', () => {
      render(<Menu slots={slots} />);
      openMeals();
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Menu' }));
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
    fireEvent.click(screen.getByRole('menuitem', { name: 'All meals' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });
});
