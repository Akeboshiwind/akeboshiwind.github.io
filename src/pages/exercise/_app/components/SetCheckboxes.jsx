// A row of checkboxes representing sets / rounds / a single completion.
// `labels` overrides the default "Set N" label per index.
export function SetCheckboxes({ count, completed, onToggle, disabled, labels }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }, (_, i) => {
        const done = !!completed[i];
        const label = labels?.[i] ?? (count === 1 ? 'Done' : `Set ${i + 1}`);
        return (
          <button
            key={i}
            type="button"
            onClick={() => !disabled && onToggle(i)}
            disabled={disabled}
            aria-pressed={done}
            className={[
              'inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border transition-colors min-w-[80px]',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              done
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600',
            ].join(' ')}
          >
            <span
              className={[
                'inline-block w-4 h-4 rounded border flex-shrink-0',
                done
                  ? 'bg-emerald-500 border-emerald-500'
                  : 'border-gray-300 dark:border-gray-600',
              ].join(' ')}
              aria-hidden="true"
            >
              {done && (
                <svg viewBox="0 0 16 16" className="w-4 h-4 text-white">
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8.5l3.5 3.5L13 5"
                  />
                </svg>
              )}
            </span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
