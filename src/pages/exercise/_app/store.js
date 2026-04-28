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
      circuitProgress: {},
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

// ── Circuit per-child progress ───────────────────────────────────────
// Circuits track two things during a workout:
//   completedSets[circuitId]    = bool[rounds] — round-level progress
//   circuitProgress[circuitId]  = bool[children.length] — per-child
//                                  ticks within the CURRENT round
// "Complete round" advances completedSets and resets circuitProgress.

export const toggleCircuitChild = (state, dayKey, circuitId, childIndex) => {
  const next = ensureInProgress(state, dayKey);
  const day = next.template.days[dayKey];
  const circuit = findItem(day, circuitId);
  if (!circuit || circuit.kind !== 'circuit') return state;
  const len = circuit.children.length;
  const arr = next.inProgress.circuitProgress?.[circuitId]
    ? [...next.inProgress.circuitProgress[circuitId]]
    : Array(len).fill(false);
  arr[childIndex] = !arr[childIndex];
  return {
    ...next,
    inProgress: {
      ...next.inProgress,
      circuitProgress: {
        ...(next.inProgress.circuitProgress ?? {}),
        [circuitId]: arr,
      },
    },
  };
};

export const completeCircuitRound = (state, dayKey, circuitId) => {
  const next = ensureInProgress(state, dayKey);
  const day = next.template.days[dayKey];
  const circuit = findItem(day, circuitId);
  if (!circuit || circuit.kind !== 'circuit') return state;
  // Tick the next unticked round.
  const rounds = next.inProgress.completedSets[circuitId]
    ? [...next.inProgress.completedSets[circuitId]]
    : Array(circuit.rounds).fill(false);
  const idx = rounds.indexOf(false);
  if (idx === -1) return state; // already complete
  rounds[idx] = true;
  return {
    ...next,
    inProgress: {
      ...next.inProgress,
      completedSets: { ...next.inProgress.completedSets, [circuitId]: rounds },
      circuitProgress: { ...(next.inProgress.circuitProgress ?? {}), [circuitId]: Array(circuit.children.length).fill(false) },
    },
  };
};

// ── Circuit editing ──────────────────────────────────────────────────

export const addCircuitChild = (state, dayKey, circuitId, exerciseId) => {
  const pool = state.pool[exerciseId];
  if (!pool || pool.kind !== 'continuous') return state;
  const child = {
    kind: 'continuous-exercise',
    id: newId(),
    exerciseId,
    durationSec: pool.defaultDurationSec ?? 30,
  };
  return withDay(state, dayKey, day => mapItem(day, circuitId, item =>
    item.kind === 'circuit' ? { ...item, children: [...item.children, child] } : item));
};

export const reorderCircuitChildren = (state, dayKey, circuitId, childIds) =>
  withDay(state, dayKey, day => mapItem(day, circuitId, item => {
    if (item.kind !== 'circuit') return item;
    const byId = new Map(item.children.map(c => [c.id, c]));
    const next = childIds.map(id => byId.get(id)).filter(Boolean);
    for (const c of item.children) if (!childIds.includes(c.id)) next.push(c);
    return { ...item, children: next };
  }));

