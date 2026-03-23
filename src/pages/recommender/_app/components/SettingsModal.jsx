import React, { useState } from 'react';
import { getPhase, getPhaseLabel, getPhaseDescription } from '../utils.js';
import { PromptModal } from './PromptModal.jsx';

const PHASE_COLORS = {
  exploring: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  refining: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  honing: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
};

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

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Phase info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phase</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PHASE_COLORS[phase]}`}
              >
                {getPhaseLabel(phase)}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getPhaseDescription(phase)}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {reviewed} recommendation{reviewed !== 1 ? 's' : ''} reviewed
            </p>
          </div>

          {/* Edit form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                List name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                What are you looking for?
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!name.trim() || !description.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 dark:disabled:bg-blue-800 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              Save Changes
            </button>
          </form>

          {/* Prompt */}
          <button
            onClick={() => setShowPrompt(true)}
            className="w-full px-4 py-2 text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-left"
          >
            View current prompt
          </button>

          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-full px-4 py-2 text-red-500 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              Delete list
            </button>
          ) : (
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-sm text-red-600 dark:text-red-400 mb-3 font-medium">
                Delete "{list.name}"? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onDelete}
                  className="flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
      {showPrompt && <PromptModal list={list} onClose={() => setShowPrompt(false)} />}
    </>
  );
};
