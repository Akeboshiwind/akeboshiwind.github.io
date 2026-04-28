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

// ── Imported-routine parsing ─────────────────────────────────────────

const KNOWN_EQUIPMENT = new Set(['none', 'dumbbell', 'band', 'elliptical', 'other']);
const POOL_KIND_FOR_ITEM = {
  'reps-exercise': 'reps',
  'timed-exercise': 'timed',
  'continuous-exercise': 'continuous',
};

// Strip markdown fences and any prose around the JSON.
const extractJsonBlock = raw => {
  if (typeof raw !== 'string') return null;
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) return fenced[1].trim();
  // Fallback: first { to last }
  const first = raw.indexOf('{');
  const last = raw.lastIndexOf('}');
  if (first >= 0 && last > first) return raw.slice(first, last + 1);
  return raw.trim();
};

// Validate and normalise an imported routine. Returns
//   { ok: true, parsed, summary } or { ok: false, error }
// `parsed` is a plain object with `pool` (array) and `days` (object) ready
// to merge with the existing state.
export const parseImportedRoutine = (state, raw) => {
  const block = extractJsonBlock(raw);
  if (!block) return { ok: false, error: 'No JSON found in input.' };
  let data;
  try { data = JSON.parse(block); } catch (e) { return { ok: false, error: 'Invalid JSON: ' + e.message }; }
  if (!data || typeof data !== 'object') return { ok: false, error: 'Top-level must be an object.' };
  if (!Array.isArray(data.pool)) return { ok: false, error: 'pool must be an array.' };
  if (!data.days || typeof data.days !== 'object') return { ok: false, error: 'days must be an object.' };

  // Index existing pool by lowercased name → id
  const nameToId = new Map();
  for (const p of Object.values(state.pool)) {
    nameToId.set(p.name.trim().toLowerCase(), p.id);
  }

  // Pool — produce a normalised list with resolved ids.
  const newPool = [];
  const updatedPool = [];
  const poolByName = new Map();
  for (const [i, p] of data.pool.entries()) {
    const where = `pool[${i}]`;
    if (!p || typeof p !== 'object') return { ok: false, error: `${where} is not an object.` };
    if (typeof p.name !== 'string' || !p.name.trim()) return { ok: false, error: `${where} missing name.` };
    if (!['reps', 'timed', 'continuous'].includes(p.kind)) return { ok: false, error: `${where} kind must be 'reps' | 'timed' | 'continuous'.` };
    const equipment = KNOWN_EQUIPMENT.has(p.equipment) ? p.equipment : 'other';
    const tags = Array.isArray(p.tags) ? p.tags.filter(t => typeof t === 'string') : [];
    const lower = p.name.trim().toLowerCase();
    const existingId = nameToId.get(lower);
    const id = existingId ?? (slugify(p.name) + '-' + Math.random().toString(36).slice(2, 5));
    const entry = {
      id, kind: p.kind,
      name: p.name.trim(),
      description: typeof p.description === 'string' ? p.description.trim() : '',
      tip: typeof p.tip === 'string' ? p.tip.trim() : '',
      equipment, tags,
    };
    if (p.kind === 'reps') {
      entry.defaultSets = clampInt(p.defaultSets, 1, 50, 3);
      entry.defaultReps = clampInt(p.defaultReps, 1, 999, 12);
      entry.defaultRestSec = clampInt(p.defaultRestSec, 0, 999, 60);
    } else if (p.kind === 'timed') {
      entry.defaultSets = clampInt(p.defaultSets, 1, 50, 3);
      entry.defaultDurationSec = clampInt(p.defaultDurationSec, 1, 7200, 30);
      entry.defaultRestSec = clampInt(p.defaultRestSec, 0, 999, 30);
    } else {
      entry.defaultDurationSec = clampInt(p.defaultDurationSec, 1, 7200, 300);
    }
    poolByName.set(lower, entry);
    if (existingId) updatedPool.push(entry); else newPool.push(entry);
  }

  // Days — validate each item.
  const days = {};
  const dayChanges = []; // [{ day, summary }]
  for (const k of DAYS) {
    const incoming = data.days[k];
    if (!incoming) {
      // Day omitted — keep existing day untouched
      days[k] = state.template.days[k];
      continue;
    }
    if (typeof incoming !== 'object') return { ok: false, error: `days.${k} must be an object.` };
    const rest = !!incoming.rest;
    const focus = typeof incoming.focus === 'string' ? incoming.focus.trim() : '';
    const itemsIn = Array.isArray(incoming.items) ? incoming.items : [];
    const items = [];
    for (const [i, raw] of itemsIn.entries()) {
      const where = `days.${k}.items[${i}]`;
      const item = await_normaliseItem(raw, where, poolByName);
      if (item.error) return { ok: false, error: item.error };
      items.push(item.value);
    }
    days[k] = { rest, focus, items: rest ? [] : items };
    dayChanges.push({ day: k, exercises: countCheckable(days[k]) });
  }

  return {
    ok: true,
    parsed: { newPool, updatedPool, days },
    summary: {
      newExercises: newPool.map(p => p.name),
      updatedExercises: updatedPool.map(p => p.name),
      days: dayChanges,
    },
  };
};

