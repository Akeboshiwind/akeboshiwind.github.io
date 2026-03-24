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

// Maximum comparisons for bottom-up merge sort on n elements
export function mergeUpperBound(n) {
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

export default {
  name: 'Merge Sort',
  fn: mergeSort,
  complexity: 'O(n log n)',
  getTotal: n => mergeUpperBound(n),
  exact: false,
  stable: true,
  noRepeatPairs: true,
  description:
    'Splits in half, sorts each half, merges the results. Guaranteed O(n log n) in all cases. Each pair of values is compared at most once, so you\'ll never see a repeat. For sorted inputs, try Adaptive Merge Sort to skip unnecessary merges.',
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
};
