import React, { useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { useVault, useProgress, clearAll } from './hooks.js';
import { parseZipExport } from './parser.js';
import { UploadView } from './components/UploadView.jsx';
import { ProgressDashboard } from './components/ProgressDashboard.jsx';
import { EntryList } from './components/EntryList.jsx';
import { EntryDetail } from './components/EntryDetail.jsx';
import './app.css';

const App = () => {
  const [vault, setVault] = useVault();
  const [progress, setProgress] = useProgress();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImport = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = await parseZipExport(file);
      setVault(parsed);
    } catch (e) {
      setError(e.message || 'Failed to parse export');
    } finally {
      setIsLoading(false);
    }
  }, [setVault]);

  const handleReset = useCallback(() => {
    clearAll();
    setVault(null);
    setProgress({ dispositions: {}, fieldStatuses: {}, userNotes: {}, pinnedId: null, applePasswordsReported: null });
  }, [setVault, setProgress]);

  // Merge vault entries with progress data for rendering
  const entries = useMemo(() => {
    if (!vault) return null;
    return vault.map(entry => ({
      ...entry,
      disposition: progress.dispositions[entry.bitwarden_id] || null,
      user_notes: progress.userNotes[entry.bitwarden_id] || '',
      is_pinned: progress.pinnedId === entry.bitwarden_id,
      field_statuses: progress.fieldStatuses[entry.bitwarden_id] || entry.field_statuses,
    }));
  }, [vault, progress]);

  const handlePin = useCallback((id) => {
    setProgress(prev => ({
      ...prev,
      pinnedId: prev.pinnedId === id ? null : id,
    }));
  }, [setProgress]);

  const handleSetDisposition = useCallback((id, disposition) => {
    setProgress(prev => ({
      ...prev,
      dispositions: { ...prev.dispositions, [id]: disposition },
    }));
  }, [setProgress]);

  const handleClearDisposition = useCallback((id) => {
    setProgress(prev => {
      const { [id]: _, ...rest } = prev.dispositions;
      return { ...prev, dispositions: rest };
    });
  }, [setProgress]);

  const handleUnpin = useCallback(() => {
    setProgress(prev => ({ ...prev, pinnedId: null }));
  }, [setProgress]);

  const handleUpdateNotes = useCallback((id, text) => {
    setProgress(prev => ({
      ...prev,
      userNotes: { ...prev.userNotes, [id]: text },
    }));
  }, [setProgress]);

  const handleSetFieldStatus = useCallback((id, fieldName, status) => {
    setProgress(prev => {
      const existing = prev.fieldStatuses[id] || {};
      return {
        ...prev,
        fieldStatuses: {
          ...prev.fieldStatuses,
          [id]: { ...existing, [fieldName]: status },
        },
      };
    });
  }, [setProgress]);

  const handleApplePasswordsCountChange = useCallback((count) => {
    setProgress(prev => ({ ...prev, applePasswordsReported: count }));
  }, [setProgress]);

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
        applePasswordsReported={progress.applePasswordsReported}
        onApplePasswordsCountChange={handleApplePasswordsCountChange}
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
