import { DAYS, DAY_NAMES } from '../store.js';
import { Icon, prevSvg, nextSvg } from '../icons.js';

export function DayJumper({ viewDay, onChange }) {
  const idx = DAYS.indexOf(viewDay);
  const prev = DAYS[(idx - 1 + DAYS.length) % DAYS.length];
  const next = DAYS[(idx + 1) % DAYS.length];

  return (
    <div className="flex items-center justify-between gap-2 mb-2">
      <button
        type="button"
        onClick={() => onChange(prev)}
        aria-label={`Previous day (${DAY_NAMES[prev]})`}
        className="pixel-button p-1"
      >
        <Icon svg={prevSvg} />
      </button>
      <h2 className="font-pixel text-pixel-lg text-heading flex-1 text-center">{DAY_NAMES[viewDay]}</h2>
      <button
        type="button"
        onClick={() => onChange(next)}
        aria-label={`Next day (${DAY_NAMES[next]})`}
        className="pixel-button p-1"
      >
        <Icon svg={nextSvg} />
      </button>
    </div>
  );
}
