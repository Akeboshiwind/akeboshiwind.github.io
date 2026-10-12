import React, { useState, useEffect, useRef } from 'react';
import { Sheet } from '../../../../components/pixel/Sheet.jsx';

export const CreateListModal = ({ onCreate, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    onCreate({ name: name.trim(), description: description.trim() });
  };

  return (
    <Sheet title="New List" onClose={onClose}>
      <form onSubmit={handleSubmit} className="min-h-0 overflow-y-auto flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className="label">List name</span>
          <input
            ref={nameRef}
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Sci-Fi Books, Japanese Restaurants, Podcasts"
            className="pixel-field w-full text-sm py-2"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="label">What are you looking for?</span>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe what you want in as much detail as you like. What style, themes, qualities matter to you? The more specific you are, the better the recommendations."
            rows={5}
            className="pixel-field w-full text-sm resize-none"
          />
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="pixel-button flex-1 py-2">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || !description.trim()}
            className="pixel-button flex-1 py-2"
            data-variant="primary"
          >
            Create &amp; Generate
          </button>
        </div>
      </form>
    </Sheet>
  );
};
