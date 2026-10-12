import React, { useState } from 'react';
import { Sheet } from '../../../../components/pixel/Sheet.jsx';
import { buildFullPrompt } from '../api.js';

const Block = ({ title, children }) => (
  <div>
    <h3 className="label opacity-70 mb-2">{title}</h3>
    <pre className="bg-code-bg text-code-text font-pixel text-pixel whitespace-pre-wrap break-words p-3 leading-relaxed">{children}</pre>
  </div>
);

export const PromptModal = ({ list, onClose }) => {
  const { system, user } = buildFullPrompt(list);
  const full = `[System]\n${system}\n\n[User]\n${user}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Sheet title="Current prompt" onClose={onClose} className="sm:max-w-2xl">
      <div className="min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-4">
        <Block title="System">{system}</Block>
        <Block title="User">{user}</Block>
      </div>
      <button onClick={handleCopy} className="pixel-button w-full py-2 shrink-0" data-variant="primary">
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </Sheet>
  );
};
