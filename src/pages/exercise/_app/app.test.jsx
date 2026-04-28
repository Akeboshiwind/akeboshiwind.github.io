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

  test('toggling a set persists to localStorage', () => {
    render(<App />);
    // Find any "Set 1" button (rest days won't have one — Wed/Sun)
    const set1 = screen.queryAllByRole('button', { name: /set 1|done/i })[0];
    if (!set1) return; // rest day, skip
    expect(set1.getAttribute('aria-pressed')).toBe('false');
    fireEvent.click(set1);
    expect(set1.getAttribute('aria-pressed')).toBe('true');
    const stored = JSON.parse(localStorage.getItem('exercise_state'));
    expect(stored.inProgress).not.toBeNull();
    expect(stored.inProgress.completedSets).toBeTruthy();
  });

  test('finishing an empty workout warns and does nothing', () => {
    const original = window.confirm;
    window.confirm = vi.fn(() => false);
    render(<App />);
    const finish = screen.queryByRole('button', { name: /finish workout/i });
    if (!finish) {
      window.confirm = original;
      return;
    }
    fireEvent.click(finish);
    expect(window.confirm).toHaveBeenCalled();
    const stored = JSON.parse(localStorage.getItem('exercise_state') || '{}');
    expect(stored.history?.length ?? 0).toBe(0);
    window.confirm = original;
  });
});
