import { describe, test, expect } from 'vitest';
import { parse, detectDelimiter, rowOrder, numericColumns, showEscapedNewlines } from './csv.js';

describe('parse', () => {
  test('splits rows and fields', () => {
    expect(parse('a,b\n1,2', ',')).toEqual({ ok: true, rows: [['a', 'b'], ['1', '2']] });
  });

  test('takes CRLF line endings and a trailing newline', () => {
    expect(parse('a,b\r\n1,2\r\n', ',').rows).toEqual([['a', 'b'], ['1', '2']]);
  });

  test('a quoted field keeps its delimiters, newlines and doubled quotes', () => {
    expect(parse('"a,b","line 1\nline 2","say ""hi"""', ',').rows).toEqual([['a,b', 'line 1\nline 2', 'say "hi"']]);
  });

  test('empty fields stay empty', () => {
    expect(parse(',,\n1,,', ',').rows).toEqual([['', '', ''], ['1', '', '']]);
  });

  test('pads short rows to the widest', () => {
    expect(parse('a,b,c\n1\n1,2', ',').rows).toEqual([['a', 'b', 'c'], ['1', '', ''], ['1', '2', '']]);
  });

  test('uses the delimiter it is given', () => {
    expect(parse('a\tb,c', '\t').rows).toEqual([['a', 'b,c']]);
  });

  test('skips blank lines', () => {
    expect(parse('a\n\n\nb\n', ',').rows).toEqual([['a'], ['b']]);
  });

  test('drops a leading byte order mark', () => {
    expect(parse('﻿a,b', ',').rows).toEqual([['a', 'b']]);
  });

  test('a quote that never closes says on which line it opened', () => {
    expect(parse('a,b\n1,"oops\n2,3', ',')).toEqual({ ok: false, error: expect.stringMatching(/line 2/) });
  });

  test('an empty paste is not a table', () => {
    expect(parse('  \n ', ',')).toEqual({ ok: false, error: expect.any(String) });
  });
});

describe('detectDelimiter', () => {
  test.each([
    ['a,b,c', ','],
    ['a\tb\tc', '\t'],
    ['a;b;c', ';'],
    ['a|b|c', '|'],
  ])('%j uses %j', (text, delimiter) => {
    expect(detectDelimiter(text)).toBe(delimiter);
  });

  test('ignores delimiters inside quotes', () => {
    expect(detectDelimiter('"a,b,c,d";e;f\n1;2;3')).toBe(';');
  });

  test('falls back to a comma', () => {
    expect(detectDelimiter('just one column')).toBe(',');
  });
});

describe('rowOrder', () => {
  const rows = [['b', '10'], ['a', '9'], ['', '-2'], ['C', '']];

  test('with no sort or query it is every row in order', () => {
    expect(rowOrder(rows, {})).toEqual([0, 1, 2, 3]);
  });

  test('sorts text ignoring case, with empty cells last', () => {
    expect(rowOrder(rows, { sort: { column: 0, direction: 'asc' } })).toEqual([1, 0, 3, 2]);
    expect(rowOrder(rows, { sort: { column: 0, direction: 'desc' } })).toEqual([3, 0, 1, 2]);
  });

  test('sorts numbers by value', () => {
    expect(rowOrder(rows, { sort: { column: 1, direction: 'asc' } })).toEqual([2, 1, 0, 3]);
    expect(rowOrder(rows, { sort: { column: 1, direction: 'desc' } })).toEqual([0, 1, 2, 3]);
  });

  test('equal cells keep their order', () => {
    expect(rowOrder([['x'], ['x']], { sort: { column: 0, direction: 'desc' } })).toEqual([0, 1]);
  });

  test('keeps rows with a cell containing the query, ignoring case', () => {
    expect(rowOrder([['Apple', 'Red'], ['Banana', 'Yellow']], { query: 'yell' })).toEqual([1]);
  });

  test('a blank query keeps every row', () => {
    expect(rowOrder([['a'], ['b']], { query: '  ' })).toEqual([0, 1]);
  });

  test('filters, then sorts what is left', () => {
    expect(rowOrder(rows, { query: 'a', sort: { column: 0, direction: 'desc' } })).toEqual([1]);
    expect(rowOrder([['ab'], ['b'], ['aa']], { query: 'a', sort: { column: 0, direction: 'asc' } })).toEqual([2, 0]);
  });
});

describe('numericColumns', () => {
  test('a column is numeric when every filled cell is a number', () => {
    expect(numericColumns([['1', 'a', '', '1.5'], ['-2', '3', '', ''], ['1e3', '4', '', '.5']])).toEqual([true, false, false, true]);
  });
});

describe('showEscapedNewlines', () => {
  test('turns a written \\n or \\r\\n into a line break', () => {
    expect(showEscapedNewlines('one\\ntwo\\r\\nthree')).toBe('one\ntwo\nthree');
  });

  test('leaves other backslashes alone', () => {
    expect(showEscapedNewlines('C:\\temp\\x')).toBe('C:\\temp\\x');
  });
});
