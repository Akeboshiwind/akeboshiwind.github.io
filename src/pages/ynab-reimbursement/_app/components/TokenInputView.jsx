import React from 'react';
import { SectionLabel } from '../../../../components/pixel/SectionLabel.jsx';

export const TokenInputView = ({ onTokenSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onTokenSubmit(e.target.token.value.trim());
  };

  return (
    <section>
      <SectionLabel className="mb-3">YNAB Access Token</SectionLabel>
      <p className="mt-0 mb-4">
        To use this tool, you need to provide your YNAB personal access token.
        You can generate one at <a href="https://app.youneedabudget.com/settings/developer"
        target="_blank" rel="noopener noreferrer"
        className="text-link underline">YNAB Developer Settings</a>.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          name="token"
          placeholder="Paste your YNAB access token here"
          className="pixel-field flex-1 min-w-0"
          required
        />
        <button type="submit" className="pixel-button" data-variant="primary">
          Connect to YNAB
        </button>
      </form>
    </section>
  );
};
