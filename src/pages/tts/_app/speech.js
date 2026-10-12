export const VOICES = ['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer', 'verse', 'marin', 'cedar'];
export const SPEECH_URL = 'https://api.openai.com/v1/audio/speech';
export const MODEL = 'gpt-4o-mini-tts';
export const PREVIEW_TEXT = 'Hello, this is a preview of my voice.';

export function speechRequest(apiKey, text, voice, instructions) {
  const body = { model: MODEL, voice, input: text };
  if (instructions && instructions.trim()) {
    body.instructions = instructions.trim();
  }
  return {
    url: SPEECH_URL,
    init: {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
  };
}

/** Resolves to the audio Blob, or rejects with "API error <status>: <body>". */
export async function generateSpeech(apiKey, text, voice, instructions) {
  const { url, init } = speechRequest(apiKey, text, voice, instructions);
  const response = await fetch(url, init);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }
  return await response.blob();
}
