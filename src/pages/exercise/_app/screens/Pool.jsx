import { useMemo, useState } from 'react';

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
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => navigate('/planner')}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold flex-1 text-center">Exercises</h1>
        <button
          type="button"
          onClick={() => navigate('/pool/new')}
          aria-label="New exercise"
          className="text-sm font-medium text-emerald-700 dark:text-emerald-300 hover:underline"
        >
          + New
        </button>
      </div>

      <input
        type="search"
        placeholder="Search exercises…"
        value={q}
        onChange={e => setQ(e.target.value)}
        className="w-full px-3 py-2 mb-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-base"
      />

      <div className="flex flex-wrap gap-2 mb-4">
        {EQUIPMENT_FILTERS.map(f => (
          <button
            key={f}
            type="button"
            onClick={() => setEquipFilter(f)}
            className={[
              'px-3 py-1 rounded-full text-xs border',
              equipFilter === f
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300',
            ].join(' ')}
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
              className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <p className="font-medium text-sm">{p.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{descriptor(p)}</p>
            </button>
          </li>
        ))}
        {entries.length === 0 && (
          <li className="text-sm text-gray-500 text-center py-8">No matches.</li>
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
