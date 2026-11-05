/** A body: the tables it scans, and the CTEs it reads with how many times each. */
interface Body {
  scans: string[];
  reads: [string, number][];
}

interface Spec extends Body {
  name: string;
}

interface Sample {
  name: string;
  sql: string;
}

const from = ({ scans, reads }: Body): string => [
  ...scans,
  ...reads.flatMap(([name, k]) => Array.from({ length: k }, (_, i) => (i === 0 ? name : `${name} AS ${name}_${i + 1}`))),
].join(', ');

/** A query whose WITH declares `ctes` in order, each reading only those before it. */
const sql = (ctes: Spec[], query: Body): string =>
  `WITH ${ctes.map((c) => `${c.name} AS (SELECT * FROM ${from(c)})`).join(',\n     ')}\nSELECT * FROM ${from(query)}`;

/** a; b reads a twice; c reads b twice; the query reads c twice. */
const diamond = sql([
  { name: 'a', scans: ['t'], reads: [] },
  { name: 'b', scans: [], reads: [['a', 2]] },
  { name: 'c', scans: [], reads: [['b', 2]] },
], { scans: [], reads: [['c', 2]] });

/** Each of nine CTEs reads the one below twice, so copies double all the way down. */
const ladder = (() => {
  const ctes: Spec[] = [{ name: 'l0', scans: ['t'], reads: [] }];
  for (let i = 1; i < 9; i++) ctes.push({ name: `l${i}`, scans: [], reads: [[`l${i - 1}`, 2]] });
  return sql(ctes, { scans: [], reads: [['l8', 2]] });
})();

const mulberry = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * 40 CTEs in four tiers (sources, joins, rollups, reports). Most CTEs read their inputs once; a few high up read one
 * input two or three times, so copies multiply to a few dozen down the chain. Invented, not taken from any real query.
 */
const realistic = (() => {
  const rnd = mulberry(35);
  const tables = ['orders', 'items', 'users', 'events', 'accounts', 'rates', 'regions', 'flags'];
  const ctes: Spec[] = [];
  const names = (start: number, end: number) => ctes.slice(start, end).map((c) => c.name);
  const pick = (pool: string[], k: number) => {
    const left = [...pool];
    const out: string[] = [];
    while (out.length < k && left.length) out.push(left.splice(Math.floor(rnd() * left.length), 1)[0]);
    return out;
  };
  const add = (name: string, scans: string[], reads: [string, number][]) => ctes.push({ name, scans, reads });
  for (let i = 0; i < 12; i++) add(`src${i}`, pick(tables, 1 + Math.floor(rnd() * 2)), []);
  for (let i = 0; i < 12; i++) {
    const scans = rnd() < 0.3 ? pick(tables, 1) : [];
    add(`join${i}`, scans, pick(names(0, 12), 1 + Math.floor(rnd() * 3)).map((n): [string, number] => [n, 1]));
  }
  for (let i = 0; i < 10; i++) {
    const reads = pick(names(12, 24), 1 + Math.floor(rnd() * 3)).map((n): [string, number] => [n, rnd() < 0.4 ? 2 : 1]);
    add(`roll${i}`, [], reads);
  }
  for (let i = 0; i < 6; i++) {
    add(`rep${i}`, [], pick(names(24, 34), 2 + Math.floor(rnd() * 2)).map((n): [string, number] => [n, i < 2 ? 2 : 1]));
  }
  return sql(ctes, { scans: [], reads: names(34, 40).map((n): [string, number] => [n, 1]) });
})();

export const SAMPLES: Sample[] = [
  { name: 'Diamond', sql: diamond },
  { name: 'Ladder', sql: ladder },
  { name: 'Realistic', sql: realistic },
];
