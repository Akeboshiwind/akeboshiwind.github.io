import React, { useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocalStorage, clearAllStorage } from './hooks.js';
import { parseZipExport } from './parser.js';
import { UploadView } from './components/UploadView.jsx';
import { ProgressDashboard } from './components/ProgressDashboard.jsx';
import { EntryList } from './components/EntryList.jsx';
import { EntryDetail } from './components/EntryDetail.jsx';
import './app.css';

const App = () => {
  const [entries, setEntries] = useLocalStorage('entries', null);
  const [applePasswordsReported, setApplePasswordsReported] = useLocalStorage('applePasswordsReported', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImport = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = await parseZipExport(file);
      setEntries(parsed);
    } catch (e) {
      setError(e.message || 'Failed to parse export');
    } finally {
      setIsLoading(false);
    }
  }, [setEntries]);

  const handleReset = useCallback(() => {
    clearAllStorage();
    setEntries(null);
    setApplePasswordsReported(null);
  }, [setEntries, setApplePasswordsReported]);

  const updateEntry = useCallback((id, updater) => {
    setEntries(prev => prev.map(e =>
      e.bitwarden_id === id ? updater(e) : e
    ));
  }, [setEntries]);

  const handlePin = useCallback((id) => {
    setEntries(prev => prev.map(e => ({
      ...e,
      is_pinned: e.bitwarden_id === id ? !e.is_pinned : false,
    })));
  }, [setEntries]);

  const handleSetDisposition = useCallback((id, disposition) => {
    updateEntry(id, e => ({ ...e, disposition }));
  }, [updateEntry]);

  const handleClearDisposition = useCallback((id) => {
    updateEntry(id, e => ({ ...e, disposition: null }));
  }, [updateEntry]);

  const handleUnpin = useCallback(() => {
    setEntries(prev => prev.map(e => ({ ...e, is_pinned: false })));
  }, [setEntries]);

  const handleUpdateNotes = useCallback((id, text) => {
    updateEntry(id, e => ({ ...e, user_notes: text }));
  }, [updateEntry]);

  const handleSetFieldStatus = useCallback((id, fieldName, status) => {
    updateEntry(id, e => {
      const fs = { ...e.field_statuses };
      if (fieldName === 'totp') {
        fs.totp = status;
      } else if (fieldName === 'notes') {
        fs.notes = status;
      } else if (fieldName.startsWith('custom_field_')) {
        const idx = parseInt(fieldName.split('_')[2], 10);
        fs.custom_fields = [...fs.custom_fields];
        fs.custom_fields[idx] = status;
      } else if (fieldName.startsWith('attachment_')) {
        const idx = parseInt(fieldName.split('_')[1], 10);
        fs.attachments = [...fs.attachments];
        fs.attachments[idx] = status;
      }
      return { ...e, field_statuses: fs };
    });
  }, [updateEntry]);

  const backLink = (
    <a href="/tools/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-4 inline-block">
      &larr; Tools
    </a>
  );

  if (!entries) {
    return (
      <div className="max-w-xl mx-auto pt-8 px-8">
        {backLink}
        <UploadView onImport={handleImport} isLoading={isLoading} error={error} />
      </div>
    );
  }

  const total = entries.length;
  const done = entries.filter(e => e.disposition != null).length;
  const remaining = total - done;
  const applePasswordsMarked = entries.filter(e => e.disposition === 'apple_passwords').length;
  const pinnedEntry = entries.find(e => e.is_pinned);

  return (
    <div className="max-w-3xl mx-auto p-4">
      {backLink}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Password Migration Helper
      </h1>

      <ProgressDashboard
        total={total}
        done={done}
        remaining={remaining}
        applePasswordsMarked={applePasswordsMarked}
        applePasswordsReported={applePasswordsReported}
        onApplePasswordsCountChange={setApplePasswordsReported}
        onReset={handleReset}
      />

      {pinnedEntry && (
        <EntryDetail
          entry={pinnedEntry}
          onSetDisposition={handleSetDisposition}
          onClearDisposition={handleClearDisposition}
          onUnpin={handleUnpin}
          onUpdateNotes={handleUpdateNotes}
          onSetFieldStatus={handleSetFieldStatus}
        />
      )}

      <EntryList entries={entries} onPin={handlePin} />
    </div>
  );
};

createRoot(document.getElementById('app')).render(<App />);
