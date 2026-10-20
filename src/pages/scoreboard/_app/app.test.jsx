import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const tap = (el, { x = 100, y = 100, dy = 0 } = {}) => {
  fireEvent.pointerDown(el, { clientX: x, clientY: y });
  fireEvent.pointerUp(el, { clientX: x, clientY: y + dy });
};

describe('Scoreboard', () => {
  beforeEach(() => { localStorage.clear(); });

  test('starts both sides at zero and the match timer at 3:00', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Home: 0' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Away: 0' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /start timer/i }).textContent).toContain('03:00');
  });

  test('a tap adds a point and a swipe down takes one away', () => {
    render(<App />);
    const home = screen.getByRole('button', { name: 'Home: 0' });
    tap(home);
    tap(home);
    expect(home.getAttribute('aria-label')).toBe('Home: 2');
    tap(home, { dy: 80 });
    expect(home.getAttribute('aria-label')).toBe('Home: 1');
  });

  test('a score never goes below zero', () => {
    render(<App />);
    const away = screen.getByRole('button', { name: 'Away: 0' });
    tap(away, { dy: 80 });
    expect(away.getAttribute('aria-label')).toBe('Away: 0');
  });

  test('the keyboard scores too', () => {
    render(<App />);
    const home = screen.getByRole('button', { name: 'Home: 0' });
    fireEvent.keyDown(home, { key: 'Enter' });
    fireEvent.keyDown(home, { key: 'ArrowUp' });
    fireEvent.keyDown(home, { key: 'ArrowDown' });
    expect(home.getAttribute('aria-label')).toBe('Home: 1');
  });

  test('scores survive a reload', () => {
    const { unmount } = render(<App />);
    tap(screen.getByRole('button', { name: 'Away: 0' }));
    unmount();
    render(<App />);
    expect(screen.getByRole('button', { name: 'Away: 1' })).toBeTruthy();
  });

  test('the match timer runs down to full time', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(screen.getByRole('button', { name: /pause timer/i }).textContent).toContain('02:00');
    act(() => { vi.advanceTimersByTime(120_000); });
    expect(screen.getByRole('button', { name: /hold to reset/i }).textContent).toContain('00:00');
    expect(screen.getByText('Full time')).toBeTruthy();
  });

  test('pausing holds the time', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
    act(() => { vi.advanceTimersByTime(10_000); });
    fireEvent.click(screen.getByRole('button', { name: /pause timer/i }));
    act(() => { vi.advanceTimersByTime(30_000); });
    expect(screen.getByRole('button', { name: /start timer/i }).textContent).toContain('02:50');
    expect(screen.getByText('Paused')).toBeTruthy();
  });

  test('holding the timer resets it, without also starting it', () => {
    vi.useFakeTimers();
    render(<App />);
    const timer = screen.getByRole('button', { name: /start timer/i });
    fireEvent.click(timer);
    act(() => { vi.advanceTimersByTime(10_000); });
    fireEvent.pointerDown(timer);
    act(() => { vi.advanceTimersByTime(700); });
    fireEvent.pointerUp(timer);
    fireEvent.click(timer);
    expect(timer.textContent).toContain('03:00');
    expect(timer.getAttribute('aria-label')).toMatch(/start timer/i);
  });

  test('settings change the match length and the points per tap', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.change(screen.getByLabelText('Minutes'), { target: { value: '10' } });
    fireEvent.change(screen.getByLabelText('Seconds'), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByRole('button', { name: /start timer/i }).textContent).toContain('10:30');
    const home = screen.getByRole('button', { name: 'Home: 0' });
    tap(home);
    expect(home.getAttribute('aria-label')).toBe('Home: 3');
  });

  test('the stopwatch counts up', () => {
    vi.useFakeTimers();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Stopwatch' }));
    expect(screen.queryByLabelText('Minutes')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
    act(() => { vi.advanceTimersByTime(65_000); });
    expect(screen.getByRole('button', { name: /pause timer/i }).textContent).toContain('01:05');
  });

  test('fullscreen lives in settings, not on the board', () => {
    render(<App />);
    expect(screen.queryByRole('button', { name: /fullscreen/i })).toBeNull();
  });

  test('settings offer fullscreen only where the browser supports it', () => {
    const { unmount } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    expect(screen.queryByLabelText('Fullscreen')).toBeNull();
    unmount();

    Object.defineProperty(document, 'fullscreenEnabled', { value: true, configurable: true });
    try {
      render(<App />);
      fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
      expect(screen.getByLabelText('Fullscreen')).toBeTruthy();
    } finally {
      delete document.fullscreenEnabled;
    }
  });

  test('reset everything zeroes the scores and the timer', () => {
    vi.useFakeTimers();
    render(<App />);
    tap(screen.getByRole('button', { name: 'Home: 0' }));
    fireEvent.click(screen.getByRole('button', { name: /start timer/i }));
    act(() => { vi.advanceTimersByTime(5_000); });
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset everything' }));
    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.getByRole('button', { name: 'Home: 0' })).toBeTruthy();
    expect(screen.getByRole('button', { name: /start timer/i }).textContent).toContain('03:00');
  });
});
