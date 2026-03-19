// Binary insertion sort: uses binary search to find the insertion position.
// Each element is compared via binary search in O(log n) comparisons.
// The same value pair is never compared twice — every comparison yields new info.
function* binaryInsertionSort(items) {
  const arr = [...items];
  for (let i = 1; i < arr.length; i++) {
    let lo = 0, hi = i;
    while (lo < hi) {
      const mid = Math.floor((lo + hi) / 2);
      const cmp = yield { a: arr[i], b: arr[mid] };
      // cmp < 0: arr[i] < arr[mid] → search left half
      // cmp >= 0: arr[i] >= arr[mid] → search right half (stable: equal goes right)
      if (cmp < 0) hi = mid; else lo = mid + 1;
    }
    // Shift arr[lo..i-1] right and insert arr[i] at position lo
    const val = arr[i];
    for (let j = i; j > lo; j--) arr[j] = arr[j - 1];
    arr[lo] = val;
  }
  return arr;
}

// Best-case comparisons for binary insertion sort (sorted input: always go right)
// Each position i costs floor(log2(i+1)) comparisons.
function binaryInsertBest(n) {
  let count = 0;
  for (let i = 1; i < n; i++) count += Math.floor(Math.log2(i + 1));
  return count;
}

// Worst-case comparisons for binary insertion sort (reverse-sorted: always go left)
// Each position i costs ceil(log2(i+1)) comparisons.
function binaryInsertWorst(n) {
  let count = 0;
  for (let i = 1; i < n; i++) count += Math.ceil(Math.log2(i + 1));
  return count;
}

export default {
  name: 'Binary Insertion Sort',
  fn: binaryInsertionSort,
  complexity: 'O(n log n)',
  getTotal: n => binaryInsertWorst(n),
  exact: false,
  stable: true,
  noRepeatPairs: true,
  description:
    'Like insertion sort, but uses binary search to locate the insertion position. Every comparison is unique — you will never see the same pair twice. O(log n) comparisons per element makes for a very fair, varied experience.',
  estimates: {
    best:  n => binaryInsertBest(n),
    avg:   n => Math.round((binaryInsertBest(n) + binaryInsertWorst(n)) / 2),
    worst: n => binaryInsertWorst(n),
    bestLabel:  'already sorted',
    worstLabel: 'reverse sorted',
  },
  scenarios: [
    { label: 'Nearly sorted',   rating: 'ok',    note: 'Binary search does the same work regardless of order' },
    { label: 'Random data',     rating: 'great', note: 'No repeated pairs — each comparison tells you something new' },
    { label: 'Reverse sorted',  rating: 'ok',    note: 'Same binary-search count as sorted — no worst case' },
    { label: 'Many duplicates', rating: 'great', note: 'Stable and handles equals gracefully' },
  ],
};
