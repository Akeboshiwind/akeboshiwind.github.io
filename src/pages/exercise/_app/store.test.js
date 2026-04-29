import { describe, test, expect, vi, afterEach } from 'vitest';
import {
  parseImportedRoutine, applyImportedRoutine, DAYS,
  toggleCircuitChild, completeCircuitRound,
  addCircuit, addCircuitChild,
  startWorkout, cancelWorkout, finishWorkout, toggleSet,
} from './store.js';
import { seedPool, seedTemplate } from './seed.js';

const baseState = {
  pool: seedPool,
  template: seedTemplate,
  inProgress: null,
  history: [],
};

const restDay = { rest: true, focus: 'Rest', items: [] };

// Build a minimal valid routine — all seven days present, optional `mon`
// override for tests that want a workout day.
const routine = (overrides = {}) => ({
  pool: [],
  days: {
    mon: restDay, tue: restDay, wed: restDay,
    thu: restDay, fri: restDay, sat: restDay, sun: restDay,
    ...overrides,
  },
});

describe('parseImportedRoutine — structural', () => {
  test('rejects malformed JSON', () => {
    const r = parseImportedRoutine(baseState, '{not json');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/JSON/);
  });

  test('strips markdown fences', () => {
    const json = JSON.stringify(routine());
    const r = parseImportedRoutine(baseState, '```json\n' + json + '\n```');
    expect(r.ok).toBe(true);
  });

  test('rejects when a day is missing', () => {
    const data = routine();
    delete data.days.thu;
    const r = parseImportedRoutine(baseState, JSON.stringify(data));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/days\.thu/);
  });

  test('rejects pool array missing', () => {
    const data = routine();
    delete data.pool;
    const r = parseImportedRoutine(baseState, JSON.stringify(data));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/pool/);
  });

  test('rejects day with non-boolean rest', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify(routine({
      mon: { rest: 'no', focus: '', items: [] },
    })));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/rest must be a boolean/);
  });
});

describe('parseImportedRoutine — pool validation', () => {
  test('rejects pool entry missing description', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [{ kind: 'reps', name: 'Test', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 12, defaultRestSec: 60 }],
      days: routine().days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/description/);
  });

  test('rejects pool entry with unknown equipment', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [{ kind: 'reps', name: 'Test', description: '', tip: '', equipment: 'kettlebell', tags: [], defaultSets: 3, defaultReps: 12, defaultRestSec: 60 }],
      days: routine().days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/equipment/);
  });

  test('rejects pool entry with missing numeric default', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [{ kind: 'reps', name: 'Test', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 12 /* defaultRestSec missing */ }],
      days: routine().days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/defaultRestSec/);
  });

  test('rejects pool numeric out of range', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [{ kind: 'reps', name: 'Test', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 999, defaultReps: 12, defaultRestSec: 60 }],
      days: routine().days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/defaultSets must be between/);
  });

  test('rejects duplicate names in incoming pool', () => {
    const entry = { kind: 'reps', name: 'Twin', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 12, defaultRestSec: 60 };
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [entry, { ...entry }],
      days: routine().days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/duplicates/);
  });

  test('matches existing exercises by name (case-insensitive)', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [
        { kind: 'reps', name: 'BODYWEIGHT SQUATS', description: 'new', tip: '', equipment: 'none', tags: [], defaultSets: 4, defaultReps: 20, defaultRestSec: 30 },
      ],
      days: routine({ mon: { rest: false, focus: 'Test', items: [
        { kind: 'reps-exercise', name: 'Bodyweight Squats', sets: 4, reps: 20, restSec: 30, weightNote: '' },
      ] } }).days,
    }));
    expect(r.ok).toBe(true);
    expect(r.summary.updatedExercises).toContain('BODYWEIGHT SQUATS');
    expect(r.summary.newExercises).toEqual([]);
    expect(r.parsed.updatedPool[0].id).toBe('bw-squat');
  });

  test('creates new ids for unknown exercises', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [
        { kind: 'reps', name: 'Hindu Pushup', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 10, defaultRestSec: 60 },
      ],
      days: routine({ mon: { rest: false, focus: '', items: [
        { kind: 'reps-exercise', name: 'Hindu Pushup', sets: 3, reps: 10, restSec: 60, weightNote: '' },
      ] } }).days,
    }));
    expect(r.ok).toBe(true);
    expect(r.summary.newExercises).toContain('Hindu Pushup');
    expect(r.parsed.newPool[0].id).toMatch(/^hindu-pushup-/);
  });
});

