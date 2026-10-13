import { useEffect, useState } from 'react';
import { phaseEndBeep, finalBeep } from '../audio.js';

// Sticky bottom timer bar.
// `phases` = array of { label, sec }. Plays beep at each phase end and a
// distinct final beep when the last phase ends. Auto-dismisses 2.5s later.
export function TimerBar({ phases, onDismiss }) {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [remaining, setRemaining] = useState(() => phases[0]?.sec ?? 0);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);

  // 1Hz tick
  useEffect(() => {
    if (paused || done) return;
    const id = setInterval(() => {
      setRemaining(r => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [paused, done]);

  // Phase advance / completion
  useEffect(() => {
    if (done || paused || remaining > 0) return;
    if (phaseIdx < phases.length - 1) {
      phaseEndBeep();
      setPhaseIdx(i => i + 1);
      setRemaining(phases[phaseIdx + 1].sec);
    } else {
      finalBeep();
      setDone(true);
    }
  }, [remaining, paused, done, phaseIdx, phases]);

  // Auto-dismiss
  useEffect(() => {
    if (!done) return;
    const id = setTimeout(onDismiss, 2500);
    return () => clearTimeout(id);
  }, [done, onDismiss]);

  const phase = phases[phaseIdx];
  const phaseLabel = done ? 'Done' : phase?.label;
  const totalSec = phase?.sec ?? 1;
  const progress = done ? 1 : 1 - remaining / totalSec;

  return (
    <div
      role="status"
      className="pixel-bar pt-4 flex items-center gap-3"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-border">
        <div
          className={`block h-full transition-[width] duration-1000 ease-linear ${done ? 'pixel-mark' : 'bg-accent'}`}
          data-variant={done ? 'ok' : undefined}
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className={`label truncate ${done ? '' : 'opacity-70'}`}>
          {done ? <span className="pixel-alert-text" data-variant="ok">{phaseLabel}</span> : phaseLabel}
          {!done && phases.length > 1 && (
            <span className="ml-2">{phaseIdx + 1} / {phases.length}</span>
          )}
        </p>
        <p className="font-pixel text-pixel-lg tabular-nums text-heading">{formatRemaining(remaining)}</p>
      </div>
      {!done && (
        <button
          type="button"
          onClick={() => setPaused(p => !p)}
          className="pixel-button py-2"
          aria-label={paused ? 'Resume' : 'Pause'}
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
      )}
      <button
        type="button"
        onClick={onDismiss}
        data-variant={done ? 'primary' : undefined}
        className="pixel-button py-2"
      >
        {done ? 'Close' : 'Cancel'}
      </button>
    </div>
  );
}

function formatRemaining(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
