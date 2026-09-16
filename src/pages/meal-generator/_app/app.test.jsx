import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { App } from './app.jsx';
import { SLOT_COUNT } from './store.js';
import { MEALS } from './meals.js';

afterEach(cleanup);
beforeEach(() => localStorage.clear());

const bands = () => screen.getAllByRole('listitem');
const names = () => bands().map(b => b.querySelector('div > div').textContent);
const lockButton = band => within(band).getByRole('button');
const generateButton = () => screen.getByRole('button', { name: 'Generate' });

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

  test('going back restores the locks of that palette', () => {
    render(<App />);
    fireEvent.click(lockButton(bands()[2]));
    fireEvent.click(generateButton());
    expect(lockButton(bands()[2]).getAttribute('aria-pressed')).toBe('true');

    // Back past the generate, then back past the lock itself.
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(lockButton(bands()[2]).getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
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
