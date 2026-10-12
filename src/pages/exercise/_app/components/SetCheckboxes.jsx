// A row of checkboxes representing sets / rounds / a single completion.
// `labels` overrides the default "Set N" label per index.
export function SetCheckboxes({ count, completed, onToggle, disabled, labels }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: count }, (_, i) => {
        const done = !!completed[i];
        const label = labels?.[i] ?? (count === 1 ? 'Done' : `Set ${i + 1}`);
        return (
          <label
            key={i}
            className={[
              'pixel-chip inline-flex items-center gap-2 py-2 min-w-[80px]',
              done ? 'border-ok text-ok' : '',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-accent',
            ].join(' ')}
          >
            <input
              type="checkbox"
              className="pixel-check disabled:cursor-not-allowed"
              data-variant="ok"
              checked={done}
              disabled={disabled}
              onChange={() => onToggle(i)}
            />
            {label}
          </label>
        );
      })}
    </div>
  );
}
