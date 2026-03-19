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

export default {
  name: 'Bubble Sort',
  fn: bubbleSort,
  complexity: 'O(n²)',
  getTotal: n => n * (n - 1) / 2,
  exact: false,
  stable: true,
  noRepeatPairs: false,
  description:
    'Repeatedly scans adjacent pairs and swaps them if out of order. Early exit makes it O(n) on sorted data. Downside for humans: the same adjacent pairs re-appear in every pass, so you\'ll see familiar faces over and over.',
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
};
