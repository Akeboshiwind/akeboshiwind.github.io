import React, { useState } from 'react';
import { Sheet } from '../../../../components/pixel/Sheet.jsx';
import { FileDrop } from '../../../../components/pixel/FileDrop.jsx';
import { Icon } from '../../../../components/pixel/Icon.jsx';
import uploadSvg from 'pixelarticons/svg/upload.svg?raw';

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

  const setImport = text => {
    setImportText(text);
    setImportError('');
    setConfirming(false);
  };

  const handleFiles = async files => {
    if (files.length === 0) return;
    setImport(await files[0].text());
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

  return (
    <Sheet title="Import / Export" onClose={onClose}>
      <div className="min-h-0 overflow-y-auto flex flex-col gap-6">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="label">Export</h3>
            <button onClick={handleCopy} className="pixel-button" data-variant="primary">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            value={exportJson}
            rows={6}
            aria-label="Exported lists"
            className="pixel-field w-full bg-code-bg text-code-text font-pixel text-pixel resize-none"
          />
        </div>

        <div>
          <h3 className="label mb-1">Import</h3>
          <p className="text-sm opacity-80 mb-2">
            Paste exported data below. This will replace all existing lists.
          </p>
          <textarea
            value={importText}
            onChange={e => setImport(e.target.value)}
            placeholder='[{"id": "...", "name": "...", ...}]'
            aria-label="Lists to import"
            rows={6}
            className="pixel-field w-full font-pixel text-pixel resize-none"
          />
          <FileDrop accept="application/json,.json" onFiles={handleFiles} className="mt-2 py-3">
            <span className="flex items-center gap-2">
              <Icon svg={uploadSvg} className="w-4 h-4" />
              Or choose a .json file
            </span>
          </FileDrop>
          {importError && <p className="label text-danger mt-2">{importError}</p>}
          {confirming && !importError && (
            <p className="text-sm text-warn mt-2">
              This will replace all {lists.length} existing list{lists.length !== 1 ? 's' : ''}. Click Import again to confirm.
            </p>
          )}
          <button
            onClick={handleImport}
            disabled={!importText.trim()}
            className="pixel-button w-full py-2 mt-3"
            data-variant={confirming ? 'danger' : 'primary'}
          >
            {confirming ? 'Confirm Import' : 'Import'}
          </button>
        </div>
      </div>
    </Sheet>
  );
};
