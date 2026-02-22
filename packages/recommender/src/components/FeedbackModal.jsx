import React, { useState, useRef, useEffect } from 'react';

export const FeedbackModal = ({ recommendation, reaction, onSubmit, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(feedback.trim());
  };

  const isLiked = reaction === 'liked';
  const emoji = isLiked ? '👍' : '👎';
  const label = isLiked ? 'Liked' : 'Disliked';
  const color = isLiked
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-500 dark:text-red-400';
  const placeholder = isLiked
    ? 'What did you like about it? (optional)'
    : 'What put you off? (optional)';

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-end sm:items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{emoji}</span>
            <span className={`font-semibold ${color}`}>{label}</span>
          </div>
          <p className="text-gray-900 dark:text-gray-100 font-medium mb-4 text-sm">
            {recommendation}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                Why? <span className="text-gray-400">(encouraged but optional)</span>
              </label>
              <textarea
                ref={textareaRef}
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Your feedback helps the AI learn your taste and improves future recommendations.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
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
