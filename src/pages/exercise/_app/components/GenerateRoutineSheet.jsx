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
        <p className="mb-2">
          1. (Optional) Tell Claude what you want — goals, equipment changes, intensity, time available.
          The current pool, plan, and last 4 weeks of history are included automatically.
        </p>
        <textarea
          value={brief}
          onChange={e => setBrief(e.target.value)}
          rows={3}
          placeholder="e.g. Drop one strength day, add a 20-min run on Saturday. Keep weights light."
          className="pixel-field w-full text-base resize-y"
        />
      </section>

      <section className="text-sm">
        <p className="mb-2">
          2. Copy the prompt and paste it into <a href="https://claude.ai" target="_blank" rel="noopener" className="text-link underline">claude.ai</a>.
        </p>
        <button
          type="button"
          onClick={onCopy}
          data-variant="primary"
          className="pixel-button py-2"
        >
          {copied ? 'Copied' : 'Copy prompt'}
        </button>
        <details className="mt-3">
          <summary className="label opacity-70 cursor-pointer hover:text-accent">Show prompt ({promptText.length.toLocaleString()} chars)</summary>
          <pre className="mt-2 max-h-48 overflow-auto bg-code-bg text-code-text p-3 font-pixel text-pixel whitespace-pre-wrap">{promptText}</pre>
        </details>
      </section>

      <section className="text-sm">
        <p className="mb-2">
          3. Paste Claude's JSON reply below.
        </p>
        <textarea
          value={raw}
          onChange={e => setRaw(e.target.value)}
          rows={8}
          placeholder='```json
{ "pool": [...], "days": {...} }
```'
          className="pixel-field w-full font-pixel text-base resize-y"
        />
      </section>

      {error && (
        <p className="label normal-case tracking-normal break-words"><span className="pixel-alert-text">{error}</span></p>
      )}

      <button
        type="button"
        onClick={onPreview}
        disabled={!raw.trim()}
        data-variant="primary"
        className="pixel-button w-full py-3"
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
        <h3 className="label opacity-70 mb-2">
          Exercise pool
        </h3>
        <ul className="text-sm space-y-1">
          <li>
            <span className="pixel-alert-text" data-variant="ok">+ {newExercises.length} new</span>
            {newExercises.length > 0 && (
              <span className="opacity-70"> · {trim(newExercises)}</span>
            )}
          </li>
          <li>
            <span className="pixel-alert-text" data-variant="warn">↻ {updatedExercises.length} updated</span>
            {updatedExercises.length > 0 && (
              <span className="opacity-70"> · {trim(updatedExercises)}</span>
            )}
          </li>
        </ul>
      </section>

      <section>
        <h3 className="label opacity-70 mb-2">
          Week template ({days.length}/7 days replaced)
        </h3>
        <ul className="text-sm space-y-1">
          {days.map(({ day, exercises }) => (
            <li key={day} className="pixel-line flex justify-between gap-3 py-1">
              <span>{DAY_NAMES[day]}</span>
              <span className="opacity-70">
                {exercises === 0 ? 'rest' : `${exercises} items`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm opacity-70">
        Any in-progress workout will be cleared. Existing pool exercises not in the import are kept.
      </p>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="pixel-button flex-1 py-3"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onApply}
          data-variant="primary"
          className="pixel-button flex-1 py-3"
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
