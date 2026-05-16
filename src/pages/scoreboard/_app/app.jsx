import { createRoot } from 'react-dom/client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { ensureAudio, buzzer, tone } from './audio.js';
import './app.css';

const PREFIX = 'scoreboard_';

const HOLD_MS = 600;
const SWIPE_THRESHOLD = 40;
const TAP_MAX_DURATION = 500;

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <path d="M8 5v14l11-7L8 5z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const vibe = (enabled, pattern) => {
  if (enabled && typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern); } catch { /* ignore */ }
  }
};

const fmtTime = (s) => {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
};

function Side({ side, label, score, increment, onScore, hintGone, onFirstInteraction }) {
  const sideRef = useRef(null);
  const startRef = useRef(null);
  const [bumpClass, setBumpClass] = useState('');
  const prevScoreRef = useRef(score);
  const animTimerRef = useRef(null);

  useEffect(() => {
    if (score === prevScoreRef.current) return;
    const up = score > prevScoreRef.current;
    prevScoreRef.current = score;
    setBumpClass('');
    const raf = requestAnimationFrame(() => setBumpClass(up ? 'bump' : 'dip'));
    clearTimeout(animTimerRef.current);
    animTimerRef.current = setTimeout(() => setBumpClass(''), 240);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(animTimerRef.current);
    };
  }, [score]);

  const handlePointerDown = (e) => {
    if (e.target.closest('.timer-pill') || e.target.closest('.modal-backdrop')) return;
    startRef.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ }
  };

  const handlePointerUp = (e) => {
    const s = startRef.current;
    if (!s) return;
    startRef.current = null;

    const dy = e.clientY - s.y;
    const dx = e.clientX - s.x;
    const dt = Date.now() - s.t;

    // Ripple feedback — created via DOM since it's a fire-and-forget animation
    const host = e.currentTarget;
    const r = document.createElement('div');
    r.className = 'ripple';
    const rect = host.getBoundingClientRect();
    r.style.left = (e.clientX - rect.left) + 'px';
    r.style.top = (e.clientY - rect.top) + 'px';
    host.appendChild(r);
    setTimeout(() => r.remove(), 600);

    onFirstInteraction();

    if (Math.abs(dy) > SWIPE_THRESHOLD && Math.abs(dy) > Math.abs(dx)) {
      onScore(dy < 0 ? increment : -increment);
    } else if (dt < TAP_MAX_DURATION && Math.abs(dx) < 20 && Math.abs(dy) < 20) {
      onScore(increment);
    }
  };

  const handlePointerCancel = () => { startRef.current = null; };

  return (
    <div
      ref={sideRef}
      className={`side ${side}`}
      data-side={side}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
    >
      <div className={`score ${bumpClass}`}>{score}</div>
      <div className="label">{label}</div>
      <div className={`hint ${hintGone ? 'gone' : ''}`}>Tap +1 · Swipe ↓ −1</div>
    </div>
  );
}

