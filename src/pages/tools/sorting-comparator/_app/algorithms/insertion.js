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

export default {
  name: 'Insertion Sort',
  fn: insertionSort,
  complexity: 'O(n²)',
  getTotal: n => n * (n - 1) / 2,
  exact: false,
  stable: true,
  noRepeatPairs: false,
  description:
    'Builds a sorted prefix one element at a time, shifting each new item left until it finds its spot. Best O(n²) algorithm for nearly-sorted data, but linear search means the same pair of values can appear again with duplicate items.',
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
    { label: 'Many duplicates', rating: 'ok',    note: 'Stable; but same value pair may reappear' },
  ],
};
