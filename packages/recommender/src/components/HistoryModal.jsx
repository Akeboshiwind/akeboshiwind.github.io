import React, { useState, useRef, useEffect } from 'react';

const StatusBadge = ({ status }) => {
  if (status === 'seen') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        <span>📝</span> Seen
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
      Pending
    </span>
  );
};

const NoteEditor = ({ note, onSave, onCancel }) => {
  const [value, setValue] = useState(note);
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);

  const handleKeyDown = e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSave(value.trim());
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="mt-1.5 space-y-1.5">
      <textarea
        ref={ref}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        className="w-full px-2.5 py-1.5 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs resize-none"
        placeholder="Add a note..."
      />
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(value.trim())}
          className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export const HistoryModal = ({ list, onClose, onUpdateNote }) => {
  const [editingId, setEditingId] = useState(null);

  const reviewed = list.recommendations
    .filter(r => r.status !== 'pending')
    .sort((a, b) => (b.reviewedAt || 0) - (a.reviewedAt || 0));

  const pending = list.recommendations.filter(r => r.status === 'pending');

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSaveNote = (recId, note) => {
    onUpdateNote(recId, note);
    setEditingId(null);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{list.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6">
          {reviewed.length === 0 && pending.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
              No recommendations yet.
            </p>
          ) : (
            <div className="space-y-4">
              {pending.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                    Current ({pending.length})
                  </h3>
                  <div className="space-y-2">
                    {pending.map(r => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{r.text}</span>
                        <StatusBadge status={r.status} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviewed.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                    Reviewed ({reviewed.length})
                  </h3>
                  <div className="space-y-2">
                    {reviewed.map(r => (
                      <div
                        key={r.id}
                        className="py-2 border-b border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{r.text}</span>
                          <StatusBadge status={r.status} />
                        </div>

                        {editingId === r.id ? (
                          <NoteEditor
                            note={r.note || ''}
                            onSave={note => handleSaveNote(r.id, note)}
                            onCancel={() => setEditingId(null)}
                          />
                        ) : (
                          <div className="flex items-center gap-1.5 mt-1 group">
                            {r.note ? (
                              <p className="text-xs text-gray-400 dark:text-gray-500 italic flex-1">
                                "{r.note}"
                              </p>
                            ) : (
                              <p className="text-xs text-gray-300 dark:text-gray-600 flex-1 invisible group-hover:visible">
                                Add a note...
                              </p>
                            )}
                            <button
                              onClick={() => setEditingId(r.id)}
                              className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                              title="Edit note"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
