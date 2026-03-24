import React from 'react';

export const TokenInputView = ({ onTokenSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onTokenSubmit(e.target.token.value.trim());
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">YNAB Access Token</h2>
      <p className="mb-4 text-sm">
        To use this tool, you need to provide your YNAB personal access token.
        You can generate one at <a href="https://app.youneedabudget.com/settings/developer"
        target="_blank" rel="noopener noreferrer"
        className="text-blue-500 hover:underline">YNAB Developer Settings</a>.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          name="token"
          placeholder="Paste your YNAB access token here"
          className="w-full p-2 border border-gray-300 rounded mb-4 dark:bg-gray-700 dark:border-gray-600"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Connect to YNAB
        </button>
      </form>
    </div>
  );
};
