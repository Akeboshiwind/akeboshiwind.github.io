import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef } from 'react';
import playSvg from 'pixelarticons/svg/play.svg?raw';
import pauseSvg from 'pixelarticons/svg/pause.svg?raw';
import slidersSvg from 'pixelarticons/svg/sliders.svg?raw';
import expandSvg from 'pixelarticons/svg/expand.svg?raw';
import collapseSvg from 'pixelarticons/svg/collapse.svg?raw';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { Icon } from '../../../components/pixel/Icon.jsx';
import { Sheet } from '../../../components/pixel/Sheet.jsx';
import { STOPPED, STOPWATCH_CAP, isRunning, start, stop, shown, fmtTime } from './clock.js';
import { ensureAudio, buzzer, tone } from './audio.js';
import './scoreboard.css';

const PREFIX = 'scoreboard_';

const HOLD_MS = 600;
const SWIPE_THRESHOLD = 40;
const TAP_MAX_MS = 500;
const TAP_SLOP = 20;
const INCREMENTS = [1, 2, 3, 5];

const UP_KEYS = ['Enter', ' ', 'ArrowUp', '+'];
const DOWN_KEYS = ['ArrowDown', '-', 'Backspace'];

const fullscreenElement = () => document.fullscreenElement || document.webkitFullscreenElement || null;

const vibe = (enabled, pattern) => {
  if (enabled && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch {}
  }
};

