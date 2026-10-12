import { describe, test, expect } from 'vitest';
import { graphWindow, inWindow, yMax, formatRange, plotArea, xOf, yOf, hitTest } from './graph.js';

const now = new Date(2026, 0, 20, 15, 30);

describe('graphWindow', () => {
  test('ends at midnight tomorrow and spans 30 days', () => {
    const { start, end, endOfEnd } = graphWindow(now, 0);
    expect(end).toEqual(new Date(2026, 0, 21));
    expect(start).toEqual(new Date(2025, 11, 23));
    expect(endOfEnd).toEqual(new Date(2026, 0, 21, 23, 59, 59, 999));
  });

  test('moves back by the offset in days', () => {
    expect(graphWindow(now, 15).end).toEqual(new Date(2026, 0, 6));
  });

  test('formats as day and short month', () => {
    expect(formatRange(graphWindow(now, 0))).toBe('23 Dec – 21 Jan');
  });
});

test('inWindow includes both ends of the window', () => {
  const win = graphWindow(now, 0);
  const at = (d) => ({ timestamp: d.toISOString() });
  expect(inWindow(at(new Date(2025, 11, 23)), win)).toBe(true);
  expect(inWindow(at(new Date(2026, 0, 21, 23, 59)), win)).toBe(true);
  expect(inWindow(at(new Date(2025, 11, 22, 23, 59)), win)).toBe(false);
  expect(inWindow(at(new Date(2026, 0, 22)), win)).toBe(false);
});

test('yMax is at least 1', () => {
  expect(yMax([])).toBe(1);
  expect(yMax([{ score: 0.4 }])).toBe(1);
  expect(yMax([{ score: 0.4 }, { score: 1.6 }])).toBe(1.6);
});

describe('plotting', () => {
  const win = graphWindow(now, 0);
  const area = plotArea(335, 250);

  test('the plot area sits inside the padding', () => {
    expect(area).toEqual({ w: 290, h: 190 });
  });

  test('the first day is the left edge and the last the right', () => {
    expect(xOf(win.start, win, area)).toBe(35);
    expect(xOf(win.end, win, area)).toBe(325);
  });

  test('0 is the bottom and the top score the top', () => {
    expect(yOf(0, 1, area)).toBe(210);
    expect(yOf(1, 1, area)).toBe(20);
  });

  test('hitTest finds the first point in view within 15px of the click', () => {
    const entries = [
      { score: 0.5, timestamp: new Date(2025, 0, 1).toISOString() },
      { score: 1, timestamp: win.end.toISOString() },
      { score: 1, timestamp: win.end.toISOString() },
    ];
    expect(hitTest(entries, win, 335, 250, 320, 25)).toBe(1);
    expect(hitTest(entries, win, 335, 250, 100, 100)).toBe(-1);
  });
});
