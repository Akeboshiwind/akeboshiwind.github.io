// Single localStorage-backed store for the whole app.
// Shape: { pool, template, inProgress, history }

import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { seedPool, seedTemplate } from './seed.js';

const PREFIX = 'exercise_';

const initialState = {
  pool: seedPool,
  template: seedTemplate,
  inProgress: null,
  history: [],
};

export const useStore = () => {
  const [state, setState] = useLocalStorage('state', initialState, { prefix: PREFIX });
  return [state, setState];
};

export const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
export const DAY_NAMES = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday',
  thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
};
// Date.getDay(): 0 Sun, 1 Mon, ..., 6 Sat
export const todayKey = () => {
  const map = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return map[new Date().getDay()];
};

// ── Item helpers ─────────────────────────────────────────────────────

// Number of "checkable units" for an item (sets, rounds, or 1).
export const unitCount = item => {
  switch (item.kind) {
    case 'reps-exercise':
    case 'timed-exercise':
      return item.sets;
    case 'continuous-exercise':
      return 1;
    case 'circuit':
      return item.rounds;
    default:
      return 0;
  }
};

// All items in a day that carry checkable units (excluding sections).
// Circuits count as one item with `rounds` units; their children aren't
// individually checkable.
export const checkableItems = day =>
  day.items.filter(i => i.kind !== 'section');

// Total planned units across a day.
export const totalUnits = day =>
  checkableItems(day).reduce((n, i) => n + unitCount(i), 0);

// Total completed units, given a completedSets map.
export const completedUnits = (day, completedSets) =>
  checkableItems(day).reduce((n, i) => {
    const arr = completedSets[i.id] || [];
    return n + arr.filter(Boolean).length;
  }, 0);

// ── State transformations (pure) ─────────────────────────────────────

// Ensure inProgress exists for the given day. Returns updated state.
const ensureInProgress = (state, dayKey) => {
  if (state.inProgress && state.inProgress.day === dayKey) return state;
  return {
    ...state,
    inProgress: {
      day: dayKey,
      startedAt: Date.now(),
      completedSets: {},
    },
  };
};

export const toggleSet = (state, dayKey, itemId, index) => {
  const next = ensureInProgress(state, dayKey);
  const day = next.template.days[dayKey];
  const item = findItem(day, itemId);
  if (!item) return state;
  const max = unitCount(item);
  const arr = next.inProgress.completedSets[itemId]
    ? [...next.inProgress.completedSets[itemId]]
    : Array(max).fill(false);
  arr[index] = !arr[index];
  return {
    ...next,
    inProgress: {
      ...next.inProgress,
      completedSets: {
        ...next.inProgress.completedSets,
        [itemId]: arr,
      },
    },
  };
};

// Look up an item by id, including circuit children.
const findItem = (day, itemId) => {
  for (const item of day.items) {
    if (item.id === itemId) return item;
    if (item.kind === 'circuit') {
      for (const child of item.children) {
        if (child.id === itemId) return child;
      }
    }
  }
  return null;
};

// Apply a transform to an item (top-level or circuit child) inside a day.
// Returns a new day. Pass `null` from `transform` to remove the item.
const mapItem = (day, itemId, transform) => {
  const items = [];
  for (const item of day.items) {
    if (item.id === itemId) {
      const next = transform(item);
      if (next != null) items.push(next);
      continue;
    }
    if (item.kind === 'circuit') {
      let touched = false;
      const children = [];
      for (const child of item.children) {
        if (child.id === itemId) {
          const next = transform(child);
          if (next != null) children.push(next);
          touched = true;
          continue;
        }
        children.push(child);
      }
      items.push(touched ? { ...item, children } : item);
    } else {
      items.push(item);
    }
  }
  return { ...day, items };
};

const withDay = (state, dayKey, fn) => ({
  ...state,
  template: {
    ...state.template,
    days: { ...state.template.days, [dayKey]: fn(state.template.days[dayKey]) },
  },
});

export const updateItem = (state, dayKey, itemId, patch) =>
  withDay(state, dayKey, day => mapItem(day, itemId, item => ({ ...item, ...patch })));

export const removeItem = (state, dayKey, itemId) => {
  const next = withDay(state, dayKey, day => mapItem(day, itemId, () => null));
  // Also drop any in-progress checkmarks for this id.
  if (next.inProgress?.day === dayKey && next.inProgress.completedSets[itemId]) {
    const { [itemId]: _, ...rest } = next.inProgress.completedSets;
    return { ...next, inProgress: { ...next.inProgress, completedSets: rest } };
  }
  return next;
};

// Swap the underlying exerciseId of an exercise item. Doesn't change kind —
// callers are responsible for picking a pool entry whose kind matches the
// item's kind (the SwapSheet filters accordingly).
export const swapExercise = (state, dayKey, itemId, newExerciseId) =>
  updateItem(state, dayKey, itemId, { exerciseId: newExerciseId });

// Add or remove a set from an item that has a `sets` field.
export const addSet = (state, dayKey, itemId) =>
  withDay(state, dayKey, day => mapItem(day, itemId, item =>
    item.sets ? { ...item, sets: item.sets + 1 } : item));

