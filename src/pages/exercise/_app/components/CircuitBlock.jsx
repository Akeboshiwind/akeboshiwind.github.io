import { useState } from 'react';
import { SetCheckboxes } from './SetCheckboxes.jsx';

export function CircuitBlock({ item, pool, completed, onToggle, onStartTimer, disabled }) {
  const [showDetails, setShowDetails] = useState(false);

  const labels = Array.from({ length: item.rounds }, (_, i) => `Round ${i + 1}`);

  return (
    <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.name}</h3>
        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
          {item.rounds} rounds
        </span>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cadence(item)}</p>

      <button
        type="button"
        onClick={() => setShowDetails(s => !s)}
        className="mt-2 text-xs text-gray-500 dark:text-gray-400 underline-offset-2 hover:underline"
      >
        {showDetails ? 'Hide exercises' : `Show ${item.children.length} exercises`}
      </button>

      {showDetails && (
        <ul className="mt-2 space-y-2">
          {item.children.map(child => {
            const ex = pool[child.exerciseId];
            return (
              <li key={child.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {ex?.name ?? child.exerciseId}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{child.durationSec}s</p>
                {ex?.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {ex.description}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SetCheckboxes
          count={item.rounds}
          completed={completed}
          onToggle={onToggle}
          disabled={disabled}
          labels={labels}
        />
        {onStartTimer && (
          <button
            type="button"
            onClick={onStartTimer}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M8 4v4l2.5 2.5M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z"/></svg>
            Start timer
          </button>
        )}
      </div>
    </div>
  );
}

function cadence(item) {
  const parts = [];
  if (item.children.every(c => c.durationSec === item.children[0]?.durationSec)) {
    const d = item.children[0]?.durationSec;
    if (d) parts.push(`${d}s work`);
  } else {
    parts.push(item.children.map(c => `${c.durationSec}s`).join(' / '));
  }
  if (item.betweenChildSec > 0) parts.push(`${item.betweenChildSec}s between`);
  if (item.betweenRoundSec > 0) parts.push(`${item.betweenRoundSec}s between rounds`);
  return parts.join(' · ');
}
