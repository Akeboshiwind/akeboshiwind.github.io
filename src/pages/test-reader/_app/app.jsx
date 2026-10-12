import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import clipboardIcon from 'pixelarticons/svg/clipboard.svg?raw';
import imageIcon from 'pixelarticons/svg/image.svg?raw';
import chevronLeftIcon from 'pixelarticons/svg/chevron-left.svg?raw';
import chevronRightIcon from 'pixelarticons/svg/chevron-right.svg?raw';
import { FileDrop } from '../../../components/pixel/FileDrop.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import {
  loadData, saveData, findTest, createTest, addEntry, updateEntry, deleteEntry,
  testSummary, toLocalInputValue, parseEntryInput,
} from './store.js';
import { PAGE_DAYS, graphWindow, formatRange } from './graph.js';
import { Graph } from './Graph.jsx';
import { PhotoReader } from './PhotoReader.jsx';

const TITLE = 'Lateral Flow Test Reader';

const FormError = ({ children }) => children ? <p role="alert" className="label text-danger">{children}</p> : null;

function EntryForm({ title, initial, onSave, onCancel, onDelete }) {
  const [score, setScore] = useState(initial.score);
  const [date, setDate] = useState(initial.date);
  const [error, setError] = useState(null);

  const save = () => {
    const input = parseEntryInput(score, date);
    if (input.error) setError(input.error);
    else onSave(input);
  };

  return (
    <section className="pixel-panel p-4 flex flex-col gap-4" aria-label={title}>
      <SectionLabel>{title}</SectionLabel>
      <label className="flex flex-col gap-1">
        <span className="label">Score:</span>
        <input type="number" min="0" step="0.01" value={score} onChange={(e) => setScore(e.target.value)} className="pixel-field text-base" />
      </label>
      <label className="flex flex-col gap-1">
        <span className="label">Date & Time:</span>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} className="pixel-field text-base" />
      </label>
      <FormError>{error}</FormError>
      <div className="flex gap-2">
        {onDelete && <button type="button" onClick={onDelete} className="pixel-button flex-1 py-2" data-variant="danger">Delete</button>}
        <button type="button" onClick={onCancel} className="pixel-button flex-1 py-2">Cancel</button>
        <button type="button" onClick={save} className="pixel-button flex-1 py-2" data-variant="primary">Save</button>
      </div>
    </section>
  );
}