export const addCircuit = (state, dayKey) => {
  const circuit = {
    kind: 'circuit',
    id: newId(),
    name: 'New circuit',
    rounds: 3,
    betweenChildSec: 15,
    betweenRoundSec: 60,
    children: [],
  };
  return withDay(state, dayKey, day => ({ ...day, items: [...day.items, circuit] }));
};

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
// to merge with the existing state. Validation is strict: every required
// field must be present with the right type, otherwise we reject and surface
// a single error message naming the offending path.
export const parseImportedRoutine = (state, raw) => {
  const block = extractJsonBlock(raw);
  if (!block) return { ok: false, error: 'No JSON found in input.' };
  let data;
  try { data = JSON.parse(block); } catch (e) { return { ok: false, error: 'Invalid JSON: ' + e.message }; }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return { ok: false, error: 'Top-level must be a JSON object.' };
  }
  if (!Array.isArray(data.pool)) return { ok: false, error: 'pool must be an array.' };
  if (!data.days || typeof data.days !== 'object' || Array.isArray(data.days)) {
    return { ok: false, error: 'days must be an object.' };
  }
  for (const k of DAYS) {
    if (!(k in data.days)) return { ok: false, error: `days.${k} is missing — all seven days must be present.` };
  }

  // Index existing pool by lowercased name → id
  const nameToId = new Map();
  for (const p of Object.values(state.pool)) {
    nameToId.set(p.name.trim().toLowerCase(), p.id);
  }

  // Pool entries from the import. These are additions or edits — existing
  // pool entries that aren't re-listed here are still resolvable from
  // state.pool when items reference them by name.
  const newPool = [];
  const updatedPool = [];
  const poolByName = new Map();
  for (const [i, p] of data.pool.entries()) {
    const where = `pool[${i}]`;
    const result = normalisePoolEntry(p, where, nameToId);
    if (result.error) return { ok: false, error: result.error };
    const entry = result.value;
    const lower = entry.name.toLowerCase();
    if (poolByName.has(lower)) return { ok: false, error: `${where} duplicates name "${entry.name}".` };
    poolByName.set(lower, entry);
    if (nameToId.has(lower)) updatedPool.push(entry); else newPool.push(entry);
  }
  // Layer existing pool entries underneath, so items can reference them
  // by name without the model having to re-list them. The imported pool
  // takes precedence (these are the entries the model wants to change).
  const resolvableByName = new Map();
  for (const p of Object.values(state.pool)) {
    resolvableByName.set(p.name.trim().toLowerCase(), p);
  }
  for (const [k, v] of poolByName) resolvableByName.set(k, v);

  // Days.
  const days = {};
  const dayChanges = [];
  for (const k of DAYS) {
    const incoming = data.days[k];
    const where = `days.${k}`;
    if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) {
      return { ok: false, error: `${where} must be an object.` };
    }
    if (typeof incoming.rest !== 'boolean') {
      return { ok: false, error: `${where}.rest must be a boolean.` };
    }
    if (typeof incoming.focus !== 'string') {
      return { ok: false, error: `${where}.focus must be a string.` };
    }
    if (!Array.isArray(incoming.items)) {
      return { ok: false, error: `${where}.items must be an array.` };
    }
    const items = [];
    if (!incoming.rest) {
      for (const [i, item] of incoming.items.entries()) {
        const r = normaliseItem(item, `${where}.items[${i}]`, resolvableByName);
        if (r.error) return { ok: false, error: r.error };
        items.push(r.value);
      }
    }
    days[k] = { rest: incoming.rest, focus: incoming.focus.trim(), items };
    dayChanges.push({ day: k, exercises: items.filter(it => it.kind !== 'section').length });
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

const normalisePoolEntry = (p, where, nameToId) => {
  if (!p || typeof p !== 'object' || Array.isArray(p)) return { error: `${where} must be an object.` };
  if (typeof p.name !== 'string' || !p.name.trim()) return { error: `${where}.name must be a non-empty string.` };
  if (!['reps', 'timed', 'continuous'].includes(p.kind)) {
    return { error: `${where}.kind must be 'reps' | 'timed' | 'continuous'.` };
  }
  if (typeof p.equipment !== 'string' || !KNOWN_EQUIPMENT.has(p.equipment)) {
    return { error: `${where}.equipment must be one of: ${[...KNOWN_EQUIPMENT].join(', ')}.` };
  }
  if (!Array.isArray(p.tags) || p.tags.some(t => typeof t !== 'string')) {
    return { error: `${where}.tags must be an array of strings.` };
  }
  if (typeof p.description !== 'string') return { error: `${where}.description must be a string.` };
  if (typeof p.tip !== 'string') return { error: `${where}.tip must be a string.` };

  const lower = p.name.trim().toLowerCase();
  const existingId = nameToId.get(lower);
  const id = existingId ?? (slugify(p.name) + '-' + Math.random().toString(36).slice(2, 5));

  let kindFields;
  if (p.kind === 'reps') {
    kindFields = mustInts(p, { defaultSets: [1, 50], defaultReps: [1, 999], defaultRestSec: [0, 999] }, where);
  } else if (p.kind === 'timed') {
    kindFields = mustInts(p, { defaultSets: [1, 50], defaultDurationSec: [1, 7200], defaultRestSec: [0, 999] }, where);
  } else {
    kindFields = mustInts(p, { defaultDurationSec: [1, 7200] }, where);
  }
  if (kindFields.error) return { error: kindFields.error };

  return { value: {
    id, kind: p.kind,
    name: p.name.trim(),
    description: p.description.trim(),
    tip: p.tip.trim(),
    equipment: p.equipment,
    tags: p.tags,
    ...kindFields.value,
  } };
};

