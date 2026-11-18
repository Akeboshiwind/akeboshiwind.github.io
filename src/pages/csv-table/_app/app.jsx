import { createRoot } from 'react-dom/client';
import { useMemo, useState } from 'react';
import fileIcon from 'pixelarticons/svg/file.svg?raw';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { FileDrop } from '../../../components/pixel/FileDrop.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';
import * as CSV from './csv.js';

const PREFIX = 'csv-table_';
const PAGE = 200;

const EXAMPLE = `Fruit,Colour,Price
Apple,Red,0.40
Banana,Yellow,0.25`;

const DELIMITER_NAMES = { ',': 'Comma', '\t': 'Tab', ';': 'Semicolon', '|': 'Pipe' };

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

const Start = ({ onSource }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  const open = (source) => {
    const result = CSV.parse(source.text, CSV.detectDelimiter(source.text));
    if (result.ok) onSource(source);
    else setError(result.error);
  };

  const openFile = async ([file]) => {
    if (file) open({ text: await file.text(), name: file.name });
  };

  return (
    <>
      <FileDrop accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain" onFiles={openFile} className="py-10 mt-6">
        <Icon svg={fileIcon} className="w-8 h-8" />
        <span>Drop a CSV here</span>
        <span className="opacity-60">or tap to choose one</span>
      </FileDrop>

      <form onSubmit={e => { e.preventDefault(); open({ text, name: null }); }} className="flex flex-col gap-3">
        <SectionLabel className="mt-8">Or paste it</SectionLabel>
        <textarea
          aria-label="Paste CSV"
          value={text}
          onChange={e => { setText(e.target.value); setError(null); }}
          placeholder={EXAMPLE}
          rows={7}
          spellCheck={false}
          className="pixel-field font-pixel text-pixel-md w-full"
        />
        <button type="submit" className="pixel-button w-fit" data-variant="primary">View table</button>
      </form>
      {error && <p role="alert" className="pixel-alert-text w-fit" data-variant="danger">{error}</p>}
    </>
  );
};

const nextSort = (sort, column) => {
  if (sort?.column !== column) return { column, direction: 'asc' };
  return sort.direction === 'asc' ? { column, direction: 'desc' } : null;
};

const Viewer = ({ source, delimiter, setDelimiter, header, setHeader, escapes, setEscapes, onNew }) => {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState(null);
  const [limit, setLimit] = useState(PAGE);

  const detected = useMemo(() => CSV.detectDelimiter(source.text), [source.text]);
  const result = useMemo(
    () => CSV.parse(source.text, delimiter === 'auto' ? detected : delimiter),
    [source.text, delimiter, detected],
  );

  const rows = result.ok ? result.rows : [[]];
  const width = rows[0].length;
  const names = header ? rows[0] : rows[0].map((_, c) => `Column ${c + 1}`);
  const body = header ? rows.slice(1) : rows;
  const activeSort = sort && sort.column < width ? sort : null;
  const order = useMemo(() => CSV.rowOrder(body, { query, sort: activeSort }), [body, query, activeSort]);
  const numeric = useMemo(() => (body.length ? CSV.numericColumns(body) : names.map(() => false)), [body, names]);
  const shown = order.slice(0, limit);
  const more = Math.min(PAGE, order.length - shown.length);

  const summary = `${order.length === body.length ? '' : `${order.length} of `}${plural(body.length, 'row')} × ${plural(width, 'column')}`;

  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-6">
        {source.name && <span className="font-bold text-heading break-all">{source.name}</span>}
        <span className="label opacity-60">{summary}</span>
      </div>

      <div className="flex flex-wrap items-end gap-4 mt-2">
        <label className="flex flex-col gap-1 grow min-w-40">
          <span className="label">Filter</span>
          <input type="search" aria-label="Filter rows" value={query} onChange={e => { setQuery(e.target.value); setLimit(PAGE); }} className="pixel-field" />
        </label>
        <label className="flex flex-col gap-1">
          <span className="label">Delimiter</span>
          <select aria-label="Delimiter" value={delimiter} onChange={e => setDelimiter(e.target.value)} className="pixel-field">
            <option value="auto">Auto ({DELIMITER_NAMES[detected]})</option>
            {CSV.DELIMITERS.map(d => <option key={d} value={d}>{DELIMITER_NAMES[d]}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 pb-1">
          <input type="checkbox" checked={header} onChange={e => setHeader(e.target.checked)} className="pixel-check" />
          <span className="label">First row is a header</span>
        </label>
        <label className="flex items-center gap-2 pb-1">
          <input type="checkbox" checked={escapes} onChange={e => setEscapes(e.target.checked)} className="pixel-check" />
          <span className="label">Show <span className="normal-case">\n</span> and ⏎ as line breaks</span>
        </label>
      </div>

      {result.ok ? (
        <div className="pixel-bleed mt-4">
          <div className="overflow-auto max-h-[75vh] w-fit max-w-full mx-auto">
            <table className="pixel-table w-auto">
              <thead className="sticky top-0 bg-bg">
                <tr>
                  <th className="text-right opacity-60">#</th>
                  {names.map((name, c) => {
                    const direction = activeSort?.column === c ? activeSort.direction : null;
                    return (
                      <th key={c} aria-sort={direction ? `${direction}ending` : undefined} className={numeric[c] ? 'text-right' : ''}>
                        <button
                          type="button"
                          onClick={() => setSort(s => nextSort(s, c))}
                          title="Sort"
                          className="whitespace-pre text-inherit uppercase hover:text-accent"
                        >
                          {name}
                          {direction && <span aria-hidden="true" className="text-accent">{direction === 'asc' ? ' ▲' : ' ▼'}</span>}
                        </button>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {shown.map(r => (
                  <tr key={r}>
                    <td className="pixel-num text-right opacity-60 align-top">{r + 1}</td>
                    {body[r].map((value, c) => (
                      <td key={c} className={`align-top whitespace-pre ${numeric[c] ? 'pixel-num text-right' : ''}`}>{escapes ? CSV.showEscapedNewlines(value) : value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p role="alert" className="pixel-alert-text w-fit mt-4" data-variant="danger">{result.error}</p>
      )}

      {result.ok && order.length === 0 && <p className="label opacity-60">No rows match.</p>}
      {more > 0 && (
        <button type="button" onClick={() => setLimit(l => l + PAGE)} className="pixel-button w-fit mx-auto mt-2">
          Show {more} more
        </button>
      )}

      <div className="pixel-bar flex flex-wrap items-center gap-2">
        <span className="flex-1" />
        <button type="button" onClick={onNew} className="pixel-button">New</button>
      </div>
    </>
  );
};

export function App() {
  const [source, setSource] = useLocalStorage('source', null, { prefix: PREFIX });
  const [delimiter, setDelimiter] = useLocalStorage('delimiter', 'auto', { prefix: PREFIX });
  const [header, setHeader] = useLocalStorage('header', true, { prefix: PREFIX });
  const [escapes, setEscapes] = useLocalStorage('escapes', false, { prefix: PREFIX });

  const start = next => {
    setDelimiter('auto');
    setHeader(true);
    setSource(next);
  };

  return (
    <main className="flex flex-col gap-2 pb-32">
      <h1 className="page-title">CSV Viewer</h1>
      <p className="page-sub">Open or paste a CSV to read it as a table; sort by a column, or filter the rows.</p>
      {source
        ? <Viewer key={source.text} source={source} delimiter={delimiter} setDelimiter={setDelimiter} header={header} setHeader={setHeader} escapes={escapes} setEscapes={setEscapes} onNew={() => start(null)} />
        : <Start onSource={start} />}
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
