import { DAY_NAMES, totalUnits, completedUnits } from '../store.js';
import { SectionLabel } from '../../../../components/pixel/SectionLabel.jsx';
import { ScreenHeader } from '../components/ScreenHeader.jsx';

export function History({ state, navigate }) {
  const groups = groupByWeek(state.history);

  return (
    <>
      <ScreenHeader backLabel="← Back" onBack={() => navigate('/planner')} title="History" />

      {state.history.length === 0 && (
        <p className="text-sm opacity-70 text-center py-12">
          No completed workouts yet. Finish a session to log it here.
        </p>
      )}

      {groups.map(([label, entries]) => (
        <section key={label} className="mb-6">
          <SectionLabel className="mb-2">{label}</SectionLabel>
          <ul className="space-y-2">
            {entries.map(entry => {
              const total = totalUnits(entry.snapshot);
              const done = completedUnits(entry.snapshot, entry.completedSets);
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => navigate(`/history/${encodeURIComponent(entry.id)}`)}
                    className="pixel-panel w-full text-left p-3 hover:border-accent"
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm text-heading">
                        {prettyDate(entry.date)} · {DAY_NAMES[entry.day]}
                      </p>
                      <p className="pixel-num flex-shrink-0">
                        {done}/{total}
                      </p>
                    </div>
                    <p className="text-sm opacity-70 mt-0.5 truncate">
                      {[entry.focus, formatDuration(entry)].filter(Boolean).join(' · ')}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}

function prettyDate(iso) {
  // iso like "2026-04-28"
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

// Compact duration label, e.g. "12m" or "1h 05m". Returns "" for entries
// logged before timestamps were tracked so the caller can omit the segment.
function formatDuration(entry) {
  if (!entry.startedAt || !entry.finishedAt) return '';
  const totalMin = Math.round((entry.finishedAt - entry.startedAt) / 60000);
  if (totalMin < 1) return '<1m';
  if (totalMin < 60) return `${totalMin}m`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

// Group history entries into weeks (Monday-start). Returns [[label, entries[]], ...].
function groupByWeek(history) {
  const map = new Map();
  for (const e of history) {
    const key = weekStart(e.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(e);
  }
  // Already sorted (history is prepended, so newest first); grouping preserves order.
  const out = [];
  for (const [key, entries] of map) {
    out.push([weekLabel(key), entries]);
  }
  return out;
}

function weekStart(iso) {
  const d = new Date(iso + 'T12:00:00');
  const dow = (d.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  d.setDate(d.getDate() - dow);
  return d.toISOString().slice(0, 10);
}

function weekLabel(iso) {
  const start = new Date(iso + 'T12:00:00');
  const today = new Date();
  const tDow = (today.getDay() + 6) % 7;
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - tDow);
  thisMonday.setHours(12, 0, 0, 0);
  const diffDays = Math.round((thisMonday - start) / 86400000);
  if (diffDays === 0) return 'This week';
  if (diffDays === 7) return 'Last week';
  return start.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) + ' week';
}
