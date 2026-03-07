import React, { useCallback } from 'react';

export function UploadView({ onImport, isLoading, error }) {
  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
  }, [onImport]);

  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Password Migration Helper
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Upload your Bitwarden .zip export to begin tracking your migration
        to Apple Passwords and Uplock.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Parsing export...</p>
      ) : (
        <label className="inline-block cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Choose .zip file
          <input
            type="file"
            accept=".zip"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
