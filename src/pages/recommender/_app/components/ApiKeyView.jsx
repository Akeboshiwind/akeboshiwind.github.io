import React, { useState } from 'react';
import { SectionLabel } from '../../../../components/pixel/SectionLabel.jsx';
import { PageTitle } from './PageTitle.jsx';

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
    <div className="text-text">
      <PageTitle />

      <SectionLabel className="mb-3">Anthropic API Key</SectionLabel>
      <p className="text-sm mb-4">
        Your key is stored locally and never sent anywhere except the Anthropic API.
        Get one at{' '}
        <a
          href="https://console.anthropic.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-link underline"
        >
          console.anthropic.com
        </a>
        .
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          value={key}
          onChange={e => {
            setKey(e.target.value);
            setError('');
          }}
          placeholder="sk-ant-api03-..."
          aria-label="Anthropic API key"
          className="pixel-field w-full font-pixel text-pixel py-2"
          autoFocus
        />
        {error && <p className="label"><span className="pixel-alert-text">{error}</span></p>}
        <button
          type="submit"
          disabled={!key.trim()}
          className="pixel-button w-full py-2"
          data-variant="primary"
        >
          Get Started
        </button>
      </form>
    </div>
  );
};
