/**
 * `rows` from `parse` is a rectangular grid of strings with at least one row and one column.
 * Quoting follows RFC 4180: a field in double quotes may hold the delimiter, newlines and `""` for a quote.
 */

export const DELIMITERS = [',', '\t', ';', '|'];

export const parse = (text, delimiter) => {
  const source = text.replace(/^﻿/, '');
  const rows = [];
  let row = [];
  let field = '';
  let quotedFrom = null;
  let line = 1;

  const endRow = () => {
    row.push(field);
    if (row.length > 1 || row[0].trim() !== '') rows.push(row);
    row = [];
    field = '';
  };

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '\n') line++;
    if (quotedFrom !== null) {
      if (ch === '"' && source[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') quotedFrom = null;
      else field += ch;
    } else if (ch === '"' && field === '') quotedFrom = line;
    else if (ch === delimiter) { row.push(field); field = ''; }
    else if (ch === '\n') endRow();
    else if (ch === '\r' && source[i + 1] === '\n') continue;
    else field += ch;
  }

  if (quotedFrom !== null) return { ok: false, error: `The quote opened on line ${quotedFrom} never closes.` };
  endRow();
  if (rows.length === 0) return { ok: false, error: 'Paste some CSV to get started.' };

  const width = Math.max(...rows.map(r => r.length));
  return { ok: true, rows: rows.map(r => Array.from({ length: width }, (_, i) => r[i] ?? '')) };
};

const countOutsideQuotes = (line, ch) => {
  let count = 0;
  let quoted = false;
  for (const c of line) {
    if (c === '"') quoted = !quoted;
    else if (c === ch && !quoted) count++;
  }
  return count;
};

/** The delimiter that splits the first line most often, or a comma when none does. */
export const detectDelimiter = text => {
  const first = text.replace(/^﻿/, '').split('\n').find(line => line.trim() !== '') ?? '';
  const [best] = DELIMITERS
    .map(d => [d, countOutsideQuotes(first, d)])
    .reduce((a, b) => (b[1] > a[1] ? b : a));
  return countOutsideQuotes(first, best) > 0 ? best : ',';
};

const NUMBER = /^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i;
const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

const compare = (a, b) => {
  const x = a.trim();
  const y = b.trim();
  if (NUMBER.test(x) && NUMBER.test(y)) return Number(x) - Number(y);
  return collator.compare(x, y);
};

/**
 * The indices of the rows that contain `query`, in `sort` order. Empty cells sort last either way.
 * `sort` is `{ column, direction: 'asc' | 'desc' }`.
 */
export const rowOrder = (rows, { query = '', sort } = {}) => {
  const needle = query.trim().toLowerCase();
  const kept = rows.map((_, i) => i).filter(i => !needle || rows[i].some(cell => cell.toLowerCase().includes(needle)));
  if (!sort) return kept;

  const sign = sort.direction === 'desc' ? -1 : 1;
  const key = i => rows[i][sort.column];
  return kept.sort((i, j) => {
    const a = key(i);
    const b = key(j);
    const aEmpty = a.trim() === '';
    const bEmpty = b.trim() === '';
    if (aEmpty || bEmpty) return aEmpty - bEmpty;
    return sign * compare(a, b);
  });
};

/** For each column, whether every non-empty cell in it is a number. A column of empty cells is not. */
export const numericColumns = rows =>
  rows[0].map((_, c) => {
    const filled = rows.map(row => row[c].trim()).filter(Boolean);
    return filled.length > 0 && filled.every(cell => NUMBER.test(cell));
  });

/** For exports that write a line break as the two characters `\n` (or `\r\n`). */
export const showEscapedNewlines = text => text.replace(/\\r\\n|\\n/g, '\n');
