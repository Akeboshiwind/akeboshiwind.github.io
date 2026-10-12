import { useState } from 'react';
import { Icon, loopSvg, pencilSvg, moreSvg } from '../icons.js';

// Rendered inside Today (the workout view). Shows a left rail to indicate
// the loop, a "Circuit" label, the name, an edit button for circuit-level
// fields, the round progress, each child as a row with its own checkbox /
// timer / actions menu, and a Complete-round button.
export function CircuitBlock({
  item, pool, completed, childProgress,
  onToggleChild, onStartTimer, onCompleteRound,
  onOpenActions, onEditCircuit,
  disabled,
}) {
  const [showDescriptions, setShowDescriptions] = useState(false);

  const roundsDone = (completed || []).filter(Boolean).length;
  const currentRound = Math.min(item.rounds, roundsDone + 1);
  const allDone = roundsDone >= item.rounds;
  const childDone = childProgress || Array(item.children.length).fill(false);

  return (
    <div className="pixel-panel border-l-accent border-l-8 p-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="label text-accent inline-flex items-center gap-1">
            <Icon svg={loopSvg} className="w-4 h-4" />
            Circuit
          </p>
          <h3 className="font-pixel text-pixel-md text-heading truncate">{item.name}</h3>
          <p className="text-sm opacity-70 mt-0.5">
            {item.rounds} rounds{item.betweenChildSec > 0 ? ` · ${item.betweenChildSec}s rest` : ''}{item.betweenRoundSec > 0 ? ` · ${item.betweenRoundSec}s between rounds` : ''}
          </p>
        </div>
        {onEditCircuit && (
          <button
            type="button"
            onClick={onEditCircuit}
            aria-label="Edit circuit"
            className="pixel-icon-button -m-1"
          >
            <Icon svg={pencilSvg} />
          </button>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="label">
          {allDone ? `Done · ${item.rounds}/${item.rounds}` : `Round ${currentRound} of ${item.rounds}`}
        </span>
        <div className="flex flex-wrap justify-end gap-1 ml-auto" aria-hidden="true">
          {Array.from({ length: item.rounds }, (_, i) => (
            <span key={i} className={`inline-block w-2.5 h-2.5 ${completed?.[i] ? 'bg-ok' : 'bg-border'}`} />
          ))}
        </div>
      </div>

      {item.children.some(c => pool[c.exerciseId]?.description) && (
        <button
          type="button"
          onClick={() => setShowDescriptions(s => !s)}
          aria-expanded={showDescriptions}
          className="label mt-2 opacity-70 hover:opacity-100 hover:text-accent"
        >
          {showDescriptions ? 'Hide details' : 'Show details'}
        </button>
      )}

      <ul className="mt-3 space-y-2">
        {item.children.map((child, i) => {
          const ex = pool[child.exerciseId];
          const done = !!childDone[i];
          const last = i === item.children.length - 1;
          return (
            <li key={child.id}>
              <div className={`flex items-center gap-2 border-2 p-2 ${done ? 'border-ok' : 'border-border'}`}>
                <input
                  type="checkbox"
                  className="pixel-check disabled:cursor-not-allowed disabled:opacity-50"
                  data-variant="ok"
                  checked={done}
                  disabled={disabled}
                  onChange={() => onToggleChild(i)}
                  aria-label={done ? `Mark ${ex?.name ?? 'exercise'} not done` : `Mark ${ex?.name ?? 'exercise'} done`}
                />
                <div className={`flex-1 min-w-0 ${done ? 'opacity-60' : ''}`}>
                  <p className={`text-sm text-heading truncate ${done ? 'line-through' : ''}`}>{ex?.name ?? child.exerciseId}</p>
                  <p className="text-xs opacity-70">{child.durationSec}s</p>
                  {showDescriptions && ex?.description && (
                    <p className="text-xs opacity-80 mt-1 leading-relaxed">{ex.description}</p>
                  )}
                </div>
                {onStartTimer && (
                  <button
                    type="button"
                    onClick={() => onStartTimer([{ label: ex?.name ?? 'Work', sec: child.durationSec }])}
                    disabled={disabled}
                    className="pixel-button flex-shrink-0"
                  >
                    Start {child.durationSec}s
                  </button>
                )}
                {onOpenActions && (
                  <button
                    type="button"
                    onClick={() => onOpenActions(child.id)}
                    aria-label="Edit exercise"
                    className="pixel-icon-button"
                  >
                    <Icon svg={moreSvg} className="w-4 h-4" />
                  </button>
                )}
              </div>

              {!last && item.betweenChildSec > 0 && onStartTimer && !disabled && (
                <div className="flex items-center gap-2 pl-3 mt-1">
                  <span className="label opacity-70">Rest {item.betweenChildSec}s</span>
                  <button
                    type="button"
                    onClick={() => onStartTimer([{ label: 'Rest', sec: item.betweenChildSec }])}
                    className="pixel-button"
                  >
                    Start rest
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {!disabled && onCompleteRound && (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={onCompleteRound}
            disabled={allDone}
            data-variant="primary"
            className="pixel-button flex-1 py-2"
          >
            {allDone ? 'Circuit complete' : `Complete round ${currentRound}`}
          </button>
          {!allDone && item.betweenRoundSec > 0 && roundsDone > 0 && onStartTimer && (
            <button
              type="button"
              onClick={() => onStartTimer([{ label: 'Round rest', sec: item.betweenRoundSec }])}
              className="pixel-button py-2"
            >
              Rest {item.betweenRoundSec}s
            </button>
          )}
        </div>
      )}
    </div>
  );
}
