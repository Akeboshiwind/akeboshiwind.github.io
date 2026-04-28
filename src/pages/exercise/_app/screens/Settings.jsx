import { useRef, useState } from 'react';
import { seedPool, seedTemplate } from '../seed.js';

export function Settings({ state, setState, navigate }) {
  const fileRef = useRef(null);
  const [importError, setImportError] = useState('');

  const resetTemplate = () => {
    if (!confirm('Reset the week template to the original 8-week plan? Your exercise pool and history will be kept.')) return;
    setState(s => ({ ...s, template: seedTemplate, inProgress: null }));
  };

  const clearHistory = () => {
    if (!confirm('Delete all history entries? This cannot be undone.')) return;
    setState(s => ({ ...s, history: [] }));
  };

  const clearAll = () => {
    if (!confirm('Erase EVERYTHING — pool, template, history, in-progress workout? This cannot be undone.')) return;
    setState({ pool: seedPool, template: seedTemplate, inProgress: null, history: [] });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exercise-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPickFile = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== 'object') throw new Error('not an object');
        if (!data.pool || !data.template) throw new Error('missing pool or template');
        if (!confirm('Replace your current data with the imported file?')) return;
        setState({
          pool: data.pool,
          template: data.template,
          inProgress: data.inProgress ?? null,
          history: Array.isArray(data.history) ? data.history : [],
        });
      } catch (err) {
        setImportError('Invalid file: ' + err.message);
      }
    };
    reader.readAsText(file);
    // Reset the input so picking the same file again still triggers onChange.
    e.target.value = '';
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => navigate('/planner')}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold flex-1 text-center">Settings</h1>
        <span className="w-12" />
      </div>

      <Section title="Backup">
        <Action label="Export as JSON" description="Download your pool, template, and history." onClick={exportJson} />
        <Action label="Import from JSON" description="Replace your data from a previous export." onClick={() => fileRef.current?.click()} />
        <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={onPickFile} />
        {importError && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{importError}</p>
        )}
      </Section>

      <Section title="Reset">
        <Action
          label="Reset week template"
          description="Restores the original 8-week plan. Your pool and history are kept."
          onClick={resetTemplate}
        />
        <Action
          label="Clear history"
          description="Deletes every history entry."
          onClick={clearHistory}
          danger
        />
        <Action
          label="Erase all data"
          description="Pool, template, history, in-progress — back to seed."
          onClick={clearAll}
          danger
        />
      </Section>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-8 text-center">
        Stored locally in this browser. Use Export regularly if you don't want to lose it.
      </p>
    </>
  );
}

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
        {title}
      </h2>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {children}
      </div>
    </section>
  );
}

function Action({ label, description, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'w-full text-left px-4 py-3 transition-colors',
        danger
          ? 'text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
      ].join(' ')}
    >
      <p className="font-medium text-sm">{label}</p>
      {description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
      )}
    </button>
  );
}
