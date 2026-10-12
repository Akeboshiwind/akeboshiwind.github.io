import { describe, test, expect, beforeEach } from 'vitest';
import { STORAGE_KEYS, loadSettings, saveApiKey, clearApiKey, saveVoice, saveInstructions } from './settings.js';

beforeEach(() => localStorage.clear());

describe('the storage contract', () => {
  test('the keys are the ones users already have saved', () => {
    expect(STORAGE_KEYS).toEqual({
      apiKey: 'tts-api-key',
      voice: 'tts-voice',
      instructions: 'tts-instructions',
    });
  });

  test("today's stored format, raw strings, loads as-is", () => {
    localStorage.setItem('tts-api-key', 'sk-saved-1234');
    localStorage.setItem('tts-voice', 'onyx');
    localStorage.setItem('tts-instructions', 'Speak slowly.');
    expect(loadSettings()).toEqual({ apiKey: 'sk-saved-1234', voice: 'onyx', instructions: 'Speak slowly.' });
  });

  test('with nothing saved: no key, voice nova, no instructions', () => {
    expect(loadSettings()).toEqual({ apiKey: '', voice: 'nova', instructions: '' });
  });

  test('writes raw strings, not JSON', () => {
    saveApiKey('sk-new');
    saveVoice('sage');
    saveInstructions('Warm.');
    expect(localStorage.getItem('tts-api-key')).toBe('sk-new');
    expect(localStorage.getItem('tts-voice')).toBe('sage');
    expect(localStorage.getItem('tts-instructions')).toBe('Warm.');
  });

  test('clearing the key removes it', () => {
    saveApiKey('sk-new');
    clearApiKey();
    expect(localStorage.getItem('tts-api-key')).toBeNull();
    expect(loadSettings().apiKey).toBe('');
  });
});
