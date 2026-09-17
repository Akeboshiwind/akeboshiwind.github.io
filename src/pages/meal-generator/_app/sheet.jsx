import { useEffect } from 'react';
import { swatch } from './color.js';

// The bottom sheet both meal lists sit in: the read-only one behind the menu
// and the picker behind a band's name. Closes on its own backdrop, its close
// button and Escape.
export function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const onKeyDown = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={e => e.stopPropagation()}
        className="flex max-h-[80dvh] w-full max-w-md flex-col rounded-t-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900 sm:rounded-2xl"
      >
        <div className="flex shrink-0 items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer rounded-lg px-2 py-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>
        {/* min-h-0 is what lets this shrink inside the flex column and scroll:
            a flex item's min-height defaults to its content, which in Safari
            runs the list past the sheet instead of giving it a scrollbar. */}
        <ul className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
          {children}
        </ul>
      </div>
    </div>
  );
}

export const MealSwatch = ({ hue }) => (
  <span
    aria-hidden="true"
    className="h-7 w-7 shrink-0 rounded-md"
    style={{ backgroundColor: swatch(hue).background }}
  />
);

export const MealNote = ({ children }) => (
  <span className="shrink-0 text-[11px] uppercase tracking-wider text-gray-400">{children}</span>
);
