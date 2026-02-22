import React, { useState } from 'react';

export const ImportExportModal = ({ lists, onImport, onClose }) => {
  const exportJson = JSON.stringify(lists, null, 2);
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportChange = e => {
    setImportText(e.target.value);
    setImportError('');
    setConfirming(false);
  };

  const handleImport = () => {
    let data;
    try {
      data = JSON.parse(importText.trim());
    } catch {
      setImportError('Invalid JSON. Please check your data.');
      return;
    }
    if (!Array.isArray(data)) {
      setImportError('Data must be a JSON array of lists.');
      return;
    }

    if (!confirming) {
      setConfirming(true);
      return;
    }

    onImport(data);
    onClose();
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 dark:bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Import / Export</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6 min-h-0">
          {/* Export */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Export</h3>
              <button
                onClick={handleCopy}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={exportJson}
              rows={6}
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-xs font-mono resize-none focus:outline-none"
            />
          </div>

          {/* Import */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Import</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Paste exported data below. This will replace all existing lists.
            </p>
            <textarea
              value={importText}
              onChange={handleImportChange}
              placeholder='[{"id": "...", "name": "...", ...}]'
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs font-mono resize-none"
            />
            {importError && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1">{importError}</p>
            )}
            {confirming && !importError && (
              <p className="text-amber-600 dark:text-amber-400 text-xs mt-1">
                This will replace all {lists.length} existing list{lists.length !== 1 ? 's' : ''}. Click Import again to confirm.
              </p>
            )}
            <button
              onClick={handleImport}
              disabled={!importText.trim()}
              className={`mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-white ${
                confirming
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {confirming ? 'Confirm Import' : 'Import'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
