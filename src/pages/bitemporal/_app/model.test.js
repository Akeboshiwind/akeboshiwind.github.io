import { describe, test, expect } from 'vitest';
import {
  normalizeRoomCode,
  snapToGrid,
  hitTest,
  pointHitTest,
  menuTargets,
  eventsInSelection,
  pointsInSelection,
  moveEvent,
  resizeEvent,
  scaleEvent,
  spanScale,
  eventFromDrag,
  toggleOpen,
  removeIndices,
  eventToDml,
  generateDml,
  isTextEntry,
} from './model.js';

const closed = { _valid_from: 0.1, _valid_to: 0.4, _system_from: 0.2, color: [1, 2, 3] };
const open = { _valid_from: 0.5, _valid_to: null, _system_from: 0.3, color: [4, 5, 6] };

describe('normalizeRoomCode', () => {
  test('trims, upper-cases and truncates to six characters', () => {
    expect(normalizeRoomCode('  abcdefgh ')).toBe('ABCDEF');
  });

  test('rejects codes shorter than four characters', () => {
    expect(normalizeRoomCode('abc')).toBe(null);
    expect(normalizeRoomCode('')).toBe(null);
    expect(normalizeRoomCode(null)).toBe(null);
  });
});

test('snapToGrid rounds to the nearest tenth', () => {
  expect(snapToGrid(0.34)).toBeCloseTo(0.3);
  expect(snapToGrid(0.36)).toBeCloseTo(0.4);
});

describe('hitTest', () => {
  const drawWidth = 1000;
  const handleWidth = 8;

  test('finds the event under the point, latest system time first', () => {
    const under = { ...closed, _system_from: 0.1 };
    expect(hitTest([under, closed], 0.2, 0.5, drawWidth, handleWidth)).toEqual({ index: 1, onHandle: false });
  });

  test('reports the resize handle at the right edge of a closed event', () => {
    expect(hitTest([closed], 0.399, 0.5, drawWidth, handleWidth)).toEqual({ index: 0, onHandle: true });
  });

  test('the handle is as many pixels wide as asked', () => {
    expect(hitTest([closed], 0.38, 0.5, drawWidth, 8)).toEqual({ index: 0, onHandle: false });
    expect(hitTest([closed], 0.38, 0.5, drawWidth, 28)).toEqual({ index: 0, onHandle: true });
  });

  test('an open event runs to the right edge and has no handle', () => {
    expect(hitTest([open], 0.999, 0.5, drawWidth, handleWidth)).toEqual({ index: 0, onHandle: false });
  });

  test('misses below system-from', () => {
    expect(hitTest([closed], 0.2, 0.1, drawWidth, handleWidth)).toBe(null);
  });
});

test('pointHitTest finds the topmost point within its radius', () => {
  const points = [{ x: 0.5, y: 0.5 }, { x: 0.501, y: 0.5 }];
  expect(pointHitTest(points, 0.5, 0.5, 1000, 1000)).toEqual({ index: 1 });
  expect(pointHitTest(points, 0.6, 0.5, 1000, 1000)).toBe(null);
});

describe('menuTargets', () => {
  const selection = { events: new Set([0, 2]), points: new Set([1]) };

  test('acts on the whole selection when the hit item is in it', () => {
    expect(menuTargets({ event: { index: 2 } }, selection)).toBe(selection);
    expect(menuTargets({ point: { index: 1 } }, selection)).toBe(selection);
  });

  test('acts on the hit item alone when it is outside the selection', () => {
    expect(menuTargets({ event: { index: 1 } }, selection)).toEqual({ events: new Set([1]), points: new Set() });
    expect(menuTargets({ point: { index: 0 } }, selection)).toEqual({ events: new Set(), points: new Set([0]) });
  });

  test('is null when nothing was hit', () => {
    expect(menuTargets({ event: null }, selection)).toBe(null);
  });
});

describe('selection', () => {
  test('selects events overlapping the box, which extend upwards forever', () => {
    const box = [{ x: 0.3, y: 0.9 }, { x: 0.6, y: 0.95 }];
    expect(eventsInSelection([closed, open], ...box)).toEqual(new Set([0, 1]));
  });

  test('skips events starting above the box', () => {
    const box = [{ x: 0, y: 0 }, { x: 1, y: 0.25 }];
    expect(eventsInSelection([closed, open], ...box)).toEqual(new Set([0]));
  });

  test('selects points inside the box', () => {
    const points = [{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.8 }];
    expect(pointsInSelection(points, { x: 0.5, y: 0.5 }, { x: 0, y: 0 })).toEqual(new Set([0]));
  });
});

