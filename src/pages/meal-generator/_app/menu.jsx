import { useEffect, useRef, useState } from 'react';
import { MEALS } from './meals.js';
import { swatch } from './color.js';

const THEMES = [
  { id: 'auto', label: 'Auto' },
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
];

// ThemeInit puts the stored preference on <html> before paint; `__setTheme`
// is its setter, shared with the rest of the site.
const readPref = () =>
  (typeof document !== 'undefined' && document.documentElement.dataset.themePref) || 'auto';

const ThemeChoice = () => {
  const [pref, setPref] = useState(readPref);

  const choose = next => {
    window.__setTheme?.(next);
    setPref(next);
  };

  return (
    <div className="px-3 py-2.5">
      <div className="mb-1.5 text-[11px] uppercase tracking-wider text-gray-400">Theme</div>
      <div role="radiogroup" aria-label="Theme" className="flex gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            type="button"
            role="radio"
            aria-checked={pref === theme.id}
            onClick={() => choose(theme.id)}
            className={`flex-1 cursor-pointer rounded-md px-2 py-1 text-sm transition-colors ${
              pref === theme.id
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-100'
                : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {theme.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const MealsDialog = ({ slots, onClose }) => {
  const inPalette = new Map(slots.map(slot => [slot.id, slot]));

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="All meals"
        onClick={e => e.stopPropagation()}
        className="flex max-h-[80dvh] w-full max-w-md flex-col rounded-t-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:rounded-2xl"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">All meals</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-lg px-2 py-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        <ul className="overflow-y-auto px-4 pb-4">
          {MEALS.map(meal => {
            const slot = inPalette.get(meal.id);
            return (
              <li key={meal.id} className="flex items-center gap-3 py-1.5">
                <span
                  aria-hidden="true"
                  className="h-7 w-7 shrink-0 rounded-md"
                  style={{ backgroundColor: swatch(meal.hue).background }}
                />
                <span className="flex-1 truncate text-sm text-gray-900 dark:text-gray-100">{meal.name}</span>
                {slot && (
                  <span className="shrink-0 text-[11px] uppercase tracking-wider text-gray-400">
                    {slot.locked ? 'locked' : 'in this set'}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

// The corner menu: theme, and the meals the generator draws from.
export function Menu({ slots, onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [showMeals, setShowMeals] = useState(false);
  const wrapper = useRef(null);
  const isOpen = open || showMeals;

  // The palette's keyboard shortcuts stand down while this is up.
  useEffect(() => { onOpenChange?.(isOpen); }, [isOpen, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = e => {
      if (e.key !== 'Escape') return;
      if (showMeals) setShowMeals(false);
      else setOpen(false);
    };
    // The dialog closes on its own backdrop, so only the popover listens out
    // for clicks landing elsewhere.
    const onPointerDown = e => {
      if (!showMeals && wrapper.current && !wrapper.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [isOpen, showMeals]);

  return (
    <div ref={wrapper} className="relative shrink-0">
      {open && (
        <div className="absolute right-0 bottom-full z-20 mb-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900">
          <ThemeChoice />
          <div className="my-1 border-t border-gray-100 dark:border-gray-800" />
          <button
            type="button"
            onClick={() => { setShowMeals(true); setOpen(false); }}
            className="w-full cursor-pointer px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            All meals
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="cursor-pointer rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        <svg
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" aria-hidden="true"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {showMeals && <MealsDialog slots={slots} onClose={() => setShowMeals(false)} />}
    </div>
  );
}
