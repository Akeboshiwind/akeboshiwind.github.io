/**
 * Stored shape under `testReaderData`:
 * `{ tests: [{ id, name, createdAt, data: [{ score, timestamp, manual? }] }] }`
 */
export const STORAGE_KEY = 'testReaderData';

/** Before tests had names, the one series of results lived here as a bare entry array. */
export const LEGACY_KEY = 'ovulationTests';

export const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

/**
 * The saved tests. A legacy series is only migrated when there is no `testReaderData` yet; it becomes
 * a test named "Migrated Data", is written back under the new key, and the legacy key is removed.
 */
export function loadData(storage = localStorage, { newId = generateId, now = () => new Date() } = {}) {
  const saved = storage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);

  const legacy = storage.getItem(LEGACY_KEY);
  if (legacy) {
    const migrated = {
      tests: [{ id: newId(), name: 'Migrated Data', createdAt: now().toISOString(), data: JSON.parse(legacy) }],
    };
    storage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    storage.removeItem(LEGACY_KEY);
    return migrated;
  }

  return { tests: [] };
}

export function saveData(data, storage = localStorage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const findTest = (data, id) => data.tests.find((t) => t.id === id);

export function createTest(data, name, { id = generateId(), now = new Date() } = {}) {
  const test = { id, name, createdAt: now.toISOString(), data: [] };
  return { data: { ...data, tests: [...data.tests, test] }, test };
}

const withEntries = (data, testId, change) => ({
  ...data,
  tests: data.tests.map((t) => (t.id === testId ? { ...t, data: change(t.data) } : t)),
});

export const addEntry = (data, testId, entry) => withEntries(data, testId, (entries) => [...entries, entry]);

export const updateEntry = (data, testId, index, patch) =>
  withEntries(data, testId, (entries) => entries.map((e, i) => (i === index ? { ...e, ...patch } : e)));

export const deleteEntry = (data, testId, index) =>
  withEntries(data, testId, (entries) => entries.filter((_, i) => i !== index));

export function testSummary(test) {
  const last = test.data.length > 0
    ? new Date(test.data[test.data.length - 1].timestamp).toLocaleDateString()
    : 'No entries';
  return `${test.data.length} entries · Last: ${last}`;
}

export function toLocalInputValue(date) {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

/**
 * A manual or edited result from the form's raw values.
 *
 * @returns {{ error: string } | { score: number, timestamp: string }}
 */
export function parseEntryInput(scoreValue, dateValue) {
  const score = parseFloat(scoreValue);
  if (isNaN(score) || score <= 0) return { error: 'Score must be greater than 0' };
  if (!dateValue) return { error: 'Please select a date and time' };
  return { score, timestamp: new Date(dateValue).toISOString() };
}
