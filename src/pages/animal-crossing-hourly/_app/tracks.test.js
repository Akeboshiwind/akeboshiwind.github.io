import { describe, test, expect } from 'vitest';
import { TRACKS, TRACK_SECONDS, embedOrigin, formatOffset, trackFor } from './tracks.js';

describe('tracks', () => {
  test('covers every hour of the day exactly once', () => {
    expect(TRACKS).toHaveLength(24);
    expect(TRACKS.map((t) => t.hour)).toEqual([...Array(24).keys()]);
    expect(new Set(TRACKS.map((t) => t.videoId)).size).toBe(24);
  });

  test('picks the video for the current hour and the offset within it', () => {
    const track = trackFor(new Date(2026, 0, 1, 14, 30, 20));
    expect(track.videoId).toBe('PjGfsuEgF6g');
    expect(track.label).toBe('2 PM');
    expect(track.offset).toBe(30 * 60 + 20);
  });

  test('starts at zero on the hour and stays inside the video', () => {
    expect(trackFor(new Date(2026, 0, 1, 0, 0, 0))).toMatchObject({
      videoId: 'AsM6_fhicWg',
      offset: 0,
    });
    expect(trackFor(new Date(2026, 0, 1, 23, 59, 59)).offset).toBeLessThan(TRACK_SECONDS);
  });

  test('formats offsets as mm:ss', () => {
    expect(formatOffset(0)).toBe('00:00');
    expect(formatOffset(65)).toBe('01:05');
    expect(formatOffset(3599)).toBe('59:59');
  });

  test('only forwards an http(s) origin to the embed', () => {
    expect(embedOrigin('https://bythe.rocks')).toBe('https://bythe.rocks');
    expect(embedOrigin('http://localhost:4321')).toBe('http://localhost:4321');
    expect(embedOrigin('minis://workspace')).toBeUndefined();
    expect(embedOrigin('null')).toBeUndefined();
  });
});
