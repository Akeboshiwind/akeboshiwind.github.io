import { describe, test, expect } from 'vitest';
import {
  SLOT_COUNT, MIN_HUE_GAP, hueDistance,
  generateSlots, initialState, current, generate, toggleLock,
  unlockAll, anyLocked, undo, redo, canUndo, canRedo, isValidState,
} from './store.js';
import { MEALS, mealById } from './meals.js';

// A deterministic rng that walks the pool from the front.
const firstRng = () => 0;

// Cycles through the given fractions so successive picks differ.
const seqRng = (...values) => {
  let i = 0;
  return () => values[i++ % values.length];
};

const ids = slots => slots.map(s => s.id);

describe('generateSlots', () => {
  test('fills every slot from nothing', () => {
    const slots = generateSlots(null, { rng: firstRng });
    expect(slots).toHaveLength(SLOT_COUNT);
    expect(slots.every(s => !s.locked)).toBe(true);
  });

  test('never repeats a meal within a palette', () => {
    for (let i = 0; i < 200; i++) {
      const slots = generateSlots(null, {});
      expect(new Set(ids(slots)).size).toBe(SLOT_COUNT);
    }
  });

  test('leaves locked slots untouched', () => {
    const before = generateSlots(null, { rng: seqRng(0, 0.3, 0.6, 0.9, 0.1) });
    const locked = before.map((s, i) => (i === 1 || i === 3 ? { ...s, locked: true } : s));

    const after = generateSlots(locked, {});

    expect(after[1]).toEqual(locked[1]);
    expect(after[3]).toEqual(locked[3]);
    expect(after[1].locked).toBe(true);
  });

  test('does not hand a locked meal to another slot', () => {
    const locked = [
      { id: MEALS[0].id, locked: true },
      ...Array.from({ length: SLOT_COUNT - 1 }, (_, i) => ({ id: MEALS[i + 1].id, locked: false })),
    ];
    for (let i = 0; i < 200; i++) {
      const after = generateSlots(locked, {});
      expect(ids(after).filter(id => id === MEALS[0].id)).toHaveLength(1);
    }
  });

  test('keeps every slot filled when the pool is smaller than the palette', () => {
    const meals = MEALS.slice(0, 2);
    const slots = generateSlots(null, { meals, rng: firstRng });
    expect(slots).toHaveLength(SLOT_COUNT);
    expect(slots.every(s => !!s.id)).toBe(true);
  });

  test('tolerates an rng that returns 1', () => {
    const slots = generateSlots(null, { rng: () => 1 });
    expect(slots.every(s => !!s.id)).toBe(true);
  });
});

describe('hue spacing', () => {
  const hues = slots => slots.map(s => mealById(s.id).hue);

  test('no two meals are closer than the gap generation asks for', () => {
    // Otherwise the rule would be deciding which meals can share a palette,
    // which is the colours dictating the dinners rather than the other way up.
    for (const a of MEALS) {
      for (const b of MEALS) {
        if (a === b) continue;
        expect(hueDistance(a.hue, b.hue), `${a.name} vs ${b.name}`)
          .toBeGreaterThanOrEqual(MIN_HUE_GAP);
      }
    }
  });

  test('every meal can turn up alongside every other', () => {
    const seen = new Set();
    for (let i = 0; i < 4000; i++) {
      const palette = generateSlots(null, {});
      for (const a of palette) for (const b of palette) if (a.id !== b.id) seen.add(`${a.id}|${b.id}`);
    }
    const pairs = MEALS.length * (MEALS.length - 1);
    expect(seen.size).toBe(pairs);
  });

  test('hueDistance takes the short way round the wheel', () => {
    expect(hueDistance(10, 40)).toBe(30);
    expect(hueDistance(350, 10)).toBe(20);
    expect(hueDistance(10, 350)).toBe(20);
    expect(hueDistance(0, 180)).toBe(180);
    expect(hueDistance(200, 200)).toBe(0);
  });

  test('bands in a palette stay MIN_HUE_GAP apart', () => {
    for (let i = 0; i < 200; i++) {
      const h = hues(generateSlots(null, {}));
      for (let a = 0; a < h.length; a++) {
        for (let b = a + 1; b < h.length; b++) {
          expect(hueDistance(h[a], h[b]), `${h[a]} vs ${h[b]}`).toBeGreaterThanOrEqual(MIN_HUE_GAP);
        }
      }
    }
  });

  test('new bands keep clear of locked ones too', () => {
    const locked = [
      { id: 'pav-baji', locked: true },
      ...Array.from({ length: SLOT_COUNT - 1 }, (_, i) => ({ id: MEALS[i].id, locked: false })),
    ];
    const pinned = mealById('pav-baji').hue;
    for (let i = 0; i < 100; i++) {
      for (const slot of generateSlots(locked, {}).slice(1)) {
        expect(hueDistance(mealById(slot.id).hue, pinned)).toBeGreaterThanOrEqual(MIN_HUE_GAP);
      }
    }
  });

  test('fills the palette anyway when no meal can clear the gap', () => {
    const meals = MEALS.slice(0, 6).map((m, i) => ({ ...m, hue: 100 + i }));
    const slots = generateSlots(null, { meals });

    expect(slots).toHaveLength(SLOT_COUNT);
    expect(new Set(ids(slots)).size).toBe(SLOT_COUNT);
  });
});