function TestList({ tests, onOpen, onCreate }) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  const cancel = () => { setCreating(false); setError(null); };
  const create = () => {
    const trimmed = name.trim();
    if (!trimmed) { setError('Please enter a test name'); return; }
    onCreate(trimmed);
  };

  return (
    <div className="flex flex-col gap-4">
      {tests.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-10 text-center opacity-70">
          <Icon svg={clipboardIcon} className="w-10 h-10" />
          <p className="label">No tests yet.<br />Create one to get started.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {tests.map((test) => (
            <li key={test.id}>
              <button type="button" onClick={() => onOpen(test.id)} className="pixel-panel w-full p-4 text-left hover:border-accent cursor-pointer">
                <span className="block font-pixel text-pixel-md text-heading">{test.name}</span>
                <span className="block label opacity-70 mt-1">{testSummary(test)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {creating ? (
        <div className="pixel-panel p-4 flex flex-col gap-4">
          <input
            type="text"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') create(); else if (e.key === 'Escape') cancel(); }}
            placeholder="Test name (e.g., COVID, Ovulation)"
            aria-label="Test name"
            className="pixel-field text-base"
          />
          <FormError>{error}</FormError>
          <div className="flex gap-2">
            <button type="button" onClick={cancel} className="pixel-button flex-1 py-2">Cancel</button>
            <button type="button" onClick={create} className="pixel-button flex-1 py-2" data-variant="primary">Create</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => { setName(''); setError(null); setCreating(true); }} className="pixel-button w-full py-2" data-variant="primary">
          + Create Test
        </button>
      )}
    </div>
  );
}

const formatWhen = (timestamp) => new Date(timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

function TestDetail({ test, onAdd, onUpdate, onDelete }) {
  const [mode, setMode] = useState('graph');
  const [img, setImg] = useState(null);
  const [offset, setOffset] = useState(0);
  const [editing, setEditing] = useState(-1);

  const showGraph = () => { setMode('graph'); setImg(null); setEditing(-1); setOffset(0); };

  const choose = ([file]) => {
    if (!file) return;
    const image = new Image();
    image.onload = () => { setImg(image); setMode('photo'); };
    image.src = URL.createObjectURL(file);
  };

  const edit = (index) => { setEditing(index); setMode('edit'); };

  if (mode === 'photo' && img) {
    return (
      <PhotoReader
        img={img}
        onCancel={showGraph}
        onSave={(score) => { onAdd({ score, timestamp: new Date().toISOString() }); showGraph(); }}
      />
    );
  }

  const entry = test.data[editing];
  const rows = test.data.map((e, index) => ({ ...e, index })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <div className="flex flex-col gap-4">
      {mode === 'upload' && (
        <FileDrop accept="image/*" onFiles={choose} className="py-10">
          <Icon svg={imageIcon} className="w-8 h-8" />
          <span>Upload Photo</span>
        </FileDrop>
      )}

      <section className="pixel-panel p-3 flex flex-col gap-3" aria-label="Graph">
        <div className="flex items-center justify-between gap-2">
          <button type="button" onClick={() => setOffset((o) => o + PAGE_DAYS)} className="pixel-button flex items-center gap-1">
            <Icon svg={chevronLeftIcon} className="w-4 h-4" />{PAGE_DAYS} days
          </button>
          <span className="label text-center">{formatRange(graphWindow(new Date(), offset))}</span>
          <button type="button" disabled={offset === 0} onClick={() => setOffset((o) => Math.max(0, o - PAGE_DAYS))} className="pixel-button flex items-center gap-1">
            {PAGE_DAYS} days<Icon svg={chevronRightIcon} className="w-4 h-4" />
          </button>
        </div>
        <Graph entries={test.data} offset={offset} onPick={edit} />
      </section>

      {mode === 'graph' && (
        <>
          <button type="button" onClick={() => setMode('upload')} className="pixel-button w-full py-2" data-variant="primary">+ New Test</button>
          <button type="button" onClick={() => setMode('manual')} className="pixel-button w-full py-2">Manual Entry</button>
        </>
      )}

      {mode === 'manual' && (
        <EntryForm
          title="Manual Entry"
          initial={{ score: '0.5', date: toLocalInputValue(new Date()) }}
          onCancel={() => setMode('graph')}
          onSave={(input) => { onAdd({ ...input, manual: true }); setMode('graph'); }}
        />
      )}

      {mode === 'edit' && entry && (
        <EntryForm
          key={editing}
          title="Edit Test Result"
          initial={{ score: entry.score.toFixed(2), date: toLocalInputValue(entry.timestamp) }}
          onCancel={() => { setEditing(-1); setMode('graph'); }}
          onSave={(input) => { onUpdate(editing, input); setEditing(-1); setMode('graph'); }}
          onDelete={() => {
            if (!confirm('Delete this test result?')) return;
            onDelete(editing);
            setEditing(-1);
            setMode('graph');
          }}
        />
      )}

      {rows.length > 0 && (
        <section aria-label="Results">
          <SectionLabel className="mb-2">Results</SectionLabel>
          <table className="pixel-table">
            <tbody>
              {rows.map((row) => (
                <tr key={row.index}>
                  <td className="label">{formatWhen(row.timestamp)}{row.manual && <span className="opacity-60"> · manual</span>}</td>
                  <td className="pixel-num text-right text-heading">{row.score.toFixed(2)}</td>
                  <td className="text-right w-0">
                    <button type="button" onClick={() => edit(row.index)} className="pixel-button" aria-label={`Edit result ${row.score.toFixed(2)}`}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export function App() {
  const [data, setData] = useState(() => loadData());
  const [currentId, setCurrentId] = useState(null);
  const test = currentId && findTest(data, currentId);

  const change = (next) => { setData(next); saveData(next); };

  return (
    <div className="text-text">
      {test ? (
        <>
          <button type="button" onClick={() => setCurrentId(null)} className="label block hover:text-accent cursor-pointer mt-2">← Back to Tests</button>
          <h1 className="page-title mt-2 mb-6 break-words">{test.name}</h1>
          <TestDetail
            key={test.id}
            test={test}
            onAdd={(entry) => change(addEntry(data, test.id, entry))}
            onUpdate={(index, patch) => change(updateEntry(data, test.id, index, patch))}
            onDelete={(index) => change(deleteEntry(data, test.id, index))}
          />
        </>
      ) : (
        <>
          <h1 className="page-title mt-4 mb-2">{TITLE}</h1>
          <p className="page-sub mt-0 mb-8">Photograph a lateral flow test, read the test line against the control line, and track the ratio over time. Everything stays in this browser.</p>
          <TestList
            tests={data.tests}
            onOpen={setCurrentId}
            onCreate={(name) => {
              const { data: next, test: created } = createTest(data, name);
              change(next);
              setCurrentId(created.id);
            }}
          />
        </>
      )}
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
