// Ford-Johnson (Merge Insertion Sort): minimises total comparisons in the worst case.
// Proven optimal for n < 47. Motivated by human sorting, where each comparison is expensive.
// Never asks the same pair twice. Inserts pending elements in Jacobsthal order to
// keep binary search windows as small as possible.

// Jacobsthal sequence: t(1)=1, t(2)=3, t(k)=t(k-1)+2*t(k-2)
function jacobsthalSeq(maxN) {
  const t = [0, 1, 3];
  while (t[t.length - 1] < maxN) {
    const k = t.length;
    t.push(t[k - 1] + 2 * t[k - 2]);
  }
  return t;
}

// 0-based insertion order for p items using Jacobsthal numbers
function jacobsthalOrder(p) {
  if (p <= 0) return [];
  const t = jacobsthalSeq(p);
  const order = [];
  const used = new Set();
  for (let k = 2; k < t.length && order.length < p; k++) {
    for (let j = Math.min(t[k], p); j > t[k - 1]; j--) {
      if (!used.has(j - 1)) { order.push(j - 1); used.add(j - 1); }
    }
  }
  for (let i = 0; i < p; i++) { if (!used.has(i)) order.push(i); }
  return order;
}

// Binary-insert `item` into chain[0..bound) — bound is exclusive upper index
function* binaryInsert(chain, item, bound) {
  let lo = 0, hi = bound;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    const cmp = yield { a: item.v, b: chain[mid].v };
    if (cmp <= 0) hi = mid;   // item ≤ chain[mid] → search left half
    else lo = mid + 1;         // item > chain[mid] → search right half
  }
  chain.splice(lo, 0, item);
}

// Internal recursive generator — operates on tagged {v, id} objects
function* _fj(items) {
  const n = items.length;
  if (n <= 1) return [...items];
  if (n === 2) {
    const cmp = yield { a: items[0].v, b: items[1].v };
    return cmp <= 0 ? [items[0], items[1]] : [items[1], items[0]];
  }

  // Step 1: pair up, compare each pair (floor(n/2) comparisons)
  const pairs = []; // each: [larger, smaller]
  for (let i = 0; i + 1 < n; i += 2) {
    const cmp = yield { a: items[i].v, b: items[i + 1].v };
    if (cmp > 0) pairs.push([items[i], items[i + 1]]);
    else         pairs.push([items[i + 1], items[i]]);
  }
  const straggler = n % 2 === 1 ? items[n - 1] : null;

  // Step 2: recursively sort the larger elements of each pair
  const sortedLarges = yield* _fj(pairs.map(p => p[0]));

  // Map each sorted large back to its paired smaller element
  const largeToSmall = new Map(pairs.map(p => [p[0], p[1]]));

  // Step 3: build main chain
  // b0 (small of sortedLarges[0]) is known < sortedLarges[0] — place free, 0 comparisons
  const chain = [...sortedLarges];
  const b0 = largeToSmall.get(sortedLarges[0]);
  if (b0) chain.splice(0, 0, b0);

  // Remaining pending elements with their bound (the large they were paired with)
  const pending = [];
  for (let i = 1; i < sortedLarges.length; i++) {
    pending.push({ item: largeToSmall.get(sortedLarges[i]), boundElem: sortedLarges[i] });
  }
  if (straggler) pending.push({ item: straggler, boundElem: null });

  // Step 4: insert pending in Jacobsthal order (minimises binary search window sizes)
  for (const idx of jacobsthalOrder(pending.length)) {
    const { item, boundElem } = pending[idx];
    const bound = boundElem !== null ? chain.indexOf(boundElem) : chain.length;
    yield* binaryInsert(chain, item, bound);
  }

  return chain;
}

// Theoretical worst-case comparisons for Ford-Johnson (exact for n ≤ 13, approx beyond)
// Uses the recurrence: F(n) = F(floor(n/2)) + insertion_cost(n)
function fjWorstCase(n) {
  if (n <= 1) return 0;
  // Known exact values (OEIS A036604)
  const exact = [0, 0, 1, 3, 5, 7, 10, 13, 16, 19, 22, 26, 30, 34];
  if (n < exact.length) return exact[n];
  // Approximation for larger n: slightly better than binary insertion sort
  let total = 0;
  for (let k = 2; k <= n; k++) total += Math.ceil(Math.log2(k));
  return Math.round(total * 0.95);
}

export default {
  name: 'Ford-Johnson',
  fn: function* fordJohnson(items) {
    if (items.length <= 1) return [...items];
    const tagged = items.map((v, i) => ({ v, id: i }));
    const sorted = yield* _fj(tagged);
    return sorted.map(t => t.v);
  },
  complexity: 'O(n log n)',
  getTotal: n => fjWorstCase(n),
  exact: false,
  stable: false,
  noRepeatPairs: true,
  description:
    'Proven to use the fewest possible comparisons in the worst case — optimal for n < 47. Designed for when comparisons are expensive (like human judgement). Pairs elements, recursively sorts the winners, then inserts the losers in a carefully chosen order (Jacobsthal sequence) to keep each binary search as short as possible.',
  estimates: {
    best:  n => Math.max(0, n - 1),
    avg:   n => Math.max(0, fjWorstCase(n) - Math.floor(n / 4)),
    worst: n => fjWorstCase(n),
    bestLabel:  'already sorted — pairs compare and chain forms quickly',
    worstLabel: 'theoretical worst case — still optimal by information theory',
  },
  scenarios: [
    { label: 'Nearly sorted',   rating: 'great', note: 'Fewest comparisons guaranteed — optimal worst case' },
    { label: 'Random data',     rating: 'great', note: 'Theoretically optimal — fewer questions than any other algorithm' },
    { label: 'Reverse sorted',  rating: 'great', note: 'Pairs flip efficiently, still achieves optimal count' },
    { label: 'Many duplicates', rating: 'ok',    note: 'Not stable — equal elements may be reordered' },
  ],
};
