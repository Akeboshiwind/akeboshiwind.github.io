import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

describe('PDF Compress', () => {
  beforeEach(() => { localStorage.clear(); });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('PDF Compress')).toBeTruthy();
  });

  test('has a home link', () => {
    render(<App />);
    const home = screen.getByText('← Home').closest('a');
    expect(home.getAttribute('href')).toBe('../');
  });
});
