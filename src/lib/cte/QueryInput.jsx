import { SAMPLES } from './samples.ts';

/** The query box and its Analyse button, with a button per sample that loads the sample into the box and analyses it. */
export function QueryInput({ sql, onChange, parsing, onAnalyse }) {
  return (
    <>
      <textarea className="pixel-field w-full font-pixel text-pixel block" rows={12} spellCheck={false}
        aria-label="XTDB SQL" placeholder="Paste a query, or load a sample." value={sql}
        onChange={(e) => onChange(e.target.value)} />
      <div className="flex flex-wrap items-center gap-2">
        <button className="pixel-button" data-variant="primary" disabled={parsing} onClick={() => onAnalyse(sql)}>
          {parsing ? 'Analysing…' : 'Analyse'}
        </button>
        <div role="group" aria-label="Load a sample" className="flex flex-wrap items-center gap-2">
          <span className="label opacity-70">or load a sample:</span>
          {SAMPLES.map((s) => (
            <button key={s.name} className="pixel-button" disabled={parsing}
              onClick={() => { onChange(s.sql); onAnalyse(s.sql); }}>
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
