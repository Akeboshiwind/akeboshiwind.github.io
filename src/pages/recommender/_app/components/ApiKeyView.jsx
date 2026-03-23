import React, { useState } from 'react';

export const ApiKeyView = ({ onSave }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    const trimmed = key.trim();
    if (!trimmed.startsWith('sk-ant-')) {
      setError('Key should start with sk-ant-');
      return;
    }
    onSave(trimmed);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Recommender</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          AI-powered recommendation lists that learn from your feedback.
        </p>

        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Anthropic API Key
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Your key is stored locally and never sent anywhere except the Anthropic API.
          Get one at{' '}
          <a
            href="https://console.anthropic.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            console.anthropic.com
          </a>
          .
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={key}
            onChange={e => {
              setKey(e.target.value);
              setError('');
            }}
            placeholder="sk-ant-api03-..."
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={!key.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};
