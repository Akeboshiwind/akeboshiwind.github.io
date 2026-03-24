import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { computeDiff } from './diff.js';
import './app.css';

const STORAGE_KEY = 'diff-comparison';

const SAMPLE_LEFT = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

greet("world");`;

const SAMPLE_RIGHT = `function greet(name, greeting) {
  const message = greeting + ", " + name + "!";
  console.log(message);
  return message;
}

greet("world", "Hi");`;

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

function CombinedView({ edits }) {
  if (edits.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 p-4 italic">No differences.</p>;
  }

  let oldNum = 0;
  let newNum = 0;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto">
      {edits.map((edit, i) => {
        let leftGutter = '';
        let rightGutter = '';
        let prefix = ' ';
        let lineClass = 'diff-line-equal';

        if (edit.type === 'equal') {
          oldNum++;
          newNum++;
          leftGutter = oldNum;
          rightGutter = newNum;
        } else if (edit.type === 'delete') {
          oldNum++;
          leftGutter = oldNum;
          prefix = '-';
          lineClass = 'diff-line-delete';
        } else {
          newNum++;
          rightGutter = newNum;
          prefix = '+';
          lineClass = 'diff-line-insert';
        }

        return (
          <div key={i} className={`flex ${lineClass}`}>
            <div className="diff-gutter border-r border-gray-200 dark:border-gray-700">{leftGutter}</div>
            <div className="diff-gutter border-r border-gray-200 dark:border-gray-700">{rightGutter}</div>
            <div className="diff-content">
              <span className="diff-prefix">{prefix}</span>
              {edit.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SideBySideView({ edits }) {
  if (edits.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400 p-4 italic">No differences.</p>;
  }

  // Build paired rows: each row has a left and/or right side
  const rows = [];
  let i = 0;
  while (i < edits.length) {
    if (edits[i].type === 'equal') {
      rows.push({ left: edits[i], right: edits[i] });
      i++;
    } else {
      // Collect consecutive deletes and inserts
      const deletes = [];
      const inserts = [];
      while (i < edits.length && edits[i].type === 'delete') {
        deletes.push(edits[i]);
        i++;
      }
      while (i < edits.length && edits[i].type === 'insert') {
        inserts.push(edits[i]);
        i++;
      }
      const maxLen = Math.max(deletes.length, inserts.length);
      for (let j = 0; j < maxLen; j++) {
        rows.push({
          left: j < deletes.length ? deletes[j] : null,
          right: j < inserts.length ? inserts[j] : null,
        });
      }
    }
  }

  let oldNum = 0;
  let newNum = 0;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-auto">
      {rows.map((row, i) => {
        let leftGutter = '';
        let rightGutter = '';
        let leftClass = 'diff-line-equal';
        let rightClass = 'diff-line-equal';
        let leftValue = '';
        let rightValue = '';

        if (row.left) {
          if (row.left.type === 'equal') {
            oldNum++;
            leftGutter = oldNum;
            leftValue = row.left.value;
          } else if (row.left.type === 'delete') {
            oldNum++;
            leftGutter = oldNum;
            leftClass = 'diff-line-delete';
            leftValue = row.left.value;
          }
        }

        if (row.right) {
          if (row.right.type === 'equal') {
            newNum++;
            rightGutter = newNum;
            rightValue = row.right.value;
          } else if (row.right.type === 'insert') {
            newNum++;
            rightGutter = newNum;
            rightClass = 'diff-line-insert';
            rightValue = row.right.value;
          }
        }

        return (
          <div key={i} className="flex">
            <div className={`flex flex-1 min-w-0 ${leftClass}`}>
              <div className="diff-gutter border-r border-gray-200 dark:border-gray-700">{leftGutter}</div>
              <div className="diff-content truncate">{leftValue}</div>
            </div>
            <div className="w-px bg-gray-300 dark:bg-gray-600 shrink-0" />
            <div className={`flex flex-1 min-w-0 ${rightClass}`}>
              <div className="diff-gutter border-r border-gray-200 dark:border-gray-700">{rightGutter}</div>
              <div className="diff-content truncate">{rightValue}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function App() {
  const saved = loadState();
  const [left, setLeft] = useState(saved?.left ?? SAMPLE_LEFT);
  const [right, setRight] = useState(saved?.right ?? SAMPLE_RIGHT);
  const [viewMode, setViewMode] = useState(saved?.viewMode ?? 'combined');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ left, right, viewMode }));
  }, [left, right, viewMode]);

  const edits = useMemo(() => computeDiff(left, right), [left, right]);

  const stats = useMemo(() => {
    let added = 0, removed = 0;
    for (const e of edits) {
      if (e.type === 'insert') added++;
      if (e.type === 'delete') removed++;
    }
    return { added, removed };
  }, [edits]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <a
        href="../"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
      >
        ← Home
      </a>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 mt-2">Diff Comparison</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Original</label>
          <textarea
            className="w-full h-48 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            placeholder="Paste original text here..."
            spellCheck={false}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Modified</label>
          <textarea
            className="w-full h-48 p-3 font-mono text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            value={right}
            onChange={(e) => setRight(e.target.value)}
            placeholder="Paste modified text here..."
            spellCheck={false}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-0.5">
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'combined'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            onClick={() => setViewMode('combined')}
          >
            Combined
          </button>
          <button
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
            onClick={() => setViewMode('side-by-side')}
          >
            Side by Side
          </button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {stats.added > 0 && <span className="text-green-600 dark:text-green-400 mr-2">+{stats.added}</span>}
          {stats.removed > 0 && <span className="text-red-600 dark:text-red-400">-{stats.removed}</span>}
          {stats.added === 0 && stats.removed === 0 && <span>No changes</span>}
        </div>
      </div>

      {viewMode === 'combined' ? (
        <CombinedView edits={edits} />
      ) : (
        <SideBySideView edits={edits} />
      )}
    </div>
  );
}

createRoot(document.getElementById('app')).render(<App />);
