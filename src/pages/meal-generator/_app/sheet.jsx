import { Sheet } from '../../../components/pixel/Sheet.jsx';
import { swatch } from './color.js';

export const MealSheet = ({ title, onClose, children }) => (
  <Sheet title={title} onClose={onClose}>
    {/* min-h-0 is what lets this shrink inside the flex column and scroll:
        a flex item's min-height defaults to its content, which in Safari
        runs the list past the sheet instead of giving it a scrollbar. */}
    <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      {children}
    </ul>
  </Sheet>
);

export const MealSwatch = ({ hue }) => (
  <span
    aria-hidden="true"
    className="h-6 w-6 shrink-0"
    style={{ backgroundColor: swatch(hue).background }}
  />
);

export const MealNote = ({ children }) => (
  <span className="label shrink-0 opacity-60">{children}</span>
);
