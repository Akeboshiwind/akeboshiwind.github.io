import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import playIcon from 'pixelarticons/svg/play.svg?raw';
import pauseIcon from 'pixelarticons/svg/pause.svg?raw';
import slidersIcon from 'pixelarticons/svg/sliders.svg?raw';
import { Icon } from '../../../components/pixel/Icon.jsx';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { splitText } from './chunking.js';
import { VOICES, PREVIEW_TEXT, generateSpeech } from './speech.js';
import * as storage from './settings.js';
import { formatTime } from './timeline.js';
import { useSession } from './useSession.js';

const SPEEDS = ['0.5', '0.75', '1', '1.25', '1.5', '2'];

const STATUS_COLOUR = {
  pending: 'bg-text opacity-40',
  generating: 'bg-warn animate-pulse',
  retrying: 'bg-warn animate-pulse',
  completed: 'bg-ok',
  failed: 'pixel-mark',
};

function KeyForm({ onSave }) {
  const [key, setKey] = useState('');
  const submit = (e) => {
    e.preventDefault();
    if (key.trim()) onSave(key.trim());
  };
  return (
    <form onSubmit={submit} className="pixel-panel p-4 flex flex-col gap-4">
      <p>Enter your OpenAI API key to convert text to speech.</p>
      <div className="flex flex-col gap-2">
        <label htmlFor="api-key" className="label">OpenAI API key</label>
        <input
          id="api-key"
          type="password"
          autoComplete="off"
          className="pixel-field w-full"
          placeholder="sk-..."
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
      <button type="submit" className="pixel-button py-2" data-variant="primary">Save Key</button>
      <div className="text-sm opacity-70 flex flex-col gap-1">
        <p>Your key is stored locally in your browser and never sent to any server except OpenAI.</p>
        <p>Required: TTS API access (models like gpt-4o-mini-tts)</p>
      </div>
    </form>
  );
}

