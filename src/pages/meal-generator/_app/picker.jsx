import { MEALS } from './meals.js';
import { MealSheet, MealSwatch, MealNote } from './sheet.jsx';

// Picking a meal for one band by hand. Choosing locks the band, on the
// grounds that a meal chosen deliberately shouldn't be rolled away by the
// next generate.
export function MealPicker({ slots, index, onChoose, onClose }) {
  const chosen = slots[index];

  return (
    <MealSheet title={`Choose a meal for band ${index + 1}`} onClose={onClose}>
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
              className={`flex w-full items-center gap-3 px-2 py-1.5 text-left text-heading enabled:cursor-pointer enabled:hover:text-accent disabled:opacity-40 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent ${
                current ? 'bg-code-bg' : ''
              }`}
            >
              <MealSwatch hue={meal.hue} />
              <span className="flex-1 truncate">{meal.name}</span>
              {current && <MealNote>current</MealNote>}
              {!current && heldByLock && <MealNote>locked</MealNote>}
              {!current && elsewhere !== -1 && !heldByLock && <MealNote>swaps with {elsewhere + 1}</MealNote>}
            </button>
          </li>
        );
      })}
    </MealSheet>
  );
}
