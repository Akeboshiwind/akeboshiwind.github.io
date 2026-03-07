import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ProgressDashboard } from './ProgressDashboard.jsx';

afterEach(cleanup);

describe('ProgressDashboard', () => {
  const defaults = {
    total: 580,
    done: 200,
    remaining: 380,
    applePasswordsMarked: 150,
    applePasswordsReported: null,
    onApplePasswordsCountChange: vi.fn(),
    onReset: vi.fn(),
  };

  it('shows progress counts', () => {
    render(<ProgressDashboard {...defaults} />);
    expect(screen.getByText(/200/)).toBeInTheDocument();
    expect(screen.getByText(/580/)).toBeInTheDocument();
    expect(screen.getByText(/380/)).toBeInTheDocument();
  });

  it('shows checksum delta when reported count entered', () => {
    render(<ProgressDashboard {...defaults} applePasswordsReported={160} />);
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });

  it('has a reset button', () => {
    render(<ProgressDashboard {...defaults} />);
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });
});
