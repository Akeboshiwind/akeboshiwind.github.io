import { test, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

test('the upload screen renders', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Image Compare' })).toBeTruthy();
});