export function App() {
  const [scoreLeft, setScoreLeft] = useLocalStorage('scoreLeft', 0, { prefix: PREFIX });
  const [scoreRight, setScoreRight] = useLocalStorage('scoreRight', 0, { prefix: PREFIX });
  const [timerDuration, setTimerDuration] = useLocalStorage('duration', 180, { prefix: PREFIX });
  const [mode, setMode] = useLocalStorage('mode', 'down', { prefix: PREFIX });
  const [increment, setIncrement] = useLocalStorage('increment', 1, { prefix: PREFIX });
  const [sound, setSound] = useLocalStorage('sound', true, { prefix: PREFIX });
  const [haptics, setHaptics] = useLocalStorage('haptics', true, { prefix: PREFIX });
  const [wakeLockOn, setWakeLockOn] = useLocalStorage('wake', true, { prefix: PREFIX });

  const startValue = mode === 'down' ? timerDuration : 0;
  const [timerValue, setTimerValue] = useState(startValue);
  const [timerRunning, setTimerRunning] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [hintGone, setHintGone] = useState(false);
  const [holding, setHolding] = useState(false);

  // Draft inputs while the settings modal is open
  const [draftMins, setDraftMins] = useState(Math.floor(timerDuration / 60));
  const [draftSecs, setDraftSecs] = useState(timerDuration % 60);

  // Read-latest refs for values read inside the timer interval (avoids
  // re-creating the interval whenever a setting toggles)
  const settingsRef = useRef({ sound, haptics, wakeLockOn, mode, timerDuration });
  settingsRef.current = { sound, haptics, wakeLockOn, mode, timerDuration };

  const wakeLockRef = useRef(null);
  const holdTimeoutRef = useRef(null);
  const didHoldRef = useRef(false);

  const finished = mode === 'down' ? timerValue <= 0 : timerValue >= timerDuration;
  const idle = !timerRunning && timerValue === startValue;
  const paused = !timerRunning && !idle && !finished;
  const left = mode === 'down' ? timerValue : timerDuration - timerValue;
  const warning = !finished && left > 0 && left <= 10;

  // ---- Audio unlock on first user gesture anywhere ----
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

  // ---- Wake lock ----
  const requestWakeLock = useCallback(async () => {
    if (!settingsRef.current.wakeLockOn || typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      wakeLockRef.current.addEventListener('release', () => { wakeLockRef.current = null; });
    } catch { /* user gesture required or unsupported */ }
  }, []);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLockRef.current) {
      try { await wakeLockRef.current.release(); } catch { /* ignore */ }
      wakeLockRef.current = null;
    }
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && settingsRef.current.wakeLockOn) {
        requestWakeLock();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [requestWakeLock]);

  // ---- Timer tick ----
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setTimerValue(v => {
        const s = settingsRef.current;
        const next = s.mode === 'down' ? v - 1 : v + 1;
        const isFinished = s.mode === 'down' ? next <= 0 : next >= s.timerDuration;
        if (isFinished) {
          const snap = s.mode === 'down' ? 0 : s.timerDuration;
          // Defer the running-state flip so we don't update state mid-render
          setTimeout(() => setTimerRunning(false), 0);
          if (s.mode === 'down') {
            buzzer(s.sound);
            vibe(s.haptics, [240, 100, 240, 100, 480]);
          } else {
            vibe(s.haptics, [180, 80, 180, 80, 320]);
          }
          return snap;
        }
        const leftSec = s.mode === 'down' ? next : s.timerDuration - next;
        if (leftSec > 0 && leftSec <= 5) vibe(s.haptics, 35);
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  // Acquire wake lock when the timer starts running
  useEffect(() => {
    if (timerRunning) requestWakeLock();
  }, [timerRunning, requestWakeLock]);

  // ---- Score updates ----
  const updateScore = (side, delta) => {
    const cur = side === 'left' ? scoreLeft : scoreRight;
    const next = Math.max(0, cur + delta);
    if (next === cur) {
      vibe(haptics, 5);
      return;
    }
    if (side === 'left') setScoreLeft(next); else setScoreRight(next);
    vibe(haptics, delta > 0 ? 18 : 10);
  };

  // ---- Timer interactions ----
  const startTimer = () => {
    if (timerRunning || finished) return;
    ensureAudio();
    setTimerRunning(true);
  };
  const stopTimer = () => setTimerRunning(false);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerValue(mode === 'down' ? timerDuration : 0);
    vibe(haptics, [30, 30, 30]);
  };

  const onTimerPointerDown = (e) => {
    if (e.target.closest('.settings-btn')) return;
    didHoldRef.current = false;
    setHolding(true);
    holdTimeoutRef.current = setTimeout(() => {
      didHoldRef.current = true;
      resetTimer();
      setHolding(false);
    }, HOLD_MS);
  };
  const endHold = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setHolding(false);
  };
  const onTimerPointerUp = (e) => {
    if (e.target.closest('.settings-btn')) { endHold(); return; }
    endHold();
    if (didHoldRef.current) return;
    if (timerRunning) stopTimer(); else startTimer();
  };

  // ---- Settings modal ----
  const openSettings = (e) => {
    e?.stopPropagation();
    setDraftMins(Math.floor(timerDuration / 60));
    setDraftSecs(timerDuration % 60);
    setModalOpen(true);
  };
  const applyAndClose = () => {
    const m = Math.max(0, Math.min(99, parseInt(draftMins) || 0));
    const s = Math.max(0, Math.min(59, parseInt(draftSecs) || 0));
    const total = Math.max(1, m * 60 + s);
    const durationChanged = total !== timerDuration;
    setTimerDuration(total);
    if (!timerRunning && (durationChanged || idle || finished)) {
      setTimerValue(mode === 'down' ? total : 0);
    }
    setModalOpen(false);
  };

  const changeMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setTimerRunning(false);
    setTimerValue(newMode === 'down' ? timerDuration : 0);
  };

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    if (next) {
      ensureAudio();
      tone(880, 0, 0.12, 'square', 0.22); // test pip so user knows it works
    }
  };
  const toggleHaptics = () => {
    const next = !haptics;
    setHaptics(next);
    if (next) vibe(true, 20);
  };
  const toggleWake = () => {
    const next = !wakeLockOn;
    setWakeLockOn(next);
    if (next) requestWakeLock(); else releaseWakeLock();
  };

  const resetScores = () => {
    setScoreLeft(0);
    setScoreRight(0);
    vibe(haptics, 40);
  };
  const resetEverything = () => {
    setScoreLeft(0);
    setScoreRight(0);
    setTimerRunning(false);
    setTimerValue(mode === 'down' ? timerDuration : 0);
    vibe(haptics, [40, 60, 40]);
  };

  // Prevent context menu / iOS gesture zoom
  useEffect(() => {
    const onContext = (e) => e.preventDefault();
    const onGesture = (e) => e.preventDefault();
    document.addEventListener('contextmenu', onContext);
    document.addEventListener('gesturestart', onGesture);
    return () => {
      document.removeEventListener('contextmenu', onContext);
      document.removeEventListener('gesturestart', onGesture);
    };
  }, []);

  return (
    <>
      <div className="scoreboard">
        <Side
          side="left"
          label="Home"
          score={scoreLeft}
          increment={increment}
          onScore={(d) => updateScore('left', d)}
          hintGone={hintGone}
          onFirstInteraction={() => !hintGone && setHintGone(true)}
        />
        <Side
          side="right"
          label="Away"
          score={scoreRight}
          increment={increment}
          onScore={(d) => updateScore('right', d)}
          hintGone={hintGone}
          onFirstInteraction={() => !hintGone && setHintGone(true)}
        />

        <div
          className={[
            'timer-pill',
            paused ? 'paused' : '',
            warning ? 'warning' : '',
            holding ? 'holding' : '',
          ].filter(Boolean).join(' ')}
          onPointerDown={onTimerPointerDown}
          onPointerUp={onTimerPointerUp}
          onPointerCancel={endHold}
          onPointerLeave={endHold}
        >
          <div className="hold-ring" />
          <div className="timer-icon" aria-label="play/pause indicator">
            {timerRunning ? <PauseIcon /> : <PlayIcon />}
          </div>
          <div className="timer-text">{fmtTime(timerValue)}</div>
          <div
            className="timer-icon btn settings-btn"
            aria-label="Settings"
            role="button"
            onClick={openSettings}
          >
            <SettingsIcon />
          </div>
        </div>

        <div
          className={[
            'timer-badge',
            finished ? 'show done' : paused ? 'show' : '',
          ].filter(Boolean).join(' ')}
        >
          {finished ? 'TIME' : 'PAUSED'}
        </div>

        <div className="rotate-warning">
          <div className="phone-icon" />
          <h1>Rotate to landscape</h1>
          <p>This scoreboard is designed for landscape orientation.</p>
        </div>
      </div>

      <div
        className={`modal-backdrop${modalOpen ? ' show' : ''}`}
        onClick={(e) => { if (e.target === e.currentTarget) applyAndClose(); }}
      >
        <div className="modal" role="dialog" aria-label="Scoreboard settings">
          <h2>Scoreboard</h2>
          <div className="sub">Settings</div>

          <div className="row">
            <label>Match length</label>
            <div className="time-input">
              <input
                type="number"
                min="0"
                max="99"
                value={draftMins}
                inputMode="numeric"
                onChange={(e) => setDraftMins(e.target.value)}
              />
              <span>:</span>
              <input
                type="number"
                min="0"
                max="59"
                value={draftSecs}
                inputMode="numeric"
                onChange={(e) => setDraftSecs(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <label>Timer mode</label>
            <div className="mode-pick">
              <button
                className={mode === 'down' ? 'on' : ''}
                onClick={() => changeMode('down')}
              >Count down</button>
              <button
                className={mode === 'up' ? 'on' : ''}
                onClick={() => changeMode('up')}
              >Count up</button>
            </div>
          </div>

          <div className="row">
            <label>Point increment</label>
            <div className="inc-pick">
              {[1, 2, 3, 5].map(n => (
                <button
                  key={n}
                  className={increment === n ? 'on' : ''}
                  onClick={() => setIncrement(n)}
                >{n}</button>
              ))}
            </div>
          </div>

          <div className="row">
            <label>Buzzer at full time</label>
            <div
              className={`toggle${sound ? ' on' : ''}`}
              role="switch"
              aria-checked={sound}
              onClick={toggleSound}
            />
          </div>

          <div className="row">
            <label>Haptic feedback</label>
            <div
              className={`toggle${haptics ? ' on' : ''}`}
              role="switch"
              aria-checked={haptics}
              onClick={toggleHaptics}
            />
          </div>

          <div className="row">
            <label>Keep screen awake</label>
            <div
              className={`toggle${wakeLockOn ? ' on' : ''}`}
              role="switch"
              aria-checked={wakeLockOn}
              onClick={toggleWake}
            />
          </div>

          <div className="actions">
            <button className="sb-btn sb-btn-primary" onClick={applyAndClose}>Done</button>
            <button className="sb-btn sb-btn-ghost" onClick={resetScores}>Reset scores</button>
            <button className="sb-btn sb-btn-danger" onClick={resetEverything}>Reset everything</button>
            <a className="sb-btn sb-btn-ghost" href="../">← Home</a>
          </div>
        </div>
      </div>
    </>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