describe('parseImportedRoutine — item validation', () => {
  test('items can reference existing pool entries without re-listing them', () => {
    // "Bodyweight Squats" is in seedPool and not re-listed in the import.
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [],
      days: routine({ mon: { rest: false, focus: 'Test', items: [
        { kind: 'reps-exercise', name: 'Bodyweight Squats', sets: 3, reps: 15, restSec: 45, weightNote: '' },
      ] } }).days,
    }));
    expect(r.ok).toBe(true);
    // No new or updated pool entries — item resolves to existing id.
    expect(r.parsed.newPool).toEqual([]);
    expect(r.parsed.updatedPool).toEqual([]);
    expect(r.parsed.days.mon.items[0].exerciseId).toBe('bw-squat');
  });

  test('imported pool takes precedence over existing for same name', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [
        { kind: 'reps', name: 'Bodyweight Squats', description: 'updated', tip: '', equipment: 'none', tags: [], defaultSets: 5, defaultReps: 20, defaultRestSec: 30 },
      ],
      days: routine({ mon: { rest: false, focus: 'Test', items: [
        { kind: 'reps-exercise', name: 'Bodyweight Squats', sets: 5, reps: 20, restSec: 30, weightNote: '' },
      ] } }).days,
    }));
    expect(r.ok).toBe(true);
    expect(r.summary.updatedExercises).toEqual(['Bodyweight Squats']);
    expect(r.parsed.updatedPool[0].defaultSets).toBe(5);
  });

  test('rejects items referencing names absent from both pools', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [],
      days: routine({ mon: { rest: false, focus: '', items: [
        { kind: 'reps-exercise', name: 'Mystery Move', sets: 3, reps: 10, restSec: 60, weightNote: '' },
      ] } }).days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Mystery Move/);
  });

  test('rejects pool/item kind mismatch', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [{ kind: 'reps', name: 'X', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 10, defaultRestSec: 60 }],
      days: routine({ mon: { rest: false, focus: '', items: [
        { kind: 'continuous-exercise', name: 'X', durationSec: 30 },
      ] } }).days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/kind/);
  });

  test('rejects reps-exercise with missing weightNote', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [{ kind: 'reps', name: 'X', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 10, defaultRestSec: 60 }],
      days: routine({ mon: { rest: false, focus: '', items: [
        { kind: 'reps-exercise', name: 'X', sets: 3, reps: 10, restSec: 60 },
      ] } }).days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/weightNote/);
  });

  test('rejects reps-exercise with non-integer field', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [{ kind: 'reps', name: 'X', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 10, defaultRestSec: 60 }],
      days: routine({ mon: { rest: false, focus: '', items: [
        { kind: 'reps-exercise', name: 'X', sets: '3', reps: 10, restSec: 60, weightNote: '' },
      ] } }).days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/sets must be a number/);
  });

  test('accepts a circuit with continuous children', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [{ kind: 'continuous', name: 'Burpees', description: '', tip: '', equipment: 'none', tags: [], defaultDurationSec: 45 }],
      days: routine({ mon: { rest: false, focus: 'HIIT', items: [
        { kind: 'circuit', name: 'Test', rounds: 3, betweenChildSec: 15, betweenRoundSec: 60, children: [
          { kind: 'continuous-exercise', name: 'Burpees', durationSec: 45 },
        ] },
      ] } }).days,
    }));
    expect(r.ok).toBe(true);
  });

  test('rejects circuit with empty children', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [],
      days: routine({ mon: { rest: false, focus: '', items: [
        { kind: 'circuit', name: 'X', rounds: 3, betweenChildSec: 0, betweenRoundSec: 0, children: [] },
      ] } }).days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/children/);
  });

  test('rejects circuit child of wrong kind', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [{ kind: 'reps', name: 'Y', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 10, defaultRestSec: 60 }],
      days: routine({ mon: { rest: false, focus: '', items: [
        { kind: 'circuit', name: 'X', rounds: 3, betweenChildSec: 0, betweenRoundSec: 0, children: [
          { kind: 'reps-exercise', name: 'Y', sets: 3, reps: 10, restSec: 60, weightNote: '' },
        ] },
      ] } }).days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/continuous-exercise/);
  });

  test('rejects unknown item kind', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [],
      days: routine({ mon: { rest: false, focus: '', items: [
        { kind: 'rest-exercise', name: 'Nope' },
      ] } }).days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/unknown/);
  });
});

describe('circuit progress', () => {
  // Find the Mon circuit in seed (Elliptical Intervals).
  const monCircuit = baseState.template.days.mon.items.find(i => i.kind === 'circuit');
  const startedMon = () => startWorkout(baseState, 'mon');

  test('toggleCircuitChild flips per-child state for the current round', () => {
    const s1 = toggleCircuitChild(startedMon(), 'mon', monCircuit.id, 0);
    expect(s1.inProgress.circuitProgress[monCircuit.id][0]).toBe(true);
    expect(s1.inProgress.circuitProgress[monCircuit.id][1]).toBe(false);
    const s2 = toggleCircuitChild(s1, 'mon', monCircuit.id, 0);
    expect(s2.inProgress.circuitProgress[monCircuit.id][0]).toBe(false);
  });

  test('completeCircuitRound ticks next round and resets children', () => {
    let s = toggleCircuitChild(startedMon(), 'mon', monCircuit.id, 0);
    s = toggleCircuitChild(s, 'mon', monCircuit.id, 1);
    s = completeCircuitRound(s, 'mon', monCircuit.id);
    expect(s.inProgress.completedSets[monCircuit.id][0]).toBe(true);
    expect(s.inProgress.circuitProgress[monCircuit.id]).toEqual([false, false]);
  });

  test('completeCircuitRound is a no-op once all rounds are done', () => {
    let s = startedMon();
    for (let i = 0; i < monCircuit.rounds; i++) {
      s = completeCircuitRound(s, 'mon', monCircuit.id);
    }
    const before = s.inProgress.completedSets[monCircuit.id].slice();
    s = completeCircuitRound(s, 'mon', monCircuit.id);
    expect(s.inProgress.completedSets[monCircuit.id]).toEqual(before);
  });

  test('toggleCircuitChild is a no-op without an active session', () => {
    const s = toggleCircuitChild(baseState, 'mon', monCircuit.id, 0);
    expect(s).toBe(baseState);
  });
});

