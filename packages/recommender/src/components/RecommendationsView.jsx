import React from 'react';

const RecommendationCard = ({ rec, onReact }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <p className="text-gray-900 dark:text-gray-100 font-medium mb-4">{rec.text}</p>
      <div className="flex gap-2">
        <button
          onClick={() => onReact(rec.id, 'liked')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
        >
          <span>👍</span> Like
        </button>
        <button
          onClick={() => onReact(rec.id, 'disliked')}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 rounded-lg text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <span>👎</span> Dislike
        </button>
      </div>
    </div>
  );
};

export const RecommendationsView = ({
  list,
  onReact,
  onBack,
  onOpenSettings,
  isGenerating,
  generateError,
  onRetryGenerate,
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
          <button
            onClick={onOpenSettings}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">{list.name}</h2>
        {reviewed.length > 0 && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {reviewed.length} reviewed so far
          </p>
        )}

        {/* Generating state */}
        {isGenerating && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-medium">
              {reviewed.length === 0
                ? 'Generating your first recommendations...'
                : 'Generating new recommendations based on your feedback...'}
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
              <RecommendationCard key={rec.id} rec={rec} onReact={onReact} />
            ))}
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
