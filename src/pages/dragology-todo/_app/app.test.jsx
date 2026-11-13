import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { App } from './app.jsx';

const seed = titles => localStorage.setItem('dragology-todo_items', JSON.stringify(
  titles.map((title, i) => ({ id: `t${i}`, title, done: false }))));
const titles = () => screen.getAllByRole('checkbox').map(c => c.getAttribute('aria-label'));

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('Dragology Todo', () => {
  beforeEach(() => { localStorage.clear(); });

  test('lists the to-dos', () => {
    seed(['Milk', 'Eggs']);
    render(<App />);
    expect(titles()).toEqual(['Milk', 'Eggs']);
  });

  test('ticking a to-do marks it done', () => {
    seed(['Milk']);
    render(<App />);
    fireEvent.click(screen.getByRole('checkbox', { name: 'Milk' }));
    expect(screen.getByRole('checkbox', { name: 'Milk' }).getAttribute('aria-checked')).toBe('true');
  });

  test('a tap on + adds a to-do at the end to type into', () => {
    seed(['Milk']);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'New to-do' }));
    const input = screen.getByRole('textbox', { name: 'To-do' });
    fireEvent.change(input, { target: { value: 'Bread' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(titles()).toEqual(['Milk', 'Bread']);
  });

  test('+ works over plain http, where there is no crypto.randomUUID', () => {
    vi.spyOn(crypto, 'randomUUID', 'get').mockReturnValue(undefined);
    seed(['Milk']);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'New to-do' }));
    expect(screen.getByRole('textbox', { name: 'To-do' })).toBeTruthy();
  });

  test('a to-do left empty goes away', async () => {
    seed(['Milk']);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'New to-do' }));
    fireEvent.blur(screen.getByRole('textbox', { name: 'To-do' }));
    await waitFor(() => expect(titles()).toEqual(['Milk']));
  });

  test('a tap on a to-do edits it', () => {
    seed(['Milk']);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Milk' }));
    const input = screen.getByRole('textbox', { name: 'To-do' });
    fireEvent.change(input, { target: { value: 'Oat milk' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(titles()).toEqual(['Oat milk']);
  });
});
