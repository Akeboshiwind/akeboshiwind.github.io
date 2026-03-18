import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

// ——— Sorting Generators ———
// Protocol: yield { a, b } → receive cmp (number):
//   cmp > 0  →  a is greater (a should come later in ascending order)
//   cmp = 0  →  equal
//   cmp < 0  →  a is smaller
// Returns the sorted array in ascending order.

function* bubbleSort(items) {
  const arr = [...items];
  for (let i = 0; i < arr.length - 1; i++) {
    let swapped = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      const cmp = yield { a: arr[j], b: arr[j + 1] };
      if (cmp > 0) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // Early exit: no swaps means sorted
  }
  return arr;
}

function* insertionSort(items) {
  const arr = [...items];
  for (let i = 1; i < arr.length; i++) {
    let j = i;
    while (j > 0) {
      const cmp = yield { a: arr[j - 1], b: arr[j] };
      if (cmp > 0) {
        [arr[j - 1], arr[j]] = [arr[j], arr[j - 1]];
        j--;
      } else {
        break; // Covers both equal (cmp=0) and less-than (cmp<0)
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
      const cmp = yield { a: arr[minIdx], b: arr[j] };
      if (cmp > 0) minIdx = j; // arr[minIdx] > arr[j] → new minimum found
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
        const cmp = yield { a: left[li], b: right[ri] };
        if (cmp > 0) {
          merged.push(right[ri++]); // left > right → take right (smaller)
        } else {
          merged.push(left[li++]); // cmp <= 0 → take left (stable: left wins on equal)
        }
      }
      while (li < left.length) merged.push(left[li++]);
      while (ri < right.length) merged.push(right[ri++]);
      for (let i = 0; i < merged.length; i++) arr[lo + i] = merged[i];
    }
  }
  return arr;
}

// 3-way quicksort (Dutch National Flag partition).
// Partitions into: [< pivot] [== pivot] [> pivot]
// All equal-to-pivot elements are placed in O(n) and need no further sorting.
function* quickSort(items) {
  const arr = [...items];
  function* qs(lo, hi) {
    if (hi - lo <= 1) return;
    // Random pivot → move to front
    const pivotIdx = lo + Math.floor(Math.random() * (hi - lo));
    [arr[lo], arr[pivotIdx]] = [arr[pivotIdx], arr[lo]];
    const pivotVal = arr[lo];
    // Invariant:
    //   arr[lo..lt-1]  < pivot  (less-than zone)
    //   arr[lt..i-1]  == pivot  (equal zone, starts with just the pivot at lt=lo)
    //   arr[i..gt-1]  = unclassified
    //   arr[gt..hi-1] > pivot  (greater-than zone)
    let lt = lo, gt = hi, i = lo + 1;
    while (i < gt) {
      const cmp = yield { a: arr[i], b: pivotVal };
      if (cmp < 0) {
        [arr[i], arr[lt]] = [arr[lt], arr[i]];
        lt++; i++;
      } else if (cmp > 0) {
        gt--;
        [arr[i], arr[gt]] = [arr[gt], arr[i]];
        // Don't advance i — the swapped-in element needs classification
      } else {
        i++; // Equal to pivot: absorb into the equal zone
      }
    }
    yield* qs(lo, lt);  // Sort the less-than partition
    yield* qs(gt, hi);  // Sort the greater-than partition
    // [lt, gt) are all == pivot — already in final position, no recursion needed
  }
  yield* qs(0, arr.length);
  return arr;
}

// ——— Helpers ———

// Maximum comparisons for bottom-up merge sort on n elements
function mergeUpperBound(n) {
  let count = 0;
  for (let w = 1; w < n; w *= 2)
    for (let lo = 0; lo < n; lo += 2 * w) {
      const mid = Math.min(lo + w, n);
      const hi = Math.min(lo + 2 * w, n);
      const r = hi - mid;
      if (r > 0) count += (mid - lo) + r - 1;
    }
  return count;
}

// Minimum comparisons for bottom-up merge sort on n elements
// (when each merge exhausts the shorter half first)
function mergeBestCase(n) {
  let count = 0;
  for (let w = 1; w < n; w *= 2)
    for (let lo = 0; lo < n; lo += 2 * w) {
      const mid = Math.min(lo + w, n);
      const hi = Math.min(lo + 2 * w, n);
      const l = mid - lo, r = hi - mid;
      if (r > 0) count += Math.min(l, r);
    }
  return count;
}

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

// ——— Algorithm metadata ———

