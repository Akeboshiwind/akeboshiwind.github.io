import React, { useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { useVault, useProgress, clearAll } from './hooks.js';
import { parseZipExport } from './parser.js';
import { UploadView } from './components/UploadView.jsx';
import { ProgressDashboard } from './components/ProgressDashboard.jsx';
import { EntryList } from './components/EntryList.jsx';
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
      // Save non-sensitive manifest for rendering without vault
      const manifest = {};
      for (const entry of parsed) {
        manifest[entry.bitwarden_id] = {
          name: entry.name,
          type: entry.type,
          folder_name: entry.folder_name,
          has_totp: !!entry.totp,
          has_notes: !!entry.notes,
          custom_field_count: entry.custom_fields?.length || 0,
          attachment_count: entry.attachments?.length || 0,
        };
      }
      setProgress(prev => ({ ...prev, manifest }));
    } catch (e) {
      setError(e.message || 'Failed to parse export');
    } finally {
      setIsLoading(false);
    }
  }, [setVault, setProgress]);

  const handleReset = useCallback(() => {
    clearAll();
    setVault(null);
    setProgress({ manifest: {}, dispositions: {}, fieldStatuses: {}, userNotes: {}, pinnedId: null, applePasswordsReported: null });
  }, [setVault, setProgress]);

  const hasVault = !!vault;
  const hasManifest = Object.keys(progress.manifest).length > 0;

  // Build entries: full data if vault loaded, degraded if only manifest
  const entries = useMemo(() => {
    if (vault) {
      return vault.map(entry => ({
        ...entry,
        disposition: progress.dispositions[entry.bitwarden_id] || null,
        user_notes: progress.userNotes[entry.bitwarden_id] || '',
        is_pinned: progress.pinnedId === entry.bitwarden_id,
        field_statuses: progress.fieldStatuses[entry.bitwarden_id] || {},
      }));
    }
    if (hasManifest) {
      return Object.entries(progress.manifest).map(([id, meta]) => ({
        bitwarden_id: id,
        name: meta.name,
        type: meta.type,
        folder_name: meta.folder_name,
        uris: [],
        username: null,
        password: null,
        totp: meta.has_totp ? '(hidden)' : null,
        notes: meta.has_notes ? '(hidden)' : null,
        custom_fields: Array.from({ length: meta.custom_field_count }, (_, i) => ({
          name: `Field ${i + 1}`, value: null, is_hidden: true,
        })),
        attachments: Array.from({ length: meta.attachment_count }, (_, i) => ({
          filename: `Attachment ${i + 1}`, content: null, is_binary: false,
        })),
        cardholder_name: null, card_brand: null, card_number: null,
        card_exp_month: null, card_exp_year: null, card_code: null,
        identity_title: null, identity_first_name: null, identity_last_name: null,
        identity_email: null, identity_phone: null, identity_address: null,
        disposition: progress.dispositions[id] || null,
        user_notes: progress.userNotes[id] || '',
        is_pinned: progress.pinnedId === id,
        field_statuses: progress.fieldStatuses[id] || {},
      }));
    }
    return null;
  }, [vault, progress, hasManifest]);

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

  // No data at all — fresh start
  if (!entries) {
    return (
      <div className="max-w-xl mx-auto pt-8 px-8">
        {backLink}
        <UploadView onImport={handleImport} isLoading={isLoading} error={error} />
        <p className="mt-6 text-xs text-gray-400 dark:text-gray-500 text-center">
          Your progress is saved locally. Passwords are cleared when you close this tab.
        </p>
      </div>
    );
  }

  const total = entries.length;
  const done = entries.filter(e => e.disposition != null).length;
  const remaining = total - done;
  const applePasswordsMarked = entries.filter(e => e.disposition === 'apple_passwords').length;
  return (
    <div className="max-w-3xl mx-auto p-4">
      {backLink}
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Password Migration Helper
      </h1>

      {!hasVault && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between gap-4">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Sensitive data not loaded. Upload your Bitwarden export to view passwords and details.
          </p>
          <label className="shrink-0 cursor-pointer px-3 py-1.5 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors">
            {isLoading ? 'Loading...' : 'Upload .zip'}
            <input
              type="file"
              accept=".zip"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImport(f); }}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
          {error}
        </div>
      )}

      <ProgressDashboard
        total={total}
        done={done}
        remaining={remaining}
        applePasswordsMarked={applePasswordsMarked}
        applePasswordsReported={progress.applePasswordsReported}
        onApplePasswordsCountChange={handleApplePasswordsCountChange}
        onReset={handleReset}
      />

      <EntryList
        entries={entries}
        onPin={handlePin}
        onSetDisposition={handleSetDisposition}
        onClearDisposition={handleClearDisposition}
        onUnpin={handleUnpin}
        onUpdateNotes={handleUpdateNotes}
        onSetFieldStatus={handleSetFieldStatus}
      />
    </div>
  );
};

createRoot(document.getElementById('app')).render(<App />);
