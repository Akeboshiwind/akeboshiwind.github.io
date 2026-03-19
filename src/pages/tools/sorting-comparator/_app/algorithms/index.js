import bubble from './bubble.js';
import insertion from './insertion.js';
import binaryInsertion from './binaryInsertion.js';
import selection from './selection.js';
import merge from './merge.js';
import mergeAdaptive from './mergeAdaptive.js';
import powersort from './powersort.js';
import fordJohnson from './fordJohnson.js';
import quick from './quick.js';

// Ordered by suitability for human-driven sorting:
// 1. Ford-Johnson: provably optimal comparisons for n < 47
// 2-4. Good O(n log n) no-repeat algorithms
// 5-6. O(n log n) but may repeat or unstable
// 7-9. O(n²) — worse human experience
const ALGORITHMS = {
  fordJohnson,
  mergeAdaptive,
  powersort,
  binaryInsertion,
  merge,
  quick,
  insertion,
  bubble,
  selection,
};

export default ALGORITHMS;
