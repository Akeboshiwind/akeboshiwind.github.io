import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

describe('Scoreboard', () => {
  beforeEach(() => { localStorage.clear(); });

  test('renders both sides with starting scores', () => {
    const { container } = render(<App />);
    const scores = container.querySelectorAll('.score');
    expect(scores.length).toBe(2);
    expect(scores[0].textContent).toBe('0');
    expect(scores[1].textContent).toBe('0');
  });

  test('renders the timer at the default 3:00', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.timer-text').textContent).toBe('03:00');
  });

  test('has a home link inside the settings modal', () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText('Settings'));
    const home = screen.getByText('← Home').closest('a');
    expect(home.getAttribute('href')).toBe('../');
  });
});
