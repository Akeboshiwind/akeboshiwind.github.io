import { describe, test, expect } from 'vitest';
import { parseImportedRoutine, applyImportedRoutine, DAYS } from './store.js';
import { seedPool, seedTemplate } from './seed.js';

const baseState = {
  pool: seedPool,
  template: seedTemplate,
  inProgress: null,
  history: [],
};

describe('parseImportedRoutine', () => {
  test('rejects malformed JSON', () => {
    const r = parseImportedRoutine(baseState, '{not json');
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/JSON/);
  });

  test('strips markdown fences', () => {
    const raw = '```json\n{"pool": [], "days": {}}\n```';
    const r = parseImportedRoutine(baseState, raw);
    expect(r.ok).toBe(true);
  });

  test('matches existing exercises by name (case-insensitive) and updates them', () => {
    const raw = JSON.stringify({
      pool: [
        // Same name as a seeded exercise — should be marked as updated
        { kind: 'reps', name: 'BODYWEIGHT SQUATS', description: 'new desc', tip: '', equipment: 'none', tags: [], defaultSets: 4, defaultReps: 20, defaultRestSec: 30 },
      ],
      days: {
        mon: { rest: false, focus: 'Test', items: [
          { kind: 'reps-exercise', name: 'Bodyweight Squats', sets: 4, reps: 20, restSec: 30, weightNote: '' },
        ] },
      },
    });
    const r = parseImportedRoutine(baseState, raw);
    expect(r.ok).toBe(true);
    expect(r.summary.updatedExercises).toContain('BODYWEIGHT SQUATS');
    expect(r.summary.newExercises).toEqual([]);
    // The updated entry should keep the original id
    expect(r.parsed.updatedPool[0].id).toBe('bw-squat');
  });

  test('creates new ids for unknown exercises', () => {
    const raw = JSON.stringify({
      pool: [
        { kind: 'reps', name: 'Hindu Pushup', description: 'd', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 10, defaultRestSec: 60 },
      ],
      days: { mon: { rest: false, focus: '', items: [
        { kind: 'reps-exercise', name: 'Hindu Pushup', sets: 3, reps: 10, restSec: 60, weightNote: '' },
      ] } },
    });
    const r = parseImportedRoutine(baseState, raw);
    expect(r.ok).toBe(true);
    expect(r.summary.newExercises).toContain('Hindu Pushup');
    expect(r.parsed.newPool[0].id).toMatch(/^hindu-pushup-/);
  });

  test('rejects items that reference unknown pool entries', () => {
    const raw = JSON.stringify({
      pool: [],
      days: { mon: { rest: false, focus: '', items: [
        { kind: 'reps-exercise', name: 'Mystery', sets: 3, reps: 10, restSec: 60 },
      ] } },
    });
    const r = parseImportedRoutine(baseState, raw);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/Mystery/);
  });

  test('rejects pool/item kind mismatch', () => {
    const raw = JSON.stringify({
      pool: [{ kind: 'reps', name: 'X', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 10, defaultRestSec: 60 }],
      days: { mon: { rest: false, focus: '', items: [
        { kind: 'continuous-exercise', name: 'X', durationSec: 30 },
      ] } },
    });
    const r = parseImportedRoutine(baseState, raw);
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/kind/);
  });

  test('omitted days are kept untouched', () => {
    const raw = JSON.stringify({
      pool: [],
      days: { mon: { rest: true, focus: 'Rest', items: [] } },
    });
    const r = parseImportedRoutine(baseState, raw);
    expect(r.ok).toBe(true);
    // Days other than mon should still be the seed template days
    for (const d of DAYS) {
      if (d === 'mon') continue;
      expect(r.parsed.days[d]).toBe(baseState.template.days[d]);
    }
  });

  test('applyImportedRoutine replaces days and merges pool', () => {
    const raw = JSON.stringify({
      pool: [
        { kind: 'reps', name: 'New Move', description: '', tip: '', equipment: 'none', tags: [], defaultSets: 3, defaultReps: 10, defaultRestSec: 60 },
      ],
      days: { mon: { rest: false, focus: 'New plan', items: [
        { kind: 'reps-exercise', name: 'New Move', sets: 3, reps: 10, restSec: 60 },
      ] } },
    });
    const r = parseImportedRoutine(baseState, raw);
    expect(r.ok).toBe(true);
    const next = applyImportedRoutine(baseState, r.parsed);
    expect(next.template.days.mon.focus).toBe('New plan');
    // Existing pool entries kept
    expect(next.pool['bw-squat']).toBeTruthy();
    // New entry added
    const newId = r.parsed.newPool[0].id;
    expect(next.pool[newId]).toBeTruthy();
    expect(next.inProgress).toBeNull();
  });
});
