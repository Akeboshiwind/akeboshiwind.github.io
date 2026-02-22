import React from 'react';

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

export const HistoryModal = ({ list, onClose }) => {
  const reviewed = list.recommendations
    .filter(r => r.status !== 'pending')
    .sort((a, b) => (b.reviewedAt || 0) - (a.reviewedAt || 0));

  const pending = list.recommendations.filter(r => r.status === 'pending');

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) onClose();
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
                        className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700"
                      >
                        <span className="text-sm text-gray-700 dark:text-gray-300">{r.text}</span>
                        <StatusBadge status={r.status} />
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
