import { useState } from 'react';
import { SetCheckboxes } from './SetCheckboxes.jsx';
import { Icon, clockSvg, moreSvg, tipSvg } from '../icons.js';

export function ExerciseCard({ item, exercise, completed, onToggle, onStartTimer, onOpenActions, disabled }) {
  const [showDetails, setShowDetails] = useState(false);
  const name = exercise?.name ?? item.exerciseId;
  const description = exercise?.description ?? '';
  const tip = exercise?.tip ?? '';

  const timerButton = renderTimerButton(item, onStartTimer);

  return (
    <div className="pixel-panel p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-pixel text-pixel-md text-heading">{name}</h3>
          <p className="text-sm opacity-70 mt-1">{summary(item)}</p>
        </div>
        {onOpenActions && (
          <button
            type="button"
            onClick={onOpenActions}
            aria-label="Edit exercise"
            className="flex-shrink-0 -m-1 p-1 hover:text-accent"
          >
            <Icon svg={moreSvg} />
          </button>
        )}
      </div>

      {(description || tip) && (
        <button
          type="button"
          onClick={() => setShowDetails(s => !s)}
          aria-expanded={showDetails}
          className="label mt-2 opacity-70 hover:opacity-100 hover:text-accent"
        >
          {showDetails ? 'Hide' : 'How to do this'}
        </button>
      )}

      {showDetails && (
        <div className="mt-2 space-y-2 text-sm leading-relaxed">
          {description && <p>{description}</p>}
          {tip && (
            <p className="flex gap-2">
              <Icon svg={tipSvg} className="w-4 h-4 mt-0.5 shrink-0 text-accent" />
              <span>{tip}</span>
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
            className="pixel-button inline-flex items-center gap-2 py-2"
          >
            <Icon svg={clockSvg} className="w-4 h-4" />
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
