import { describe, test, expect, vi, afterEach } from 'vitest';
import { speechRequest, generateSpeech, VOICES } from './speech.js';

afterEach(() => vi.unstubAllGlobals());

describe('speechRequest', () => {
  test('posts JSON to the OpenAI speech endpoint with the key as a bearer token', () => {
    const { url, init } = speechRequest('sk-test', 'Hello.', 'nova', '');
    expect(url).toBe('https://api.openai.com/v1/audio/speech');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Authorization': 'Bearer sk-test', 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body)).toEqual({ model: 'gpt-4o-mini-tts', voice: 'nova', input: 'Hello.' });
  });

  test('sends instructions trimmed, and leaves them out when blank', () => {
    expect(JSON.parse(speechRequest('k', 't', 'ash', '  Calm.  ').init.body).instructions).toBe('Calm.');
    expect('instructions' in JSON.parse(speechRequest('k', 't', 'ash', '   ').init.body)).toBe(false);
  });
});

describe('generateSpeech', () => {
  test('resolves to the response audio', async () => {
    const audio = new Blob(['mp3'], { type: 'audio/mpeg' });
    const fetch = vi.fn().mockResolvedValue({ ok: true, blob: async () => audio });
    vi.stubGlobal('fetch', fetch);
    await expect(generateSpeech('sk-test', 'Hi.', 'echo', '')).resolves.toBe(audio);
    expect(fetch).toHaveBeenCalledWith('https://api.openai.com/v1/audio/speech', expect.objectContaining({ method: 'POST' }));
  });

  test('rejects with the status and body of a failed response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, text: async () => 'bad key' }));
    await expect(generateSpeech('sk-x', 'Hi.', 'echo', '')).rejects.toThrow('API error 401: bad key');
  });
});

test('offers the thirteen voices', () => {
  expect(VOICES).toEqual(['alloy', 'ash', 'ballad', 'coral', 'echo', 'fable', 'nova', 'onyx', 'sage', 'shimmer', 'verse', 'marin', 'cedar']);
});
