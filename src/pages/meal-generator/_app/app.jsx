import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { Icon } from '../../../components/pixel/Icon.jsx';
import lockSvg from 'pixelarticons/svg/lock.svg?raw';
import unlockSvg from 'pixelarticons/svg/unlock.svg?raw';
import undoSvg from 'pixelarticons/svg/undo.svg?raw';
import redoSvg from 'pixelarticons/svg/redo.svg?raw';
import { Menu } from './menu.jsx';
import { MealPicker } from './picker.jsx';
import { mealById } from './meals.js';
import { swatch } from './color.js';
import {
  initialState, isValidState, current,
  generate, toggleLock, chooseMeal, unlockAll, anyLocked, undo, redo, canUndo, canRedo,
} from './store.js';

const PREFIX = 'mealGenerator_';

// The band's own colour is the text colour, so the focus ring is drawn in it.
const onBand = 'cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current';

const Band = ({ slot, onToggleLock, onPick }) => {
  const meal = mealById(slot.id);
  const { background, text } = swatch(meal.hue);

  return (
    <li
      className="flex flex-1 items-center justify-between gap-4 min-h-0 px-4 py-3 md:flex-col md:items-start md:justify-end md:px-3 md:pb-4"
      style={{ backgroundColor: background, color: text }}
    >
      <button
        type="button"
        onClick={onPick}
        aria-haspopup="dialog"
        aria-label={`Change ${meal.name}`}
        className={`min-w-0 text-left font-pixel text-pixel-lg leading-tight hover:opacity-75 md:text-pixel-md ${onBand}`}
      >
        {meal.name}
      </button>
      <button
        type="button"
        onClick={onToggleLock}
        aria-pressed={slot.locked}
        aria-label={`${slot.locked ? 'Unlock' : 'Lock'} ${meal.name}`}
        title={slot.locked ? 'Unlock' : 'Lock'}
        className={`shrink-0 p-2 md:-ml-2 hover:opacity-100 ${slot.locked ? 'opacity-100' : 'opacity-55'} ${onBand}`}
      >
        <Icon svg={slot.locked ? lockSvg : unlockSvg} className="w-6 h-6" />
      </button>
    </li>
  );
};

const HistoryButton = ({ onClick, disabled, label, svg }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    title={label}
    className="pixel-button flex h-10 items-center"
  >
    <Icon svg={svg} />
  </button>
);

export function App() {
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
  // The band whose meal is being picked by hand, if any.
  const [picking, setPicking] = useState(null);
  const overlayOpen = menuOpen || picking !== null;

  useEffect(() => {
    const onKeyDown = e => {
      // Let the focused control have the key — space activates buttons.
      if (overlayOpen || e.target !== document.body || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === ' ') { e.preventDefault(); apply(generate); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); apply(undo); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); apply(redo); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // No dependency list: the handler closes over the current palette, and
    // rebinding it each render is cheaper than threading state through a ref.
  });

  const choose = mealId => {
    apply(s => chooseMeal(s, picking, mealId));
    setPicking(null);
  };

  return (
    <main className="flex flex-1 flex-col gap-4">
      <header className="flex flex-col gap-2">
        <h1 className="page-title">Meal Generator</h1>
        <p className="page-sub">
          Five meals, one colour each. Lock the ones you want and generate the rest.
          <span className="hidden sm:inline"> Space generates; ← and → step through what you've rolled.</span>
        </p>
      </header>

      <ul aria-label="Palette" className="pixel-panel flex min-h-[420px] flex-1 flex-col md:min-h-[320px] md:flex-row">
        {slots.map((slot, i) => (
          <Band
            key={i}
            slot={slot}
            onToggleLock={() => apply(s => toggleLock(s, i))}
            onPick={() => setPicking(i)}
          />
        ))}
      </ul>

      {picking !== null && (
        <MealPicker
          slots={slots}
          index={picking}
          onChoose={choose}
          onClose={() => setPicking(null)}
        />
      )}

      <div className="flex items-center gap-2">
        <HistoryButton onClick={() => apply(undo)} disabled={!canUndo(state)} label="Back" svg={undoSvg} />
        <HistoryButton onClick={() => apply(redo)} disabled={!canRedo(state)} label="Forward" svg={redoSvg} />

        <button
          type="button"
          onClick={() => apply(generate)}
          className="pixel-button h-10 flex-1"
          data-variant="primary"
        >
          Generate
        </button>

        <span className="label hidden shrink-0 opacity-60 sm:inline">
          {state.index + 1} / {state.entries.length}
        </span>
        <Menu
          slots={slots}
          onOpenChange={setMenuOpen}
          onUnlockAll={() => apply(unlockAll)}
          anyLocked={anyLocked(state)}
        />
      </div>
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
