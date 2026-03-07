import React, { useState, useMemo } from 'react';

const TYPE_LABELS = {
  login: 'Login',
  secure_note: 'Note',
  card: 'Card',
  identity: 'Identity',
};

const DISPOSITION_LABELS = {
  apple_passwords: 'Apple Passwords',
  uplock: 'Uplock',
  apple_wallet: 'Apple Wallet',
  deleted: 'Deleted',
};

function EntryRow({ entry, onPin }) {
  const hasExtras = entry.custom_fields.length > 0 || entry.totp || entry.attachments.length > 0;
  const isDone = entry.disposition != null;

  return (
    <div
      onClick={() => onPin(entry.bitwarden_id)}
      className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors ${
        entry.is_pinned
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          : isDone
            ? 'opacity-50 hover:opacity-70'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 shrink-0">
          {TYPE_LABELS[entry.type] || entry.type}
        </span>
        <span className="text-gray-900 dark:text-gray-100 truncate">{entry.name}</span>
        {entry.folder_name && (
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{entry.folder_name}</span>
        )}
        {hasExtras && (
          <span className="text-xs text-amber-500 shrink-0" title="Has extra fields">*</span>
        )}
      </div>
      {isDone && (
        <span className="text-xs text-green-600 dark:text-green-400 shrink-0 ml-2">
          {DISPOSITION_LABELS[entry.disposition]}
        </span>
      )}
    </div>
  );
}

export function EntryList({ entries, onPin }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = useMemo(() => {
    let result = entries;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.uris?.some(u => u.uri.toLowerCase().includes(q))
      );
    }
    if (typeFilter) {
      result = result.filter(e => e.type === typeFilter);
    }
    return result;
  }, [entries, search, typeFilter]);

  const active = filtered.filter(e => e.disposition == null);
  const done = filtered.filter(e => e.disposition != null);
  active.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input type="text" placeholder="Search entries..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-sm" />
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-sm">
          <option value="">All types</option>
          <option value="login">Login</option>
          <option value="secure_note">Note</option>
          <option value="card">Card</option>
          <option value="identity">Identity</option>
        </select>
      </div>
      <div className="space-y-1">
        {active.map(entry => (
          <EntryRow key={entry.bitwarden_id} entry={entry} onPin={onPin} />
        ))}
      </div>
      {done.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-6 mb-2">
            Done ({done.length})
          </h3>
          <div className="space-y-1">
            {done.map(entry => (
              <EntryRow key={entry.bitwarden_id} entry={entry} onPin={onPin} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
