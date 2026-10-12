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
      className={`fixed inset-x-0 bottom-0 z-20 border-t-2 bg-bg ${done ? 'border-ok' : 'border-border'}`}
    >
      <div className="h-1 bg-border">
        <div
          className={`h-full transition-[width] duration-1000 ease-linear ${done ? 'bg-ok' : 'bg-accent'}`}
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      <div className="px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center gap-3 max-w-[720px] mx-auto">
        <div className="flex-1 min-w-0">
          <p className={`label truncate ${done ? 'text-ok' : 'opacity-70'}`}>
            {phaseLabel}
            {!done && phases.length > 1 && (
              <span className="ml-2">{phaseIdx + 1} / {phases.length}</span>
            )}
          </p>
          <p className={`font-pixel text-pixel-lg tabular-nums ${done ? 'text-ok' : 'text-heading'}`}>{formatRemaining(remaining)}</p>
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
    </div>
  );
}

function formatRemaining(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
