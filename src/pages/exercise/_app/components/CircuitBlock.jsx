import { useState } from 'react';

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
    <div className="relative flex gap-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 pl-4">
      {/* Left rail with looping arrow */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-emerald-500/70" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1">
              <LoopIcon />
              Circuit
            </p>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{item.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {item.rounds} rounds{item.betweenChildSec > 0 ? ` · ${item.betweenChildSec}s rest` : ''}{item.betweenRoundSec > 0 ? ` · ${item.betweenRoundSec}s between rounds` : ''}
            </p>
          </div>
          {onEditCircuit && (
            <button
              type="button"
              onClick={onEditCircuit}
              aria-label="Edit circuit"
              className="flex-shrink-0 p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <PencilIcon />
            </button>
          )}
        </div>

        {/* Round progress */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {allDone ? `Done · ${item.rounds}/${item.rounds}` : `Round ${currentRound} of ${item.rounds}`}
          </span>
          <div className="flex gap-1.5 ml-auto" aria-hidden="true">
            {Array.from({ length: item.rounds }, (_, i) => (
              <span
                key={i}
                className={[
                  'inline-block w-2.5 h-2.5 rounded-full',
                  completed?.[i] ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700',
                ].join(' ')}
              />
            ))}
          </div>
        </div>

        {/* Description toggle */}
        {item.children.some(c => pool[c.exerciseId]?.description) && (
          <button
            type="button"
            onClick={() => setShowDescriptions(s => !s)}
            className="mt-2 text-xs text-gray-500 dark:text-gray-400 underline-offset-2 hover:underline"
          >
            {showDescriptions ? 'Hide details' : 'Show details'}
          </button>
        )}

        {/* Children */}
        <ul className="mt-3 space-y-2">
          {item.children.map((child, i) => {
            const ex = pool[child.exerciseId];
            const done = !!childDone[i];
            const last = i === item.children.length - 1;
            return (
              <li key={child.id}>
                <div className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-2">
                  <button
                    type="button"
                    onClick={() => onToggleChild(i)}
                    disabled={disabled}
                    aria-pressed={done}
                    aria-label={done ? `Mark ${ex?.name ?? 'exercise'} not done` : `Mark ${ex?.name ?? 'exercise'} done`}
                    className={[
                      'flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded border',
                      done
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800',
                      disabled ? 'opacity-50' : '',
                    ].join(' ')}
                  >
                    {done && <CheckIcon />}
                  </button>
                  <div className={`flex-1 min-w-0 ${done ? 'opacity-60' : ''}`}>
                    <p className={`text-sm font-medium truncate ${done ? 'line-through' : ''}`}>{ex?.name ?? child.exerciseId}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{child.durationSec}s</p>
                    {showDescriptions && ex?.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{ex.description}</p>
                    )}
                  </div>
                  {onStartTimer && (
                    <button
                      type="button"
                      onClick={() => onStartTimer([{ label: ex?.name ?? 'Work', sec: child.durationSec }])}
                      disabled={disabled}
                      className="flex-shrink-0 px-2.5 py-1.5 rounded-md text-xs font-medium border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50"
                    >
                      Start {child.durationSec}s
                    </button>
                  )}
                  {onOpenActions && (
                    <button
                      type="button"
                      onClick={() => onOpenActions(child.id)}
                      aria-label="Edit exercise"
                      className="flex-shrink-0 p-1.5 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <DotsIcon />
                    </button>
                  )}
                </div>

                {/* Rest between children */}
                {!last && item.betweenChildSec > 0 && onStartTimer && !disabled && (
                  <div className="flex items-center gap-2 pl-3 mt-1">
                    <span className="text-xs text-gray-400 dark:text-gray-500">Rest {item.betweenChildSec}s</span>
                    <button
                      type="button"
                      onClick={() => onStartTimer([{ label: 'Rest', sec: item.betweenChildSec }])}
                      className="px-2 py-1 rounded text-[11px] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Start rest
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Footer: complete round + between-round rest */}
        {!disabled && onCompleteRound && (
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={onCompleteRound}
              disabled={allDone}
              className="flex-1 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold"
            >
              {allDone ? 'Circuit complete' : `Complete round ${currentRound}`}
            </button>
            {!allDone && item.betweenRoundSec > 0 && roundsDone > 0 && onStartTimer && (
              <button
                type="button"
                onClick={() => onStartTimer([{ label: 'Round rest', sec: item.betweenRoundSec }])}
                className="px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Rest {item.betweenRoundSec}s
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LoopIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3 h-3" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        d="M3 8a5 5 0 0 1 9-3M13 8a5 5 0 0 1-9 3M11 4l1.5 1L13 3.5M5 12l-1.5-1L3 12.5"/>
    </svg>
  );
}
function PencilIcon() {
  return <svg viewBox="0 0 16 16" className="w-4 h-4"><path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M11 2l3 3-8 8H3v-3z"/></svg>;
}
function DotsIcon() {
  return <svg viewBox="0 0 16 16" className="w-4 h-4"><circle cx="3.5" cy="8" r="1.4" fill="currentColor"/><circle cx="8" cy="8" r="1.4" fill="currentColor"/><circle cx="12.5" cy="8" r="1.4" fill="currentColor"/></svg>;
}
function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-4 h-4">
      <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 8.5l3.5 3.5L13 5"/>
    </svg>
  );
}
