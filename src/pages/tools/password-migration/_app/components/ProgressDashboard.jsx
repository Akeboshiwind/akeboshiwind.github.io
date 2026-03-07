import React, { useState } from 'react';

export function ProgressDashboard({
  total, done, remaining,
  applePasswordsMarked, applePasswordsReported,
  onApplePasswordsCountChange, onReset,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const delta = applePasswordsReported != null
    ? applePasswordsReported - applePasswordsMarked
    : null;

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Progress</h2>
        {showConfirm ? (
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Reset all data?</span>
            <button onClick={() => { onReset(); setShowConfirm(false); }}
              className="text-sm px-2 py-1 bg-red-600 text-white rounded">Confirm</button>
            <button onClick={() => setShowConfirm(false)}
              className="text-sm px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowConfirm(true)}
            className="text-sm text-red-600 dark:text-red-400 hover:underline">Reset</button>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
        <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <span><strong className="text-gray-900 dark:text-gray-100">{done}</strong> done</span>
        <span><strong className="text-gray-900 dark:text-gray-100">{remaining}</strong> remaining</span>
        <span><strong className="text-gray-900 dark:text-gray-100">{total}</strong> total</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <label className="text-gray-600 dark:text-gray-400">
          Apple Passwords count:
          <input type="number"
            value={applePasswordsReported ?? ''}
            onChange={e => onApplePasswordsCountChange(e.target.value === '' ? null : parseInt(e.target.value, 10))}
            className="ml-2 w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
            placeholder="..." />
        </label>
        <span className="text-gray-500 dark:text-gray-500">Marked: {applePasswordsMarked}</span>
        {delta != null && (
          <span className={delta === 0 ? 'text-green-600' : 'text-amber-600'}>
            Delta: {delta > 0 ? '+' : ''}{delta}
          </span>
        )}
      </div>
    </div>
  );
}
