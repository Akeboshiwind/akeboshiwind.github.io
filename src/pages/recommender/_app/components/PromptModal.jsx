import React, { useState } from 'react';
import { buildFullPrompt } from '../api.js';

export const PromptModal = ({ list, onClose }) => {
  const { system, user } = buildFullPrompt(list);
  const full = `[System]\n${system}\n\n[User]\n${user}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center p-4 z-[60]"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Current prompt</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5 min-h-0">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">System</h3>
            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 rounded-xl p-4 leading-relaxed">{system}</pre>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">User</h3>
            <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 rounded-xl p-4 leading-relaxed">{user}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
