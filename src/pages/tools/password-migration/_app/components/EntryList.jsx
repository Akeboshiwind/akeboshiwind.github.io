import React, { useState, useMemo } from 'react';
import { EntryDetail } from './EntryDetail.jsx';

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
    <tr
      onClick={() => onPin(entry.bitwarden_id)}
      className={`cursor-pointer transition-colors ${
        entry.is_pinned
          ? 'bg-blue-50 dark:bg-blue-900/20'
          : isDone
            ? 'opacity-50 hover:opacity-70'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
      }`}
    >
      <td className="py-1.5 px-2 text-xs w-14">
        <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
          {TYPE_LABELS[entry.type] || entry.type}
        </span>
      </td>
      <td className="py-1.5 px-2 text-sm text-gray-900 dark:text-gray-100 max-w-48 truncate">
        {entry.name}{hasExtras && <span className="text-amber-500 ml-1" title="Has extra fields">*</span>}
      </td>
      <td className="py-1.5 px-2 text-xs text-gray-500 dark:text-gray-400 max-w-40 truncate">
        {entry.username}
      </td>
      <td className="py-1.5 px-2 text-xs text-gray-400 dark:text-gray-500 max-w-48 truncate hidden sm:table-cell">
        {entry.uris?.[0]?.uri?.replace(/^https?:\/\//, '')}
      </td>
      <td className="py-1.5 px-2 text-xs text-gray-400 dark:text-gray-500 max-w-24 truncate hidden md:table-cell">
        {entry.folder_name}
      </td>
      <td className="py-1.5 px-2 text-xs text-right w-28">
        {isDone && (
          <span className="text-green-600 dark:text-green-400">
            {DISPOSITION_LABELS[entry.disposition]}
          </span>
        )}
      </td>
    </tr>
  );
}

export function EntryList({ entries, onPin, onSetDisposition, onClearDisposition, onUnpin, onUpdateNotes, onSetFieldStatus }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = useMemo(() => {
    let result = entries;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.folder_name?.toLowerCase().includes(q) ||
        e.username?.toLowerCase().includes(q) ||
        e.password?.toLowerCase().includes(q) ||
        e.uris?.some(u => u.uri.toLowerCase().includes(q))
      );
    }
    if (typeFilter) {
      result = result.filter(e => e.type === typeFilter);
    }
    return result;
  }, [entries, search, typeFilter]);

  const active = filtered.filter(e => e.disposition == null || e.is_pinned);
  const done = filtered.filter(e => e.disposition != null && !e.is_pinned);

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
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <th className="py-1.5 px-2 text-left font-medium w-14">Type</th>
            <th className="py-1.5 px-2 text-left font-medium max-w-48">Name</th>
            <th className="py-1.5 px-2 text-left font-medium max-w-40">Username</th>
            <th className="py-1.5 px-2 text-left font-medium max-w-48 hidden sm:table-cell">URL</th>
            <th className="py-1.5 px-2 text-left font-medium max-w-24 hidden md:table-cell">Folder</th>
            <th className="py-1.5 px-2 text-right font-medium w-28">Status</th>
          </tr>
        </thead>
        <tbody>
          {active.map(entry => (
            <React.Fragment key={entry.bitwarden_id}>
              <EntryRow entry={entry} onPin={onPin} />
              {entry.is_pinned && (
                <tr>
                  <td colSpan="6" className="p-0">
                    <div className="border border-blue-200 dark:border-blue-800 rounded-b-lg mb-2">
                      <EntryDetail
                        entry={entry}
                        onSetDisposition={onSetDisposition}
                        onClearDisposition={onClearDisposition}
                        onUnpin={onUnpin}
                        onUpdateNotes={onUpdateNotes}
                        onSetFieldStatus={onSetFieldStatus}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
      {done.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-6 mb-2">
            Done ({done.length})
          </h3>
          <table className="w-full border-collapse">
            <tbody>
              {done.map(entry => (
                <React.Fragment key={entry.bitwarden_id}>
                  <EntryRow entry={entry} onPin={onPin} />
                  {entry.is_pinned && (
                    <tr>
                      <td colSpan="6" className="p-0">
                        <div className="border border-blue-200 dark:border-blue-800 rounded-b-lg mb-2">
                          <EntryDetail
                            entry={entry}
                            onSetDisposition={onSetDisposition}
                            onClearDisposition={onClearDisposition}
                            onUnpin={onUnpin}
                            onUpdateNotes={onUpdateNotes}
                            onSetFieldStatus={onSetFieldStatus}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
