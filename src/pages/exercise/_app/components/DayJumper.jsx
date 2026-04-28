import { DAYS, DAY_NAMES } from '../store.js';

export function DayJumper({ viewDay, onChange }) {
  const idx = DAYS.indexOf(viewDay);
  const prev = DAYS[(idx - 1 + DAYS.length) % DAYS.length];
  const next = DAYS[(idx + 1) % DAYS.length];

  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <button
        type="button"
        onClick={() => onChange(prev)}
        aria-label={`Previous day (${DAY_NAMES[prev]})`}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg viewBox="0 0 16 16" className="w-5 h-5"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M10 3l-5 5 5 5"/></svg>
      </button>
      <h1 className="text-2xl font-semibold flex-1 text-center">{DAY_NAMES[viewDay]}</h1>
      <button
        type="button"
        onClick={() => onChange(next)}
        aria-label={`Next day (${DAY_NAMES[next]})`}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <svg viewBox="0 0 16 16" className="w-5 h-5"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 3l5 5-5 5"/></svg>
      </button>
    </div>
  );
}
