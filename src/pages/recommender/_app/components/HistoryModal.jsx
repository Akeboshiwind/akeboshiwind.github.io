import React, { useState, useRef, useEffect } from 'react';
import { Sheet } from '../../../../components/pixel/Sheet.jsx';
import { Icon } from '../../../../components/pixel/Icon.jsx';
import noteSvg from 'pixelarticons/svg/note.svg?raw';
import pencilSvg from 'pixelarticons/svg/pencil.svg?raw';
import checkSvg from 'pixelarticons/svg/check.svg?raw';
import trashSvg from 'pixelarticons/svg/trash.svg?raw';
import { PromptModal } from './PromptModal.jsx';

const StatusBadge = ({ status }) => {
  if (status === 'seen') {
    return (
      <span className="label shrink-0 inline-flex items-center gap-1 opacity-70">
        <Icon svg={noteSvg} className="w-3.5 h-3.5" /> Seen
      </span>
    );
  }
  return <span className="label shrink-0 text-accent">Pending</span>;
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
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCancel();
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), note.trim());
  };

  return (
    <li className="pixel-line py-2 flex flex-col gap-2">
      <input
        ref={nameRef}
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Item name"
        aria-label="Item name"
        className="pixel-field w-full text-sm"
      />
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        placeholder="Add a note..."
        aria-label="Note"
        className="pixel-field w-full text-sm resize-none"
      />
      <div className="flex gap-2">
        <button onClick={onCancel} className="pixel-button">Cancel</button>
        <button onClick={handleSave} disabled={!name.trim()} className="pixel-button" data-variant="primary">
          Save
        </button>
      </div>
    </li>
  );
};

const ReviewForm = ({ onConfirm, onCancel }) => {
  const [note, setNote] = useState('');
  const ref = useRef(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const handleKeyDown = e => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onConfirm(note.trim());
    if (e.key === 'Escape') {
      e.stopPropagation();
      onCancel();
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-2">
      <textarea
        ref={ref}
        value={note}
        onChange={e => setNote(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={2}
        aria-label="Note"
        className="pixel-field w-full text-sm resize-none"
        placeholder="Add a note (optional)..."
      />
      <div className="flex gap-2">
        <button onClick={onCancel} className="pixel-button">Cancel</button>
        <button onClick={() => onConfirm(note.trim())} className="pixel-button" data-variant="primary">
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
    <form onSubmit={handleSubmit} className="shrink-0 flex flex-col gap-2 pt-3 border-t-2 border-border">
      <input
        ref={inputRef}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Item name"
        aria-label="Item name"
        className="pixel-field w-full text-sm py-2"
      />
      <textarea
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Add a note..."
        aria-label="Note"
        rows={2}
        className="pixel-field w-full text-sm resize-none"
      />
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="pixel-button flex-1 py-2">
          Cancel
        </button>
        <button type="submit" disabled={!text.trim() || !note.trim()} className="pixel-button flex-1 py-2" data-variant="primary">
          Add
        </button>
      </div>
    </form>
  );
};

const iconButton = 'p-1 cursor-pointer opacity-70 hover:opacity-100 focus-visible:outline-2 focus-visible:outline-accent';

const ItemActions = ({ rec, onEdit, onReview, onDelete }) => (
  <div className="flex items-center gap-1 mt-1 -ml-1">
    <button onClick={() => onEdit(rec.id)} aria-label="Edit" title="Edit" className={`${iconButton} hover:text-accent`}>
      <Icon svg={pencilSvg} className="w-4 h-4" />
    </button>
    {rec.status === 'pending' && (
      <button onClick={() => onReview(rec.id)} aria-label="Mark as seen" title="Mark as seen" className={`${iconButton} hover:text-ok`}>
        <Icon svg={checkSvg} className="w-4 h-4" />
      </button>
    )}
    <button
      onClick={() => {
        if (window.confirm(`Delete "${rec.text}"?`)) onDelete(rec.id);
      }}
      aria-label="Delete"
      title="Delete"
      className={`${iconButton} hover:text-danger`}
    >
      <Icon svg={trashSvg} className="w-4 h-4" />
    </button>
  </div>
);

const Group = ({ title, children }) => (
  <div>
    <h3 className="label opacity-70 mb-1">{title}</h3>
    <ul>{children}</ul>
  </div>
);

export const HistoryModal = ({ list, onClose, onUpdateNote, onUpdateName, onDelete, onReview, onAddCustom }) => {
  const [editingId, setEditingId] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const reviewed = list.recommendations
    .filter(r => r.status !== 'pending')
    .sort((a, b) => (b.reviewedAt || 0) - (a.reviewedAt || 0));

  const pending = list.recommendations.filter(r => r.status === 'pending');

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
      <li key={r.id} className="pixel-line py-2">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm text-heading min-w-0 break-words">{r.text}</span>
          <StatusBadge status={r.status} />
        </div>

        {reviewingId === r.id && (
          <ReviewForm
            onConfirm={note => handleReview(r.id, note)}
            onCancel={() => setReviewingId(null)}
          />
        )}

        {r.note && reviewingId !== r.id && (
          <p className="text-sm italic opacity-70 mt-1 break-words">"{r.note}"</p>
        )}

        {reviewingId !== r.id && (
          <ItemActions
            rec={r}
            onEdit={id => { setEditingId(id); setReviewingId(null); }}
            onReview={id => { setReviewingId(id); setEditingId(null); }}
            onDelete={onDelete}
          />
        )}
      </li>
    );
  };

  // Shown in place of this sheet, not over it: two sheets would both close on one Escape.
  if (showPrompt) return <PromptModal list={list} onClose={() => setShowPrompt(false)} />;

  return (
    <Sheet title="History" onClose={onClose}>
      <p className="page-sub -mt-1 shrink-0">{list.name}</p>

      <div className="min-h-0 overflow-y-auto overscroll-contain">
        {reviewed.length === 0 && pending.length === 0 ? (
          <p className="text-sm opacity-70 text-center py-8">No recommendations yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.length > 0 && (
              <Group title={`Current (${pending.length})`}>{pending.map(renderItem)}</Group>
            )}
            {reviewed.length > 0 && (
              <Group title={`Reviewed (${reviewed.length})`}>{reviewed.map(renderItem)}</Group>
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
        <div className="shrink-0 flex gap-2">
          <button onClick={() => setShowAddForm(true)} className="pixel-button flex-1 py-2">
            + Add item
          </button>
          <button onClick={() => setShowPrompt(true)} className="pixel-button flex-1 py-2">
            View prompt
          </button>
        </div>
      )}
    </Sheet>
  );
};
