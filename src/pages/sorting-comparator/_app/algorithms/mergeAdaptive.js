import { mergeUpperBound } from './merge.js';

// Adaptive merge sort: checks if left[last] ≤ right[first] before each merge.
// If the check passes, the entire merge is skipped with just 1 comparison.
// On nearly-sorted or already-sorted data this dramatically reduces comparisons.
// When a full merge is needed, the pre-check result is reused — never double-asked.
function* mergeSortAdaptive(items) {
  const arr = [...items];
  const n = arr.length;
  for (let width = 1; width < n; width *= 2) {
    for (let lo = 0; lo < n; lo += 2 * width) {
      const mid = Math.min(lo + width, n);
      const hi = Math.min(lo + 2 * width, n);
      const left = arr.slice(lo, mid);
      const right = arr.slice(mid, hi);
      if (right.length === 0) continue;
      // Pre-sorted check: 1 comparison can skip the entire merge
      const preCmp = yield { a: left[left.length - 1], b: right[0] };
      if (preCmp <= 0) continue; // left[last] ≤ right[first] → already in order
      // Full merge needed; reuse preCmp when we reach (li=last, ri=0) in the loop
      let li = 0, ri = 0;
      const merged = [];
      while (li < left.length && ri < right.length) {
        let cmp;
        if (li === left.length - 1 && ri === 0) {
          cmp = preCmp; // Already know: left[last] > right[0]
        } else {
          cmp = yield { a: left[li], b: right[ri] };
        }
        if (cmp > 0) {
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

// Number of actual merges in bottom-up merge sort (right half non-empty)
function countMerges(n) {
  let count = 0;
  for (let w = 1; w < n; w *= 2)
    for (let lo = 0; lo < n; lo += 2 * w) {
      const mid = Math.min(lo + w, n);
      const hi = Math.min(lo + 2 * w, n);
      if (hi > mid) count++;
    }
  return count;
}

export default {
  name: 'Adaptive Merge Sort',
  fn: mergeSortAdaptive,
  complexity: 'O(n log n)',
  getTotal: n => mergeUpperBound(n),
  exact: false,
  stable: true,
  noRepeatPairs: true,
  description:
    'Merge sort with a pre-sorted check before each merge: "is left[last] ≤ right[first]?" One comparison can skip an entire merge group. On already-sorted data it uses only one comparison per merge — ideal when you suspect your list is nearly in order.',
  estimates: {
    best:  n => countMerges(n),
    avg:   n => Math.round((countMerges(n) + mergeUpperBound(n)) / 2),
    worst: n => mergeUpperBound(n),
    bestLabel:  'already sorted — each merge skipped in 1 comparison',
    worstLabel: 'each merge needs full comparison work',
  },
  scenarios: [
    { label: 'Nearly sorted',   rating: 'great', note: 'Pre-check skips most or all merges in 1 comparison each' },
    { label: 'Random data',     rating: 'great', note: 'O(n log n) guaranteed, never asks same pair twice' },
    { label: 'Reverse sorted',  rating: 'ok',    note: 'Full merges needed, but still no repeated pairs' },
    { label: 'Many duplicates', rating: 'great', note: 'Stable — equal elements maintain original order' },
  ],
};