describe('moveEvent', () => {
  test('keeps a closed event inside the plot', () => {
    expect(moveEvent(closed, 0.9, 0.5, false)).toMatchObject({ _valid_from: 0.7, _system_from: 0.5 });
    expect(moveEvent(closed, 0.9, 0.5, false)._valid_to).toBeCloseTo(1);
  });

  test('leaves an open event open', () => {
    expect(moveEvent(open, 0.2, 0.4, false)).toEqual({ ...open, _valid_from: 0.2, _system_from: 0.4 });
  });

  test('snaps to the grid', () => {
    const moved = moveEvent(closed, 0.23, 0.47, true);
    expect(moved._valid_from).toBeCloseTo(0.2);
    expect(moved._system_from).toBeCloseTo(0.5);
  });
});

test('resizeEvent keeps a minimum duration', () => {
  expect(resizeEvent(closed, 0.05, false)._valid_to).toBeCloseTo(0.15);
  expect(resizeEvent(closed, 2, false)._valid_to).toBe(1);
});

test('scaleEvent scales valid time about the anchor', () => {
  const original = { _valid_from: 0.2, _valid_to: 0.4 };
  const scaled = scaleEvent(original, 0.2, 2);
  expect(scaled._valid_from).toBeCloseTo(0.2);
  expect(scaled._valid_to).toBeCloseTo(0.6);
});

test('spanScale stretches the span to the dragged edge, no further than valid time 1', () => {
  expect(spanScale(0.6, 0.2, 0.2, false)).toBeCloseTo(2);
  expect(spanScale(1.4, 0.2, 0.4, false)).toBeCloseTo(2);
});

test('eventFromDrag starts at the lower-left corner of the drag', () => {
  expect(eventFromDrag({ x: 0.6, y: 0.7 }, { x: 0.2, y: 0.3 }, [9, 9, 9])).toEqual({
    _valid_from: 0.2,
    _valid_to: 0.6,
    _system_from: 0.3,
    color: [9, 9, 9],
  });
});

test('toggleOpen opens an event, and closes it 0.2 wide', () => {
  expect(toggleOpen(closed, true)._valid_to).toBe(null);
  expect(toggleOpen(open, false)._valid_to).toBeCloseTo(0.7);
});

test('removeIndices drops the given indices', () => {
  expect(removeIndices(['a', 'b', 'c'], new Set([0, 2]))).toEqual(['b']);
});

describe('DML', () => {
  const start = '2024-01-01';
  const end = '2025-01-01';

  test('a closed event inserts with valid-to inside a system-time transaction', () => {
    const event = { _valid_from: 0, _valid_to: 1, _system_from: 0, color: [1, 2, 3] };
    expect(eventToDml(event, start, end)).toBe(
      "BEGIN READ WRITE WITH (SYSTEM_TIME = DATE '2024-01-01');\n" +
        "INSERT INTO docs RECORDS {_id: 1, _valid_from: DATE '2024-01-01', _valid_to: DATE '2025-01-01', color: [1, 2, 3]};\n" +
        'COMMIT;',
    );
  });

  test('an open event omits valid-to', () => {
    const event = { _valid_from: 0, _valid_to: null, _system_from: 0, color: [1, 2, 3] };
    expect(eventToDml(event, start, end)).not.toContain('_valid_to');
  });

  test('events are separated by a blank line', () => {
    expect(generateDml([closed, open], start, end).split('\n\n')).toHaveLength(2);
  });
});

describe('isTextEntry', () => {
  const el = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
  };

  test('text and date fields take typed keys', () => {
    expect(isTextEntry(el('<input type="text">'))).toBe(true);
    expect(isTextEntry(el('<input type="date">'))).toBe(true);
    expect(isTextEntry(el('<textarea></textarea>'))).toBe(true);
  });

  test('the page, the canvas and buttons do not', () => {
    expect(isTextEntry(document.body)).toBe(false);
    expect(isTextEntry(el('<canvas></canvas>'))).toBe(false);
    expect(isTextEntry(el('<button></button>'))).toBe(false);
    expect(isTextEntry(el('<input type="checkbox">'))).toBe(false);
  });
});
