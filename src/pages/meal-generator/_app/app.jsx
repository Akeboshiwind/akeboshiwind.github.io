import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { Menu } from './menu.jsx';
import { mealById } from './meals.js';
import { swatch } from './color.js';
import {
  initialState, isValidState, current,
  generate, toggleLock, undo, redo, canUndo, canRedo,
} from './store.js';

const PREFIX = 'mealGenerator_';

const LockIcon = ({ locked }) => (
  <svg
    width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" />
    {locked
      ? <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      : <path d="M7 11V7a5 5 0 0 1 9.9-1" />}
  </svg>
);

const Arrow = ({ direction }) => (
  <svg
    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
    style={direction === 'forward' ? { transform: 'scaleX(-1)' } : undefined}
  >
    <path d="M9 14 4 9l5-5" />
    <path d="M4 9h11a5 5 0 0 1 0 10h-4" />
  </svg>
);

const Band = ({ slot, onToggleLock, first }) => {
  const meal = mealById(slot.id);
  const { background, text, hex } = swatch(meal.hue);

  return (
    <li
      className={`flex items-center justify-between gap-4 px-6 py-5 min-h-0 md:flex-1 md:flex-col md:items-start md:justify-end md:px-5 md:pt-5 md:pb-8 ${
        // On mobile the nav pill floats over the top band, so that one is
        // given extra room rather than having its label crowded.
        first ? 'flex-[1.25] pt-14' : 'flex-1'
      }`}
      style={{ backgroundColor: background, color: text }}
    >
      <div className="min-w-0 md:mb-4">
        <div className="text-xl md:text-2xl font-semibold tracking-tight">{meal.name}</div>
        <div className="mt-1 text-[11px] uppercase tracking-[0.2em] opacity-70">{hex}</div>
      </div>
      <button
        type="button"
        onClick={onToggleLock}
        aria-pressed={slot.locked}
        aria-label={`${slot.locked ? 'Unlock' : 'Lock'} ${meal.name}`}
        title={slot.locked ? 'Unlock' : 'Lock'}
        className={`shrink-0 p-2 rounded-full cursor-pointer transition-opacity hover:opacity-100 ${slot.locked ? 'opacity-100' : 'opacity-55'}`}
      >
        <LockIcon locked={slot.locked} />
      </button>
    </li>
  );
};

const ToolbarButton = ({ onClick, disabled, label, children }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="p-2 rounded-lg text-gray-700 dark:text-gray-200 enabled:cursor-pointer enabled:hover:bg-gray-100 dark:enabled:hover:bg-gray-800 disabled:opacity-30 transition-colors"
  >
    {children}
  </button>
);

export function App({ historyUrl }) {
  const [stored, setStored] = useLocalStorage('state', null, { prefix: PREFIX });

  // `useLocalStorage` evaluates its initial value eagerly, so seeding it with
  // `initialState()` inline would roll a fresh palette on every render. Hold
  // one in a ref instead, used only until the first palette is stored.
  const seed = useRef(undefined);
  if (seed.current === undefined) seed.current = initialState();

  const state = isValidState(stored) ? stored : seed.current;
  const slots = current(state);

  const apply = fn => setStored(fn(state));

  // Set while the corner menu or the meals dialog is up.
  const [menuOpen, setMenuOpen] = useState(false);

  // iOS Safari tints its chrome — the strip around the Dynamic Island most
  // visibly — with theme-color, so it tracks the band at the top of the page.
  const topColor = swatch(mealById(slots[0].id).hue).hex;
  useEffect(() => {
    let meta = document.head.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'theme-color');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', topColor);
  }, [topColor]);

  useEffect(() => {
    const onKeyDown = e => {
      // Let the focused control have the key — space activates buttons.
      if (menuOpen || e.target !== document.body || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === ' ') { e.preventDefault(); apply(generate); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); apply(undo); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); apply(redo); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // No dependency list: the handler closes over the current palette, and
    // rebinding it each render is cheaper than threading state through a ref.
  });

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <h1 className="sr-only">Meal Generator</h1>

      <div className="relative flex-1 min-h-0">
        <nav className="absolute top-3 left-3 z-10 flex items-center gap-3 rounded-full bg-black/30 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
          <a href="../" className="hover:opacity-70 transition-opacity">← Home</a>
          {historyUrl && (
            <a href={historyUrl} target="_blank" rel="noopener" className="opacity-70 hover:opacity-100 transition-opacity">
              history
            </a>
          )}
        </nav>

        <ul className="flex h-full flex-col md:flex-row">
          {slots.map((slot, i) => (
            <Band
              key={i}
              slot={slot}
              first={i === 0}
              onToggleLock={() => apply(s => toggleLock(s, i))}
            />
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-1 border-t border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
        <ToolbarButton onClick={() => apply(undo)} disabled={!canUndo(state)} label="Back">
          <Arrow direction="back" />
        </ToolbarButton>
        <ToolbarButton onClick={() => apply(redo)} disabled={!canRedo(state)} label="Forward">
          <Arrow direction="forward" />
        </ToolbarButton>

        <button
          type="button"
          onClick={() => apply(generate)}
          className="flex-1 cursor-pointer rounded-lg px-4 py-2 text-base font-medium text-gray-900 transition-colors hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
        >
          Generate
        </button>

        <span className="hidden shrink-0 px-2 text-xs text-gray-400 sm:inline">
          {state.index + 1} / {state.entries.length}
        </span>
        <Menu slots={slots} onOpenChange={setMenuOpen} />
      </div>
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
