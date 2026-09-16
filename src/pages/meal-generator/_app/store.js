// Palette state: a list of history entries plus a cursor into it.
//
//   { entries: [ [ { id, locked }, ... ], ... ], index }
//
// An entry is one palette — a slot per band, each naming a meal and whether
// it is locked. Locks live in the entry, so stepping back through history
// restores the locks that were in force at the time. Generating or toggling
// a lock pushes a new entry and drops anything ahead of the cursor.

import { MEALS, mealById } from './meals.js';

export const SLOT_COUNT = 5;
const MAX_ENTRIES = 50;

// How far apart two bands' hues have to be, in degrees, for the palette to
// read as five colours rather than five shades of one.
export const MIN_HUE_GAP = 30;

// Degrees between two hues the short way round the wheel.
export const hueDistance = (a, b) => {
  const d = Math.abs(a - b) % 360;
  return Math.min(d, 360 - d);
};

const pickFrom = (candidates, rng) => {
  // rng() is in [0, 1) but clamp anyway — a stubbed rng in a test that
  // returns 1 shouldn't index off the end.
  const i = Math.min(candidates.length - 1, Math.floor(rng() * candidates.length));
  return candidates[i];
};

// A fresh palette, keeping locked slots exactly where they are. Unlocked slots
// are filled with meals that appear nowhere else in the palette and whose hues
// clear MIN_HUE_GAP against the bands already chosen — falling back to any
// remaining meal when nothing clears it, since a filled band beats a hole.
export const generateSlots = (previous, { meals = MEALS, rng = Math.random } = {}) => {
  const slots = previous ?? Array.from({ length: SLOT_COUNT }, () => null);
  const taken = new Set(slots.filter(s => s?.locked).map(s => s.id));
  const pool = meals.filter(m => !taken.has(m.id));
  const hues = slots.filter(s => s?.locked).map(s => mealById(s.id).hue);

  return slots.map(slot => {
    if (slot?.locked) return slot;
    // Only possible with a pool smaller than the palette; repeat rather
    // than leave a hole.
    if (pool.length === 0) pool.push(...meals);

    const spaced = pool.filter(m => hues.every(h => hueDistance(m.hue, h) >= MIN_HUE_GAP));
    const meal = pickFrom(spaced.length > 0 ? spaced : pool, rng);
    pool.splice(pool.indexOf(meal), 1);
    hues.push(meal.hue);
    return { id: meal.id, locked: false };
  });
};

export const initialState = (options = {}) => ({
  entries: [generateSlots(null, options)],
  index: 0,
});

export const current = state => state.entries[state.index];

// Push a palette on top of the cursor, discarding any redo entries and
// trimming the oldest once the history grows past MAX_ENTRIES.
const push = (state, slots) => {
  const entries = [...state.entries.slice(0, state.index + 1), slots].slice(-MAX_ENTRIES);
  return { entries, index: entries.length - 1 };
};

export const generate = (state, options = {}) =>
  push(state, generateSlots(current(state), options));

export const toggleLock = (state, i) =>
  push(state, current(state).map((s, j) => (j === i ? { ...s, locked: !s.locked } : s)));

export const canUndo = state => state.index > 0;
export const canRedo = state => state.index < state.entries.length - 1;

export const undo = state => (canUndo(state) ? { ...state, index: state.index - 1 } : state);
export const redo = state => (canRedo(state) ? { ...state, index: state.index + 1 } : state);

// Persisted state outlives the meal list it was built from: a rename or a
// removal in meals.js would otherwise render a band with no meal. The app
// throws away anything that doesn't round-trip and starts a fresh palette.
export const isValidState = state =>
  !!state &&
  Array.isArray(state.entries) &&
  state.entries.length > 0 &&
  Number.isInteger(state.index) &&
  state.index >= 0 &&
  state.index < state.entries.length &&
  state.entries.every(
    entry =>
      Array.isArray(entry) &&
      entry.length === SLOT_COUNT &&
      entry.every(slot => !!slot && typeof slot.locked === 'boolean' && !!mealById(slot.id)),
  );
