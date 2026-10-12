import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../../components/pixel/Icon.jsx';
import menuSvg from 'pixelarticons/svg/menu.svg?raw';
import { MEALS } from './meals.js';
import { MealSheet, MealSwatch, MealNote } from './sheet.jsx';

const MealsDialog = ({ slots, onClose }) => {
  const inPalette = new Map(slots.map(slot => [slot.id, slot]));

  return (
    <MealSheet title="All meals" onClose={onClose}>
      {MEALS.map(meal => {
        const slot = inPalette.get(meal.id);
        return (
          <li key={meal.id} className="flex items-center gap-3 px-2 py-1.5">
            <MealSwatch hue={meal.hue} />
            <span className="flex-1 truncate text-heading">{meal.name}</span>
            {slot && <MealNote>{slot.locked ? 'locked' : 'in this set'}</MealNote>}
          </li>
        );
      })}
    </MealSheet>
  );
};

const item = 'label w-full px-3 py-2 text-left enabled:cursor-pointer enabled:hover:text-accent disabled:opacity-40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent';

export function Menu({ slots, onOpenChange, onUnlockAll, anyLocked }) {
  const [open, setOpen] = useState(false);
  const [showMeals, setShowMeals] = useState(false);
  const wrapper = useRef(null);
  // The sheet gives focus back to its opener, but the item that opened it
  // went with the popover; the menu button stands in.
  const menuButton = useRef(null);
  const isOpen = open || showMeals;

  // The palette's keyboard shortcuts stand down while this is up.
  useEffect(() => { onOpenChange?.(isOpen); }, [isOpen, onOpenChange]);

  // The sheet looks after its own dismissal, so this is only the popover's.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = e => { if (e.key === 'Escape') setOpen(false); };
    const onPointerDown = e => {
      if (wrapper.current && !wrapper.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <div ref={wrapper} className="relative shrink-0">
      {open && (
        <div className="pixel-panel absolute right-0 bottom-full z-20 mb-2 flex w-48 flex-col bg-bg py-1">
          <button
            type="button"
            onClick={() => { onUnlockAll?.(); setOpen(false); }}
            disabled={!anyLocked}
            className={item}
          >
            Unlock all
          </button>
          <button
            type="button"
            onClick={() => { setShowMeals(true); setOpen(false); }}
            className={item}
          >
            All meals
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        ref={menuButton}
        aria-label="Menu"
        aria-haspopup="menu"
        aria-expanded={open}
        className="pixel-button flex h-10 items-center"
      >
        <Icon svg={menuSvg} />
      </button>

      {showMeals && (
        <MealsDialog
          slots={slots}
          onClose={() => { setShowMeals(false); menuButton.current?.focus(); }}
        />
      )}
    </div>
  );
}
