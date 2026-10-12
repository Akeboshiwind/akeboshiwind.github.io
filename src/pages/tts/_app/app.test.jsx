import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor, within } from '@testing-library/react';
import { App } from './app.jsx';

let requests;
let respond;

class FakeAudio {
  constructor(src) { this.listeners = {}; if (src) this.src = src; }
  addEventListener(type, fn) { this.listeners[type] = fn; }
  set src(_) {
    this.duration = 2;
    queueMicrotask(() => this.listeners.loadedmetadata?.());
  }
  play() { return Promise.resolve(); }
}

beforeEach(() => {
  localStorage.clear();
  requests = [];
  respond = () => ({ ok: true, blob: async () => new Blob(['mp3'], { type: 'audio/mpeg' }) });
  vi.stubGlobal('fetch', vi.fn(async (url, init) => {
    requests.push({ url, headers: init.headers, body: JSON.parse(init.body) });
    return respond(requests.length);
  }));
  vi.stubGlobal('Audio', FakeAudio);
  vi.spyOn(URL, 'createObjectURL').mockImplementation(() => `blob:${requests.length}`);
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const keyField = () => screen.getByLabelText('OpenAI API key');
const textField = () => screen.getByRole('textbox', { name: 'Text' });
const generateButton = () => screen.getByRole('button', { name: 'Generate Audio' });
const openSettings = () => fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
const statuses = () => screen.getAllByText(/^Chunk \d+$/).map((label) => label.nextSibling.textContent);

function enterKey(key = 'sk-test-1234') {
  fireEvent.change(keyField(), { target: { value: key } });
  fireEvent.click(screen.getByRole('button', { name: 'Save Key' }));
}

describe('Text to Speech', () => {
  test('without a saved key it asks for one, in a password field', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Text to Speech' })).toBeTruthy();
    expect(keyField().type).toBe('password');
    expect(screen.queryByRole('textbox', { name: 'Text' })).toBeNull();
  });

  test('a blank key is not saved', () => {
    render(<App />);
    enterKey('   ');
    expect(localStorage.getItem('tts-api-key')).toBeNull();
    expect(keyField()).toBeTruthy();
  });

  test('saving a key stores it trimmed and moves on to the text', () => {
    render(<App />);
    enterKey('  sk-test-1234  ');
    expect(localStorage.getItem('tts-api-key')).toBe('sk-test-1234');
    expect(textField()).toBeTruthy();
  });

  test('pressing Enter in the key field saves it', () => {
    render(<App />);
    fireEvent.change(keyField(), { target: { value: 'sk-enter' } });
    fireEvent.submit(keyField().form);
    expect(localStorage.getItem('tts-api-key')).toBe('sk-enter');
  });

  test('the chunk count follows the text, and Generate needs at least one', () => {
    localStorage.setItem('tts-api-key', 'sk-test');
    render(<App />);
    expect(screen.getByText(/chunk\(s\) will be generated/).textContent).toBe('0 chunk(s) will be generated');
    expect(generateButton().disabled).toBe(true);
    fireEvent.change(textField(), { target: { value: 'One.\n\nTwo.\n\n\nThree.' } });
    expect(screen.getByText(/chunk\(s\) will be generated/).textContent).toBe('3 chunk(s) will be generated');
    expect(generateButton().disabled).toBe(false);
  });

  test('generating sends each chunk with the chosen voice and instructions, and the audio becomes playable', async () => {
    render(<App />);
    enterKey();
    openSettings();
    fireEvent.click(screen.getByRole('button', { name: 'onyx' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Voice instructions' }), { target: { value: 'Speak slowly.' } });
    fireEvent.change(textField(), { target: { value: 'First paragraph.\n\nSecond paragraph.' } });
    fireEvent.click(generateButton());

    expect(screen.getByText('First paragraph.')).toBeTruthy();
    await waitFor(() => expect(statuses()).toEqual(['completed', 'completed']));
    expect(requests).toEqual([
      {
        url: 'https://api.openai.com/v1/audio/speech',
        headers: { 'Authorization': 'Bearer sk-test-1234', 'Content-Type': 'application/json' },
        body: { model: 'gpt-4o-mini-tts', voice: 'onyx', input: 'First paragraph.', instructions: 'Speak slowly.' },
      },
      expect.objectContaining({ body: expect.objectContaining({ input: 'Second paragraph.' }) }),
    ]);
    expect(screen.getByText('0:00 / 0:04')).toBeTruthy();
    const play = screen.getByRole('button', { name: 'Play' });
    expect(play.disabled).toBe(false);
    fireEvent.click(play);
    expect(screen.getByRole('button', { name: 'Pause' })).toBeTruthy();
  });

  test('player controls stay disabled until the first chunk is ready', () => {
    localStorage.setItem('tts-api-key', 'sk-test');
    respond = () => new Promise(() => {});
    render(<App />);
    fireEvent.change(textField(), { target: { value: 'Waiting.' } });
    fireEvent.click(generateButton());
    expect(screen.getByRole('button', { name: 'Play' }).disabled).toBe(true);
    expect(screen.getByRole('button', { name: '-15s' }).disabled).toBe(true);
    expect(screen.getByRole('slider', { name: 'Position' }).disabled).toBe(true);
  });

  test('a chunk that keeps failing is marked failed with the API error, and Retry generates it again', async () => {
    localStorage.setItem('tts-api-key', 'sk-bad');
    respond = () => ({ ok: false, status: 401, text: async () => 'Incorrect API key' });
    render(<App retryDelays={[0, 0, 0]} />);
    fireEvent.change(textField(), { target: { value: 'Hello.' } });
    fireEvent.click(generateButton());

    await waitFor(() => expect(requests).toHaveLength(4));
    await waitFor(() => expect(statuses()).toEqual(['failed']));
    expect(screen.getByText('API error 401: Incorrect API key')).toBeTruthy();

    respond = () => ({ ok: true, blob: async () => new Blob(['mp3']) });
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() => expect(statuses()).toEqual(['completed']));
    expect(screen.queryByText(/API error/)).toBeNull();
  });

  test('a failed voice preview says why', async () => {
    localStorage.setItem('tts-api-key', 'sk-bad');
    respond = () => ({ ok: false, status: 429, text: async () => 'Rate limited' });
    render(<App />);
    openSettings();
    fireEvent.click(screen.getByRole('button', { name: 'Preview nova' }));
    expect((await screen.findByRole('alert')).textContent).toBe('Preview failed: API error 429: Rate limited');
    expect(requests[0].body).toEqual({ model: 'gpt-4o-mini-tts', voice: 'nova', input: 'Hello, this is a preview of my voice.' });
  });

  test('Edit Text goes back to the text, which is kept', async () => {
    localStorage.setItem('tts-api-key', 'sk-test');
    render(<App />);
    fireEvent.change(textField(), { target: { value: 'Keep me.' } });
    fireEvent.click(generateButton());
    await waitFor(() => expect(statuses()).toEqual(['completed']));
    fireEvent.click(screen.getByRole('button', { name: 'Edit Text' }));
    expect(textField().value).toBe('Keep me.');
  });

  test('the settings key field is a password field showing the saved key\'s last four characters, and Update replaces the key', () => {
    localStorage.setItem('tts-api-key', 'sk-old-9876');
    render(<App />);
    openSettings();
    const field = screen.getByLabelText('New API key');
    expect(field.type).toBe('password');
    expect(field.placeholder).toBe('sk-...9876');
    fireEvent.change(field, { target: { value: 'sk-new-5555' } });
    fireEvent.click(screen.getByRole('button', { name: 'Update' }));
    expect(localStorage.getItem('tts-api-key')).toBe('sk-new-5555');
    expect(field.value).toBe('');
  });

  test('Clear asks first, then forgets the key and asks for a new one', () => {
    localStorage.setItem('tts-api-key', 'sk-old');
    const confirm = vi.fn(() => false);
    vi.stubGlobal('confirm', confirm);
    render(<App />);
    openSettings();
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(confirm).toHaveBeenCalledWith('Clear API key? You will need to enter it again.');
    expect(localStorage.getItem('tts-api-key')).toBe('sk-old');

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(localStorage.getItem('tts-api-key')).toBeNull();
    expect(keyField()).toBeTruthy();
  });
});

describe('the storage contract', () => {
  test("a key, voice and instructions saved by the old page load, as raw strings", () => {
    localStorage.setItem('tts-api-key', 'sk-saved-abcd');
    localStorage.setItem('tts-voice', 'shimmer');
    localStorage.setItem('tts-instructions', 'Whisper.');
    render(<App />);
    expect(screen.queryByLabelText('OpenAI API key')).toBeNull();
    openSettings();
    const settings = within(screen.getByRole('region', { name: 'Settings' }));
    expect(settings.getByLabelText('New API key').placeholder).toBe('sk-...abcd');
    expect(settings.getByRole('button', { name: 'shimmer' }).getAttribute('aria-pressed')).toBe('true');
    expect(settings.getByRole('button', { name: 'nova' }).getAttribute('aria-pressed')).toBe('false');
    expect(settings.getByRole('textbox', { name: 'Voice instructions' }).value).toBe('Whisper.');
  });

  test('changes are written back under the same keys, as raw strings', () => {
    localStorage.setItem('tts-api-key', 'sk-saved');
    render(<App />);
    openSettings();
    fireEvent.click(screen.getByRole('button', { name: 'coral' }));
    fireEvent.change(screen.getByRole('textbox', { name: 'Voice instructions' }), { target: { value: 'Brisk.' } });
    expect(localStorage.getItem('tts-voice')).toBe('coral');
    expect(localStorage.getItem('tts-instructions')).toBe('Brisk.');
    expect(localStorage.getItem('tts-api-key')).toBe('sk-saved');
  });

  test('with no voice saved, nova is chosen', () => {
    localStorage.setItem('tts-api-key', 'sk-saved');
    render(<App />);
    openSettings();
    expect(screen.getByRole('button', { name: 'nova' }).getAttribute('aria-pressed')).toBe('true');
  });
});
