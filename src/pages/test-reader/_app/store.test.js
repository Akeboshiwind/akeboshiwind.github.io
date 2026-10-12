import { describe, test, expect, beforeEach } from 'vitest';
import {
  STORAGE_KEY, LEGACY_KEY, loadData, saveData, createTest, addEntry, updateEntry, deleteEntry,
  testSummary, parseEntryInput, toLocalInputValue,
} from './store.js';

const stored = {
  tests: [{
    id: 'abc',
    name: 'COVID',
    createdAt: '2026-01-01T09:00:00.000Z',
    data: [{ score: 0.42, timestamp: '2026-01-02T09:00:00.000Z' }, { score: 1.1, timestamp: '2026-01-03T09:00:00.000Z', manual: true }],
  }],
};

beforeEach(() => localStorage.clear());

describe('the stored format', () => {
  test('the keys are testReaderData and, for legacy data, ovulationTests', () => {
    expect(STORAGE_KEY).toBe('testReaderData');
    expect(LEGACY_KEY).toBe('ovulationTests');
  });

  test('testReaderData loads as stored', () => {
    localStorage.setItem('testReaderData', JSON.stringify(stored));
    expect(loadData()).toEqual(stored);
  });

  test('nothing stored is no tests', () => {
    expect(loadData()).toEqual({ tests: [] });
  });

  test('saving writes the same JSON back under testReaderData', () => {
    saveData(stored);
    expect(JSON.parse(localStorage.getItem('testReaderData'))).toEqual(stored);
  });
});

describe('the legacy ovulationTests key', () => {
  const legacy = [{ score: 0.3, timestamp: '2025-06-01T08:00:00.000Z' }];
  const now = () => new Date('2026-02-01T10:00:00.000Z');

  test('becomes a test named Migrated Data, is written under testReaderData and removed', () => {
    localStorage.setItem('ovulationTests', JSON.stringify(legacy));
    const expected = { tests: [{ id: 'new', name: 'Migrated Data', createdAt: '2026-02-01T10:00:00.000Z', data: legacy }] };

    expect(loadData(localStorage, { newId: () => 'new', now })).toEqual(expected);
    expect(JSON.parse(localStorage.getItem('testReaderData'))).toEqual(expected);
    expect(localStorage.getItem('ovulationTests')).toBeNull();
  });

  test('is left alone when testReaderData already exists', () => {
    localStorage.setItem('testReaderData', JSON.stringify(stored));
    localStorage.setItem('ovulationTests', JSON.stringify(legacy));
    expect(loadData(localStorage, { newId: () => 'new', now })).toEqual(stored);
    expect(localStorage.getItem('ovulationTests')).toBe(JSON.stringify(legacy));
  });
});

describe('changes', () => {
  test('a created test is appended with no entries', () => {
    const { data, test } = createTest(stored, 'LH', { id: 'x', now: new Date('2026-03-01T00:00:00.000Z') });
    expect(test).toEqual({ id: 'x', name: 'LH', createdAt: '2026-03-01T00:00:00.000Z', data: [] });
    expect(data.tests.map((t) => t.name)).toEqual(['COVID', 'LH']);
  });

  test('entries are added at the end, edited and deleted by index, without touching the input', () => {
    const added = addEntry(stored, 'abc', { score: 0.9, timestamp: 't' });
    expect(added.tests[0].data.map((e) => e.score)).toEqual([0.42, 1.1, 0.9]);

    const edited = updateEntry(added, 'abc', 1, { score: 2, timestamp: 'u' });
    expect(edited.tests[0].data[1]).toEqual({ score: 2, timestamp: 'u', manual: true });

    const deleted = deleteEntry(edited, 'abc', 0);
    expect(deleted.tests[0].data.map((e) => e.score)).toEqual([2, 0.9]);
    expect(stored.tests[0].data).toHaveLength(2);
  });
});

describe('the list summary', () => {
  test('counts entries and dates the last one', () => {
    expect(testSummary(stored.tests[0])).toBe(`2 entries · Last: ${new Date('2026-01-03T09:00:00.000Z').toLocaleDateString()}`);
  });

  test('says No entries for an empty test', () => {
    expect(testSummary({ data: [] })).toBe('0 entries · Last: No entries');
  });
});

describe('form input', () => {
  test('a positive score and a date make an entry', () => {
    expect(parseEntryInput('0.75', '2026-01-02T09:30')).toEqual({ score: 0.75, timestamp: new Date('2026-01-02T09:30').toISOString() });
  });

  test.each([['0'], ['-1'], ['']])('score %j is refused', (score) => {
    expect(parseEntryInput(score, '2026-01-02T09:30')).toEqual({ error: 'Score must be greater than 0' });
  });

  test('a missing date is refused', () => {
    expect(parseEntryInput('1', '')).toEqual({ error: 'Please select a date and time' });
  });

  test('a date round-trips through the datetime-local value', () => {
    expect(toLocalInputValue(new Date('2026-01-02T09:30'))).toBe('2026-01-02T09:30');
  });
});
