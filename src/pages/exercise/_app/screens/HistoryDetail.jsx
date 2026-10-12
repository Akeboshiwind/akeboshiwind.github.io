import { DAY_NAMES, totalUnits, completedUnits } from '../store.js';
import { SectionBanner } from '../components/SectionBanner.jsx';
import { ExerciseCard } from '../components/ExerciseCard.jsx';
import { CircuitBlock } from '../components/CircuitBlock.jsx';
import { ScreenHeader } from '../components/ScreenHeader.jsx';

const noop = () => {};

export function HistoryDetail({ state, entryId, navigate }) {
  const entry = state.history.find(h => h.id === entryId);
  if (!entry) {
    return (
      <div className="text-center py-12">
        <p className="opacity-70">Not found.</p>
        <button onClick={() => navigate('/history')} className="pixel-button mt-2">
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
      <ScreenHeader backLabel="← History" onBack={() => navigate('/history')} title={DAY_NAMES[entry.day]} />

      <header className="mb-4 text-center">
        <p className="text-sm">{entry.focus}</p>
        <p className="label opacity-70 mt-1">
          {[prettyDate(entry.date), `${done}/${total} done`, formatDuration(entry)].filter(Boolean).join(' · ')}
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

function formatDuration(entry) {
  if (!entry.startedAt || !entry.finishedAt) return '';
  const totalMin = Math.round((entry.finishedAt - entry.startedAt) / 60000);
  if (totalMin < 1) return '<1m';
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}
