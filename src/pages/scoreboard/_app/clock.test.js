import { describe, test, expect } from 'vitest';
import { STOPPED, STOPWATCH_CAP, start, stop, isRunning, shown, fmtTime } from './clock.js';

describe('clock', () => {
  test('counts only the time it was running', () => {
    let c = start(STOPPED, 1_000);
    c = stop(c, 4_000);
    c = start(c, 10_000);
    expect(shown(c, 12_500, { mode: 'up', duration: 180 })).toBe(5);
  });

  test('starting a running clock, or stopping a stopped one, changes nothing', () => {
    const running = start(STOPPED, 1_000);
    expect(start(running, 5_000)).toBe(running);
    expect(stop(STOPPED, 5_000)).toBe(STOPPED);
    expect(isRunning(running)).toBe(true);
    expect(isRunning(STOPPED)).toBe(false);
  });

  test('a match timer counts down from its length and stops at zero', () => {
    const c = start(STOPPED, 0);
    expect(shown(c, 59_999, { mode: 'down', duration: 180 })).toBe(121);
    expect(shown(c, 999_000, { mode: 'down', duration: 180 })).toBe(0);
  });

  test('a stopwatch stops at the most MM:SS can show', () => {
    const c = start(STOPPED, 0);
    expect(shown(c, 200 * 60_000, { mode: 'up', duration: 180 })).toBe(STOPWATCH_CAP);
    expect(fmtTime(STOPWATCH_CAP)).toBe('99:59');
  });

  test('formats seconds as MM:SS', () => {
    expect(fmtTime(0)).toBe('00:00');
    expect(fmtTime(185)).toBe('03:05');
  });
});
