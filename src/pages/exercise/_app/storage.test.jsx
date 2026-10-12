import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, within } from '@testing-library/react';
import { App } from './app.jsx';
import { savedState, TODAY } from './fixture.js';

const KEY = 'exercise_state';

const card = name => screen.getByRole('heading', { name }).closest('li');

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(TODAY);
  localStorage.clear();
  window.location.hash = '';
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('a state saved under exercise_state in today\'s shape', () => {
  test('is the only key the app reads and writes, and loading it leaves it as it was', () => {
    const saved = JSON.stringify(savedState());
    localStorage.setItem(KEY, saved);
    render(<App />);
    expect(Object.keys(localStorage)).toEqual([KEY]);
    expect(JSON.parse(localStorage.getItem(KEY))).toEqual(JSON.parse(saved));
  });

  test('shows its template and in-progress session on Today', () => {
    localStorage.setItem(KEY, JSON.stringify(savedState()));
    render(<App />);

    expect(screen.getByText('Tuesday')).toBeTruthy();
    expect(screen.getByText('Legs and Core')).toBeTruthy();
    expect(screen.getByText('1 / 8 done')).toBeTruthy();
    expect(screen.getByText('Session in progress')).toBeTruthy();
    expect(screen.getByText('Main Work')).toBeTruthy();

    const goblet = within(card('Goblet Squat'));
    expect(goblet.getByText('3 × 10 · 12 kg · 60s rest')).toBeTruthy();
    expect(goblet.getByRole('button', { name: 'Set 1' }).getAttribute('aria-pressed')).toBe('true');
    expect(goblet.getByRole('button', { name: 'Set 2' }).getAttribute('aria-pressed')).toBe('false');

    expect(within(card('Front Plank')).getByText('2 × 40s · 20s rest')).toBeTruthy();
    expect(within(card('Easy Jog')).getByText('10 min')).toBeTruthy();

    const finisher = within(card('Finisher'));
    expect(finisher.getByText('Round 1 of 2')).toBeTruthy();
    expect(finisher.getByRole('button', { name: 'Mark Burpee not done' }).getAttribute('aria-pressed')).toBe('true');
  });

  test('lists its history by week, newest first', async () => {
    localStorage.setItem(KEY, JSON.stringify(savedState()));
    window.location.hash = '#/history';
    render(<App />);

    expect(screen.getByText('Last week')).toBeTruthy();
    const entries = screen.getAllByRole('button', { name: /· Tuesday/ });
    expect(entries).toHaveLength(2);
    expect(within(entries[0]).getByText('7/8')).toBeTruthy();
    expect(within(entries[0]).getByText('Legs and Core · 42m')).toBeTruthy();
    expect(within(entries[1]).getByText('1/2')).toBeTruthy();
    expect(within(entries[1]).getByText('Old Upper Day · 1h 05m')).toBeTruthy();
  });

  test('opens a history entry from its snapshot, with its sets ticked and locked', () => {
    localStorage.setItem(KEY, JSON.stringify(savedState()));
    window.location.hash = '#/history/h_1759780000000';
    render(<App />);

    expect(screen.getByText('Legs and Core')).toBeTruthy();
    expect(screen.getByText(/7\/8 done · 42m$/)).toBeTruthy();
    const goblet = within(card('Goblet Squat'));
    for (const name of ['Set 1', 'Set 2', 'Set 3']) {
      const set = goblet.getByRole('button', { name });
      expect(set.getAttribute('aria-pressed')).toBe('true');
      expect(set.disabled).toBe(true);
    }
    expect(within(card('Finisher')).getByText('Round 2 of 2')).toBeTruthy();
  });
});
