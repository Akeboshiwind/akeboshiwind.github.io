import { createRoot } from 'react-dom/client';
import { useRef, useState } from 'react';
import gripVertical from 'pixelarticons/svg/more-vertical.svg?raw';
import gripHorizontal from 'pixelarticons/svg/more-horizontal.svg?raw';
import switchIcon from 'pixelarticons/svg/switch.svg?raw';
import undoIcon from 'pixelarticons/svg/undo.svg?raw';
import copyIcon from 'pixelarticons/svg/copy.svg?raw';
import plusIcon from 'pixelarticons/svg/plus.svg?raw';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { Sheet } from '../../../components/pixel/Sheet.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';
import * as T from './table.js';

const PREFIX = 'markdown-table_';
const MAX_SIZE = 50;
const DRAG_THRESHOLD = 5;

const EXAMPLE = `| Fruit  | Colour | Price |
| ------ | ------ | ----: |
| Apple  | Red    |  0.40 |
| Banana | Yellow |  0.25 |`;

const clampSize = value => Math.min(MAX_SIZE, Math.max(1, Math.floor(Number(value)) || 1));

const Start = ({ onTable }) => {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const submitPaste = e => {
    e.preventDefault();
    const result = T.parse(text);
    if (result.ok) onTable(result.table);
    else setError(result.error);
  };

  const submitBlank = e => {
    e.preventDefault();
    onTable(T.blank(clampSize(rows), clampSize(columns)));
  };

  return (
    <>
      <form onSubmit={submitPaste} className="flex flex-col gap-3">
        <SectionLabel className="mt-6">Paste a table</SectionLabel>
        <textarea
          aria-label="Paste a Markdown table"
          value={text}
          onChange={e => { setText(e.target.value); setError(null); }}
          placeholder={EXAMPLE}
          rows={7}
          spellCheck={false}
          className="pixel-field font-pixel text-pixel-md w-full"
        />
        {error && <p role="alert" className="pixel-alert-text w-fit" data-variant="danger">{error}</p>}
        <button type="submit" className="pixel-button w-fit" data-variant="primary">Edit table</button>
      </form>

      <form onSubmit={submitBlank} className="flex flex-col gap-3">
        <SectionLabel className="mt-10">Or start blank</SectionLabel>
        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="label">Rows</span>
            <input type="number" min={1} max={MAX_SIZE} value={rows} onChange={e => setRows(e.target.value)} className="pixel-field pixel-num w-24" />
          </label>
          <span className="pixel-num pb-1" aria-hidden="true">×</span>
          <label className="flex flex-col gap-1">
            <span className="label">Columns</span>
            <input type="number" min={1} max={MAX_SIZE} value={columns} onChange={e => setColumns(e.target.value)} className="pixel-field pixel-num w-24" />
          </label>
          <button type="submit" className="pixel-button">Create table</button>
        </div>
        <p className="label opacity-60">Rows below the header row.</p>
      </form>
    </>
  );
};

const Actions = ({ actions }) => (
  <div className="pixel-panel divide-y-2 divide-border">
    {actions.map(({ label, run, disabled, variant }) => (
      <button key={label} type="button" onClick={run} disabled={disabled} data-variant={variant} className="pixel-row">
        {label}
      </button>
    ))}
  </div>
);

/** Where the pointer sits among `rects`, as an index: the last one whose leading edge it has passed. */
const indexAt = (rects, pos) => rects.reduce((found, start, i) => (pos >= start ? i : found), 0);

