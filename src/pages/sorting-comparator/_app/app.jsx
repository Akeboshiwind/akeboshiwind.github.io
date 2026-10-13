import React, { useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import ALGORITHMS from './algorithms/index.js';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { Sheet } from '../../../components/pixel/Sheet.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';
import checkSvg from 'pixelarticons/svg/check.svg?raw';
import minusSvg from 'pixelarticons/svg/minus.svg?raw';
import closeSvg from 'pixelarticons/svg/close.svg?raw';
import chevronDownSvg from 'pixelarticons/svg/chevron-down.svg?raw';
import chevronUpSvg from 'pixelarticons/svg/chevron-up.svg?raw';

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
  great: 'border-ok text-ok',
  ok:    'border-warn text-warn',
  poor:  '',
};
const RATING_ICON = { great: checkSvg, ok: minusSvg, poor: closeSvg };

const Estimate = ({ label, children }) => (
  <span>
    <span className="opacity-70">{label} </span>
    <span className="pixel-num text-heading">{children}</span>
  </span>
);

const AlgoRow = ({ algoKey, algo, n, expanded, onToggle, onStart }) => {
  const est = algo.estimates;
  return (
    <li className="pixel-line last:bg-none">
      <div className="flex items-center gap-3 p-3">
        <button onClick={() => onStart(algoKey)} className="pixel-button shrink-0" data-variant="primary">
          Sort
        </button>
        <button
          onClick={onToggle}
          aria-expanded={expanded}
          className="group flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium text-heading group-hover:text-accent">{algo.name}</span>
              <span className="font-pixel text-pixel opacity-70">{algo.complexity}</span>
            </div>
            <div className="label mt-0.5 flex flex-wrap items-center gap-x-3">
              <span className="opacity-70">~{est.avg(n)} comps</span>
              <span className="opacity-70">{algo.stable ? 'stable' : 'unstable'}</span>
              <span className={algo.noRepeatPairs ? 'text-accent' : 'opacity-70'}>
                {algo.noRepeatPairs ? 'no repeats' : 'may repeat'}
              </span>
            </div>
          </div>
          <Icon svg={expanded ? chevronUpSvg : chevronDownSvg} className="h-5 w-5 shrink-0 group-hover:text-accent" />
        </button>
      </div>
      {expanded && (
        <div className="flex flex-col gap-3 px-3 pb-4">
          <p className="text-sm leading-relaxed">{algo.description}</p>
          <div className="label flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <Estimate label="Best">{est.best(n)}</Estimate>
            <Estimate label="Avg">~{est.avg(n)}</Estimate>
            <Estimate label="Worst">{est.worst(n)}</Estimate>
            <span className={algo.noRepeatPairs ? 'text-accent' : 'opacity-70'}>
              {algo.noRepeatPairs ? '✓ no repeated pairs' : '↻ may repeat pairs'}
            </span>
          </div>
          <ul className="flex flex-wrap gap-1.5">
            {algo.scenarios.map(s => (
              <li
                key={s.label}
                className={`pixel-chip inline-flex items-center gap-1 ${RATING_STYLE[s.rating]}`}
                data-variant={s.rating === 'poor' ? 'danger' : undefined}
                title={s.note}
              >
                <Icon svg={RATING_ICON[s.rating]} className="h-3 w-3" />
                {s.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
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
      <header className="flex flex-col gap-2">
        <h1 className="page-title">Sorting Comparator</h1>
        <p className="page-sub">
          Sort any list by comparing items yourself. See how different algorithms feel when a human drives them.
        </p>
        <p className="page-sub">
          Great for prioritising todos, ranking preferences, or just seeing how sorting algorithms actually work.
        </p>
      </header>

      <div className="flex items-center justify-between gap-3">
        <span className="label text-heading">{n} items to sort</span>
        <button onClick={() => setShowConfig(true)} className="pixel-button">
          Edit items
        </button>
      </div>

      <section className="flex flex-col gap-3">
        <SectionLabel>Choose an algorithm</SectionLabel>
        <ul className="pixel-panel">
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
        </ul>
      </section>

      {showConfig && (
        <Sheet title="Edit Items" onClose={() => setShowConfig(false)}>
          <p className="text-sm">One item per line. Minimum 2 items.</p>
          <textarea
            value={configText}
            onChange={e => onConfigTextChange(e.target.value)}
            rows={8}
            className="pixel-field min-h-0 w-full resize-none font-mono text-sm"
            placeholder={"Apple\nBanana\nCherry"}
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={() => setShowConfig(false)} className="pixel-button flex-1">
              Cancel
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={configText.split('\n').filter(s => s.trim()).length < 2}
              className="pixel-button flex-1"
              data-variant="primary"
            >
              Save
            </button>
          </div>
        </Sheet>
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

// The item being ranked reads at 22px; the rest is the pixel-button's border, hover and focus.
const choice = 'pixel-button w-full whitespace-normal break-words px-4 py-4 text-left text-pixel-lg normal-case tracking-normal';

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
      <header className="flex items-center gap-3">
        <button onClick={handleBack} className="pixel-button shrink-0">
          ← Back
        </button>
        <h1 className="page-title min-w-0">{algo.name}</h1>
      </header>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <span className="label text-heading">
            Comparison {completed + 1}
            {algo.exact ? ` of ${totalExpected}` : ` / ≤ ${totalExpected}`}
          </span>
          <div className="flex items-center gap-3">
            {history.length > 0 && (
              <button onClick={handleUndo} className="pixel-button">
                Undo
              </button>
            )}
            <span className="label opacity-70">
              {algo.exact ? `${remaining} left` : `≤ ${remaining} left`}
            </span>
          </div>
        </div>
        <progress className="pixel-progress" value={progressPct} max={100} aria-hidden="true" />
      </div>

      <section className="pixel-panel flex flex-col p-4 sm:p-5">
        <p className="page-sub mb-4 text-center">Which should rank first?</p>
        <button onClick={() => handleChoice(1)} className={choice}>
          {comparison.a}
        </button>
        <div className="flex justify-center py-2">
          <button onClick={() => handleChoice(0)} className="pixel-button">
            = Equal
          </button>
        </div>
        <button onClick={() => handleChoice(-1)} className={choice}>
          {comparison.b}
        </button>
      </section>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => setShowProgress(p => !p)}
          aria-expanded={showProgress}
          className="pixel-button self-start"
        >
          {showProgress ? 'Hide progress' : 'Show progress'}
        </button>
        {showProgress && knownOrder && (
          <ol className="pixel-panel p-2">
            {knownOrder.sorted.map((item, idx) => {
              const isActive = comparison && (item === comparison.a || item === comparison.b);
              const isSettled = knownOrder.settled.has(item);
              return (
                <li
                  key={idx}
                  className={`flex items-center gap-2.5 px-2 py-1 text-sm ${
                    isActive ? 'text-accent' : isSettled ? 'text-heading' : 'opacity-50'
                  }`}
                >
                  <span className="w-5 shrink-0 text-right font-pixel text-pixel opacity-70">{idx + 1}</span>
                  <span className="min-w-0 break-words">{item}</span>
                  {isActive && <span className="label ml-auto">comparing</span>}
                  {isSettled && !isActive && <Icon svg={checkSvg} className="ml-auto h-4 w-4 shrink-0 text-ok" />}
                </li>
              );
            })}
          </ol>
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
      <header className="flex flex-col gap-2">
        <h1 className="page-title">Done!</h1>
        <p className="page-sub">
          {comparisons} comparison{comparisons !== 1 ? 's' : ''} with {algo.name}
        </p>
      </header>

      <ol className="pixel-panel px-2">
        {[...sorted].reverse().map((item, idx) => (
          <li key={idx} className="pixel-line flex items-baseline gap-3 px-2 py-2 last:bg-none">
            <span className="w-8 shrink-0 text-right font-pixel text-pixel opacity-70">#{idx + 1}</span>
            <span className="min-w-0 break-words text-heading">{item}</span>
          </li>
        ))}
      </ol>

      <div className="flex gap-2">
        <button onClick={onTryAnother} className="pixel-button flex-1 py-2">
          Try another algorithm
        </button>
        <button onClick={onSortAgain} className="pixel-button flex-1 py-2" data-variant="primary">
          Sort again
        </button>
      </div>
    </>
  );
};

// ——— App ———

const DEFAULT_ITEMS = ['23', '7', '45', '12', '89', '34', '56', '1', '78', '90'];

export const App = () => {
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
    <main className="flex flex-col gap-6">
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
    </main>
  );
};

const container = document.getElementById('app');
if (container) createRoot(container).render(<App />);
