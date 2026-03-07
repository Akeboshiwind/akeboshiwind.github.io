import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { EntryList } from './EntryList.jsx';

const makeEntry = (overrides) => ({
  bitwarden_id: 'id-1',
  name: 'GitHub',
  type: 'login',
  uris: [{ uri: 'https://github.com' }],
  disposition: null,
  is_pinned: false,
  folder_name: 'Dev',
  custom_fields: [],
  attachments: [],
  totp: null,
  ...overrides,
});

describe('EntryList', () => {
  afterEach(() => cleanup());
  it('renders active entries', () => {
    const entries = [makeEntry()];
    render(<EntryList entries={entries} onPin={vi.fn()} />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('Dev')).toBeInTheDocument();
  });

  it('separates done entries', () => {
    const entries = [
      makeEntry({ bitwarden_id: '1', name: 'Active', disposition: null }),
      makeEntry({ bitwarden_id: '2', name: 'Done', disposition: 'apple_passwords' }),
    ];
    render(<EntryList entries={entries} onPin={vi.fn()} />);
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('filters by search text', () => {
    const entries = [
      makeEntry({ bitwarden_id: '1', name: 'GitHub' }),
      makeEntry({ bitwarden_id: '2', name: 'Gmail', uris: [{ uri: 'https://mail.google.com' }] }),
    ];
    render(<EntryList entries={entries} onPin={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'git' } });
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.queryByText('Gmail')).not.toBeInTheDocument();
  });

  it('filters by type', () => {
    const entries = [
      makeEntry({ bitwarden_id: '1', name: 'Login Item', type: 'login' }),
      makeEntry({ bitwarden_id: '2', name: 'Note Item', type: 'secure_note' }),
    ];
    render(<EntryList entries={entries} onPin={vi.fn()} />);
    fireEvent.change(screen.getByDisplayValue('All types'), { target: { value: 'secure_note' } });
    expect(screen.queryByText('Login Item')).not.toBeInTheDocument();
    expect(screen.getByText('Note Item')).toBeInTheDocument();
  });

  it('calls onPin when clicking an entry', () => {
    const onPin = vi.fn();
    render(<EntryList entries={[makeEntry()]} onPin={onPin} />);
    fireEvent.click(screen.getByText('GitHub'));
    expect(onPin).toHaveBeenCalledWith('id-1');
  });
});