const normaliseItem = (raw, where, poolByName) => {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return { error: `${where} must be an object.` };
  }
  switch (raw.kind) {
    case 'section':
      if (typeof raw.name !== 'string') return { error: `${where}.name must be a string.` };
      if (typeof raw.description !== 'string') return { error: `${where}.description must be a string.` };
      return { value: { kind: 'section', id: newId(), name: raw.name.trim(), description: raw.description.trim() } };

    case 'reps-exercise': {
      const poolR = lookupPool(raw, where, poolByName, 'reps');
      if (poolR.error) return { error: poolR.error };
      if (typeof raw.weightNote !== 'string') return { error: `${where}.weightNote must be a string (use "" if none).` };
      const ints = mustInts(raw, { sets: [1, 50], reps: [1, 999], restSec: [0, 999] }, where);
      if (ints.error) return { error: ints.error };
      return { value: { kind: 'reps-exercise', id: newId(), exerciseId: poolR.value.id, ...ints.value, weightNote: raw.weightNote } };
    }

    case 'timed-exercise': {
      const poolR = lookupPool(raw, where, poolByName, 'timed');
      if (poolR.error) return { error: poolR.error };
      if (typeof raw.weightNote !== 'string') return { error: `${where}.weightNote must be a string (use "" if none).` };
      const ints = mustInts(raw, { sets: [1, 50], durationSec: [1, 7200], restSec: [0, 999] }, where);
      if (ints.error) return { error: ints.error };
      return { value: { kind: 'timed-exercise', id: newId(), exerciseId: poolR.value.id, ...ints.value, weightNote: raw.weightNote } };
    }

    case 'continuous-exercise': {
      const poolR = lookupPool(raw, where, poolByName, 'continuous');
      if (poolR.error) return { error: poolR.error };
      const ints = mustInts(raw, { durationSec: [1, 7200] }, where);
      if (ints.error) return { error: ints.error };
      return { value: { kind: 'continuous-exercise', id: newId(), exerciseId: poolR.value.id, ...ints.value } };
    }

    case 'circuit': {
      if (typeof raw.name !== 'string' || !raw.name.trim()) return { error: `${where}.name must be a non-empty string.` };
      const ints = mustInts(raw, { rounds: [1, 99], betweenChildSec: [0, 600], betweenRoundSec: [0, 600] }, where);
      if (ints.error) return { error: ints.error };
      if (!Array.isArray(raw.children) || raw.children.length === 0) {
        return { error: `${where}.children must be a non-empty array.` };
      }
      const children = [];
      for (const [i, c] of raw.children.entries()) {
        if (c?.kind !== 'continuous-exercise') {
          return { error: `${where}.children[${i}].kind must be "continuous-exercise".` };
        }
        const r = normaliseItem(c, `${where}.children[${i}]`, poolByName);
        if (r.error) return { error: r.error };
        children.push(r.value);
      }
      return { value: { kind: 'circuit', id: newId(), name: raw.name.trim(), ...ints.value, children } };
    }

    default:
      return { error: `${where}.kind unknown: ${JSON.stringify(raw.kind)}.` };
  }
};

const lookupPool = (raw, where, poolByName, expectedPoolKind) => {
  if (typeof raw.name !== 'string' || !raw.name.trim()) {
    return { error: `${where}.name must be a non-empty string.` };
  }
  const pool = poolByName.get(raw.name.trim().toLowerCase());
  if (!pool) return { error: `${where} references "${raw.name}" which isn't in the imported pool or the current pool.` };
  if (pool.kind !== expectedPoolKind) {
    return { error: `${where} item kind '${raw.kind}' but pool entry "${pool.name}" is of kind '${pool.kind}'.` };
  }
  return { value: pool };
};

// Strict integer extractor for multiple fields with [min, max] bounds.
const mustInts = (raw, schema, where) => {
  const out = {};
  for (const [key, [lo, hi]] of Object.entries(schema)) {
    if (raw[key] === undefined || raw[key] === null) {
      return { error: `${where}.${key} is missing.` };
    }
    if (typeof raw[key] !== 'number' || !Number.isFinite(raw[key])) {
      return { error: `${where}.${key} must be a number.` };
    }
    const n = Math.trunc(raw[key]);
    if (n < lo || n > hi) return { error: `${where}.${key} must be between ${lo} and ${hi}.` };
    out[key] = n;
  }
  return { value: out };
};

const slugify = s => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'exercise';

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