const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function Side({ name, score, setScore, increment, haptics, hint, onTouched, className }) {
  const from = useRef(null);
  const [bump, setBump] = useState({ n: 0, dir: null });

  const add = (delta) => {
    onTouched();
    const next = Math.max(0, score + delta);
    if (next === score) {
      vibe(haptics, 5);
      return;
    }
    setScore(next);
    setBump(({ n }) => ({ n: n + 1, dir: delta > 0 ? 'up' : 'down' }));
    vibe(haptics, delta > 0 ? 18 : 10);
  };

  const onPointerDown = (e) => {
    from.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch {}
  };

  const onPointerUp = (e) => {
    const s = from.current;
    if (!s) return;
    from.current = null;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dy) > SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
      add(dy < 0 ? increment : -increment);
    } else if (Date.now() - s.t < TAP_MAX_MS && Math.abs(dx) < TAP_SLOP && Math.abs(dy) < TAP_SLOP) {
      add(increment);
    }
  };

  const onKeyDown = (e) => {
    if (UP_KEYS.includes(e.key)) add(increment);
    else if (DOWN_KEYS.includes(e.key)) add(-increment);
    else return;
    e.preventDefault();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${name}: ${score}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => { from.current = null; }}
      onKeyDown={onKeyDown}
      onContextMenu={(e) => e.preventDefault()}
      className={`scoreboard-side relative flex flex-1 items-center justify-center overflow-hidden cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      <span key={bump.n} data-dir={bump.dir} className="scoreboard-score">{score}</span>
      <span className="label absolute bottom-3 left-4">{name}</span>
      {hint && <span className="label absolute bottom-3 right-4 opacity-70">Tap +1 · Swipe ↓ −1</span>}
    </div>
  );
}

export function App() {
  const [home, setHome] = useLocalStorage('scoreLeft', 0, { prefix: PREFIX });
  const [away, setAway] = useLocalStorage('scoreRight', 0, { prefix: PREFIX });
  const [duration, setDuration] = useLocalStorage('duration', 180, { prefix: PREFIX });
  const [mode, setMode] = useLocalStorage('mode', 'down', { prefix: PREFIX });
  const [increment, setIncrement] = useLocalStorage('increment', 1, { prefix: PREFIX });
  const [sound, setSound] = useLocalStorage('sound', true, { prefix: PREFIX });
  const [haptics, setHaptics] = useLocalStorage('haptics', true, { prefix: PREFIX });
  const [wake, setWake] = useLocalStorage('wake', true, { prefix: PREFIX });

  const [clock, setClock] = useState(STOPPED);
  const [now, setNow] = useState(() => Date.now());
  const [hint, setHint] = useState(true);
  const [holding, setHolding] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [draft, setDraft] = useState(null);

  const board = useRef(null);
  const holdTimer = useRef(null);
  const held = useRef(false);

  const running = isRunning(clock);
  const value = shown(clock, now, { mode, duration });
  const finished = mode === 'down' && value === 0;
  const paused = !running && !finished && clock.banked > 0;
  const status = finished ? 'Full time' : paused ? 'Paused' : mode === 'down' ? 'Match' : 'Stopwatch';
  const timerTone = finished ? 'danger' : mode === 'down' && value <= 10 ? 'warn' : undefined;

  useEffect(() => {
    const unlock = () => {
      ensureAudio();
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
    };
    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
    return () => {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
    };
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(fullscreenElement() !== null);
    document.addEventListener('fullscreenchange', onChange);
    document.addEventListener('webkitfullscreenchange', onChange);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      document.removeEventListener('webkitfullscreenchange', onChange);
    };
  }, []);

  // The browser drops the lock whenever the page is hidden, so it is taken again on each return.
  useEffect(() => {
    if (!wake || !('wakeLock' in navigator)) return;
    let lock = null;
    let live = true;
    const acquire = async () => {
      if (document.visibilityState !== 'visible') return;
      try {
        const l = await navigator.wakeLock.request('screen');
        if (live) lock = l; else l.release();
      } catch {}
    };
    acquire();
    document.addEventListener('visibilitychange', acquire);
    return () => {
      live = false;
      document.removeEventListener('visibilitychange', acquire);
      lock?.release().catch(() => {});
    };
  }, [wake]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (!running) return;
    if (finished) {
      setClock({ banked: duration * 1000, since: null });
      buzzer(sound);
      vibe(haptics, [240, 100, 240, 100, 480]);
    } else if (mode === 'up' && value === STOPWATCH_CAP) {
      setClock({ banked: STOPWATCH_CAP * 1000, since: null });
    } else if (mode === 'down' && value <= 5) {
      vibe(haptics, 35);
    }
  }, [running, value]);

  const toggleTimer = () => {
    const t = Date.now();
    if (running) {
      setClock(stop(clock, t));
    } else if (!finished) {
      ensureAudio();
      setNow(t);
      setClock(start(clock, t));
    }
  };

  const resetTimer = () => setClock(STOPPED);

  const endHold = () => {
    clearTimeout(holdTimer.current);
    setHolding(false);
  };

  const onTimerPointerDown = () => {
    held.current = false;
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      held.current = true;
      setHolding(false);
      resetTimer();
      vibe(haptics, [30, 30, 30]);
    }, HOLD_MS);
  };

  const onTimerClick = () => {
    if (held.current) {
      held.current = false;
      return;
    }
    toggleTimer();
  };

  const toggleFullscreen = async () => {
    try {
      if (fullscreenElement()) await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      else await (board.current.requestFullscreen || board.current.webkitRequestFullscreen).call(board.current);
    } catch {}
  };

  const openSettings = () => setDraft({ mins: Math.floor(duration / 60), secs: String(duration % 60).padStart(2, '0') });

  const closeSettings = () => {
    const total = Math.max(1, clamp(parseInt(draft.mins) || 0, 0, 99) * 60 + clamp(parseInt(draft.secs) || 0, 0, 59));
    if (total !== duration) {
      setDuration(total);
      if (!running) resetTimer();
    }
    setDraft(null);
  };

  const changeMode = (next) => {
    if (next === mode) return;
    setMode(next);
    resetTimer();
  };

  const toggleSound = () => {
    setSound(!sound);
    if (!sound) {
      ensureAudio();
      tone(880, 0, 0.12, 'square', 0.22);
    }
  };

  const toggleHaptics = () => {
    setHaptics(!haptics);
    vibe(!haptics, 20);
  };

  const resetScores = () => {
    setHome(0);
    setAway(0);
    vibe(haptics, 40);
  };

  const resetEverything = () => {
    resetScores();
    resetTimer();
  };

  const touched = () => setHint(false);
  const side = { increment, haptics, hint, onTouched: touched };

  return (
    <main ref={board} className="scoreboard flex flex-1 flex-col gap-2 bg-bg">
      <div className="scoreboard-bar grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <span className="pixel-chip justify-self-start">{status}</span>
        <button
          type="button"
          aria-label={running ? 'Pause timer' : finished ? 'Full time, hold to reset' : 'Start timer'}
          title="Tap to start or pause · hold to reset"
          data-variant={timerTone}
          onPointerDown={onTimerPointerDown}
          onPointerUp={endHold}
          onPointerCancel={endHold}
          onPointerLeave={endHold}
          onClick={onTimerClick}
          className="pixel-button relative inline-flex items-center gap-2 px-3"
        >
          <Icon svg={running ? pauseSvg : playSvg} className="h-5 w-5" />
          <span className="scoreboard-time">{fmtTime(value)}</span>
          {holding && <span aria-hidden="true" className="scoreboard-hold" style={{ animationDuration: `${HOLD_MS}ms` }} />}
        </button>
        <span className="flex gap-1 justify-self-end">
          <button type="button" aria-label="Settings" onClick={openSettings} className="pixel-icon-button">
            <Icon svg={slidersSvg} />
          </button>
          <button
            type="button"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            onClick={toggleFullscreen}
            className="pixel-icon-button"
          >
            <Icon svg={isFullscreen ? collapseSvg : expandSvg} />
          </button>
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2 landscape:flex-row">
        <Side name="Home" score={home} setScore={setHome} className="bg-accent text-bg" {...side} />
        <Side name="Away" score={away} setScore={setAway} className="bg-heading text-bg" {...side} />
      </div>

      {draft && (
        <Sheet title="Settings" onClose={closeSettings}>
          <div className="flex min-h-0 flex-col gap-4 overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="label">Timer</span>
              <span className="flex gap-1">
                <button type="button" aria-pressed={mode === 'down'} onClick={() => changeMode('down')} className="pixel-chip">Match timer</button>
                <button type="button" aria-pressed={mode === 'up'} onClick={() => changeMode('up')} className="pixel-chip">Stopwatch</button>
              </span>
            </div>

            {mode === 'down' && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="label">Match length</span>
                <span className="flex items-center gap-1">
                  <input
                    type="number" min="0" max="99" inputMode="numeric" aria-label="Minutes"
                    value={draft.mins}
                    onChange={(e) => setDraft({ ...draft, mins: e.target.value })}
                    className="pixel-field pixel-num w-16 text-center"
                  />
                  <span className="pixel-num">:</span>
                  <input
                    type="number" min="0" max="59" inputMode="numeric" aria-label="Seconds"
                    value={draft.secs}
                    onChange={(e) => setDraft({ ...draft, secs: e.target.value })}
                    className="pixel-field pixel-num w-16 text-center"
                  />
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="label">Points per tap</span>
              <span className="flex gap-1">
                {INCREMENTS.map((n) => (
                  <button key={n} type="button" aria-pressed={increment === n} onClick={() => setIncrement(n)} className="pixel-chip w-8">{n}</button>
                ))}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {mode === 'down' && (
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={sound} onChange={toggleSound} className="pixel-check" />
                  Buzzer at full time
                </label>
              )}
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={haptics} onChange={toggleHaptics} className="pixel-check" />
                Haptic feedback
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={wake} onChange={() => setWake(!wake)} className="pixel-check" />
                Keep screen awake
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={isFullscreen} onChange={toggleFullscreen} className="pixel-check" />
                Fullscreen
              </label>
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={resetTimer} className="pixel-button">Reset timer</button>
              <button type="button" onClick={resetScores} className="pixel-button">Reset scores</button>
              <button type="button" onClick={resetEverything} className="pixel-button" data-variant="danger">Reset everything</button>
              <button type="button" onClick={closeSettings} className="pixel-button ml-auto" data-variant="primary">Done</button>
            </div>
          </div>
        </Sheet>
      )}
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
