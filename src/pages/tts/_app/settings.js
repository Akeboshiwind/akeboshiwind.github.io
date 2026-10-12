/** Values are raw strings, not JSON: keys saved by earlier versions of the page must still load. */
export const STORAGE_KEYS = {
  apiKey: 'tts-api-key',
  voice: 'tts-voice',
  instructions: 'tts-instructions',
};

export const DEFAULT_VOICE = 'nova';

export function loadSettings(storage = localStorage) {
  return {
    apiKey: storage.getItem(STORAGE_KEYS.apiKey) || '',
    voice: storage.getItem(STORAGE_KEYS.voice) || DEFAULT_VOICE,
    instructions: storage.getItem(STORAGE_KEYS.instructions) || '',
  };
}

export const saveApiKey = (key, storage = localStorage) => storage.setItem(STORAGE_KEYS.apiKey, key);
export const clearApiKey = (storage = localStorage) => storage.removeItem(STORAGE_KEYS.apiKey);
export const saveVoice = (voice, storage = localStorage) => storage.setItem(STORAGE_KEYS.voice, voice);
export const saveInstructions = (text, storage = localStorage) => storage.setItem(STORAGE_KEYS.instructions, text);
