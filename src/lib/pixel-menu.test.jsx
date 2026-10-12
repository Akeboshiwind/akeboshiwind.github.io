import { describe, test, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Menu } from '../components/pixel/Menu.jsx';

afterEach(cleanup);

const svg = '<svg viewBox="0 0 24 24"></svg>';

const renderMenu = (props = {}) => {
  const chosen = [];
  const items = [
    { label: 'Rename', onSelect: () => chosen.push('Rename') },
    { label: 'Archive', onSelect: () => chosen.push('Archive'), disabled: true },
    { label: 'Export', onSelect: () => chosen.push('Export') },
    { label: 'Delete', onSelect: () => chosen.push('Delete') },
  ];
  render(<><Menu label="Options" icon={svg} items={items} {...props} /><button>Elsewhere</button></>);
  return chosen;
};

const trigger = () => screen.getByRole('button', { name: 'Options' });
const menu = () => screen.queryByRole('menu', { name: 'Options' });
const item = (name) => screen.getByRole('menuitem', { name });
const key = (k, target = document.activeElement) => fireEvent.keyDown(target, { key: k });

describe('Menu', () => {
  test('starts closed, its trigger announcing a menu', () => {
    renderMenu();
    expect(trigger().getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(menu()).toBeNull();
  });

  test('the trigger toggles it, and opening focuses the first item', () => {
    renderMenu();
    fireEvent.click(trigger());
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(menu()).toBeTruthy();
    expect(document.activeElement).toBe(item('Rename'));

    fireEvent.click(trigger());
    expect(menu()).toBeNull();
  });

  test('arrow keys move between enabled items and wrap; Home and End jump', () => {
    renderMenu();
    fireEvent.click(trigger());
    key('ArrowDown');
    expect(document.activeElement).toBe(item('Export'));
    key('ArrowDown');
    expect(document.activeElement).toBe(item('Delete'));
    key('ArrowDown');
    expect(document.activeElement).toBe(item('Rename'));
    key('ArrowUp');
    expect(document.activeElement).toBe(item('Delete'));
    key('Home');
    expect(document.activeElement).toBe(item('Rename'));
    key('End');
    expect(document.activeElement).toBe(item('Delete'));
  });

  test('ArrowDown on the trigger opens on the first item, ArrowUp on the last', () => {
    renderMenu();
    key('ArrowDown', trigger());
    expect(document.activeElement).toBe(item('Rename'));
    key('Escape');
    key('ArrowUp', trigger());
    expect(document.activeElement).toBe(item('Delete'));
  });

  test('choosing an item runs it, closes the menu and returns focus to the trigger', () => {
    const chosen = renderMenu();
    fireEvent.click(trigger());
    fireEvent.click(item('Export'));
    expect(chosen).toEqual(['Export']);
    expect(menu()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  test('the chosen item runs with focus already back on the trigger', () => {
    let focusedDuringSelect;
    render(<Menu label="Options" icon={svg} items={[{ label: 'Open', onSelect: () => { focusedDuringSelect = document.activeElement; } }]} />);
    fireEvent.click(trigger());
    fireEvent.click(item('Open'));
    expect(focusedDuringSelect).toBe(trigger());
  });

  test('a disabled item cannot be chosen', () => {
    const chosen = renderMenu();
    fireEvent.click(trigger());
    expect(item('Archive').disabled).toBe(true);
    fireEvent.click(item('Archive'));
    expect(chosen).toEqual([]);
  });

  test('Escape closes it and returns focus to the trigger', () => {
    renderMenu();
    fireEvent.click(trigger());
    key('Escape');
    expect(menu()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  test('a press outside closes it without taking focus back', () => {
    renderMenu();
    fireEvent.click(trigger());
    const elsewhere = screen.getByRole('button', { name: 'Elsewhere' });
    elsewhere.focus();
    fireEvent.pointerDown(elsewhere);
    expect(menu()).toBeNull();
    expect(document.activeElement).toBe(elsewhere);
  });

  test('a press inside the menu leaves it open', () => {
    renderMenu();
    fireEvent.click(trigger());
    fireEvent.pointerDown(item('Rename'));
    expect(menu()).toBeTruthy();
  });

  test('Tab closes it', () => {
    renderMenu();
    fireEvent.click(trigger());
    key('Tab');
    expect(menu()).toBeNull();
  });

  test('reports when it opens and closes', () => {
    const onOpenChange = vi.fn();
    renderMenu({ onOpenChange });
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    fireEvent.click(trigger());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    key('Escape');
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
  });

  test('opens upward when side is "top"', () => {
    renderMenu({ side: 'top' });
    fireEvent.click(trigger());
    expect(menu().dataset.side).toBe('top');
  });
});
