import { useState } from 'react';
import { DAYS, DAY_NAMES, totalUnits } from '../store.js';
import { GenerateRoutineSheet } from '../components/GenerateRoutineSheet.jsx';
import { ScreenHeader } from '../components/ScreenHeader.jsx';

export function Planner({ state, setState, navigate }) {
  const [generateOpen, setGenerateOpen] = useState(false);

  return (
    <>
      <ScreenHeader backLabel="← Today" onBack={() => navigate('/')} title="Week template" />

      <button
        type="button"
        onClick={() => setGenerateOpen(true)}
        className="pixel-button w-full mb-4 py-2"
      >
        Generate routine with Claude
      </button>

      <ul className="space-y-2">
        {DAYS.map(d => {
          const day = state.template.days[d];
          const total = totalUnits(day);
          return (
            <li key={d}>
              <button
                type="button"
                onClick={() => navigate(`/planner/${d}`)}
                className="pixel-panel w-full text-left p-3 hover:border-accent"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-pixel text-pixel-md text-heading">{DAY_NAMES[d]}</p>
                    <p className="text-sm opacity-70 truncate mt-0.5">
                      {day.rest ? 'Rest day' : (day.focus || 'No focus set')}
                    </p>
                  </div>
                  <span className="label opacity-70 flex-shrink-0">
                    {day.rest ? '—' : `${day.items.filter(i => i.kind !== 'section').length} items`}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <nav className="mt-6 flex flex-col gap-2">
        <a
          href="#/pool"
          className="label hover:text-accent"
        >
          Edit exercise pool →
        </a>
        <a
          href="#/history"
          className="label hover:text-accent"
        >
          History →
        </a>
        <a
          href="#/settings"
          className="label hover:text-accent"
        >
          Settings →
        </a>
      </nav>

      <GenerateRoutineSheet
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
        state={state}
        setState={setState}
      />
    </>
  );
}
