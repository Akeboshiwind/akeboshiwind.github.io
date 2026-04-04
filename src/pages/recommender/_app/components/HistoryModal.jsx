import React, { useState, useRef, useEffect } from 'react';
import { PromptModal } from './PromptModal.jsx';

const StatusBadge = ({ status }) => {
  if (status === 'seen') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        <span>📝</span> Seen
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
      Pending
    </span>
  );
};

const ItemEditor = ({ rec, onSave, onCancel }) => {
  const [name, setName] = useState(rec.text);
  const [note, setNote] = useState(rec.note || '');
  const nameRef = useRef(null);

  useEffect(() => {
    nameRef.current?.focus();
    nameRef.current?.select();
  }, []);

  const handleKeyDown = e => {
    if (e.key === 'Escape') onCancel();
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), note.trim());
  };

  return (
    <div className="py-2 border-b border-gray-100 dark:border-gray-700 space-y-2">
      <input
        ref={nameRef}
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Item name"
        className="w-full px-2.5 py-1.5 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        placeholder="Add a note..."
        className="w-full px-2.5 py-1.5 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs resize-none"
      />
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim()}
          className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 disabled:opacity-40"
        >
          Save
        </button>
      </div>
    </div>
  );
};

const ReviewForm = ({ onConfirm, onCancel }) => {
  const [note, setNote] = useState('');
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const handleKeyDown = e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onConfirm(note.trim());
    if (e.key === 'Escape') onCancel();
  };

  return (
    <div className="mt-1.5 space-y-1.5">
      <textarea
        ref={ref}
        value={note}
        onChange={e => setNote(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        className="w-full px-2.5 py-1.5 border border-green-300 dark:border-green-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-xs resize-none"
        placeholder="Add a note (optional)..."
      />
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={() => onConfirm(note.trim())}
          className="text-xs text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300"
        >
          Mark as seen
        </button>
      </div>
    </div>
  );
};

const AddItemForm = ({ onSave, onCancel }) => {
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = e => {
    e.preventDefault();
    if (!text.trim() || !note.trim()) return;
    onSave(text.trim(), note.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3 flex-shrink-0">
      <input
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Item name"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a note..."
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!text.trim() || !note.trim()}
          className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
};

const ItemActions = ({ rec, onEdit, onReview, onDelete }) => {
  return (
    <div className="flex items-center gap-2 mt-1">
      <button
        onClick={() => onEdit(rec.id)}
        className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
        title="Edit"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      </button>
      {rec.status === 'pending' && (
        <button
          onClick={() => onReview(rec.id)}
          className="text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400"
          title="Mark as seen"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      )}
      <button
        onClick={() => {
          if (window.confirm(`Delete "${rec.text}"?`)) onDelete(rec.id);
        }}
        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
        title="Delete"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export const HistoryModal = ({ list, onClose, onUpdateNote, onUpdateName, onDelete, onReview, onAddCustom }) => {
  const [editingId, setEditingId] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const reviewed = list.recommendations
    .filter(r => r.status !== 'pending')
    .sort((a, b) => (b.reviewedAt || 0) - (a.reviewedAt || 0));

  const pending = list.recommendations.filter(r => r.status === 'pending');

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSaveEdit = (recId, name, note) => {
    onUpdateName(recId, name);
    onUpdateNote(recId, note);
    setEditingId(null);
  };

  const handleReview = (recId, note) => {
    onReview(recId, note);
    setReviewingId(null);
  };

  const renderItem = r => {
    if (editingId === r.id) {
      return (
        <ItemEditor
          key={r.id}
          rec={r}
          onSave={(name, note) => handleSaveEdit(r.id, name, note)}
          onCancel={() => setEditingId(null)}
        />
      );
    }

    return (
      <div key={r.id} className="py-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">{r.text}</span>
          <StatusBadge status={r.status} />
        </div>

        {reviewingId === r.id && (
          <ReviewForm
            onConfirm={note => handleReview(r.id, note)}
            onCancel={() => setReviewingId(null)}
          />
        )}

        {r.note && reviewingId !== r.id && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic mt-1">
            "{r.note}"
          </p>
        )}

        {reviewingId !== r.id && (
          <ItemActions
            rec={r}
            onEdit={id => { setEditingId(id); setReviewingId(null); }}
            onReview={id => { setReviewingId(id); setEditingId(null); }}
            onDelete={onDelete}
          />
        )}
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">History</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{list.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 min-h-0">
          {reviewed.length === 0 && pending.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-8">
              No recommendations yet.
            </p>
          ) : (
            <div className="space-y-4">
              {pending.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                    Current ({pending.length})
                  </h3>
                  <div className="space-y-2">
                    {pending.map(renderItem)}
                  </div>
                </div>
              )}

              {reviewed.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                    Reviewed ({reviewed.length})
                  </h3>
                  <div className="space-y-2">
                    {reviewed.map(renderItem)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {showAddForm ? (
          <AddItemForm
            onSave={(text, note) => { onAddCustom(text, note); setShowAddForm(false); }}
            onCancel={() => setShowAddForm(false)}
          />
        ) : (
          <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex-shrink-0 flex gap-2">
            <button
              onClick={() => setShowAddForm(true)}
              className="flex-1 py-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors"
            >
              + Add item
            </button>
            <button
              onClick={() => setShowPrompt(true)}
              className="flex-1 py-2 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 font-medium transition-colors"
            >
              View prompt
            </button>
          </div>
        )}
      {showPrompt && <PromptModal list={list} onClose={() => setShowPrompt(false)} />}
      </div>
    </div>
  );
};
