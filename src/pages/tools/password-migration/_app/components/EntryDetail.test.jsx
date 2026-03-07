import { describe, it, expect, vi, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { EntryDetail } from './EntryDetail.jsx';

const makeEntry = (overrides) => ({
  bitwarden_id: 'id-1',
  name: 'GitHub',
  type: 'login',
  uris: [{ uri: 'https://github.com' }],
  username: 'user@example.com',
  password: 'secret',
  totp: 'otpauth://totp/secret',
  notes: 'Some notes',
  folder_name: 'Dev',
  custom_fields: [
    { name: 'API Key', value: 'key-123', is_hidden: true },
  ],
  attachments: [
    { filename: 'backup.txt', content: 'code1 code2', is_binary: false },
  ],
  cardholder_name: null, card_brand: null, card_number: null,
  card_exp_month: null, card_exp_year: null, card_code: null,
  identity_title: null, identity_first_name: null, identity_last_name: null,
  identity_email: null, identity_phone: null, identity_address: null,
  disposition: null,
  user_notes: '',
  is_pinned: true,
  field_statuses: {
    totp: null,
    notes: null,
    custom_fields: [null],
    attachments: [null],
  },
  ...overrides,
});

describe('EntryDetail', () => {
  afterEach(cleanup);

  const handlers = {
    onSetDisposition: vi.fn(),
    onClearDisposition: vi.fn(),
    onUnpin: vi.fn(),
    onUpdateNotes: vi.fn(),
    onSetFieldStatus: vi.fn(),
  };

  it('shows entry name and type', () => {
    render(<EntryDetail entry={makeEntry()} {...handlers} />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  it('hides password behind reveal toggle', () => {
    render(<EntryDetail entry={makeEntry()} {...handlers} />);
    expect(screen.queryByText('secret')).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByText(/reveal/i)[0]);
    expect(screen.getByText('secret')).toBeInTheDocument();
  });

  it('shows disposition buttons', () => {
    render(<EntryDetail entry={makeEntry()} {...handlers} />);
    expect(screen.getByRole('button', { name: /apple passwords/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /uplock/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /deleted/i })).toBeInTheDocument();
  });

  it('calls onSetDisposition when clicking a disposition', () => {
    render(<EntryDetail entry={makeEntry()} {...handlers} />);
    fireEvent.click(screen.getByRole('button', { name: /apple passwords/i }));
    expect(handlers.onSetDisposition).toHaveBeenCalledWith('id-1', 'apple_passwords');
  });

  it('shows folder name', () => {
    render(<EntryDetail entry={makeEntry()} {...handlers} />);
    expect(screen.getByText('Dev')).toBeInTheDocument();
  });

  it('shows custom field names', () => {
    render(<EntryDetail entry={makeEntry()} {...handlers} />);
    expect(screen.getByText('API Key')).toBeInTheDocument();
  });
});
