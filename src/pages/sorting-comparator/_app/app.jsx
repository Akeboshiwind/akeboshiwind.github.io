import React, { useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import ALGORITHMS from './algorithms/index.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function replaySort(algoKey, shuffledItems, history) {
  const gen = ALGORITHMS[algoKey].fn(shuffledItems);
  let result = gen.next();
  for (const cmp of history) {
    if (result.done) break;
    result = gen.next(cmp);
  }
  return { gen, result };
}

// ——— Screen 1: Algorithm Selection ———

const RATING_STYLE = {
  great: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
  ok:    'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800',
  poor:  'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
};
const RATING_ICON = { great: '✓', ok: '~', poor: '✗' };

const AlgoRow = ({ algoKey, algo, n, expanded, onToggle, onStart }) => {
  const est = algo.estimates;
  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        onClick={onToggle}
      >
        <button
          onClick={e => { e.stopPropagation(); onStart(algoKey); }}
          className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded-lg transition-colors"
        >
          Sort
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{algo.name}</span>
            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{algo.complexity}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            <span>~{est.avg(n)} comps</span>
            <span>{algo.stable ? 'stable' : 'unstable'}</span>
            <span className={algo.noRepeatPairs ? 'text-blue-600 dark:text-blue-400' : ''}>
              {algo.noRepeatPairs ? 'no repeats' : 'may repeat'}
            </span>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {expanded && (
        <div className="px-4 pb-4 pt-1">
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
            {algo.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs mb-3">
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
            <span className={algo.noRepeatPairs ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}>
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
      )}
    </div>
  );
};

