import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

describe('Dual-Background Matte', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Dual-Background Matte')).toBeTruthy();
  });

  test('has a home link', () => {
    render(<App />);
    const home = screen.getByText('← Home').closest('a');
    expect(home.getAttribute('href')).toBe('../');
  });

  test('shows help by default and can hide it', () => {
    render(<App />);
    expect(screen.getByText('How this works')).toBeTruthy();
    fireEvent.click(screen.getByText('Hide help'));
    expect(screen.queryByText('How this works')).toBeNull();
  });

  test('shows both file pickers and the five view pills', () => {
    render(<App />);
    expect(screen.getByText('Photo on white background')).toBeTruthy();
    expect(screen.getByText('Photo on black background')).toBeTruthy();
    for (const label of ['Result', 'Stray opaque', 'Stray transparent', 'Partial alpha', 'Difference']) {
      // Each view label is rendered as a button in the pill row.
      const btn = screen.getAllByRole('button', { name: label })[0];
      expect(btn).toBeTruthy();
    }
  });

  test('shows the sticky download button (disabled before upload)', () => {
    render(<App />);
    const btn = screen.getByText('Download transparent PNG').closest('button');
    expect(btn.disabled).toBe(true);
  });
});
