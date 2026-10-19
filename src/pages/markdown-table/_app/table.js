/**
 * A table is `{ cells, align }`: `cells` is a rectangular grid whose first row is the header,
 * with at least one row and one column; `align` has one entry per column, `'left' | 'center' | 'right' | null`.
 * Every function here returns a new table and keeps that shape.
 */

const splitRow = line => {
  let s = line.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|') && !s.endsWith('\\|')) s = s.slice(0, -1);
  return s.split(/(?<!\\)\|/).map(cell => cell.trim().replaceAll('\\|', '|'));
};

const DELIMITER_CELL = /^:?-+:?$/;

const alignOf = cell => {
  const left = cell.startsWith(':');
  const right = cell.endsWith(':');
  return left && right ? 'center' : left ? 'left' : right ? 'right' : null;
};

const fit = (row, width) => Array.from({ length: width }, (_, i) => row[i] ?? '');

export const parse = text => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return { ok: false, error: 'Paste a table to get started.' };
  if (lines.length < 2) return { ok: false, error: 'A table needs a header row and a delimiter row like |---|---|.' };

  const header = splitRow(lines[0]);
  const delimiter = splitRow(lines[1]);
  if (!delimiter.every(cell => DELIMITER_CELL.test(cell))) {
    return { ok: false, error: 'The second line should be a delimiter row like |---|---|.' };
  }

  const width = header.length;
  return {
    ok: true,
    table: {
      cells: [header, ...lines.slice(2).map(splitRow)].map(row => fit(row, width)),
      align: fit(delimiter, width).map(cell => (cell ? alignOf(cell) : null)),
    },
  };
};

const escape = cell => cell.replaceAll('|', '\\|');

const pad = (text, width, align) => {
  const gap = width - text.length;
  if (align === 'right') return ' '.repeat(gap) + text;
  if (align === 'center') {
    const left = Math.floor(gap / 2);
    return ' '.repeat(left) + text + ' '.repeat(gap - left);
  }
  return text + ' '.repeat(gap);
};

const rule = (width, align) => {
  if (align === 'left') return ':' + '-'.repeat(width - 1);
  if (align === 'right') return '-'.repeat(width - 1) + ':';
  if (align === 'center') return ':' + '-'.repeat(width - 2) + ':';
  return '-'.repeat(width);
};

export const serialise = ({ cells, align }) => {
  const escaped = cells.map(row => row.map(escape));
  const widths = align.map((_, c) => Math.max(3, ...escaped.map(row => row[c].length)));
  const line = row => `| ${row.join(' | ')} |`;
  const [header, ...body] = escaped.map(row => line(row.map((cell, c) => pad(cell, widths[c], align[c]))));
  return [header, line(widths.map((w, c) => rule(w, align[c]))), ...body].join('\n');
};

export const blank = (bodyRows, columns) => ({
  cells: Array.from({ length: bodyRows + 1 }, () => Array(columns).fill('')),
  align: Array(columns).fill(null),
});

export const transpose = ({ cells }) => ({
  cells: cells[0].map((_, c) => cells.map(row => row[c])),
  align: cells.map(() => null),
});

const move = (list, from, to) => {
  const next = [...list];
  next.splice(to, 0, ...next.splice(from, 1));
  return next;
};

const insert = (list, at, item) => [...list.slice(0, at), item, ...list.slice(at)];
const remove = (list, at) => list.filter((_, i) => i !== at);

export const moveRow = (table, from, to) => ({ ...table, cells: move(table.cells, from, to) });

export const moveColumn = ({ cells, align }, from, to) => ({
  cells: cells.map(row => move(row, from, to)),
  align: move(align, from, to),
});

export const insertRow = (table, at) => ({ ...table, cells: insert(table.cells, at, table.align.map(() => '')) });

export const insertColumn = ({ cells, align }, at) => ({
  cells: cells.map(row => insert(row, at, '')),
  align: insert(align, at, null),
});

export const deleteRow = (table, at) =>
  table.cells.length === 1 ? table : { ...table, cells: remove(table.cells, at) };

export const deleteColumn = (table, at) =>
  table.align.length === 1 ? table : { cells: table.cells.map(row => remove(row, at)), align: remove(table.align, at) };

export const setCell = (table, r, c, value) => ({
  ...table,
  cells: table.cells.map((row, i) => (i === r ? row.map((cell, j) => (j === c ? value : cell)) : row)),
});

export const setAlign = (table, c, value) => ({ ...table, align: table.align.map((a, i) => (i === c ? value : a)) });
