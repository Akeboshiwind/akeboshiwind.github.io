// Powersort: detects natural runs and merges them.
// A "run" is a maximal already-sorted (or reverse-sorted) sequence.
// On already-sorted input: finds one run, uses exactly n-1 comparisons.
// Powersort is the modern successor to Timsort (used in Python 3.11+).

// Asks about two tagged items, or answers from an earlier question about the same pair.
// Run detection compares the neighbours at each run boundary, and those two meet again in a merge.
function* ask(known, x, y) {
  const key = `${x.id},${y.id}`;
  if (known.has(key)) return known.get(key);
  const cmp = yield { a: x.v, b: y.v };
  known.set(key, cmp);
  known.set(`${y.id},${x.id}`, -cmp);
  return cmp;
}

function* mergeTwoRuns(arr, known, lo, mid, hi) {
  const left = arr.slice(lo, mid);
  const right = arr.slice(mid, hi);
  let li = 0, ri = 0;
  const merged = [];
  while (li < left.length && ri < right.length) {
    const cmp = yield* ask(known, left[li], right[ri]);
    if (cmp > 0) merged.push(right[ri++]);
    else merged.push(left[li++]);
  }
  while (li < left.length) merged.push(left[li++]);
  while (ri < right.length) merged.push(right[ri++]);
  for (let k = 0; k < merged.length; k++) arr[lo + k] = merged[k];
}

function* powersort(items) {
  const arr = items.map((v, id) => ({ v, id }));
  const known = new Map();
  const n = arr.length;
  if (n <= 1) return [...items];

  // Phase 1: detect natural runs (consumes comparisons to find boundaries)
  const runs = []; // each run: [lo, hi) exclusive
  let i = 0;
  while (i < n) {
    const lo = i;
    if (i + 1 >= n) { runs.push([lo, n]); break; }
    const first = yield* ask(known, arr[i], arr[i + 1]);
    if (first > 0) {
      // Descending run — extend
      i += 2;
      while (i < n) {
        const c = yield* ask(known, arr[i - 1], arr[i]);
        if (c <= 0) break;
        i++;
      }
      // Reverse in-place (free, no comparisons)
      let l = lo, r = i - 1;
      while (l < r) { [arr[l], arr[r]] = [arr[r], arr[l]]; l++; r--; }
    } else {
      // Ascending run — extend
      i += 2;
      while (i < n) {
        const c = yield* ask(known, arr[i - 1], arr[i]);
        if (c > 0) break;
        i++;
      }
    }
    runs.push([lo, i]);
  }

  if (runs.length === 1) return arr.map(t => t.v); // already sorted

  // Phase 2: merge adjacent runs until one remains
  let current = runs;
  while (current.length > 1) {
    const next = [];
    for (let j = 0; j < current.length; j += 2) {
      if (j + 1 >= current.length) { next.push(current[j]); continue; }
      const [lo] = current[j];
      const [mid] = current[j + 1];
      const [, hi] = current[j + 1];
      yield* mergeTwoRuns(arr, known, lo, mid, hi);
      next.push([lo, hi]);
    }
    current = next;
  }

  return arr.map(t => t.v);
}

// Worst-case: all single-element runs → full merge sort work
function powersortWorst(n) {
  let count = 0;
  // n-1 comparisons to detect runs (each pair compared once) +
  // merge work for ceil(log2(n)) passes over n elements
  count += n - 1; // run detection
  let runs = n;
  while (runs > 1) {
    count += n - Math.floor(runs / 2); // rough merge work per pass
    runs = Math.ceil(runs / 2);
  }
  return count;
}

export default {
  name: 'Powersort',
  fn: powersort,
  complexity: 'O(n log n)',
  getTotal: n => powersortWorst(n),
  exact: false,
  stable: true,
  noRepeatPairs: true,
  description:
    'Detects natural runs — pre-existing sorted (or reverse-sorted) sequences — and merges them. On an already-sorted list it finds one big run and uses only n−1 comparisons total. Powersort is the modern successor to Timsort, used in Python 3.11+, and provably adapts to the existing structure of your data.',
  estimates: {
    best:  n => Math.max(0, n - 1),
    avg:   n => Math.max(0, Math.round(n * Math.log2(Math.max(n, 1)) * 0.65)),
    worst: n => powersortWorst(n),
    bestLabel:  'already sorted — one run detected, no merges needed',
    worstLabel: 'fully random — many single-element runs, full merge work',
  },
  scenarios: [
    { label: 'Nearly sorted',   rating: 'great', note: 'Detects long existing runs, merges only what needs merging' },
    { label: 'Random data',     rating: 'great', note: 'O(n log n) guaranteed, adapts to any structure present' },
    { label: 'Reverse sorted',  rating: 'great', note: 'Detects one descending run, reverses free — n-1 comparisons' },
    { label: 'Many duplicates', rating: 'great', note: 'Stable — equal elements maintain original order' },
  ],
};