describe('history', () => {
  test('generate appends an entry and moves the cursor', () => {
    const a = initialState({ rng: firstRng });
    const b = generate(a, {});

    expect(b.entries).toHaveLength(2);
    expect(b.index).toBe(1);
    expect(current(b)).toBe(b.entries[1]);
  });

  test('undo and redo walk the entries without dropping them', () => {
    const a = generate(generate(initialState({}), {}), {});
    const back = undo(undo(a));

    expect(back.index).toBe(0);
    expect(current(back)).toEqual(a.entries[0]);
    expect(redo(back).index).toBe(1);
    expect(redo(redo(back))).toEqual(a);
  });

  test('undo at the start and redo at the end are no-ops', () => {
    const a = initialState({});
    expect(canUndo(a)).toBe(false);
    expect(canRedo(a)).toBe(false);
    expect(undo(a)).toBe(a);
    expect(redo(a)).toBe(a);
  });

  test('generating after undo discards the entries ahead', () => {
    const a = generate(generate(initialState({}), {}), {});
    const b = generate(undo(a), {});

    expect(b.entries).toHaveLength(3);
    expect(canRedo(b)).toBe(false);
    expect(b.entries.slice(0, 2)).toEqual(a.entries.slice(0, 2));
  });

  test('history is capped, keeping the most recent palettes', () => {
    let state = initialState({});
    const many = 80;
    for (let i = 0; i < many; i++) state = generate(state, {});

    expect(state.entries.length).toBeLessThanOrEqual(50);
    expect(state.index).toBe(state.entries.length - 1);
    expect(canRedo(state)).toBe(false);
  });
});

describe('locking', () => {
  test('toggling a lock is not a history step', () => {
    const a = generate(initialState({}), {});
    const b = toggleLock(a, 2);

    expect(b.entries).toHaveLength(a.entries.length);
    expect(b.index).toBe(a.index);
    expect(current(b)[2].locked).toBe(true);
    expect(ids(current(b))).toEqual(ids(current(a)));
    // Only the palette under the cursor changes.
    expect(b.entries[0]).toEqual(a.entries[0]);
  });

  test('a lock leaves the entries ahead of the cursor alone', () => {
    const a = generate(generate(initialState({}), {}), {});
    const stepped = undo(a);
    const locked = toggleLock(stepped, 1);

    expect(canRedo(locked)).toBe(true);
    expect(locked.entries[2]).toEqual(a.entries[2]);
    expect(current(redo(locked))).toEqual(a.entries[2]);
  });

  test('a generated palette carries the locks in force when it was made', () => {
    const a = toggleLock(initialState({}), 0);
    const pinned = current(a)[0].id;
    const b = generate(a, {});

    expect(current(b)[0]).toEqual({ id: pinned, locked: true });
  });

  test('stepping back brings a palette its locks as it was left', () => {
    const a = toggleLock(initialState({}), 0);
    const regenerated = generate(a, {});

    expect(current(undo(regenerated))[0].locked).toBe(true);
    // Unlocking on the way back sticks to that palette, and the newer one
    // keeps the lock it was generated with.
    const unlocked = toggleLock(undo(regenerated), 0);
    expect(current(unlocked)[0].locked).toBe(false);
    expect(current(redo(unlocked))[0].locked).toBe(true);
  });

  test('unlocking frees the slot for the next generation', () => {
    const a = toggleLock(initialState({}), 1);
    const pinned = current(a)[1].id;
    const b = toggleLock(a, 1);

    expect(current(b)[1].locked).toBe(false);
    // With every slot unlocked the pinned meal is no longer guaranteed to stay.
    const rolls = Array.from({ length: 50 }, () => current(generate(b, {}))[1].id);
    expect(rolls.some(id => id !== pinned)).toBe(true);
  });

  test('unlockAll clears every lock without touching the history', () => {
    const state = toggleLock(toggleLock(generate(initialState({}), {}), 0), 3);
    const meals = ids(current(state));

    const cleared = unlockAll(state);
    expect(current(cleared).every(s => !s.locked)).toBe(true);
    expect(ids(current(cleared))).toEqual(meals);
    expect(cleared.entries).toHaveLength(state.entries.length);
    expect(cleared.index).toBe(state.index);
  });

  test('unlockAll leaves the state alone when nothing is locked', () => {
    const state = initialState({});
    expect(unlockAll(state)).toBe(state);
  });

  test('anyLocked reports the palette at the cursor', () => {
    const state = generate(initialState({}), {});
    expect(anyLocked(state)).toBe(false);

    const locked = toggleLock(state, 2);
    expect(anyLocked(locked)).toBe(true);
    // The palette behind it was left with nothing locked.
    expect(anyLocked(undo(locked))).toBe(false);
  });

  test('a fully locked palette survives generation unchanged', () => {
    let state = initialState({});
    for (let i = 0; i < SLOT_COUNT; i++) state = toggleLock(state, i);
    const before = current(state);

    expect(current(generate(state, {}))).toEqual(before);
  });
});

describe('isValidState', () => {
  const valid = initialState({});

  test('accepts a well-formed stored state', () => {
    expect(isValidState(valid)).toBe(true);
  });

  test.each([
    ['null', null],
    ['nonsense', { nope: true }],
    ['no entries', { entries: [], index: 0 }],
    ['cursor past the end', { entries: valid.entries, index: 3 }],
    ['wrong slot count', { entries: [valid.entries[0].slice(1)], index: 0 }],
    ['unknown meal', { entries: [[...valid.entries[0].slice(1), { id: 'gone', locked: false }]], index: 0 }],
    ['missing lock flag', { entries: [[...valid.entries[0].slice(1), { id: MEALS[0].id }]], index: 0 }],
  ])('rejects %s', (_label, stored) => {
    expect(isValidState(stored)).toBe(false);
  });
});
