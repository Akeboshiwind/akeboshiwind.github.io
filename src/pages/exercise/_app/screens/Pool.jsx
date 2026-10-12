import { useMemo, useState } from 'react';
import { ScreenHeader } from '../components/ScreenHeader.jsx';

const EQUIPMENT_FILTERS = ['all', 'none', 'dumbbell', 'band', 'elliptical', 'other'];

export function Pool({ state, navigate }) {
  const [q, setQ] = useState('');
  const [equipFilter, setEquipFilter] = useState('all');

  const entries = useMemo(() => {
    const list = Object.values(state.pool);
    return list
      .filter(p => equipFilter === 'all' ? true : p.equipment === equipFilter)
      .filter(p => !q || p.name.toLowerCase().includes(q.toLowerCase())
                   || p.tags?.some(t => t.toLowerCase().includes(q.toLowerCase())))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [state.pool, q, equipFilter]);

  return (
    <>
      <ScreenHeader
        backLabel="← Back"
        onBack={() => navigate('/planner')}
        title="Exercises"
        action={
          <button
            type="button"
            onClick={() => navigate('/pool/new')}
            aria-label="New exercise"
            data-variant="primary"
            className="pixel-button shrink-0"
          >
            + New
          </button>
        }
      />

      <input
        type="search"
        placeholder="Search exercises…"
        value={q}
        onChange={e => setQ(e.target.value)}
        className="pixel-field w-full mb-3 text-base"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {EQUIPMENT_FILTERS.map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setEquipFilter(f)}
            aria-pressed={equipFilter === f}
            className="pixel-chip"
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {entries.map(p => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => navigate(`/pool/${encodeURIComponent(p.id)}`)}
              className="pixel-panel w-full text-left p-3 hover:border-accent"
            >
              <p className="text-sm text-heading">{p.name}</p>
              <p className="label opacity-70 mt-0.5">{descriptor(p)}</p>
            </button>
          </li>
        ))}
        {entries.length === 0 && (
          <li className="text-sm opacity-70 text-center py-8">No matches.</li>
        )}
      </ul>
    </>
  );
}

function descriptor(p) {
  switch (p.kind) {
    case 'reps':       return `${p.kind} · ${p.defaultSets}×${p.defaultReps} · ${p.equipment}`;
    case 'timed':      return `${p.kind} · ${p.defaultSets}×${p.defaultDurationSec}s · ${p.equipment}`;
    case 'continuous': return `${p.kind} · ${p.defaultDurationSec}s · ${p.equipment}`;
    default: return '';
  }
}
