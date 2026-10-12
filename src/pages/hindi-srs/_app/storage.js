import { LETTERS } from './letters.js';
import { getDefaultCard } from './srs.js';

export const STORAGE_KEY = 'hindi-srs-progress';
export const SETTINGS_KEY = 'hindi-srs-settings';

export const MIN_LEARNING_CARDS = 1;
export const MAX_LEARNING_CARDS = 50;

export function getDefaultSettings() {
  return { maxLearningCards: 10 };
}

export function newDeck(now = Date.now()) {
  return LETTERS.map((letter) => getDefaultCard(letter, now));
}

/** Settings once held a daily new-card counter; its limit becomes the learning-card limit. */
export function migrateSettings(settings) {
  if ('newCardsPerDay' in settings) {
    settings.maxLearningCards = settings.newCardsPerDay;
    delete settings.newCardsPerDay;
    delete settings.lastNewCardsDate;
    delete settings.newCardsToday;
  }
  return settings;
}

/** Parses a typed limit the way the settings field always has: unparseable is 10, then clamped to 1–50. */
export function clampMaxLearningCards(value) {
  const parsed = parseInt(value) || 10;
  return Math.min(MAX_LEARNING_CARDS, Math.max(MIN_LEARNING_CARDS, parsed));
}

/** Writes the migrated settings back, so a legacy shape is upgraded on first load. */
export function loadSettings(storage = localStorage) {
  try {
    const saved = storage.getItem(SETTINGS_KEY);
    if (saved) {
      const settings = migrateSettings({ ...getDefaultSettings(), ...JSON.parse(saved) });
      saveSettings(settings, storage);
      return settings;
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return getDefaultSettings();
}

export function saveSettings(settings, storage = localStorage) {
  try {
    storage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

/** The saved deck as stored: an array of full cards (letter fields and schedule), not merged with LETTERS. */
export function loadProgress(storage = localStorage) {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return newDeck();
}

export function saveProgress(cards, storage = localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}
