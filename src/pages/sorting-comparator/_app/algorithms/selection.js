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

export default {
  name: 'Selection Sort',
  fn: selectionSort,
  complexity: 'O(n²)',
  getTotal: n => n * (n - 1) / 2,
  exact: true, // Always exactly n(n-1)/2 comparisons
  stable: false,
  noRepeatPairs: false,
  description:
    'Finds the minimum of the unsorted portion and moves it into place, every round. Makes exactly n(n−1)/2 comparisons regardless of input. Tedious for humans: the current minimum dominates every comparison in a round.',
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
};
