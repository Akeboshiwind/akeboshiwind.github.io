import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { App } from './app.jsx';
import { SLOT_COUNT } from './store.js';
import { MEALS, mealById } from './meals.js';
import { swatch } from './color.js';

afterEach(cleanup);
beforeEach(() => localStorage.clear());

const palette = () => screen.getByRole('list', { name: 'Palette' });
const bands = () => within(palette()).getAllByRole('listitem');
const nameButton = band => within(band).getByRole('button', { name: /^Change / });
const names = () => bands().map(b => nameButton(b).textContent);
const lockButton = band => within(band).getByRole('button', { name: /^(Lock|Unlock) / });
const generateButton = () => screen.getByRole('button', { name: 'Generate' });
const openPicker = i => fireEvent.click(nameButton(bands()[i]));
const pickerRow = name => within(screen.getByRole('dialog')).getByRole('button', { name: new RegExp(`^${name}`) });

describe('Meal Generator', () => {
  test('renders a palette of distinct meals', () => {
    render(<App />);
    expect(screen.getByText('Meal Generator')).toBeTruthy();

    const shown = names();
    expect(shown).toHaveLength(SLOT_COUNT);
    expect(new Set(shown).size).toBe(SLOT_COUNT);
    const known = new Set(MEALS.map(m => m.name));
    expect(shown.every(n => known.has(n))).toBe(true);
  });

  test('has a home link', () => {
    render(<App />);
    expect(screen.getByText('← Home').closest('a').getAttribute('href')).toBe('../');
  });

  test('generate replaces the meals', () => {
    render(<App />);
    const before = names();
    fireEvent.click(generateButton());
    expect(names()).not.toEqual(before);
  });

  test('a locked meal survives generation, an unlocked one may not', () => {
    render(<App />);
    const pinned = names()[1];
    fireEvent.click(lockButton(bands()[1]));

    for (let i = 0; i < 10; i++) fireEvent.click(generateButton());
    expect(names()[1]).toBe(pinned);

    fireEvent.click(lockButton(bands()[1]));
    const rolls = Array.from({ length: 20 }, () => {
      fireEvent.click(generateButton());
      return names()[1];
    });
    expect(rolls.some(n => n !== pinned)).toBe(true);
  });

  test('the lock button reports its state', () => {
    render(<App />);
    const button = lockButton(bands()[0]);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.getAttribute('aria-label')).toMatch(/^Lock /);

    fireEvent.click(button);
    const after = lockButton(bands()[0]);
    expect(after.getAttribute('aria-pressed')).toBe('true');
    expect(after.getAttribute('aria-label')).toMatch(/^Unlock /);
  });

  test('unlock all clears every lock, leaving the history where it was', () => {
    render(<App />);
    fireEvent.click(generateButton());
    const meals = names();
    fireEvent.click(lockButton(bands()[0]));
    fireEvent.click(lockButton(bands()[2]));

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    fireEvent.click(screen.getByRole('button', { name: 'Unlock all' }));

    expect(bands().map(b => lockButton(b).getAttribute('aria-pressed'))).toEqual(Array(SLOT_COUNT).fill('false'));
    expect(names()).toEqual(meals);
    expect(screen.getByText('2 / 2')).toBeTruthy();
  });

  test('unlock all is offered only when something is locked', () => {
    render(<App />);
    const item = () => {
      fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
      return screen.getByRole('button', { name: 'Unlock all' });
    };

    expect(item().disabled).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });

    fireEvent.click(lockButton(bands()[1]));
    expect(item().disabled).toBe(false);
  });

  test('back and forward walk the history', () => {
    render(<App />);
    const first = names();
    fireEvent.click(generateButton());
    const second = names();

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(names()).toEqual(first);

    fireEvent.click(screen.getByRole('button', { name: 'Forward' }));
    expect(names()).toEqual(second);
  });

  test('back and forward are disabled at the ends of the history', () => {
    render(<App />);
    const back = () => screen.getByRole('button', { name: 'Back' });
    const forward = () => screen.getByRole('button', { name: 'Forward' });

    expect(back().disabled).toBe(true);
    expect(forward().disabled).toBe(true);

    fireEvent.click(generateButton());
    expect(back().disabled).toBe(false);
    expect(forward().disabled).toBe(true);

    fireEvent.click(back());
    expect(forward().disabled).toBe(false);
  });

  test('locking is not a history step', () => {
    render(<App />);
    const back = () => screen.getByRole('button', { name: 'Back' });

    // Nothing generated yet, so there is nowhere to step back to — and
    // locking must not invent somewhere.
    fireEvent.click(lockButton(bands()[2]));
    expect(back().disabled).toBe(true);
    expect(screen.getByText('1 / 1')).toBeTruthy();

    fireEvent.click(generateButton());
    expect(screen.getByText('2 / 2')).toBeTruthy();

    // One step back lands on the palette the lock was set on, not on a
    // separate entry recording the lock.
    fireEvent.click(back());
    expect(back().disabled).toBe(true);
    expect(lockButton(bands()[2]).getAttribute('aria-pressed')).toBe('true');
  });

  test('a generated palette keeps the locks it was made with', () => {
    render(<App />);
    fireEvent.click(lockButton(bands()[2]));
    const pinned = names()[2];

    fireEvent.click(generateButton());
    expect(names()[2]).toBe(pinned);
    expect(lockButton(bands()[2]).getAttribute('aria-pressed')).toBe('true');

    // Unlocking here stays with this palette; the one behind keeps its lock.
    fireEvent.click(lockButton(bands()[2]));
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(lockButton(bands()[2]).getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Forward' }));
    expect(lockButton(bands()[2]).getAttribute('aria-pressed')).toBe('false');
  });

  test('space generates, arrows step through history', () => {
    render(<App />);
    const first = names();

    fireEvent.keyDown(document.body, { key: ' ' });
    const second = names();
    expect(second).not.toEqual(first);

    fireEvent.keyDown(document.body, { key: 'ArrowLeft' });
    expect(names()).toEqual(first);

    fireEvent.keyDown(document.body, { key: 'ArrowRight' });
    expect(names()).toEqual(second);
  });

  test('the top band leaves room for the nav pill on mobile only', () => {
    render(<App />);
    const [first, ...rest] = bands();

    expect(first.className).toContain('pt-14');
    expect(first.className).toContain('flex-[1.25]');
    // Desktop lays the bands out as equal columns, with the pill clear of them.
    expect(first.className).toContain('md:flex-1');
    expect(first.className).toContain('md:pt-5');

    for (const band of rest) {
      expect(band.className).not.toContain('pt-14');
      expect(band.className).toContain('flex-1');
    }
  });

  test('the browser chrome is tinted with the top band, and follows it', () => {
    render(<App />);
    const chrome = () => document.head.querySelector('meta[name="theme-color"]')?.getAttribute('content');
    const topHex = () => swatch(MEALS.find(m => m.name === names()[0]).hue).hex;

    expect(chrome()).toBe(topHex());

    fireEvent.click(generateButton());
    expect(chrome()).toBe(topHex());

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(chrome()).toBe(topHex());
  });

  test('tapping a name picks a meal by hand, and locks the band', () => {
    render(<App />);
    const taken = new Set(names());
    const free = MEALS.find(m => !taken.has(m.name));

    openPicker(1);
    expect(screen.getByRole('dialog', { name: /Choose a meal/ })).toBeTruthy();
    fireEvent.click(pickerRow(free.name));

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(names()[1]).toBe(free.name);
    expect(lockButton(bands()[1]).getAttribute('aria-pressed')).toBe('true');

    // Locked, so the next generate leaves it alone.
    fireEvent.click(generateButton());
    expect(names()[1]).toBe(free.name);
  });

  test('picking a meal already on another band swaps the two', () => {
    render(<App />);
    const [a, b] = names();

    openPicker(0);
    fireEvent.click(pickerRow(b));

    expect(names()[0]).toBe(b);
    expect(names()[1]).toBe(a);
    expect(new Set(names()).size).toBe(SLOT_COUNT);
    expect(lockButton(bands()[1]).getAttribute('aria-pressed')).toBe('false');
  });

  test("a locked band won't give its meal up to the picker", () => {
    render(<App />);
    const pinned = names()[3];
    fireEvent.click(lockButton(bands()[3]));

    openPicker(0);
    expect(pickerRow(pinned).disabled).toBe(true);
  });

  test('the picker marks the band\'s own meal as current', () => {
    render(<App />);
    const own = names()[2];

    openPicker(2);
    const row = pickerRow(own);
    expect(row.getAttribute('aria-current')).toBe('true');
    expect(row.disabled).toBe(false);
  });

  test('the picker closes on Escape, leaving the band alone', () => {
    render(<App />);
    const before = names();

    openPicker(0);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(names()).toEqual(before);
    expect(lockButton(bands()[0]).getAttribute('aria-pressed')).toBe('false');
  });

  test('the keyboard shortcuts stand down while the picker is open', () => {
    render(<App />);
    const before = names();

    openPicker(0);
    fireEvent.keyDown(document.body, { key: ' ' });
    expect(names()).toEqual(before);
  });

  test('bands show the meal alone, with no colour code', () => {
    render(<App />);
    for (const band of bands()) {
      expect(band.textContent).not.toMatch(/#[0-9A-F]{6}/);
    }
  });

  test('bands change colour outright, with no transition', () => {
    render(<App />);
    for (const band of bands()) {
      expect(band.className).not.toMatch(/transition|duration|animate/);
    }
  });

  test('the menu reaches the theme setting and the meal list', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('radiogroup', { name: 'Theme' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'All meals' }));
    const dialog = screen.getByRole('dialog', { name: 'All meals' });
    expect(within(dialog).getAllByText('in this set')).toHaveLength(SLOT_COUNT);
  });

  test('the keyboard shortcuts stand down while the menu is open', () => {
    render(<App />);
    const before = names();

    fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
    fireEvent.keyDown(document.body, { key: ' ' });
    expect(names()).toEqual(before);

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.keyDown(document.body, { key: ' ' });
    expect(names()).not.toEqual(before);
  });

  test('the palette and its locks survive a reload', () => {
    render(<App />);
    fireEvent.click(generateButton());
    fireEvent.click(lockButton(bands()[0]));
    const shown = names();

    cleanup();
    render(<App />);

    expect(names()).toEqual(shown);
    expect(lockButton(bands()[0]).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Back' }).disabled).toBe(false);
  });

  test('a corrupt stored palette falls back to a fresh one', () => {
    localStorage.setItem('mealGenerator_state', '{"entries":[[{"id":"not-a-meal","locked":false}]],"index":0}');
    render(<App />);

    expect(names()).toHaveLength(SLOT_COUNT);
    expect(screen.getByRole('button', { name: 'Back' }).disabled).toBe(true);
  });
});
