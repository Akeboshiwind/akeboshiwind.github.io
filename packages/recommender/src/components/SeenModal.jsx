import React, { useState, useRef, useEffect } from 'react';

export const SeenModal = ({ recommendation, onSubmit, onClose }) => {
  const [note, setNote] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (!note.trim()) return;
    onSubmit(note.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">📝</span>
              <span className="font-semibold text-gray-700 dark:text-gray-300">Marked as seen</span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-medium mb-4 text-sm">
            {recommendation}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                Add a note
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

            <button
              type="submit"
              disabled={!note.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