export const removeSet = (state, dayKey, itemId) => {
  const next = withDay(state, dayKey, day => mapItem(day, itemId, item =>
    item.sets && item.sets > 1 ? { ...item, sets: item.sets - 1 } : item));
  // Trim completedSets if needed.
  if (next.inProgress?.day === dayKey) {
    const arr = next.inProgress.completedSets[itemId];
    const item = findItem(next.template.days[dayKey], itemId);
    if (arr && item?.sets && arr.length > item.sets) {
      return {
        ...next,
        inProgress: {
          ...next.inProgress,
          completedSets: { ...next.inProgress.completedSets, [itemId]: arr.slice(0, item.sets) },
        },
      };
    }
  }
  return next;
};

export const finishWorkout = state => {
  if (!state.inProgress) return state;
  const dayKey = state.inProgress.day;
  const day = state.template.days[dayKey];
  const entry = {
    id: `h_${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    day: dayKey,
    focus: day.focus,
    snapshot: day,
    completedSets: state.inProgress.completedSets,
  };
  return {
    ...state,
    inProgress: null,
    history: [entry, ...state.history],
  };
};

export const resetWorkout = state => ({ ...state, inProgress: null });

// ── Template editing ─────────────────────────────────────────────────

export const newId = () => `i_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

export const setRestDay = (state, dayKey, rest) =>
  withDay(state, dayKey, day => ({ ...day, rest, items: rest ? [] : day.items }));

export const setFocus = (state, dayKey, focus) =>
  withDay(state, dayKey, day => ({ ...day, focus }));

export const addSection = (state, dayKey, name, description = '') =>
  withDay(state, dayKey, day => ({
    ...day,
    items: [...day.items, { kind: 'section', id: newId(), name, description }],
  }));

export const updateSection = (state, dayKey, itemId, patch) =>
  withDay(state, dayKey, day => mapItem(day, itemId, item =>
    item.kind === 'section' ? { ...item, ...patch } : item));

// Build a default day item from a pool entry. Caller picks the kind by
// reference to the pool entry's own kind.
export const itemFromPoolEntry = (pool, exerciseId) => {
  const p = pool[exerciseId];
  if (!p) return null;
  const id = newId();
  switch (p.kind) {
    case 'reps':
      return {
        kind: 'reps-exercise', id, exerciseId,
        sets: p.defaultSets, reps: p.defaultReps,
        restSec: p.defaultRestSec, weightNote: '',
      };
    case 'timed':
      return {
        kind: 'timed-exercise', id, exerciseId,
        sets: p.defaultSets, durationSec: p.defaultDurationSec,
        restSec: p.defaultRestSec, weightNote: '',
      };
    case 'continuous':
      return {
        kind: 'continuous-exercise', id, exerciseId,
        durationSec: p.defaultDurationSec,
      };
    default: return null;
  }
};

export const addExercise = (state, dayKey, exerciseId) => {
  const item = itemFromPoolEntry(state.pool, exerciseId);
  if (!item) return state;
  return withDay(state, dayKey, day => ({ ...day, items: [...day.items, item] }));
};

// Reorder top-level items (does not currently reach into circuit children).
export const reorderItems = (state, dayKey, ids) =>
  withDay(state, dayKey, day => {
    const byId = new Map(day.items.map(i => [i.id, i]));
    const next = ids.map(id => byId.get(id)).filter(Boolean);
    // Append any items that weren't in `ids` (defensive — shouldn't normally happen).
    for (const i of day.items) if (!ids.includes(i.id)) next.push(i);
    return { ...day, items: next };
  });

// ── Pool editing ─────────────────────────────────────────────────────

export const upsertPoolEntry = (state, entry) => ({
  ...state,
  pool: { ...state.pool, [entry.id]: entry },
});

export const deletePoolEntry = (state, id) => {
  const { [id]: _, ...rest } = state.pool;
  return { ...state, pool: rest };
};

// ── Timer phase construction ─────────────────────────────────────────

// Build a flat list of [{ label, sec }] phases from a timer intent.
// For circuits we expand into rounds × children with optional rest periods.
export const restPhases = (sec, label = 'Rest') => [{ label, sec }];

export const durationPhases = (sec, label = 'Work') => [{ label, sec }];

export const circuitPhases = (item, pool) => {
  const phases = [];
  for (let r = 0; r < item.rounds; r++) {
    item.children.forEach((child, i) => {
      const ex = pool[child.exerciseId];
      const name = ex?.name ?? child.exerciseId;
      phases.push({ label: `R${r + 1} · ${name}`, sec: child.durationSec });
      if (i < item.children.length - 1 && item.betweenChildSec > 0) {
        phases.push({ label: 'Rest', sec: item.betweenChildSec });
      }
    });
    if (r < item.rounds - 1 && item.betweenRoundSec > 0) {
      phases.push({ label: `Round ${r + 2} in…`, sec: item.betweenRoundSec });
    }
  }
  return phases;
};
