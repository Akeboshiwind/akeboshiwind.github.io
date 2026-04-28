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
      className={[
        'fixed inset-x-0 bottom-0 z-30 border-t shadow-lg',
        done
          ? 'bg-emerald-500 border-emerald-600 text-white'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100',
      ].join(' ')}
    >
      {/* Progress bar */}
      <div className={`h-1 ${done ? 'bg-emerald-300' : 'bg-gray-100 dark:bg-gray-700'}`}>
        <div
          className={`h-full transition-[width] duration-1000 ease-linear ${done ? 'bg-white' : 'bg-emerald-500'}`}
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      <div className="px-4 py-3 flex items-center gap-3 max-w-xl mx-auto">
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider opacity-75">
            {phaseLabel}
            {!done && phases.length > 1 && (
              <span className="ml-2">{phaseIdx + 1} / {phases.length}</span>
            )}
          </p>
          <p className="text-2xl font-mono tabular-nums">{formatRemaining(remaining)}</p>
        </div>
        {!done && (
          <button
            type="button"
            onClick={() => setPaused(p => !p)}
            className="px-3 py-2 rounded-md text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={paused ? 'Resume' : 'Pause'}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button
          type="button"
          onClick={onDismiss}
          className={[
            'px-3 py-2 rounded-md text-sm font-medium border',
            done
              ? 'border-white/40 hover:bg-white/10'
              : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700',
          ].join(' ')}
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
