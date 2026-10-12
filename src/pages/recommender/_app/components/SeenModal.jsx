import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from '../../../../components/pixel/Sheet.jsx';

export const SeenModal = ({ recommendation, onSubmit, onClose }) => {
  const [note, setNote] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (!note.trim()) return;
    onSubmit(note.trim());
  };

  return (
    <Sheet title="Marked as seen" onClose={onClose}>
      <p className="text-heading font-medium">{recommendation}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="label">Add a note</span>
          <textarea
            ref={textareaRef}
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="e.g. already read it, not my thing, want to try soon..."
            rows={3}
            className="pixel-field w-full text-sm resize-none"
          />
        </label>

        <button type="submit" disabled={!note.trim()} className="pixel-button w-full py-2" data-variant="primary">
          Save
        </button>
      </form>
    </Sheet>
  );
};
