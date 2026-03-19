import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';
import ALGORITHMS from './algorithms/index.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startSort(algoKey, items) {
  const gen = ALGORITHMS[algoKey].fn(items);
  const first = gen.next();
  if (first.done)
    return { gen, done: true, sorted: first.value, comparison: null, completed: 0 };
  return { gen, done: false, sorted: null, comparison: first.value, completed: 0 };
}

// ——— AlgoInfo component ———

const RATING_STYLE = {
  great: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  ok:    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
  poor:  'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
};
const RATING_ICON = { great: '✓', ok: '~', poor: '✗' };

const AlgoInfo = ({ algoKey, n }) => {
  const algo = ALGORITHMS[algoKey];
  const est = algo.estimates;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-5">
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
        {algo.description}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
        <span className="text-gray-500 dark:text-gray-400">
          <span className="text-gray-400 dark:text-gray-500">Best </span>
          <span className="font-mono font-semibold text-gray-800 dark:text-gray-100">{est.best(n)}</span>
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          <span className="text-gray-400 dark:text-gray-500">Avg </span>
          <span className="font-mono font-semibold text-gray-800 dark:text-gray-100">~{est.avg(n)}</span>
        </span>
        <span className="text-gray-500 dark:text-gray-400">
          <span className="text-gray-400 dark:text-gray-500">Worst </span>
          <span className="font-mono font-semibold text-gray-800 dark:text-gray-100">{est.worst(n)}</span>
        </span>
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <span className={algo.stable ? 'text-xs text-emerald-600 dark:text-emerald-400' : 'text-xs text-gray-400 dark:text-gray-500'}>
          {algo.stable ? '= stable' : '≠ unstable'}
        </span>
        <span className="text-gray-300 dark:text-gray-600">·</span>
        <span className={algo.noRepeatPairs ? 'text-xs text-blue-600 dark:text-blue-400' : 'text-xs text-gray-400 dark:text-gray-500'}>
          {algo.noRepeatPairs ? '✓ no repeated pairs' : '↻ may repeat pairs'}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {algo.scenarios.map(s => (
          <span
            key={s.label}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${RATING_STYLE[s.rating]}`}
            title={s.note}
          >
            <span className="opacity-60">{RATING_ICON[s.rating]}</span>
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
};

// ——— App ———

const DEFAULT_ITEMS = ['23', '7', '45', '12', '89', '34', '56', '1', '78', '90'];

const App = () => {
  const [algoKey, setAlgoKey] = useState('bubble');
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [sortState, setSortState] = useState(() => startSort('bubble', shuffle(DEFAULT_ITEMS)));
  const [topIsA, setTopIsA] = useState(true);
  const [showConfig, setShowConfig] = useState(false);
  const [configText, setConfigText] = useState(DEFAULT_ITEMS.join('\n'));
  const [dragOver, setDragOver] = useState(null);
  const dragSource = useRef(null);

  const algo = ALGORITHMS[algoKey];
  const totalExpected = algo.getTotal(items.length);

  const resetSort = (newAlgoKey, newItems) => {
    setSortState(startSort(newAlgoKey, shuffle(newItems)));
    setTopIsA(true);
  };

  const handleAlgoChange = key => {
    setAlgoKey(key);
    setSortState(startSort(key, shuffle(items)));
    setTopIsA(true);
  };

  const handleShuffle = () => resetSort(algoKey, items);

  // cmp: 1 = a > b (a on top is correct), -1 = a < b, 0 = equal
  const handleConfirm = cmp => {
    const { gen, comparison } = sortState;
    if (!comparison) return;
    const result = gen.next(cmp);
    if (result.done) {
      setSortState(prev => ({ ...prev, done: true, sorted: result.value, comparison: null, completed: prev.completed + 1 }));
    } else {
      setSortState(prev => ({ ...prev, comparison: result.value, completed: prev.completed + 1 }));
      setTopIsA(true);
    }
  };

  const handleSwap = () => setTopIsA(p => !p);

  const handleDragStart = (e, slot) => {
    dragSource.current = slot;
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, slot) => {
    e.preventDefault();
    if (slot !== dragSource.current) setDragOver(slot);
  };
  const handleDrop = (e, slot) => {
    e.preventDefault();
    if (dragSource.current !== null && slot !== dragSource.current) setTopIsA(p => !p);
    setDragOver(null);
    dragSource.current = null;
  };
  const handleDragEnd = () => {
    setDragOver(null);
    dragSource.current = null;
  };

  const handleSaveConfig = () => {
    const newItems = configText.split('\n').map(s => s.trim()).filter(Boolean);
    if (newItems.length < 2) return;
    setItems(newItems);
    setConfigText(newItems.join('\n'));
    resetSort(algoKey, newItems);
    setShowConfig(false);
  };

  const comp = sortState.comparison;
  const topItem = comp ? (topIsA ? comp.a : comp.b) : null;
  const bottomItem = comp ? (topIsA ? comp.b : comp.a) : null;
  const currentN = sortState.completed + 1;
  const progressPct = Math.min((sortState.completed / totalExpected) * 100, 100);
  const remaining = totalExpected - sortState.completed;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Back link */}
        <a
          href="../"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← Tools
        </a>

        {/* Title */}
        <h1 className="text-2xl font-bold mt-4 mb-1">Sorting Comparator</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Experience how different sorting algorithms feel when you're the one doing the comparisons.
        </p>

        {/* Controls */}
        <div className="flex gap-2 mb-4">
          <select
            value={algoKey}
            onChange={e => handleAlgoChange(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(ALGORITHMS).map(([key, a]) => (
              <option key={key} value={key}>
                {a.name} — {a.complexity} — ~{a.estimates.avg(items.length)} comps
              </option>
            ))}
          </select>
          <button
            onClick={handleShuffle}
            className="px-4 py-2 text-sm font-medium bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors whitespace-nowrap"
          >
            Shuffle
          </button>
          <button
            onClick={() => setShowConfig(true)}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            title="Configure items"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </button>
        </div>

        {/* Algorithm info panel */}
        <AlgoInfo algoKey={algoKey} n={items.length} />

        {/* Main content */}
        {!sortState.done ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

            {/* Progress header */}
            <div className="px-5 py-3.5 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Comparison {currentN}
                  {algo.exact ? ` of ${totalExpected}` : ` / ≤ ${totalExpected}`}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {algo.exact ? `${remaining} left` : `≤ ${remaining} left`}
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            {/* Comparison area */}
            <div className="p-5 space-y-2">
              <p className="text-xs text-center text-gray-400 dark:text-gray-500 mb-3">
                Arrange so the{' '}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">higher</span>
                {' '}item is on top — drag or swap
              </p>

              {/* Top slot */}
              <div
                className={`rounded-xl border-2 transition-all duration-150 ${
                  dragOver === 'top'
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent bg-gray-50 dark:bg-gray-700/50'
                }`}
                onDragOver={e => handleDragOver(e, 'top')}
                onDrop={e => handleDrop(e, 'top')}
              >
                <div className="px-4 pt-3 pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    ↑ Higher
                  </span>
                </div>
                <div
                  draggable
                  onDragStart={e => handleDragStart(e, 'top')}
                  onDragEnd={handleDragEnd}
                  className="px-4 pb-4 cursor-grab active:cursor-grabbing select-none"
                >
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 block">{topItem}</span>
                </div>
              </div>

              {/* Swap button */}
              <div className="flex justify-center py-0.5">
                <button
                  onClick={handleSwap}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 16V4m0 0L3 8m4-4l4 4"/>
                    <path d="M17 8v12m0 0l4-4m-4 4l-4-4"/>
                  </svg>
                  Swap
                </button>
              </div>

              {/* Bottom slot */}
              <div
                className={`rounded-xl border-2 transition-all duration-150 ${
                  dragOver === 'bottom'
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-transparent bg-gray-50 dark:bg-gray-700/50'
                }`}
                onDragOver={e => handleDragOver(e, 'bottom')}
                onDrop={e => handleDrop(e, 'bottom')}
              >
                <div className="px-4 pt-3 pb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                    ↓ Lower
                  </span>
                </div>
                <div
                  draggable
                  onDragStart={e => handleDragStart(e, 'bottom')}
                  onDragEnd={handleDragEnd}
                  className="px-4 pb-4 cursor-grab active:cursor-grabbing select-none"
                >
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 block">{bottomItem}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => handleConfirm(0)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 font-medium rounded-xl transition-colors text-sm"
                  title="These two items have equal value"
                >
                  = Equal
                </button>
                <button
                  onClick={() => handleConfirm(topIsA ? 1 : -1)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
                >
                  Confirm Order ✓
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Sorted result */
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">Sorting complete!</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {sortState.completed} comparison{sortState.completed !== 1 ? 's' : ''} · {algo.name}
                </p>
              </div>
              <button
                onClick={handleShuffle}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Try again
              </button>
            </div>
            <div className="p-5">
              <div className="space-y-1.5">
                {[...sortState.sorted].reverse().map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <span className="text-xs font-mono text-gray-400 dark:text-gray-500 w-6 text-right shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Config modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Configure Items</h2>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              One item per line. Minimum 2 items.
            </p>
            <textarea
              value={configText}
              onChange={e => setConfigText(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder={"Apple\nBanana\nCherry"}
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                disabled={configText.split('\n').filter(s => s.trim()).length < 2}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
