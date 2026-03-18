import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

// ——— Sorting Algorithm Generators ———
// Each generator yields { a, b } pairs and receives a boolean (true = a > b).
// Returns the sorted array in ascending order.

function* bubbleSort(items) {
  const arr = [...items];
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      const aIsGreater = yield { a: arr[j], b: arr[j + 1] };
      if (aIsGreater) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
  return arr;
}

function* insertionSort(items) {
  const arr = [...items];
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0) {
      const prevIsGreater = yield { a: arr[j - 1], b: arr[j] };
      if (prevIsGreater) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        j--;
      } else {
        break;
      }
    }
  }
  return arr;
}

function* selectionSort(items) {
  const arr = [...items];
  for (let i = 0; i < arr.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      const currentIsGreater = yield { a: arr[minIdx], b: arr[j] };
      if (currentIsGreater) minIdx = j;
    }
    if (minIdx !== i) [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}

function* mergeSort(items) {
  const arr = [...items];
  const n = arr.length;
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      const left = arr.slice(lo, mid);
      const right = arr.slice(mid, hi);
      if (right.length === 0) continue;
      let li = 0, ri = 0;
      const merged = [];
      while (li < left.length && ri < right.length) {
        const leftIsGreater = yield { a: left[li], b: right[ri] };
        if (leftIsGreater) {
          merged.push(right[ri++]);
        } else {
          merged.push(left[li++]);
        }
      }
      while (li < left.length) merged.push(left[li++]);
      while (ri < right.length) merged.push(right[ri++]);
      for (let i = 0; i < merged.length; i++) arr[lo + i] = merged[i];
    }
  }
  return arr;
}

function* quickSort(items) {
  const arr = [...items];
  function* qs(lo, hi) {
    if (hi - lo <= 1) return;
    // Random pivot for better average-case behavior
    const pivotIdx = lo + Math.floor(Math.random() * (hi - lo));
    [arr[pivotIdx], arr[hi - 1]] = [arr[hi - 1], arr[pivotIdx]];
    const pivotVal = arr[hi - 1];
    let store = lo;
    for (let i = lo; i < hi - 1; i++) {
      const isGreater = yield { a: arr[i], b: pivotVal };
      if (!isGreater) {
        [arr[i], arr[store]] = [arr[store], arr[i]];
        store++;
      }
    }
    [arr[store], arr[hi - 1]] = [arr[hi - 1], arr[store]];
    yield* qs(lo, store);
    yield* qs(store + 1, hi);
  }
  yield* qs(0, arr.length);
  return arr;
}

// Compute upper-bound comparison count for bottom-up merge sort
function mergeUpperBound(n) {
  let count = 0;
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      const rightSize = hi - mid;
      if (rightSize > 0) count += (mid - lo) + rightSize - 1;
    }
  }
  return count;
}

const ALGORITHMS = {
  bubble:    { name: 'Bubble Sort',    fn: bubbleSort,    complexity: 'O(n²)',           getTotal: n => n * (n - 1) / 2,  exact: true  },
  insertion: { name: 'Insertion Sort', fn: insertionSort, complexity: 'O(n²)',           getTotal: n => n * (n - 1) / 2,  exact: false },
  selection: { name: 'Selection Sort', fn: selectionSort, complexity: 'O(n²)',           getTotal: n => n * (n - 1) / 2,  exact: true  },
  merge:     { name: 'Merge Sort',     fn: mergeSort,     complexity: 'O(n log n)',      getTotal: n => mergeUpperBound(n), exact: false },
  quick:     { name: 'Quicksort',      fn: quickSort,     complexity: 'O(n log n) avg',  getTotal: n => n * (n - 1) / 2,  exact: false },
};

const DEFAULT_ITEMS = ['23', '7', '45', '12', '89', '34', '56', '1', '78', '90'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startSort(algorithmKey, items) {
  const gen = ALGORITHMS[algorithmKey].fn(items);
  const first = gen.next();
  if (first.done) {
    return { gen, done: true, sorted: first.value, comparison: null, completed: 0 };
  }
  return { gen, done: false, sorted: null, comparison: first.value, completed: 0 };
}

// ——— App ———

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

  const handleConfirm = () => {
    const { gen, comparison } = sortState;
    if (!comparison) return;
    const result = gen.next(topIsA); // topIsA = true means a is on top = a > b
    if (result.done) {
      setSortState(prev => ({ ...prev, done: true, sorted: result.value, comparison: null, completed: prev.completed + 1 }));
    } else {
      setSortState(prev => ({ ...prev, comparison: result.value, completed: prev.completed + 1 }));
      setTopIsA(true);
    }
  };

  const handleSwap = () => setTopIsA(p => !p);

  // Drag-and-drop for swapping the two items
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
    if (dragSource.current !== null && slot !== dragSource.current) {
      setTopIsA(p => !p);
    }
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
        <div className="flex gap-2 mb-6">
          <select
            value={algoKey}
            onChange={e => handleAlgoChange(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(ALGORITHMS).map(([key, a]) => (
              <option key={key} value={key}>{a.name} — {a.complexity}</option>
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
                Arrange so the <span className="font-semibold text-emerald-600 dark:text-emerald-400">higher</span> item is on top — drag or use swap
              </p>

              {/* Top slot — Higher */}
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
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 block">
                    {topItem}
                  </span>
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

              {/* Bottom slot — Lower */}
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
                  <span className="text-3xl font-bold text-gray-900 dark:text-gray-100 block">
                    {bottomItem}
                  </span>
                </div>
              </div>

              {/* Confirm button */}
              <div className="pt-2">
                <button
                  onClick={handleConfirm}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-colors text-sm shadow-sm"
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
