import { describe, test, expect } from 'vitest';
import { sampleSpan, sampleRows, averageColour, intensity, lineRatio, readLine, dragCrop, dragMarker } from './analysis.js';

const grey = (v) => ({ r: v, g: v, b: v });

describe('sampleSpan', () => {
  test('trims 10% of the width from each side', () => {
    expect(sampleSpan(100, 0, 0)).toEqual({ startX: 10, sampleWidth: 80 });
  });

  test('trims 10% of the cropped width inside the crop', () => {
    expect(sampleSpan(200, 25, 25)).toEqual({ startX: 60, sampleWidth: 80 });
  });

  test('a crop narrower than 10px is not sampled', () => {
    expect(sampleSpan(50, 45, 40)).toBeNull();
  });
});

describe('sampleRows', () => {
  test('are the row and its neighbours', () => {
    expect(sampleRows(10, 100)).toEqual([9, 10, 11]);
  });

  test('stay inside the image', () => {
    expect(sampleRows(0, 100)).toEqual([0, 0, 1]);
    expect(sampleRows(99, 100)).toEqual([98, 99, 99]);
  });
});

test('averageColour is the mean RGB across every pixel of every run, ignoring alpha', () => {
  const runs = [new Uint8ClampedArray([0, 0, 0, 255, 100, 50, 20, 0]), new Uint8ClampedArray([200, 100, 40, 255])];
  expect(averageColour(runs)).toEqual({ r: 100, g: 50, b: 20 });
});

describe('intensity', () => {
  test('is how much darker than the base a line is', () => {
    expect(intensity(grey(150), grey(200))).toBe(50);
  });

  test('a line lighter than the base is 0', () => {
    expect(intensity(grey(220), grey(200))).toBe(0);
  });
});

describe('lineRatio', () => {
  test('is test intensity over control intensity', () => {
    expect(lineRatio(grey(100), grey(150), grey(200))).toEqual({ controlIntensity: 100, testIntensity: 50, ratio: 0.5 });
  });

  test('can exceed 1 when the test line is darker', () => {
    expect(lineRatio(grey(150), grey(100), grey(200)).ratio).toBe(2);
  });

  test('is 0 when the control line is no more than 5 darker than the base', () => {
    expect(lineRatio(grey(195), grey(100), grey(200)).ratio).toBe(0);
    expect(lineRatio(grey(194), grey(194), grey(200)).ratio).toBe(1);
  });
});

test('readLine averages the three rows around y across the span', () => {
  const calls = [];
  const ctx = {
    getImageData(x, y, w, h) {
      calls.push([x, y, w, h]);
      return { data: new Uint8ClampedArray([y, y, y, 255]) };
    },
  };
  expect(readLine(ctx, { startX: 3, sampleWidth: 7 }, 20, 100)).toEqual(grey(20));
  expect(calls).toEqual([[3, 19, 7, 1], [3, 20, 7, 1], [3, 21, 7, 1]]);
});

describe('dragCrop', () => {
  test('moves the dragged side', () => {
    expect(dragCrop('left', 20, { left: 0, right: 0 })).toEqual({ left: 20, right: 0 });
    expect(dragCrop('right', 70, { left: 0, right: 0 })).toEqual({ left: 0, right: 30 });
  });

  test('keeps 10% between the handles', () => {
    expect(dragCrop('left', 80, { left: 0, right: 30 })).toEqual({ left: 60, right: 30 });
    expect(dragCrop('right', 10, { left: 40, right: 0 })).toEqual({ left: 40, right: 50 });
  });

  test('stays within the photo', () => {
    expect(dragCrop('left', -10, { left: 5, right: 0 })).toEqual({ left: 0, right: 0 });
    expect(dragCrop('right', 120, { left: 0, right: 5 })).toEqual({ left: 0, right: 0 });
  });
});

test('dragMarker keeps a marker between 5% and 95%', () => {
  expect(dragMarker(-3)).toBe(5);
  expect(dragMarker(50)).toBe(50);
  expect(dragMarker(99)).toBe(95);
});