const ALGORITHMS = {
  bubble: {
    name: 'Bubble Sort',
    fn: bubbleSort,
    complexity: 'O(n²)',
    getTotal: n => n * (n - 1) / 2,
    exact: false,
    stable: true,
    description:
      'Repeatedly scans and swaps adjacent out-of-order pairs. The early exit makes it O(n) on already-sorted data, but it\'s painfully slow on random or reverse-sorted inputs.',
    estimates: {
      best:  n => Math.max(0, n - 1),
      avg:   n => Math.round(n * (n - 1) / 4),
      worst: n => n * (n - 1) / 2,
      bestLabel:  'already sorted',
      worstLabel: 'reverse sorted',
    },
    scenarios: [
      { label: 'Nearly sorted',   rating: 'great', note: 'Early exit kicks in — just a few passes' },
      { label: 'Random data',     rating: 'poor',  note: 'Full n² comparisons in practice' },
      { label: 'Reverse sorted',  rating: 'poor',  note: 'Maximum work — every pair must bubble up' },
      { label: 'Many duplicates', rating: 'ok',    note: 'Stable — equal elements never swap' },
    ],
  },

  insertion: {
    name: 'Insertion Sort',
    fn: insertionSort,
    complexity: 'O(n²)',
    getTotal: n => n * (n - 1) / 2,
    exact: false,
    stable: true,
    description:
      'Builds a sorted section one element at a time, inserting each into its correct position. The best O(n²) algorithm for nearly-sorted data — and it stops immediately on equal elements.',
    estimates: {
      best:  n => Math.max(0, n - 1),
      avg:   n => Math.round(n * (n - 1) / 4),
      worst: n => n * (n - 1) / 2,
      bestLabel:  'already sorted',
      worstLabel: 'reverse sorted',
    },
    scenarios: [
      { label: 'Nearly sorted',   rating: 'great', note: 'Only 1–2 comparisons per element' },
      { label: 'Random data',     rating: 'poor',  note: '~n²/4 comparisons on average' },
      { label: 'Reverse sorted',  rating: 'poor',  note: 'Each element must shift all the way left' },
      { label: 'Many duplicates', rating: 'great', note: 'Stable and breaks on equal — very efficient' },
    ],
  },

  selection: {
    name: 'Selection Sort',
    fn: selectionSort,
    complexity: 'O(n²)',
    getTotal: n => n * (n - 1) / 2,
    exact: true, // Always exactly n(n-1)/2 comparisons
    stable: false,
    description:
      'Repeatedly finds the minimum of the unsorted portion and moves it into place. Makes exactly n(n−1)/2 comparisons every single time — no shortcuts, no early exit, no sensitivity to input.',
    estimates: {
      best:  n => n * (n - 1) / 2,
      avg:   n => n * (n - 1) / 2,
      worst: n => n * (n - 1) / 2,
      bestLabel:  'always the same',
      worstLabel: 'always the same',
    },
    scenarios: [
      { label: 'Nearly sorted',   rating: 'poor', note: 'No benefit — always full n² comparisons' },
      { label: 'Random data',     rating: 'ok',   note: 'Predictable but quadratic' },
      { label: 'Reverse sorted',  rating: 'ok',   note: 'Same work as any other input' },
      { label: 'Many duplicates', rating: 'ok',   note: 'Not stable, but comparison count unchanged' },
    ],
  },

  merge: {
    name: 'Merge Sort',
    fn: mergeSort,
    complexity: 'O(n log n)',
    getTotal: n => mergeUpperBound(n),
    exact: false,
    stable: true,
    description:
      'Splits in half, sorts each half, merges the results. Guaranteed O(n log n) in all cases — there are no bad inputs. The standard for reliable, stable sorting of large datasets.',
    estimates: {
      best:  n => mergeBestCase(n),
      avg:   n => Math.max(0, Math.round(n * Math.log2(Math.max(n, 1)) - n + 1)),
      worst: n => mergeUpperBound(n),
      bestLabel:  'one side exhausted first in each merge',
      worstLabel: 'each merge compares every element',
    },
    scenarios: [
      { label: 'Nearly sorted',   rating: 'ok',    note: 'Still performs all merges — no shortcut' },
      { label: 'Random data',     rating: 'great', note: 'Optimal O(n log n) guaranteed' },
      { label: 'Reverse sorted',  rating: 'great', note: 'Same as random — no worst case' },
      { label: 'Many duplicates', rating: 'great', note: 'Stable — equal elements maintain original order' },
    ],
  },

  quick: {
    name: 'Quicksort (3-way)',
    fn: quickSort,
    complexity: 'O(n log n) avg',
    getTotal: n => n * (n - 1) / 2,
    exact: false,
    stable: false,
    description:
      'Picks a random pivot and partitions elements into three groups: smaller, equal, and larger. The equal group is placed in one pass and never touched again — making it excellent with duplicates.',
    estimates: {
      best:  n => Math.max(0, Math.round(n * Math.log2(Math.max(n, 1)))),
      avg:   n => Math.max(0, Math.round(1.39 * n * Math.log2(Math.max(n, 1)))),
      worst: n => n * (n - 1) / 2,
      bestLabel:  'perfectly balanced partitions',
      worstLabel: 'always picks worst pivot',
    },
    scenarios: [
      { label: 'Nearly sorted',   rating: 'ok',    note: 'Random pivot prevents sorted-input worst case' },
      { label: 'Random data',     rating: 'great', note: 'Best practical performance in most benchmarks' },
      { label: 'Reverse sorted',  rating: 'ok',    note: 'Random pivot avoids O(n²) degenerate behavior' },
      { label: 'Many duplicates', rating: 'great', note: '3-way partition: all duplicates placed in O(n)' },
    ],
  },
};

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
