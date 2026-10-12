import { describe, test, expect, beforeAll } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';

beforeAll(async () => {
  document.body.innerHTML = '<div id="app"></div>';
  await act(async () => { await import('./app.jsx'); });
});

const convert = (text) => {
  fireEvent.change(screen.getByPlaceholderText(/Paste Transit-encoded data here/), { target: { value: text } });
  fireEvent.click(screen.getByRole('button', { name: 'Convert' }));
};

describe('Transit Converter', () => {
  test('shows the title and an empty output', async () => {
    expect(await screen.findByRole('heading', { name: 'Transit → JSON' })).toBeTruthy();
    expect(screen.getByText('JSON output will appear here')).toBeTruthy();
  });

  test('converts a transit map to pretty-printed JSON', () => {
    convert('["^ ","name","Alice","age",30]');
    expect(screen.getByText((_, el) => el.tagName === 'PRE' && el.textContent === JSON.stringify({ name: 'Alice', age: 30 }, null, 2))).toBeTruthy();
    expect(screen.queryByText('JSON output will appear here')).toBeNull();
  });

  test('nested maps and arrays become plain JSON, keyword keys keep their colon', () => {
    convert('["^ ","~:user",["^ ","~:name","Bob","~:ids",[1,2,3]],"~:n",null]');
    const pre = screen.getByText((_, el) => el.tagName === 'PRE');
    expect(JSON.parse(pre.textContent)).toEqual({ ':user': { ':name': 'Bob', ':ids': [1, 2, 3] }, ':n': null });
  });

  test('invalid input shows the parse error and clears the output', () => {
    convert('["^ ","name","Alice","age",30]');
    convert('not transit {');
    expect(screen.queryByText((_, el) => el.tagName === 'PRE')).toBeNull();
    expect(screen.getByText('JSON output will appear here')).toBeTruthy();
    let message;
    try { JSON.parse('not transit {'); } catch (e) { message = e.message; }
    expect(screen.getByText(message)).toBeTruthy();
  });
});
