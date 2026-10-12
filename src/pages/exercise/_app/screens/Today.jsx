import { useEffect, useState } from 'react';
import {
  DAY_NAMES,
  toggleSet, startWorkout, finishWorkout, cancelWorkout,
  totalUnits, completedUnits,
  toggleCircuitChild, completeCircuitRound,
  updateItem, removeItem, swapExercise,
} from '../store.js';
import { primeAudio } from '../audio.js';
import { SectionBanner } from '../components/SectionBanner.jsx';
import { ExerciseCard } from '../components/ExerciseCard.jsx';
import { CircuitBlock } from '../components/CircuitBlock.jsx';
import { DayJumper } from '../components/DayJumper.jsx';
import { TimerBar } from '../components/TimerBar.jsx';
import { ExerciseActionsSheet } from '../components/ExerciseActionsSheet.jsx';
import { CircuitEditSheet } from '../components/CircuitEditSheet.jsx';

export function Today({ state, setState, today }) {
  const [viewDay, setViewDay] = useState(today);
  const [activeTimerPhases, setActiveTimerPhases] = useState(null);
  const [actionsItemId, setActionsItemId] = useState(null);
  const [editingCircuitId, setEditingCircuitId] = useState(null);

  const day = state.template.days[viewDay];

  const inProgressDay = state.inProgress?.day ?? null;
  const isViewingActive = inProgressDay === viewDay;
  const interactive = !day.rest && isViewingActive;
  const completed = isViewingActive ? state.inProgress.completedSets : {};
  const circuitProgress = isViewingActive ? (state.inProgress.circuitProgress ?? {}) : {};

  const total = totalUnits(day);
  const done = completedUnits(day, completed);

  const startTimer = phases => { primeAudio(); setActiveTimerPhases(phases); };
  const dismissTimer = () => setActiveTimerPhases(null);

  const handleToggle = (itemId, index) =>
    setState(s => toggleSet(s, viewDay, itemId, index));

  const handleStart = () => {
    primeAudio();
    setState(s => startWorkout(s, viewDay));
  };

  const handleFinish = () => {
    if (done === 0 && !confirm('Finish workout with nothing checked off?')) return;
    setState(finishWorkout);
  };

  const handleCancel = () => {
    if (!confirm('Cancel this workout? It won’t be added to your history.')) return;
    setState(cancelWorkout);
  };

  const findItem = id => {
    for (const it of day.items) {
      if (it.id === id) return it;
      if (it.kind === 'circuit') {
        for (const c of it.children) if (c.id === id) return c;
      }
    }
    return null;
  };
  const actionsItem = actionsItemId ? findItem(actionsItemId) : null;
  const editingCircuit = editingCircuitId ? findItem(editingCircuitId) : null;

  return (
    <div className="pb-28">
      <DayJumper viewDay={viewDay} onChange={setViewDay} />

      <header className="mb-4 text-center">
        <p className="text-sm">
          {day.rest ? 'Rest day' : day.focus}
        </p>
        {!day.rest && total > 0 && (
          <p className="label opacity-70 mt-1">
            {done} / {total} done
            {viewDay !== today && ` · viewing ${DAY_NAMES[viewDay]}`}
          </p>
        )}
        {viewDay !== today && (
          <button
            type="button"
            onClick={() => setViewDay(today)}
            className="label mt-2 text-accent hover:underline"
          >
            ← Back to today ({DAY_NAMES[today]})
          </button>
        )}
      </header>

      {!isViewingActive && inProgressDay && !day.rest && (
        <ActiveBanner
          activeDay={inProgressDay}
          onResume={() => setViewDay(inProgressDay)}
          onDiscard={() => setState(cancelWorkout)}
        />
      )}

      {!day.rest && !inProgressDay && (
        <StartBanner viewDay={viewDay} today={today} onStart={handleStart} />
      )}

      {isViewingActive && (
        <SessionBanner startedAt={state.inProgress.startedAt} onCancel={handleCancel} />
      )}

      {day.rest ? (
        <RestDay />
      ) : (
        <>
          <ul className="space-y-3">
            {day.items.map(item => (
              <li key={item.id}>
                {item.kind === 'section' && <SectionBanner section={item} />}
                {(item.kind === 'reps-exercise' || item.kind === 'timed-exercise' || item.kind === 'continuous-exercise') && (
                  <ExerciseCard
                    item={item}
                    exercise={state.pool[item.exerciseId]}
                    completed={completed[item.id] || []}
                    onToggle={i => handleToggle(item.id, i)}
                    onStartTimer={startTimer}
                    onOpenActions={() => setActionsItemId(item.id)}
                    disabled={!interactive}
                  />
                )}
                {item.kind === 'circuit' && (
                  <CircuitBlock
                    item={item}
                    pool={state.pool}
                    completed={completed[item.id] || []}
                    childProgress={circuitProgress[item.id] || []}
                    onToggleChild={i => setState(s => toggleCircuitChild(s, viewDay, item.id, i))}
                    onCompleteRound={() => setState(s => completeCircuitRound(s, viewDay, item.id))}
                    onStartTimer={startTimer}
                    onOpenActions={childId => setActionsItemId(childId)}
                    onEditCircuit={() => setEditingCircuitId(item.id)}
                    disabled={!interactive}
                  />
                )}
              </li>
            ))}
          </ul>

          {interactive && (
            <div className="mt-8">
              <button
                type="button"
                onClick={handleFinish}
                data-variant="primary"
                className="pixel-button w-full py-3"
              >
                Finish workout
              </button>
            </div>
          )}
        </>
      )}

      {activeTimerPhases && (
        <TimerBar phases={activeTimerPhases} onDismiss={dismissTimer} />
      )}

      <ExerciseActionsSheet
        open={!!actionsItem}
        onClose={() => setActionsItemId(null)}
        item={actionsItem}
        exercise={actionsItem ? state.pool[actionsItem.exerciseId] : null}
        pool={state.pool}
        onUpdate={patch => setState(s => updateItem(s, viewDay, actionsItemId, patch))}
        onSwap={newId => setState(s => swapExercise(s, viewDay, actionsItemId, newId))}
        onRemove={() => setState(s => removeItem(s, viewDay, actionsItemId))}
      />

      <CircuitEditSheet
        open={!!editingCircuit}
        circuit={editingCircuit}
        onClose={() => setEditingCircuitId(null)}
        onSave={patch => {
          setState(s => updateItem(s, viewDay, editingCircuitId, patch));
          setEditingCircuitId(null);
        }}
        onRemove={() => {
          setState(s => removeItem(s, viewDay, editingCircuitId));
          setEditingCircuitId(null);
        }}
      />
    </div>
  );
}

