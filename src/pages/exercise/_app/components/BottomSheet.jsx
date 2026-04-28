import { useEffect } from 'react';

export function BottomSheet({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full sm:max-w-md sm:mx-4 bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] flex flex-col"
      >
        {title && (
          <div className="px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="p-1 rounded text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg viewBox="0 0 16 16" className="w-5 h-5"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M3 3l10 10M13 3L3 13"/></svg>
            </button>
          </div>
        )}
        <div className="overflow-y-auto p-4 flex-1">{children}</div>
      </div>
    </div>
  );
}
