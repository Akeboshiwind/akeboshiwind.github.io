import { useMemo, useState } from 'react';
import { BottomSheet } from './BottomSheet.jsx';
import { buildPrompt } from '../prompt.js';
import { DAY_NAMES, parseImportedRoutine, applyImportedRoutine } from '../store.js';

export function GenerateRoutineSheet({ open, onClose, state, setState }) {
  const [stage, setStage] = useState('input');     // 'input' | 'preview'
  const [brief, setBrief] = useState('');
  const [raw, setRaw] = useState('');
  const [error, setError] = useState('');
  const [parsed, setParsed] = useState(null);
  const [summary, setSummary] = useState(null);
  const [copied, setCopied] = useState(false);

  const promptText = useMemo(() => buildPrompt(state, brief), [state, brief]);

  const reset = () => {
    setStage('input'); setBrief(''); setRaw(''); setError('');
    setParsed(null); setSummary(null); setCopied(false);
  };

  const close = () => { reset(); onClose(); };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      setError('Could not copy to clipboard. Open the prompt below and copy manually.');
    }
  };

  const onPreview = () => {
    setError('');
    const result = parseImportedRoutine(state, raw);
    if (!result.ok) { setError(result.error); return; }
    setParsed(result.parsed);
    setSummary(result.summary);
    setStage('preview');
  };

  const onApply = () => {
    setState(s => applyImportedRoutine(s, parsed));
    close();
  };

  return (
    <BottomSheet open={open} onClose={close} title={stage === 'input' ? 'Generate routine with Claude' : 'Confirm import'}>
      {stage === 'input' && (
        <Input
          brief={brief} setBrief={setBrief}
          raw={raw} setRaw={setRaw}
          promptText={promptText}
          onCopy={onCopy} copied={copied}
          onPreview={onPreview}
          error={error}
        />
      )}
      {stage === 'preview' && (
        <Preview
          summary={summary}
          onBack={() => setStage('input')}
          onApply={onApply}
        />
      )}
    </BottomSheet>
  );
}

function Input({ brief, setBrief, raw, setRaw, promptText, onCopy, copied, onPreview, error }) {
  return (
    <div className="flex flex-col gap-4">
      <section className="text-sm">
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          1. (Optional) Tell Claude what you want — goals, equipment changes, intensity, time available.
          The current pool, plan, and last 4 weeks of history are included automatically.
        </p>
        <textarea
          value={brief}
          onChange={e => setBrief(e.target.value)}
          rows={3}
          placeholder="e.g. Drop one strength day, add a 20-min run on Saturday. Keep weights light."
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm resize-y"
        />
      </section>

      <section className="text-sm">
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          2. Copy the prompt and paste it into <a href="https://claude.ai" target="_blank" rel="noopener" className="text-emerald-700 dark:text-emerald-300 underline">claude.ai</a>.
        </p>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium"
        >
          {copied ? '✓ Copied' : 'Copy prompt'}
        </button>
        <details className="mt-3">
          <summary className="text-xs text-gray-500 cursor-pointer">Show prompt ({promptText.length.toLocaleString()} chars)</summary>
          <pre className="mt-2 max-h-48 overflow-auto bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3 text-xs whitespace-pre-wrap font-mono rounded">{promptText}</pre>
        </details>
      </section>

      <section className="text-sm">
        <p className="text-gray-700 dark:text-gray-300 mb-2">
          3. Paste Claude's JSON reply below.
        </p>
        <textarea
          value={raw}
          onChange={e => setRaw(e.target.value)}
          rows={8}
          placeholder='```json
{ "pool": [...], "days": {...} }
```'
          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm font-mono resize-y"
        />
      </section>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 break-words">{error}</p>
      )}

      <button
        type="button"
        onClick={onPreview}
        disabled={!raw.trim()}
        className="w-full py-3 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold"
      >
        Preview changes
      </button>
    </div>
  );
}

function Preview({ summary, onBack, onApply }) {
  const { newExercises, updatedExercises, days } = summary;

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Exercise pool
        </h3>
        <ul className="text-sm space-y-1">
          <li>
            <span className="text-emerald-700 dark:text-emerald-300">+ {newExercises.length} new</span>
            {newExercises.length > 0 && (
              <span className="text-gray-500 dark:text-gray-400"> · {trim(newExercises)}</span>
            )}
          </li>
          <li>
            <span className="text-amber-700 dark:text-amber-300">↻ {updatedExercises.length} updated</span>
            {updatedExercises.length > 0 && (
              <span className="text-gray-500 dark:text-gray-400"> · {trim(updatedExercises)}</span>
            )}
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Week template ({days.length}/7 days replaced)
        </h3>
        <ul className="text-sm space-y-1">
          {days.map(({ day, exercises }) => (
            <li key={day} className="flex justify-between gap-3">
              <span>{DAY_NAMES[day]}</span>
              <span className="text-gray-500 dark:text-gray-400">
                {exercises === 0 ? 'rest' : `${exercises} items`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        Any in-progress workout will be cleared. Existing pool exercises not in the import are kept.
      </p>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-md border border-gray-300 dark:border-gray-600 font-medium"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onApply}
          className="flex-1 py-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
        >
          Apply changes
        </button>
      </div>
    </div>
  );
}

function trim(list, max = 3) {
  if (list.length <= max) return list.join(', ');
  return list.slice(0, max).join(', ') + ` +${list.length - max} more`;
}
