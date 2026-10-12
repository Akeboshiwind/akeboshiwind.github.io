import React, { useState } from 'react';
import { Sheet } from '../../../../components/pixel/Sheet.jsx';
import { getPhase, getPhaseLabel, getPhaseDescription } from '../utils.js';
import { PromptModal } from './PromptModal.jsx';

export const SettingsModal = ({ list, onSave, onDelete, onClose }) => {
  const [name, setName] = useState(list.name);
  const [description, setDescription] = useState(list.description);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const phase = getPhase(list);
  const reviewed = list.recommendations.filter(r => r.status !== 'pending').length;

  const handleSave = e => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;
    onSave({ name: name.trim(), description: description.trim() });
    onClose();
  };

  // Shown in place of this sheet, not over it: two sheets would both close on one Escape.
  if (showPrompt) return <PromptModal list={list} onClose={() => setShowPrompt(false)} />;

  return (
    <Sheet title="Settings" onClose={onClose}>
      <div className="min-h-0 overflow-y-auto flex flex-col gap-5">
        <div className="pixel-panel p-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="label">Phase</span>
            <span className="pixel-chip">{getPhaseLabel(phase)}</span>
          </div>
          <p className="text-sm">{getPhaseDescription(phase)}</p>
          <p className="label opacity-70 mt-1">
            {reviewed} recommendation{reviewed !== 1 ? 's' : ''} reviewed
          </p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="label">List name</span>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="pixel-field w-full text-sm py-2"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="label">What are you looking for?</span>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="pixel-field w-full text-sm resize-none"
            />
          </label>

          <button
            type="submit"
            disabled={!name.trim() || !description.trim()}
            className="pixel-button w-full py-2"
            data-variant="primary"
          >
            Save Changes
          </button>
        </form>

        <button onClick={() => setShowPrompt(true)} className="pixel-button w-full py-2">
          View current prompt
        </button>

        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="pixel-button w-full py-2" data-variant="danger">
            Delete list
          </button>
        ) : (
          <div className="pixel-panel border-danger p-3">
            <p className="text-sm text-danger mb-3">
              Delete "{list.name}"? This cannot be undone.
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="pixel-button flex-1 py-2">
                Cancel
              </button>
              <button onClick={onDelete} className="pixel-button flex-1 py-2" data-variant="danger">
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
};