function ActiveBanner({ activeDay, onResume, onDiscard }) {
  return (
    <div className="pixel-panel border-warn p-3 mb-4 text-sm">
      <p className="text-warn">
        Workout in progress on {DAY_NAMES[activeDay]}.
      </p>
      <div className="mt-2 flex gap-2">
        <button onClick={onResume} className="pixel-button">
          Go to {DAY_NAMES[activeDay]}
        </button>
        <button onClick={onDiscard} data-variant="danger" className="pixel-button">
          Discard
        </button>
      </div>
    </div>
  );
}

function StartBanner({ viewDay, today, onStart }) {
  const label = viewDay === today ? 'Start workout' : `Start ${DAY_NAMES[viewDay]}'s workout`;
  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={onStart}
        data-variant="primary"
        className="pixel-button w-full py-3"
      >
        {label}
      </button>
      <p className="label mt-2 opacity-70 text-center">
        Sets unlock once a session is running.
      </p>
    </div>
  );
}

function SessionBanner({ startedAt, onCancel }) {
  const seconds = useElapsedSeconds(startedAt);
  return (
    <div className="pixel-panel border-ok p-3 mb-4 flex items-center justify-between gap-3">
      <div className="text-ok flex items-baseline gap-2">
        <span className="label">Session in progress</span>
        <span className="pixel-num">{formatElapsed(seconds)}</span>
      </div>
      <button
        type="button"
        onClick={onCancel}
        className="pixel-button"
      >
        Cancel
      </button>
    </div>
  );
}

function useElapsedSeconds(startedAt) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return Math.max(0, Math.floor((now - startedAt) / 1000));
}

function formatElapsed(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const pad = n => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

function RestDay() {
  return (
    <div className="pixel-panel p-6 text-center">
      <p className="font-pixel text-pixel-md text-heading mb-2">Rest day</p>
      <p className="text-sm opacity-80 leading-relaxed">
        Light walk, gentle stretching, sleep, hydration. Your body adapts on rest days — trust the process.
      </p>
    </div>
  );
}
