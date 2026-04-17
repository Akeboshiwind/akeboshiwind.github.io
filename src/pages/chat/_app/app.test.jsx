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
