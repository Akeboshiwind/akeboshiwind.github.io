import { describe, test, expect } from 'vitest';
import { parseImportedRoutine, applyImportedRoutine, DAYS } from './store.js';
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
  test('rejects items referencing unknown pool entries', () => {
    const r = parseImportedRoutine(baseState, JSON.stringify({
      pool: [],
      days: routine({ mon: { rest: false, focus: '', items: [
        { kind: 'reps-exercise', name: 'Mystery', sets: 3, reps: 10, restSec: 60, weightNote: '' },
      ] } }).days,
    }));
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Mystery/);
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
