import React, { useState, useRef, useEffect } from 'react';

export const SeenModal = ({ recommendation, onSubmit, onSkip }) => {
  const [note, setNote] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(note.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📝</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">Marked as seen</span>
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-medium mb-4 text-sm">
            {recommendation}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                Any notes? <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                ref={textareaRef}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. already read it, not my thing, want to try soon..."
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onSkip}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Skip
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
