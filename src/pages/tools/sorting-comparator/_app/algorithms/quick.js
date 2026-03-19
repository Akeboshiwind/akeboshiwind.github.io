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

export default {
  name: 'Quicksort (3-way)',
  fn: quickSort,
  complexity: 'O(n log n) avg',
  getTotal: n => n * (n - 1) / 2,
  exact: false,
  stable: false,
  noRepeatPairs: false,
  description:
    'Picks a random pivot and partitions into smaller, equal, and larger groups. Equal elements are placed in one pass and need no further sorting. Downside for humans: the pivot dominates every comparison within a partition round.',
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
};
