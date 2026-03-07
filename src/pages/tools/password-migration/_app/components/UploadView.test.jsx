import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { UploadView } from './UploadView.jsx';

describe('UploadView', () => {
  it('renders upload prompt', () => {
    render(<UploadView onImport={vi.fn()} isLoading={false} error={null} />);
    expect(screen.getByText(/upload.*bitwarden/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\.zip/i).length).toBeGreaterThanOrEqual(1);
  });

  it('shows loading state', () => {
    render(<UploadView onImport={vi.fn()} isLoading={true} error={null} />);
    expect(screen.getByText(/parsing/i)).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<UploadView onImport={vi.fn()} isLoading={false} error="Bad zip" />);
    expect(screen.getByText('Bad zip')).toBeInTheDocument();
  });
});
