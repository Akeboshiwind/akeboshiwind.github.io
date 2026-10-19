import { describe, test, expect } from 'vitest';
import { blank, parse, serialise, transpose, moveRow, moveColumn, insertRow, insertColumn, deleteRow, deleteColumn, setCell, setAlign } from './table.js';

const t = (cells, align = cells[0].map(() => null)) => ({ cells, align });

describe('parse', () => {
  test('reads the header, delimiter and body rows', () => {
    expect(parse('| a | b |\n|---|---|\n| 1 | 2 |')).toEqual({ ok: true, table: t([['a', 'b'], ['1', '2']]) });
  });

  test('outer pipes are optional', () => {
    expect(parse('a | b\n--- | ---\n1 | 2')).toEqual({ ok: true, table: t([['a', 'b'], ['1', '2']]) });
  });

  test('reads alignment from the delimiter row', () => {
    expect(parse('|a|b|c|d|\n|:--|:-:|--:|-|').table.align).toEqual(['left', 'center', 'right', null]);
  });

  test('pads short rows and drops cells past the header', () => {
    expect(parse('|a|b|\n|-|-|\n|1|\n|1|2|3|').table.cells).toEqual([['a', 'b'], ['1', ''], ['1', '2']]);
  });

  test('an escaped pipe stays in its cell', () => {
    expect(parse('|a\\|b|c|\n|-|-|').table.cells).toEqual([['a|b', 'c']]);
  });

  test('ignores surrounding blank lines and indentation', () => {
    expect(parse('\n  |a|\n  |-|\n  |1|\n\n').table.cells).toEqual([['a'], ['1']]);
  });

  test('without a delimiter row it is not a table', () => {
    expect(parse('|a|b|\n|1|2|')).toEqual({ ok: false, error: expect.any(String) });
  });

  test('an empty paste is not a table', () => {
    expect(parse('   ')).toEqual({ ok: false, error: expect.any(String) });
  });
});

describe('serialise', () => {
  test('pads every column to its widest cell', () => {
    expect(serialise(t([['a', 'bb'], ['ccc', 'd']]))).toBe(
      '| a   | bb  |\n' +
      '| --- | --- |\n' +
      '| ccc | d   |',
    );
  });

  test('writes alignment into the delimiter row and pads to match', () => {
    expect(serialise(t([['a', 'b', 'c'], ['1', '2', '3']], ['left', 'center', 'right']))).toBe(
      '| a   |  b  |   c |\n' +
      '| :-- | :-: | --: |\n' +
      '| 1   |  2  |   3 |',
    );
  });

  test('escapes pipes', () => {
    expect(serialise(t([['a|b']]))).toBe('| a\\|b |\n| ---- |');
  });

  test('round-trips through parse', () => {
    const table = t([['x', 'y|z'], ['', '2']], ['right', null]);
    expect(parse(serialise(table)).table).toEqual(table);
  });
});

describe('blank', () => {
  test('makes a header plus the asked-for body rows', () => {
    expect(blank(2, 3)).toEqual(t([['', '', ''], ['', '', ''], ['', '', '']]));
  });
});

describe('transpose', () => {
  test('swaps rows and columns, and drops alignment', () => {
    expect(transpose(t([['a', 'b', 'c'], ['1', '2', '3']], ['left', null, 'right']))).toEqual(
      t([['a', '1'], ['b', '2'], ['c', '3']]),
    );
  });
});

describe('moving', () => {
  const table = t([['a', 'b', 'c'], ['1', '2', '3'], ['4', '5', '6']], ['left', null, 'right']);

  test('a row moves to the given index', () => {
    expect(moveRow(table, 2, 0).cells.map(r => r[0])).toEqual(['4', 'a', '1']);
    expect(moveRow(table, 0, 2).cells.map(r => r[0])).toEqual(['1', '4', 'a']);
  });

  test('a column moves with its alignment', () => {
    expect(moveColumn(table, 0, 2)).toEqual(
      t([['b', 'c', 'a'], ['2', '3', '1'], ['5', '6', '4']], [null, 'right', 'left']),
    );
  });
});

describe('inserting and deleting', () => {
  const table = t([['a', 'b'], ['1', '2']], ['left', 'right']);

  test('a row is inserted blank at the index', () => {
    expect(insertRow(table, 1).cells).toEqual([['a', 'b'], ['', ''], ['1', '2']]);
  });

  test('a column is inserted blank and unaligned at the index', () => {
    expect(insertColumn(table, 1)).toEqual(t([['a', '', 'b'], ['1', '', '2']], ['left', null, 'right']));
  });

  test('a row is deleted', () => {
    expect(deleteRow(table, 0).cells).toEqual([['1', '2']]);
  });

  test('a column is deleted with its alignment', () => {
    expect(deleteColumn(table, 0)).toEqual(t([['b'], ['2']], ['right']));
  });

  test('the last row or column cannot be deleted', () => {
    const one = t([['a']]);
    expect(deleteRow(one, 0)).toBe(one);
    expect(deleteColumn(one, 0)).toBe(one);
  });
});

describe('editing', () => {
  const table = t([['a', 'b'], ['1', '2']]);

  test('setCell replaces one cell', () => {
    expect(setCell(table, 1, 0, 'x').cells).toEqual([['a', 'b'], ['x', '2']]);
  });

  test('setAlign sets one column', () => {
    expect(setAlign(table, 1, 'center').align).toEqual([null, 'center']);
  });
});
