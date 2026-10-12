import { describe, test, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

describe('TapBlok Unlock', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('TapBlok Unlock')).toBeTruthy();
  });

  test('starts locked', () => {
    render(<App />);
    expect(screen.getByText('Locked')).toBeTruthy();
    expect(screen.getByLabelText('Unlock the QR code')).toBeTruthy();
  });

  test('unlocks on tap and can be locked again', () => {
    render(<App />);

    fireEvent.click(screen.getByLabelText('Unlock the QR code'));
    expect(screen.getByText('Unlocked — ready to scan')).toBeTruthy();
    expect(screen.queryByLabelText('Unlock the QR code')).toBeNull();

    fireEvent.click(screen.getByText('Lock again'));
    expect(screen.getByText('Locked')).toBeTruthy();
    expect(screen.getByLabelText('Unlock the QR code')).toBeTruthy();
  });

  test('the cover dissolves out on unlock and back in on lock, but not on load', () => {
    const { container } = render(<App />);
    const cover = container.querySelector('[data-cover]');
    expect(cover.dataset.cover).toBe('still');

    fireEvent.click(screen.getByLabelText('Unlock the QR code'));
    expect(cover.dataset.cover).toBe('out');

    fireEvent.click(screen.getByText('Lock again'));
    expect(cover.dataset.cover).toBe('in');
  });
});
