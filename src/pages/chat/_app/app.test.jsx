import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

describe('Chat', () => {
  beforeEach(() => { localStorage.clear(); });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Chat')).toBeTruthy();
  });

  test('has a home link', () => {
    render(<App />);
    const home = screen.getByText('← Home').closest('a');
    expect(home.getAttribute('href')).toBe('../');
  });

  test('sending a message adds it to the list', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    fireEvent.change(textarea, { target: { value: 'hello world' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('hello world')).toBeTruthy();
    expect(textarea.value).toBe('');
  });

  test('empty messages are not sent', () => {
    render(<App />);
    const sendButton = screen.getByRole('button', { name: 'Send' });
    expect(sendButton.disabled).toBe(true);
  });

  test('clear removes all messages', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    const sendButton = screen.getByRole('button', { name: 'Send' });

    fireEvent.change(textarea, { target: { value: 'first' } });
    fireEvent.click(sendButton);
    fireEvent.change(textarea, { target: { value: 'second' } });
    fireEvent.click(sendButton);

    expect(screen.getByText('first')).toBeTruthy();
    expect(screen.getByText('second')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.queryByText('first')).toBeNull();
    expect(screen.queryByText('second')).toBeNull();
  });
});

describe('Chat flows', () => {
  beforeEach(() => { localStorage.clear(); });

  test('an empty conversation invites a first message and cannot be cleared', () => {
    render(<App />);
    expect(screen.getByText('No messages yet. Say hello.')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear' }).disabled).toBe(true);
  });

  test('Enter sends the draft', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'by enter' } });
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(screen.getByText('by enter')).toBeTruthy();
    expect(textarea.value).toBe('');
    expect(screen.queryByText('No messages yet. Say hello.')).toBeNull();
  });

  test('Shift+Enter does not send', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'not yet' } });
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(textarea.value).toBe('not yet');
  });

  test('a whitespace-only draft cannot be sent', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: '   ' } });
    expect(screen.getByRole('button', { name: 'Send' }).disabled).toBe(true);
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(screen.getByText('No messages yet. Say hello.')).toBeTruthy();
  });

  test('a sent message is trimmed', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: '  padded  ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText('padded')).toBeTruthy();
  });

  test('messages show in the order they were sent', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    for (const text of ['one', 'two', 'three']) {
      fireEvent.change(textarea, { target: { value: text } });
      fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    }
    expect(screen.getAllByRole('listitem').map(li => li.textContent)).toEqual(['one', 'two', 'three']);
  });
});

describe('Chat storage contract', () => {
  beforeEach(() => { localStorage.clear(); });

  test('messages saved under chat_messages load on render', () => {
    localStorage.setItem('chat_messages', JSON.stringify([
      { id: '1_a', text: 'saved before', at: 1700000000000 },
      { id: '2_b', text: 'and again', at: 1700000001000 },
    ]));
    render(<App />);
    expect(screen.getByText('saved before')).toBeTruthy();
    expect(screen.getByText('and again')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Clear' }).disabled).toBe(false);
  });

  test('a sent message is saved to chat_messages as { id, text, at }', () => {
    render(<App />);
    const textarea = screen.getByPlaceholderText('Type a message...');
    fireEvent.change(textarea, { target: { value: 'persist me' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send' }));
    const stored = JSON.parse(localStorage.getItem('chat_messages'));
    expect(stored).toHaveLength(1);
    expect(stored[0]).toEqual({ id: expect.any(String), text: 'persist me', at: expect.any(Number) });
  });

  test('clearing saves an empty list to chat_messages', () => {
    localStorage.setItem('chat_messages', JSON.stringify([{ id: '1_a', text: 'gone soon', at: 1 }]));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(JSON.parse(localStorage.getItem('chat_messages'))).toEqual([]);
  });
});
