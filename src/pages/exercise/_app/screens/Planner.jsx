import { DAYS, DAY_NAMES, totalUnits } from '../store.js';

export function Planner({ state, navigate }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Today
        </button>
        <h1 className="text-2xl font-semibold flex-1 text-center">Week template</h1>
        <span className="w-12" />
      </div>

      <ul className="space-y-2">
        {DAYS.map(d => {
          const day = state.template.days[d];
          const total = totalUnits(day);
          return (
            <li key={d}>
              <button
                type="button"
                onClick={() => navigate(`/planner/${d}`)}
                className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold">{DAY_NAMES[d]}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {day.rest ? 'Rest day' : (day.focus || 'No focus set')}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
                    {day.rest ? '—' : `${day.items.filter(i => i.kind !== 'section').length} items`}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 flex flex-col gap-2 text-sm">
        <a
          href="#/pool"
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline-offset-2 hover:underline"
        >
          Edit exercise pool →
        </a>
        <a
          href="#/history"
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline-offset-2 hover:underline"
        >
          History →
        </a>
        <a
          href="#/settings"
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline-offset-2 hover:underline"
        >
          Settings →
        </a>
      </div>
    </>
  );
}