const Editor = ({ table, update, undo, canUndo, onNew }) => {
  const [open, setOpen] = useState(null);
  const [drag, setDrag] = useState(null);
  const [copied, setCopied] = useState(false);
  const grid = useRef(null);
  const justDragged = useRef(false);

  const rowCount = table.cells.length;
  const columnCount = table.align.length;
  const markdown = T.serialise(table);

  const startDrag = (axis, from) => e => {
    if (e.button !== 0) return;
    const origin = axis === 'row' ? e.clientY : e.clientX;
    const starts = [...grid.current.querySelectorAll(`[data-${axis}-handle]`)].map(el => {
      const rect = el.getBoundingClientRect();
      return axis === 'row' ? rect.top : rect.left;
    });
    let moved = false;
    let to = from;

    const onMove = ev => {
      const pos = axis === 'row' ? ev.clientY : ev.clientX;
      if (!moved && Math.abs(pos - origin) < DRAG_THRESHOLD) return;
      moved = true;
      to = indexAt(starts, pos);
      setDrag({ axis, from, to });
    };
    const finish = ev => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
      setDrag(null);
      if (!moved) return;
      justDragged.current = true;
      setTimeout(() => { justDragged.current = false; });
      if (ev.type === 'pointerup' && to !== from) {
        update(axis === 'row' ? T.moveRow(table, from, to) : T.moveColumn(table, from, to));
      }
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', finish);
    window.addEventListener('pointercancel', finish);
  };

  const openHandle = (axis, index) => () => {
    if (!justDragged.current) setOpen({ axis, index });
  };

  const act = next => () => {
    update(next);
    setOpen(null);
  };

  const rowActions = r => [
    { label: 'Move up', run: act(T.moveRow(table, r, r - 1)), disabled: r === 0 },
    { label: 'Move down', run: act(T.moveRow(table, r, r + 1)), disabled: r === rowCount - 1 },
    { label: 'Insert row above', run: act(T.insertRow(table, r)) },
    { label: 'Insert row below', run: act(T.insertRow(table, r + 1)) },
    { label: 'Delete row', run: act(T.deleteRow(table, r)), disabled: rowCount === 1, variant: 'danger' },
  ];

  const columnActions = c => [
    { label: 'Move left', run: act(T.moveColumn(table, c, c - 1)), disabled: c === 0 },
    { label: 'Move right', run: act(T.moveColumn(table, c, c + 1)), disabled: c === columnCount - 1 },
    { label: 'Insert column left', run: act(T.insertColumn(table, c)) },
    { label: 'Insert column right', run: act(T.insertColumn(table, c + 1)) },
    ...[['Align left', 'left'], ['Align centre', 'center'], ['Align right', 'right'], ['No alignment', null]].map(([label, value]) => ({
      label: table.align[c] === value ? `${label} ✓` : label,
      run: act(T.setAlign(table, c, value)),
    })),
    { label: 'Delete column', run: act(T.deleteColumn(table, c)), disabled: columnCount === 1, variant: 'danger' },
  ];

  // Accent bars mark where a dragged row or column will land, on the side it is moving towards.
  const dropMark = (axis, index) => {
    if (drag?.axis !== axis || drag.to !== index || drag.to === drag.from) return undefined;
    const after = drag.to > drag.from;
    return axis === 'row'
      ? `inset 0 ${after ? '-3px' : '3px'} 0 var(--accent)`
      : `inset ${after ? '-3px' : '3px'} 0 0 var(--accent)`;
  };
  const cellStyle = (r, c) => {
    const shadows = [dropMark('row', r), dropMark('column', c)].filter(Boolean);
    return shadows.length ? { boxShadow: shadows.join(', ') } : undefined;
  };
  const dragging = (r, c) => (drag?.axis === 'row' && drag.from === r) || (drag?.axis === 'column' && drag.from === c);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* the Markdown is still on screen to select by hand */ }
  };

  const moveOnEnter = (r, c) => e => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    grid.current.querySelector(`[data-cell="${e.shiftKey ? r - 1 : r + 1},${c}"]`)?.focus();
  };

  const handle = 'pixel-icon-button touch-none select-none cursor-grab active:cursor-grabbing';
  const alignClass = { left: 'text-left', center: 'text-center', right: 'text-right' };

  return (
    <>
      <div className="pixel-bleed mt-6 pb-2">
        <table ref={grid} className="pixel-table w-auto mx-auto min-w-[min(100%,calc(720px-2rem))]">
          <tbody>
            <tr className="bg-none">
              <td aria-hidden="true" className="p-0" />
              {table.align.map((align, c) => (
                <td key={c} data-column-handle className="p-0 text-center" style={cellStyle(-1, c)}>
                  <button
                    type="button"
                    aria-label={`Column ${c + 1}`}
                    title="Drag to move, click for options"
                    onPointerDown={startDrag('column', c)}
                    onClick={openHandle('column', c)}
                    className={`${handle} w-full`}
                  >
                    <Icon svg={gripHorizontal} className="w-4 h-4" />
                    {align && <span className="label ml-1 opacity-60">{{ left: ':--', center: ':-:', right: '--:' }[align]}</span>}
                  </button>
                </td>
              ))}
              <td rowSpan={rowCount + 1} className="relative w-8 p-0">
                <button
                  type="button"
                  onClick={() => update(T.insertColumn(table, columnCount))}
                  aria-label="Add column"
                  title="Add column"
                  className="pixel-icon-button absolute inset-0 w-full opacity-60 hover:opacity-100"
                >
                  <Icon svg={plusIcon} className="w-4 h-4" />
                </button>
              </td>
            </tr>
            {table.cells.map((row, r) => (
              <tr key={r}>
                <td data-row-handle className="p-0 align-middle" style={cellStyle(r, -1)}>
                  <button
                    type="button"
                    aria-label={`Row ${r + 1}`}
                    title="Drag to move, click for options"
                    onPointerDown={startDrag('row', r)}
                    onClick={openHandle('row', r)}
                    className={handle}
                  >
                    <Icon svg={gripVertical} className="w-4 h-4" />
                  </button>
                </td>
                {row.map((value, c) => (
                  <td key={c} className={`px-1 py-0.5 align-top ${dragging(r, c) ? 'opacity-40' : ''}`} style={cellStyle(r, c)}>
                    <div className={`pixel-grow min-w-32 max-w-80 ${r === 0 ? 'font-bold text-heading' : ''}`} data-value={value}>
                      <textarea
                        rows={1}
                        cols={1}
                        data-cell={`${r},${c}`}
                        aria-label={`Row ${r + 1}, column ${c + 1}`}
                        value={value}
                        onChange={e => update(T.setCell(table, r, c, e.target.value.replace(/\r?\n/g, ' ')), { typing: [r, c] })}
                        onKeyDown={moveOnEnter(r, c)}
                        className={alignClass[table.align[c]]}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-none">
              <td className="p-0" />
              <td colSpan={columnCount} className="p-0">
                <button
                  type="button"
                  onClick={() => update(T.insertRow(table, rowCount))}
                  aria-label="Add row"
                  title="Add row"
                  className="pixel-icon-button w-full opacity-60 hover:opacity-100"
                >
                  <Icon svg={plusIcon} className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="label opacity-60">Drag a handle to move a row or column; click it for more.</p>

      <SectionLabel className="mt-8 mb-2">Markdown</SectionLabel>
      <pre aria-label="Markdown" className="pixel-panel bg-code-bg text-code-text font-pixel text-pixel-md p-3 overflow-x-auto select-all">{markdown}</pre>

      <div className="pixel-bar flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => update(T.transpose(table))} className="pixel-button inline-flex items-center gap-1">
          <Icon svg={switchIcon} className="w-4 h-4" />Transpose
        </button>
        <button type="button" onClick={undo} disabled={!canUndo} aria-label="Undo" title="Undo" className="pixel-button inline-flex items-center">
          <Icon svg={undoIcon} className="w-4 h-4" />
        </button>
        <span className="flex-1" />
        <button type="button" onClick={onNew} className="pixel-button">New</button>
        <button type="button" onClick={copy} className="pixel-button inline-flex items-center gap-1" data-variant="primary">
          <Icon svg={copyIcon} className="w-4 h-4" />{copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {open && (
        <Sheet title={`${open.axis === 'row' ? 'Row' : 'Column'} ${open.index + 1}${open.axis === 'row' && open.index === 0 ? ' (header)' : ''}`} onClose={() => setOpen(null)}>
          <div className="min-h-0 overflow-y-auto">
            <Actions actions={open.axis === 'row' ? rowActions(open.index) : columnActions(open.index)} />
          </div>
        </Sheet>
      )}
    </>
  );
};

export function App() {
  const [table, setTable] = useLocalStorage('table', null, { prefix: PREFIX });
  const [past, setPast] = useState([]);
  const lastTyped = useRef(null);

  // A run of keystrokes in one cell is one undo step.
  const update = (next, { typing } = {}) => {
    const key = typing?.join(',') ?? null;
    if (key === null || key !== lastTyped.current) setPast(p => [...p, table].slice(-100));
    lastTyped.current = key;
    setTable(next);
  };

  const undo = () => {
    lastTyped.current = null;
    setTable(past.at(-1));
    setPast(p => p.slice(0, -1));
  };

  const start = next => {
    setPast([]);
    lastTyped.current = null;
    setTable(next);
  };

  return (
    <main className="flex flex-col gap-2 pb-32">
      <h1 className="page-title">Markdown Table Tools</h1>
      <p className="page-sub">Paste a table, or start a blank one, then edit, reorder and transpose it.</p>
      {table
        ? <Editor table={table} update={update} undo={undo} canUndo={past.length > 0} onNew={() => start(null)} />
        : <Start onTable={start} />}
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
