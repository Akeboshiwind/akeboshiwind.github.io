import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

describe('Exercise app', () => {
  beforeEach(() => { localStorage.clear(); });

  test('renders the current day name', () => {
    render(<App />);
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const found = dayNames.some(d => screen.queryByText(d));
    expect(found).toBe(true);
  });

  test('has a home link', () => {
    render(<App />);
    const home = screen.getByText('← Home').closest('a');
    expect(home.getAttribute('href')).toBe('../');
  });

  test('sets are inert until the user starts a session', () => {
    render(<App />);
    const startBtn = screen.queryByRole('button', { name: /^start (workout|.*'s workout)/i });
    if (!startBtn) return; // rest day, skip
    // Sets exist but clicking does nothing while no session is running.
    const set1 = screen.queryAllByRole('button', { name: /set 1|done/i })[0];
    if (set1) {
      fireEvent.click(set1);
      const beforeStart = JSON.parse(localStorage.getItem('exercise_state') || '{}');
      expect(beforeStart.inProgress ?? null).toBeNull();
    }
    fireEvent.click(startBtn);
    const stored = JSON.parse(localStorage.getItem('exercise_state'));
    expect(stored.inProgress).not.toBeNull();
    expect(stored.inProgress.startedAt).toBeTypeOf('number');
    // After starting, toggling a set should record it.
    const setNow = screen.queryAllByRole('button', { name: /set 1|done/i })[0];
    if (setNow) {
      fireEvent.click(setNow);
      const after = JSON.parse(localStorage.getItem('exercise_state'));
      expect(after.inProgress.completedSets).toBeTruthy();
    }
  });

  test('finishing an empty workout warns and does nothing', () => {
    const original = window.confirm;
    window.confirm = vi.fn(() => false);
    render(<App />);
    const startBtn = screen.queryByRole('button', { name: /^start (workout|.*'s workout)/i });
    if (!startBtn) {
      window.confirm = original;
      return; // rest day
    }
    fireEvent.click(startBtn);
    const finish = screen.getByRole('button', { name: /finish workout/i });
    fireEvent.click(finish);
    expect(window.confirm).toHaveBeenCalled();
    const stored = JSON.parse(localStorage.getItem('exercise_state') || '{}');
    expect(stored.history?.length ?? 0).toBe(0);
    window.confirm = original;
  });

  test('cancel button discards an in-progress session after confirmation', () => {
    const original = window.confirm;
    window.confirm = vi.fn(() => true);
    render(<App />);
    const startBtn = screen.queryByRole('button', { name: /^start (workout|.*'s workout)/i });
    if (!startBtn) {
      window.confirm = original;
      return;
    }
    fireEvent.click(startBtn);
    const cancel = screen.getByRole('button', { name: /^cancel$/i });
    fireEvent.click(cancel);
    expect(window.confirm).toHaveBeenCalled();
    const stored = JSON.parse(localStorage.getItem('exercise_state'));
    expect(stored.inProgress).toBeNull();
    expect(stored.history?.length ?? 0).toBe(0);
    window.confirm = original;
  });
});
