import { useEffect, useState } from 'react';
import { Menu as PixelMenu } from '../../../components/pixel/Menu.jsx';
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

export function Menu({ slots, onOpenChange, onUnlockAll, anyLocked }) {
  const [listOpen, setListOpen] = useState(false);
  const [showMeals, setShowMeals] = useState(false);
  const isOpen = listOpen || showMeals;

  // The palette's keyboard shortcuts stand down while this is up.
  useEffect(() => { onOpenChange?.(isOpen); }, [isOpen, onOpenChange]);

  return (
    <>
      <PixelMenu
        label="Menu"
        icon={menuSvg}
        side="top"
        triggerClassName="h-10"
        onOpenChange={setListOpen}
        items={[
          { label: 'Unlock all', onSelect: () => onUnlockAll?.(), disabled: !anyLocked },
          { label: 'All meals', onSelect: () => setShowMeals(true) },
        ]}
      />
      {showMeals && <MealsDialog slots={slots} onClose={() => setShowMeals(false)} />}
    </>
  );
}