const SelectScreen = ({ items, configText, onConfigTextChange, onStart }) => {
  const [expandedAlgo, setExpandedAlgo] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const n = items.length;

  const handleSaveConfig = () => {
    const newItems = configText.split('\n').map(s => s.trim()).filter(Boolean);
    if (newItems.length < 2) return;
    onConfigTextChange(newItems.join('\n'));
    setShowConfig(false);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mt-4 mb-1">Sorting Comparator</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
        Sort any list by comparing items yourself. See how different algorithms feel when a human drives them.
      </p>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-6">
        Great for prioritising todos, ranking preferences, or just seeing how sorting algorithms actually work.
      </p>

      {/* Item config */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {n} items to sort
        </span>
        <button
          onClick={() => setShowConfig(true)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          Edit items
        </button>
      </div>

      {/* Algorithm table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-4">
        <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Choose an algorithm
          </span>
        </div>
        {Object.entries(ALGORITHMS).map(([key, algo]) => (
          <AlgoRow
            key={key}
            algoKey={key}
            algo={algo}
            n={n}
            expanded={expandedAlgo === key}
            onToggle={() => setExpandedAlgo(expandedAlgo === key ? null : key)}
            onStart={onStart}
          />
        ))}
      </div>

      {/* Config modal */}
      {showConfig && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Edit Items</h2>
              <button
                onClick={() => setShowConfig(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              One item per line. Minimum 2 items.
            </p>
            <textarea
              value={configText}
              onChange={e => onConfigTextChange(e.target.value)}
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
    </>
  );
};

// ——— Progress: build known ordering from comparison history ———

function buildKnownOrder(shuffledItems, algoKey, history) {
  // Replay the sort to get each comparison pair and its result
  const pairs = [];
  const gen = ALGORITHMS[algoKey].fn(shuffledItems);
  let result = gen.next();
  for (let i = 0; i < history.length; i++) {
    if (result.done) break;
    pairs.push({ a: result.value.a, b: result.value.b, cmp: history[i] });
    result = gen.next(history[i]);
  }

  // Build a directed graph: edge from winner to loser (winner ranks first)
  const items = [...new Set(shuffledItems)];
  const adj = new Map(); // item -> Set of items it beats
  for (const item of items) adj.set(item, new Set());

  for (const { a, b, cmp } of pairs) {
    if (cmp > 0) adj.get(a).add(b);       // a ranks first (beats b)
    else if (cmp < 0) adj.get(b).add(a);   // b ranks first (beats a)
    // cmp === 0: no ordering edge
  }

  // Compute transitive closure for reachability (to know "settled" items)
  const reachable = new Map();
  for (const item of items) {
    const visited = new Set();
    const stack = [item];
    while (stack.length) {
      const cur = stack.pop();
      for (const next of adj.get(cur) || []) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
    reachable.set(item, visited);
  }

  // Topological sort (Kahn's algorithm) for display order
  const inDegree = new Map();
  for (const item of items) inDegree.set(item, 0);
  for (const [, beats] of adj) {
    for (const loser of beats) {
      inDegree.set(loser, (inDegree.get(loser) || 0) + 1);
    }
  }
  const queue = items.filter(item => inDegree.get(item) === 0);
  const sorted = [];
  while (queue.length) {
    queue.sort(); // stable tie-breaking
    const item = queue.shift();
    sorted.push(item);
    for (const loser of adj.get(item) || []) {
      inDegree.set(loser, inDegree.get(loser) - 1);
      if (inDegree.get(loser) === 0) queue.push(loser);
    }
  }

  // An item is "settled" if we know its relationship with all other items
  const settled = new Set();
  for (const item of items) {
    const beats = reachable.get(item);
    let knownCount = beats.size;
    // Also count items that beat this one
    for (const other of items) {
      if (other !== item && reachable.get(other).has(item)) knownCount++;
    }
    if (knownCount >= items.length - 1) settled.add(item);
  }

  return { sorted, settled };
}

// ——— Screen 2: Sorting ———

const SortingScreen = ({ algoKey, shuffledItems, onBack, onComplete }) => {
  const algo = ALGORITHMS[algoKey];
  const [history, setHistory] = useState([]);
  const [showProgress, setShowProgress] = useState(false);

  const comparison = useMemo(() => {
    const { result } = replaySort(algoKey, shuffledItems, history);
    return result.done ? null : result.value;
  }, [algoKey, shuffledItems, history]);

  const knownOrder = useMemo(() => {
    if (!showProgress || history.length === 0) return null;
    return buildKnownOrder(shuffledItems, algoKey, history);
  }, [showProgress, shuffledItems, algoKey, history]);

  const completed = history.length;
  const totalExpected = algo.getTotal(shuffledItems.length);
  const progressPct = Math.min((completed / totalExpected) * 100, 100);
  const remaining = totalExpected - completed;

  const handleChoice = useCallback((cmp) => {
    const newHistory = [...history, cmp];
    // Check if this completes the sort
    const { result: newResult } = replaySort(algoKey, shuffledItems, newHistory);
    if (newResult.done) {
      onComplete(newResult.value, newHistory.length);
    } else {
      setHistory(newHistory);
    }
  }, [history, algoKey, shuffledItems, onComplete]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    setHistory(prev => prev.slice(0, -1));
  }, [history.length]);

  const handleBack = () => {
    if (history.length > 0 && !confirm('Abandon current sort?')) return;
    onBack();
  };

  if (!comparison) return null;

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mt-4 mb-5">
        <button
          onClick={handleBack}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← Back
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{algo.name}</h2>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Comparison {completed + 1}
            {algo.exact ? ` of ${totalExpected}` : ` / ≤ ${totalExpected}`}
          </span>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button
                onClick={handleUndo}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                Undo
              </button>
            )}
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {algo.exact ? `${remaining} left` : `≤ ${remaining} left`}
            </span>
          </div>
        </div>
        <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Comparison area */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="p-5">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-5">
            Which should rank first?
          </p>

          {/* Item A - tap to choose */}
          <button
            onClick={() => handleChoice(1)}
            className="w-full text-left px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 border-2 border-transparent transition-all duration-150 group cursor-pointer"
          >
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              {comparison.a}
            </span>
          </button>

          {/* Equal button */}
          <div className="flex justify-center py-2">
            <button
              onClick={() => handleChoice(0)}
              className="px-4 py-1.5 text-sm font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              = Equal
            </button>
          </div>

          {/* Item B - tap to choose */}
          <button
            onClick={() => handleChoice(-1)}
            className="w-full text-left px-5 py-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700 border-2 border-transparent transition-all duration-150 group cursor-pointer"
          >
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
              {comparison.b}
            </span>
          </button>
        </div>
      </div>

      {/* Progress view toggle */}
      <div className="mt-4">
        <button
          onClick={() => setShowProgress(p => !p)}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          {showProgress ? 'Hide progress' : 'Show progress'}
        </button>
        {showProgress && knownOrder && (
          <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
            <div className="space-y-1">
              {knownOrder.sorted.map((item, idx) => {
                const isActive = comparison && (item === comparison.a || item === comparison.b);
                const isSettled = knownOrder.settled.has(item);
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium'
                        : isSettled
                          ? 'text-gray-900 dark:text-gray-100'
                          : 'text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    <span className="text-xs font-mono w-5 text-right shrink-0 opacity-50">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                    {isActive && (
                      <span className="text-xs opacity-50 ml-auto">comparing</span>
                    )}
                    {isSettled && !isActive && (
                      <span className="text-xs text-emerald-500 dark:text-emerald-400 ml-auto opacity-60">✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// ——— Screen 3: Results ———

const ResultsScreen = ({ algoKey, sorted, comparisons, onTryAnother, onSortAgain }) => {
  const algo = ALGORITHMS[algoKey];

  return (
    <>
      <div className="mt-4 mb-5">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Done!</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {comparisons} comparison{comparisons !== 1 ? 's' : ''} with {algo.name}
        </p>
      </div>

      {/* Sorted list */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden mb-5">
        <div className="p-5">
          <div className="space-y-1.5">
            {[...sorted].reverse().map((item, idx) => (
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

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onTryAnother}
          className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Try another algorithm
        </button>
        <button
          onClick={onSortAgain}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          Sort again
        </button>
      </div>
    </>
  );
};

// ——— App ———

const DEFAULT_ITEMS = ['23', '7', '45', '12', '89', '34', '56', '1', '78', '90'];

const App = ({ historyUrl }) => {
  const [screen, setScreen] = useState('select'); // 'select' | 'sorting' | 'results'
  const [items, setItems] = useState(DEFAULT_ITEMS);
  const [configText, setConfigText] = useState(DEFAULT_ITEMS.join('\n'));
  const [algoKey, setAlgoKey] = useState(null);
  const [shuffledItems, setShuffledItems] = useState(null);
  const [sortResult, setSortResult] = useState(null); // { sorted, comparisons }

  const handleConfigTextChange = (text) => {
    setConfigText(text);
    // If it's already a clean list (from Save), update items
    const newItems = text.split('\n').map(s => s.trim()).filter(Boolean);
    if (newItems.length >= 2) {
      setItems(newItems);
    }
  };

  const handleStart = (key) => {
    const currentItems = configText.split('\n').map(s => s.trim()).filter(Boolean);
    if (currentItems.length >= 2) {
      setItems(currentItems);
    }
    setAlgoKey(key);
    setShuffledItems(shuffle(currentItems.length >= 2 ? currentItems : items));
    setScreen('sorting');
  };

  const handleComplete = (sorted, comparisons) => {
    setSortResult({ sorted, comparisons });
    setScreen('results');
  };

  const handleTryAnother = () => {
    // Back to select, keeping same items
    setScreen('select');
  };

  const handleSortAgain = () => {
    // Reshuffle and restart same algorithm
    setShuffledItems(shuffle(items));
    setSortResult(null);
    setScreen('sorting');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Back link */}
        {screen === 'select' && (
          <nav className="flex items-center gap-3 text-sm text-gray-400">
            <a
              href="../"
              className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              ← Home
            </a>
            {historyUrl && (
              <a
                href={historyUrl}
                target="_blank"
                rel="noopener"
                className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                history
              </a>
            )}
          </nav>
        )}

        {screen === 'select' && (
          <SelectScreen
            items={items}
            configText={configText}
            onConfigTextChange={handleConfigTextChange}
            onStart={handleStart}
          />
        )}

        {screen === 'sorting' && algoKey && shuffledItems && (
          <SortingScreen
            algoKey={algoKey}
            shuffledItems={shuffledItems}
            onBack={() => setScreen('select')}
            onComplete={handleComplete}
          />
        )}

        {screen === 'results' && sortResult && (
          <ResultsScreen
            algoKey={algoKey}
            sorted={sortResult.sorted}
            comparisons={sortResult.comparisons}
            onTryAnother={handleTryAnother}
            onSortAgain={handleSortAgain}
          />
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App historyUrl={container.dataset.historyUrl} />);
