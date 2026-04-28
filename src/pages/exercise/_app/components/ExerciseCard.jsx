import { useState } from 'react';
import { SetCheckboxes } from './SetCheckboxes.jsx';

export function ExerciseCard({ item, exercise, completed, onToggle, onStartTimer, onOpenActions, disabled }) {
  const [showDetails, setShowDetails] = useState(false);
  const name = exercise?.name ?? item.exerciseId;
  const description = exercise?.description ?? '';
  const tip = exercise?.tip ?? '';

  const timerButton = renderTimerButton(item, onStartTimer);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">{name}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{summary(item)}</p>
        </div>
        {onOpenActions && (
          <button
            type="button"
            onClick={onOpenActions}
            aria-label="Edit exercise"
            className="flex-shrink-0 p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg viewBox="0 0 16 16" className="w-5 h-5"><circle cx="3.5" cy="8" r="1.4" fill="currentColor"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/><circle cx="12.5" cy="8" r="1.4" fill="currentColor"/></svg>
          </button>
        )}
      </div>

      {(description || tip) && (
        <button
          type="button"
          onClick={() => setShowDetails(s => !s)}
          className="mt-2 text-xs text-gray-500 dark:text-gray-400 underline-offset-2 hover:underline"
        >
          {showDetails ? 'Hide' : 'How to do this'}
        </button>
      )}

      {showDetails && (
        <div className="mt-2 space-y-2">
          {description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
          )}
          {tip && (
            <p className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed">
              <span aria-hidden="true">💡 </span>{tip}
            </p>
          )}
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SetCheckboxes
          count={unitCount(item)}
          completed={completed}
          onToggle={onToggle}
          disabled={disabled}
        />
        {timerButton && (
          <button
            type="button"
            onClick={timerButton.onClick}
            disabled={disabled}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 16 16" className="w-4 h-4"><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M8 4v4l2.5 2.5M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z"/></svg>
            {timerButton.label}
          </button>
        )}
      </div>
    </div>
  );
}

function renderTimerButton(item, onStartTimer) {
  if (!onStartTimer) return null;
  switch (item.kind) {
    case 'reps-exercise':
      return {
        label: `Rest ${item.restSec}s`,
        onClick: () => onStartTimer([{ label: 'Rest', sec: item.restSec }]),
      };
    case 'timed-exercise':
      return {
        label: `Start ${item.durationSec}s`,
        onClick: () => onStartTimer([{ label: 'Work', sec: item.durationSec }]),
      };
    case 'continuous-exercise':
      return {
        label: `Start ${formatDuration(item.durationSec)}`,
        onClick: () => onStartTimer([{ label: 'Work', sec: item.durationSec }]),
      };
    default:
      return null;
  }
}

function unitCount(item) {
  switch (item.kind) {
    case 'reps-exercise':
    case 'timed-exercise':
      return item.sets;
    case 'continuous-exercise':
      return 1;
    default:
      return 0;
  }
}

function summary(item) {
  switch (item.kind) {
    case 'reps-exercise': {
      const parts = [`${item.sets} × ${item.reps}`];
      if (item.weightNote) parts.push(item.weightNote);
      parts.push(`${item.restSec}s rest`);
      return parts.join(' · ');
    }
    case 'timed-exercise': {
      const parts = [`${item.sets} × ${item.durationSec}s`];
      if (item.weightNote) parts.push(item.weightNote);
      parts.push(`${item.restSec}s rest`);
      return parts.join(' · ');
    }
    case 'continuous-exercise':
      return formatDuration(item.durationSec);
    default:
      return '';
  }
}

function formatDuration(sec) {
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  const rem = sec % 60;
  return rem === 0 ? `${min} min` : `${min}m ${rem}s`;
}