function VoicePicker({ voice, onPick, apiKey }) {
  const [previewing, setPreviewing] = useState(null);
  const [error, setError] = useState(null);

  async function preview(name) {
    setPreviewing(name);
    setError(null);
    try {
      const blob = await generateSpeech(apiKey, PREVIEW_TEXT, name, '');
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.oncanplaythrough = () => audio.play().catch((err) => console.error('Preview failed:', err));
      audio.onended = () => URL.revokeObjectURL(url);
      audio.onerror = () => URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Preview failed: ${err.message}`);
    } finally {
      setPreviewing(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {VOICES.map((name) => (
          <div key={name} className="flex">
            <button
              type="button"
              className="pixel-chip flex-1 text-left"
              aria-pressed={voice === name}
              onClick={() => onPick(name)}
            >
              {name}
            </button>
            <button
              type="button"
              className={`pixel-button -ml-[2px] px-2 ${previewing === name ? 'animate-pulse' : ''}`}
              aria-label={`Preview ${name}`}
              title="Preview"
              disabled={previewing === name}
              onClick={() => preview(name)}
            >
              <Icon svg={playIcon} className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      {error && <p role="alert" className="text-sm break-words"><span className="pixel-alert-text">{error}</span></p>}
    </div>
  );
}

function SettingsPanel({ settings, onKey, onClearKey, onVoice, onInstructions }) {
  const [newKey, setNewKey] = useState('');
  const update = (e) => {
    e.preventDefault();
    if (newKey.trim()) {
      onKey(newKey.trim());
      setNewKey('');
    }
  };
  const clear = () => {
    if (confirm('Clear API key? You will need to enter it again.')) onClearKey();
  };

  return (
    <section aria-label="Settings" className="pixel-panel p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <SectionLabel>API Key</SectionLabel>
        <form onSubmit={update} className="flex flex-wrap gap-2">
          <input
            type="password"
            autoComplete="off"
            aria-label="New API key"
            className="pixel-field flex-1 min-w-0 basis-40"
            placeholder={settings.apiKey ? `sk-...${settings.apiKey.slice(-4)}` : 'sk-...'}
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
          />
          <button type="submit" className="pixel-button">Update</button>
          <button type="button" className="pixel-button" data-variant="danger" onClick={clear}>Clear</button>
        </form>
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Voice</SectionLabel>
        <VoicePicker voice={settings.voice} onPick={onVoice} apiKey={settings.apiKey} />
      </div>

      <div className="flex flex-col gap-2">
        <SectionLabel>Voice Instructions</SectionLabel>
        <textarea
          aria-label="Voice instructions"
          className="pixel-field w-full min-h-20 resize-y"
          placeholder="e.g., Speak warmly and clearly, with a calm tone..."
          value={settings.instructions}
          onChange={(e) => onInstructions(e.target.value)}
        />
        <p className="text-sm opacity-70">Optional: Describe how the voice should speak. This affects tone, pace, and delivery style.</p>
      </div>
    </section>
  );
}

function ChunkCard({ chunk, number, playing, onPlay, onRetry }) {
  const header = (
    <div className="flex items-center gap-3">
      <span className="label">Chunk {number}</span>
      <span className="flex items-center gap-2 label opacity-80">
        <span aria-hidden="true" className={`w-2 h-2 ${STATUS_COLOUR[chunk.status]}`} />
        {chunk.status}
      </span>
      {chunk.status === 'failed' && (
        <button type="button" className="pixel-button ml-auto" onClick={onRetry}>Retry</button>
      )}
    </div>
  );
  const body = (
    <>
      {header}
      <p className="mt-2 whitespace-pre-wrap break-words">{chunk.text}</p>
      {chunk.status === 'failed' && chunk.error && (
        <p className="mt-2 text-sm break-words"><span className="pixel-alert-text">{chunk.error}</span></p>
      )}
    </>
  );
  const frame = `pixel-panel p-3 block w-full text-left ${playing ? 'border-accent' : ''}`;
  return chunk.status === 'completed' ? (
    <button type="button" className={`${frame} cursor-pointer hover:border-accent`} onClick={onPlay} aria-current={playing || undefined}>
      {body}
    </button>
  ) : (
    <div className={frame}>{body}</div>
  );
}

function PlayerBar({ session }) {
  const { hasAudio, playing, position, total, rate, waiting } = session;
  return (
    <div className="pixel-bar flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className="pixel-button" title="Back 15 seconds" disabled={!hasAudio} onClick={() => session.skip(-15)}>-15s</button>
        <button
          type="button"
          className="pixel-button px-3"
          data-variant="primary"
          aria-label={playing ? 'Pause' : 'Play'}
          disabled={!hasAudio}
          onClick={session.togglePlay}
        >
          <Icon svg={playing ? pauseIcon : playIcon} className="w-5 h-5" />
        </button>
        <button type="button" className="pixel-button" title="Forward 30 seconds" disabled={!hasAudio} onClick={() => session.skip(30)}>+30s</button>
        <select
          aria-label="Speed"
          className="pixel-field ml-auto"
          value={String(rate)}
          onChange={(e) => session.setRate(parseFloat(e.target.value))}
        >
          {SPEEDS.map((s) => <option key={s} value={s}>{s}x</option>)}
        </select>
      </div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          aria-label="Position"
          className="pixel-range flex-1"
          min="0"
          max="100"
          step="any"
          value={total > 0 ? (position / total) * 100 : 0}
          disabled={!hasAudio}
          onChange={(e) => session.seekFraction(Number(e.target.value) / 100)}
        />
        <span className="pixel-num">{formatTime(position)} / {formatTime(total)}</span>
      </div>
      {waiting && <p className="label text-warn">Waiting for more audio to generate...</p>}
    </div>
  );
}

export function App({ retryDelays } = {}) {
  const [settings, setSettings] = useState(() => storage.loadSettings());
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const [view, setView] = useState(settings.apiKey ? 'input' : 'key');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [text, setText] = useState('');
  const session = useSession(settingsRef, { retryDelays });

  const chunkCount = text.trim() ? splitText(text.trim()).length : 0;

  const saveKey = (key) => {
    storage.saveApiKey(key);
    setSettings((s) => ({ ...s, apiKey: key }));
  };

  const clearKey = () => {
    storage.clearApiKey();
    setSettings((s) => ({ ...s, apiKey: '' }));
    setSettingsOpen(false);
    setView('key');
  };

  const pickVoice = (voice) => {
    storage.saveVoice(voice);
    setSettings((s) => ({ ...s, voice }));
  };

  const setInstructions = (instructions) => {
    storage.saveInstructions(instructions);
    setSettings((s) => ({ ...s, instructions }));
  };

  const generate = () => {
    if (!text.trim()) return;
    setView('play');
    session.generate(text.trim());
  };

  const editText = () => {
    session.pause();
    setView('input');
  };

  const shortcuts = useRef({});
  shortcuts.current = { active: view === 'play' && !settingsOpen, session };
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      const { active, session } = shortcuts.current;
      if (!active || !session.hasAudio) return;
      if (e.code === 'Space') {
        e.preventDefault();
        session.togglePlay();
      } else if (e.key === 'ArrowLeft') {
        session.skip(-15);
      } else if (e.key === 'ArrowRight') {
        session.skip(30);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const settingsChip = (
    <button
      type="button"
      className="pixel-chip flex items-center gap-2"
      aria-expanded={settingsOpen}
      onClick={() => setSettingsOpen((o) => !o)}
    >
      <Icon svg={slidersIcon} className="w-4 h-4" />
      Settings
    </button>
  );

  return (
    <div className={`text-text flex flex-col gap-6 ${view === 'play' ? 'pb-48' : ''}`}>
      <div>
        <h1 className="page-title mt-4 mb-2">Text to Speech</h1>
        <p className="page-sub m-0">Read text aloud with OpenAI's voices, using your own API key. Long text is generated in chunks.</p>
      </div>

      {view === 'key' && <KeyForm onSave={(key) => { saveKey(key); setView('input'); }} />}

      {view !== 'key' && settingsOpen && (
        <SettingsPanel
          settings={settings}
          onKey={saveKey}
          onClearKey={clearKey}
          onVoice={pickVoice}
          onInstructions={setInstructions}
        />
      )}

      {view === 'input' && (
        <div className="flex flex-col gap-4">
          <SectionLabel action={settingsChip}>Enter Text</SectionLabel>
          <textarea
            aria-label="Text"
            className="pixel-field w-full min-h-72 resize-y"
            placeholder="Paste or type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="label opacity-80"><span className="pixel-num">{chunkCount}</span> chunk(s) will be generated</p>
            <button type="button" className="pixel-button py-2 px-4" data-variant="primary" disabled={chunkCount === 0} onClick={generate}>
              Generate Audio
            </button>
          </div>
        </div>
      )}

      {view === 'play' && (
        <div className="flex flex-col gap-4">
          <SectionLabel action={<span className="flex gap-2">{settingsChip}<button type="button" className="pixel-button" onClick={editText}>Edit Text</button></span>}>
            Audio
          </SectionLabel>
          <ol className="flex flex-col gap-3 list-none p-0 m-0">
            {session.chunks.map((chunk, i) => (
              <li key={chunk.id}>
                <ChunkCard
                  chunk={chunk}
                  number={i + 1}
                  playing={session.index === i && session.playing}
                  onPlay={() => session.playFrom(i)}
                  onRetry={() => session.retry(chunk.id)}
                />
              </li>
            ))}
          </ol>
          <PlayerBar session={session} />
        </div>
      )}

      <audio ref={session.audioRef} />
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
