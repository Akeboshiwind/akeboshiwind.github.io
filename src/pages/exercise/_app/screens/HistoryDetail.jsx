import { DAY_NAMES, totalUnits, completedUnits } from '../store.js';
import { SectionBanner } from '../components/SectionBanner.jsx';
import { ExerciseCard } from '../components/ExerciseCard.jsx';
import { CircuitBlock } from '../components/CircuitBlock.jsx';

const noop = () => {};

export function HistoryDetail({ state, entryId, navigate }) {
  const entry = state.history.find(h => h.id === entryId);
  if (!entry) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Not found.</p>
        <button onClick={() => navigate('/history')} className="mt-2 text-sm underline">
          Back to history
        </button>
      </div>
    );
  }

  const day = entry.snapshot;
  const total = totalUnits(day);
  const done = completedUnits(day, entry.completedSets);

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => navigate('/history')}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← History
        </button>
        <h1 className="text-2xl font-semibold flex-1 text-center">
          {DAY_NAMES[entry.day]}
        </h1>
        <span className="w-12" />
      </div>

      <header className="mb-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">{entry.focus}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {prettyDate(entry.date)} · {done}/{total} done
        </p>
      </header>

      <ul className="space-y-3">
        {day.items.map(item => (
          <li key={item.id}>
            {item.kind === 'section' && <SectionBanner section={item} />}
            {(item.kind === 'reps-exercise' || item.kind === 'timed-exercise' || item.kind === 'continuous-exercise') && (
              <ExerciseCard
                item={item}
                exercise={state.pool[item.exerciseId]}
                completed={entry.completedSets[item.id] || []}
                onToggle={noop}
                disabled
              />
            )}
            {item.kind === 'circuit' && (
              <CircuitBlock
                item={item}
                pool={state.pool}
                completed={entry.completedSets[item.id] || []}
                onToggle={noop}
                disabled
              />
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

function prettyDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}
