import { describe, test, expect, beforeEach, vi } from 'vitest';
import {
  STORAGE_KEY, SETTINGS_KEY, loadProgress, saveProgress, loadSettings, saveSettings, newDeck, clampMaxLearningCards,
} from './storage.js';
import { LETTERS } from './letters.js';

// A deck exactly as the page has always saved it: every card carries its letter fields and its schedule.
const SAVED_PROGRESS = JSON.stringify([
  { char: 'अ', roman: 'a', hint: 'like "u" in "but"', interval: 1, ease: 2.5, reps: 2, lapses: 0, due: 1700086400000, state: 'review' },
  { char: 'आ', roman: 'ā', hint: 'like "a" in "father"', interval: 0, ease: 2.3, reps: 0, lapses: 1, due: 1700000000000, state: 'learning' },
  { char: 'इ', roman: 'i', hint: 'like "i" in "bit"', interval: 0, ease: 2.5, reps: 0, lapses: 0, due: 1699990000000, state: 'new' },
]);

beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('storage keys', () => {
  test('are the ones users already have data under', () => {
    expect(STORAGE_KEY).toBe('hindi-srs-progress');
    expect(SETTINGS_KEY).toBe('hindi-srs-settings');
  });
});

describe('loadProgress', () => {
  test('loads a deck saved in today\'s format unchanged', () => {
    localStorage.setItem('hindi-srs-progress', SAVED_PROGRESS);
    expect(loadProgress()).toEqual(JSON.parse(SAVED_PROGRESS));
  });

  test('starts every letter as a new card when nothing is saved', () => {
    const deck = loadProgress();
    expect(deck).toHaveLength(LETTERS.length);
    expect(deck.every((c) => c.state === 'new' && c.ease === 2.5 && c.interval === 0)).toBe(true);
    expect(deck.map((c) => c.char)).toEqual(LETTERS.map((l) => l.char));
  });

  test('falls back to a new deck when the saved value is not JSON', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem('hindi-srs-progress', '{oops');
    expect(loadProgress()).toHaveLength(LETTERS.length);
  });
});

describe('saveProgress', () => {
  test('writes the deck as a JSON array under hindi-srs-progress', () => {
    const deck = newDeck(5);
    saveProgress(deck);
    expect(JSON.parse(localStorage.getItem('hindi-srs-progress'))).toEqual(deck);
  });
});

describe('loadSettings', () => {
  test('loads settings saved in today\'s format', () => {
    localStorage.setItem('hindi-srs-settings', '{"maxLearningCards":7}');
    expect(loadSettings()).toEqual({ maxLearningCards: 7 });
  });

  test('defaults to 10 learning cards when nothing is saved', () => {
    expect(loadSettings()).toEqual({ maxLearningCards: 10 });
    expect(localStorage.getItem('hindi-srs-settings')).toBeNull();
  });

  test('migrates the old daily-counter shape and writes the migrated shape back', () => {
    localStorage.setItem('hindi-srs-settings', JSON.stringify({ newCardsPerDay: 5, lastNewCardsDate: 'Mon Jan 01 2024', newCardsToday: 2 }));
    expect(loadSettings()).toEqual({ maxLearningCards: 5 });
    expect(JSON.parse(localStorage.getItem('hindi-srs-settings'))).toEqual({ maxLearningCards: 5 });
  });
});

describe('saveSettings', () => {
  test('writes the settings as JSON under hindi-srs-settings', () => {
    saveSettings({ maxLearningCards: 12 });
    expect(localStorage.getItem('hindi-srs-settings')).toBe('{"maxLearningCards":12}');
  });
});

describe('clampMaxLearningCards', () => {
  test('keeps 1–50, and reads anything unparseable as 10', () => {
    expect(clampMaxLearningCards('7')).toBe(7);
    expect(clampMaxLearningCards('0')).toBe(10);
    expect(clampMaxLearningCards('-3')).toBe(1);
    expect(clampMaxLearningCards('99')).toBe(50);
    expect(clampMaxLearningCards('')).toBe(10);
  });
});
