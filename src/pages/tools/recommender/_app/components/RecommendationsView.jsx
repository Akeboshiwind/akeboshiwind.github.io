import React, { useState, useRef, useEffect } from 'react';

const RecommendationCard = ({ rec, onSeen }) => {
  return (
    <div
      onClick={() => onSeen(rec.id)}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-3 cursor-pointer active:bg-gray-50 dark:active:bg-gray-700 sm:hover:bg-gray-50 sm:dark:hover:bg-gray-700/50 transition-colors"
    >
      <p className="text-gray-900 dark:text-gray-100 font-medium flex-1">{rec.text}</p>
      <span className="flex-shrink-0 flex items-center gap-1.5 py-1.5 px-2.5 border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 rounded-lg text-sm font-medium">
        <span>📝</span>
        <span className="hidden sm:inline">Mark as seen</span>
      </span>
    </div>
  );
};

const MenuButton = ({ onOpenSettings, onOpenHistory }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const choose = fn => { setOpen(false); fn(); };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        title="Menu"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 z-10">
          <button
            onClick={() => choose(onOpenSettings)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Settings
          </button>
          <button
            onClick={() => choose(onOpenHistory)}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            History
          </button>
        </div>
      )}
    </div>
  );
};

export const RecommendationsView = ({
  list,
  onSeen,
  onBack,
  onOpenSettings,
  onOpenHistory,
  isGenerating,
  generateError,
  onRetryGenerate,
  onGenerateMore,
}) => {
  const pending = list.recommendations.filter(r => r.status === 'pending');
  const reviewed = list.recommendations.filter(r => r.status !== 'pending');
  const isExhausted = pending.length === 0 && !isGenerating;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1.5 text-sm font-medium"
          >
            ← Back
          </button>
          <MenuButton onOpenSettings={onOpenSettings} onOpenHistory={onOpenHistory} />
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{list.name}</h2>
        {reviewed.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {reviewed.length} seen so far
          </p>
        )}

        {/* Generating state */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {reviewed.length === 0
                ? 'Generating your first recommendations...'
                : 'Generating new recommendations...'}
            </p>
          </div>
        )}

        {/* Error state */}
        {!isGenerating && generateError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-4">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium mb-1">
              Failed to generate recommendations
            </p>
            <p className="text-red-500 dark:text-red-400 text-xs mb-3">{generateError}</p>
            <button
              onClick={onRetryGenerate}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* All reviewed — waiting to generate */}
        {isExhausted && !generateError && reviewed.length > 0 && pending.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-4">✓</div>
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              All reviewed!
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              New recommendations will be generated shortly.
            </p>
          </div>
        )}

        {/* Recommendations list */}
        {!isGenerating && pending.length > 0 && (
          <div className="space-y-3">
            {pending.map(rec => (
              <RecommendationCard key={rec.id} rec={rec} onSeen={onSeen} />
            ))}
            <button
              onClick={onGenerateMore}
              disabled={isGenerating}
              className="w-full py-2.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors"
            >
              Generate more
            </button>
          </div>
        )}

        {/* Empty first-time state */}
        {!isGenerating && !generateError && pending.length === 0 && reviewed.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Generating recommendations...</p>
          </div>
        )}
      </div>
    </div>
  );
};
