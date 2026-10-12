import { describe, test, expect } from 'vitest';
import { playableCount, totalPlayableDuration, globalPosition, locate, formatTime } from './timeline.js';

const done = (duration) => ({ status: 'completed', duration });
const pending = { status: 'pending', duration: 0 };

describe('the playable run', () => {
  const chunks = [done(10), done(20), pending, done(5)];

  test('is the completed chunks before the first one that is not', () => {
    expect(playableCount(chunks)).toBe(2);
    expect(totalPlayableDuration(chunks)).toBe(30);
    expect(playableCount([pending, done(5)])).toBe(0);
  });

  test('a global position adds the earlier chunks to the time in the current one', () => {
    expect(globalPosition(chunks, 0, 3)).toBe(3);
    expect(globalPosition(chunks, 1, 3)).toBe(13);
    expect(globalPosition(chunks, 1, undefined)).toBe(10);
  });

  test('locate finds the chunk and offset for a global time within the playable run', () => {
    expect(locate(chunks, 0)).toEqual({ index: 0, offset: 0 });
    expect(locate(chunks, 10)).toEqual({ index: 0, offset: 10 });
    expect(locate(chunks, 25)).toEqual({ index: 1, offset: 15 });
    expect(locate(chunks, 31)).toBeNull();
  });
});

test('formatTime is minutes and zero-padded seconds', () => {
  expect(formatTime(0)).toBe('0:00');
  expect(formatTime(65.9)).toBe('1:05');
  expect(formatTime(600)).toBe('10:00');
});
