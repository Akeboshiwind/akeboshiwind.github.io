import { MEALS } from './meals.js';
import { Sheet, MealSwatch, MealNote } from './sheet.jsx';

// Picking a meal for one band by hand. Choosing locks the band, on the
// grounds that a meal chosen deliberately shouldn't be rolled away by the
// next generate.
export function MealPicker({ slots, index, onChoose, onClose }) {
  const chosen = slots[index];

  return (
    <Sheet title={`Choose a meal for band ${index + 1}`} onClose={onClose}>
      {MEALS.map(meal => {
        const current = meal.id === chosen.id;
        const elsewhere = slots.findIndex((slot, i) => i !== index && slot.id === meal.id);
        // A locked band's meal isn't available: taking it would swap the meal
        // out from under a lock.
        const heldByLock = elsewhere !== -1 && slots[elsewhere].locked;

        return (
          <li key={meal.id}>
            <button
              type="button"
              disabled={heldByLock}
              aria-current={current ? 'true' : undefined}
              onClick={() => onChoose(meal.id)}
              className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors enabled:cursor-pointer enabled:hover:bg-gray-100 disabled:opacity-40 dark:enabled:hover:bg-gray-800 ${
                current ? 'bg-gray-100 dark:bg-gray-800' : ''
              }`}
            >
              <MealSwatch hue={meal.hue} />
              <span className="flex-1 truncate text-sm text-gray-900 dark:text-gray-100">{meal.name}</span>
              {current && <MealNote>current</MealNote>}
              {!current && heldByLock && <MealNote>locked</MealNote>}
              {!current && elsewhere !== -1 && !heldByLock && <MealNote>swaps with {elsewhere + 1}</MealNote>}
            </button>
          </li>
        );
      })}
    </Sheet>
  );
}