describe('session lifecycle', () => {
  afterEach(() => vi.useRealTimers());

  test('toggleSet does nothing until startWorkout is called', () => {
    // Pick the first reps/timed item on Monday.
    const item = baseState.template.days.mon.items.find(i => i.kind === 'reps-exercise' || i.kind === 'timed-exercise');
    const before = toggleSet(baseState, 'mon', item.id, 0);
    expect(before).toBe(baseState);
    const after = toggleSet(startWorkout(baseState, 'mon'), 'mon', item.id, 0);
    expect(after.inProgress.completedSets[item.id][0]).toBe(true);
  });

  test('startWorkout is a no-op when a session is already running', () => {
    const s1 = startWorkout(baseState, 'mon');
    const s2 = startWorkout(s1, 'tue');
    expect(s2).toBe(s1);
  });

  test('cancelWorkout drops in-progress without writing to history', () => {
    const s = cancelWorkout(startWorkout(baseState, 'mon'));
    expect(s.inProgress).toBeNull();
    expect(s.history).toEqual([]);
  });

  test('finishWorkout records duration and dates from startedAt', () => {
    // Start at a fixed instant, finish 25 minutes later.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-29T22:30:00Z'));
    const started = startWorkout(baseState, 'mon');
    vi.setSystemTime(new Date('2026-04-29T22:55:00Z'));
    const finished = finishWorkout(started);
    const entry = finished.history[0];
    expect(entry.date).toBe('2026-04-29');
    expect(entry.startedAt).toBe(Date.parse('2026-04-29T22:30:00Z'));
    expect(entry.finishedAt).toBe(Date.parse('2026-04-29T22:55:00Z'));
    expect(entry.day).toBe('mon');
    expect(finished.inProgress).toBeNull();
  });

  test('finishWorkout uses the start date when a session crosses midnight (UTC)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-29T23:50:00Z'));
    const started = startWorkout(baseState, 'mon');
    vi.setSystemTime(new Date('2026-04-30T00:15:00Z'));
    const entry = finishWorkout(started).history[0];
    expect(entry.date).toBe('2026-04-29');
  });
});

describe('circuit editing', () => {
  test('addCircuit appends a default circuit to the day', () => {
    const next = addCircuit(baseState, 'mon');
    const items = next.template.days.mon.items;
    const last = items[items.length - 1];
    expect(last.kind).toBe('circuit');
    expect(last.children).toEqual([]);
    expect(last.rounds).toBeGreaterThan(0);
  });

  test('addCircuitChild only accepts continuous pool entries', () => {
    const withCircuit = addCircuit(baseState, 'mon');
    const circuit = withCircuit.template.days.mon.items.at(-1);
    // Try adding a reps-kind exercise — should be a no-op.
    const noChange = addCircuitChild(withCircuit, 'mon', circuit.id, 'bw-squat');
    expect(noChange).toBe(withCircuit);
    // Adding a continuous one works.
    const added = addCircuitChild(withCircuit, 'mon', circuit.id, 'jump-squat');
    const updated = added.template.days.mon.items.find(i => i.id === circuit.id);
    expect(updated.children).toHaveLength(1);
    expect(updated.children[0].exerciseId).toBe('jump-squat');
  });
});

describe('applyImportedRoutine', () => {
  test('replaces days, merges pool, clears in-progress', () => {
    const stateWithProgress = { ...baseState, inProgress: { day: 'mon', startedAt: 0, completedSets: {} } };
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [
        { kind: 'reps', name: 'New Move', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 10, defaultRestSec: 60 },
      ],
      days: routine({ mon: { rest: false, focus: 'New plan', items: [
        { kind: 'reps-exercise', name: 'New Move', sets: 3, reps: 10, restSec: 60, weightNote: '' },
      ] } }).days,
    }));
    expect(r.ok).toBe(true);
    const next = applyImportedRoutine(stateWithProgress, r.parsed);
    expect(next.template.days.mon.focus).toBe('New plan');
    expect(next.pool['bw-squat']).toBeTruthy(); // existing kept
    expect(next.pool[r.parsed.newPool[0].id]).toBeTruthy(); // new added
    expect(next.inProgress).toBeNull();
    // All 7 days should be the new ones — the previous state's days should not bleed through
    for (const d of DAYS) {
      expect(next.template.days[d]).toBe(r.parsed.days[d]);
    }
  });
});