// Inline (no async — name is a leftover joke). Returns { value } or { error }.
const await_normaliseItem = (raw, where, poolByName) => {
  if (!raw || typeof raw !== 'object') return { error: `${where} is not an object.` };
  if (raw.kind === 'section') {
    return { value: {
      kind: 'section', id: newId(),
      name: typeof raw.name === 'string' ? raw.name.trim() : '',
      description: typeof raw.description === 'string' ? raw.description.trim() : '',
    } };
  }
  if (raw.kind === 'reps-exercise' || raw.kind === 'timed-exercise' || raw.kind === 'continuous-exercise') {
    if (typeof raw.name !== 'string' || !raw.name.trim()) {
      return { error: `${where} missing exercise name.` };
    }
    const lower = raw.name.trim().toLowerCase();
    const pool = poolByName.get(lower);
    if (!pool) return { error: `${where} references "${raw.name}" which isn't in pool.` };
    const expected = POOL_KIND_FOR_ITEM[raw.kind];
    if (pool.kind !== expected) {
      return { error: `${where} kind '${raw.kind}' but pool has '${pool.kind}' for "${raw.name}".` };
    }
    if (raw.kind === 'reps-exercise') {
      return { value: {
        kind: 'reps-exercise', id: newId(), exerciseId: pool.id,
        sets: clampInt(raw.sets, 1, 50, pool.defaultSets ?? 3),
        reps: clampInt(raw.reps, 1, 999, pool.defaultReps ?? 12),
        restSec: clampInt(raw.restSec, 0, 999, pool.defaultRestSec ?? 60),
        weightNote: typeof raw.weightNote === 'string' ? raw.weightNote : '',
      } };
    }
    if (raw.kind === 'timed-exercise') {
      return { value: {
        kind: 'timed-exercise', id: newId(), exerciseId: pool.id,
        sets: clampInt(raw.sets, 1, 50, pool.defaultSets ?? 3),
        durationSec: clampInt(raw.durationSec, 1, 7200, pool.defaultDurationSec ?? 30),
        restSec: clampInt(raw.restSec, 0, 999, pool.defaultRestSec ?? 30),
        weightNote: typeof raw.weightNote === 'string' ? raw.weightNote : '',
      } };
    }
    return { value: {
      kind: 'continuous-exercise', id: newId(), exerciseId: pool.id,
      durationSec: clampInt(raw.durationSec, 1, 7200, pool.defaultDurationSec ?? 60),
    } };
  }
  if (raw.kind === 'circuit') {
    const childrenIn = Array.isArray(raw.children) ? raw.children : [];
    const children = [];
    for (const [i, c] of childrenIn.entries()) {
      if (c?.kind !== 'continuous-exercise') {
        return { error: `${where}.children[${i}] must be continuous-exercise.` };
      }
      const result = await_normaliseItem(c, `${where}.children[${i}]`, poolByName);
      if (result.error) return result;
      children.push(result.value);
    }
    return { value: {
      kind: 'circuit', id: newId(),
      name: typeof raw.name === 'string' ? raw.name.trim() : 'Circuit',
      rounds: clampInt(raw.rounds, 1, 99, 3),
      betweenChildSec: clampInt(raw.betweenChildSec, 0, 600, 0),
      betweenRoundSec: clampInt(raw.betweenRoundSec, 0, 600, 0),
      children,
    } };
  }
  return { error: `${where} unknown kind: ${raw.kind}.` };
};

const clampInt = (v, lo, hi, fallback) => {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(hi, Math.max(lo, n));
};

const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'exercise';

const countCheckable = day => day.items.filter(i => i.kind !== 'section').length;

// Apply a parsed routine: upsert pool entries, replace days.
export const applyImportedRoutine = (state, parsed) => {
  const pool = { ...state.pool };
  for (const entry of parsed.newPool) pool[entry.id] = entry;
  for (const entry of parsed.updatedPool) pool[entry.id] = entry;
  return {
    ...state,
    pool,
    template: { ...state.template, days: parsed.days },
    inProgress: null,
  };
};

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
