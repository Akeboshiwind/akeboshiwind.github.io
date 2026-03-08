# Password Migration Helper Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a client-side tool to audit and track migration of a Bitwarden vault to Apple Passwords, Uplock, and Apple Wallet.

**Architecture:** React SPA rendered into an Astro page shell. All state in localStorage via a `useLocalStorage` hook. Bitwarden `.zip` parsed client-side with JSZip. No server, no network requests with vault data. Component-per-view pattern matching the YNAB tool.

**Tech Stack:** React 19, Tailwind CSS 4, JSZip, Vitest + Testing Library

**Spec:** `src/pages/tools/password-migration/spec.allium`

**Bitwarden JSON types:** 1=Login, 2=SecureNote, 3=Card, 4=Identity. Custom field types: 0=text, 1=hidden, 2=boolean.

---

### Task 1: Install JSZip and set up parser module

**Files:**
- Modify: `package.json` (add jszip dependency)
- Create: `src/pages/tools/password-migration/_app/parser.js`
- Test: `src/pages/tools/password-migration/_app/parser.test.js`

**Step 1: Install JSZip**

Run: `npm install jszip`

**Step 2: Write failing tests for the parser**

```js
// parser.test.js
import { describe, it, expect } from 'vitest';
import { parseBitwardenItem, mapFolders } from './parser.js';

describe('mapFolders', () => {
  it('maps folder IDs to names', () => {
    const folders = [
      { id: 'f1', name: 'Social' },
      { id: 'f2', name: 'Work' },
    ];
    expect(mapFolders(folders)).toEqual({ f1: 'Social', f2: 'Work' });
  });

  it('returns empty map for empty array', () => {
    expect(mapFolders([])).toEqual({});
  });
});

describe('parseBitwardenItem', () => {
  const folderMap = { 'folder-1': 'Social Media' };

  it('parses a login item', () => {
    const item = {
      id: 'abc-123',
      type: 1,
      name: 'GitHub',
      notes: 'my notes',
      favorite: true,
      folderId: 'folder-1',
      login: {
        uris: [{ uri: 'https://github.com', match: null }],
        username: 'user@example.com',
        password: 'secret123',
        totp: 'otpauth://totp/GitHub?secret=ABC',
      },
      fields: [
        { name: 'API Key', value: 'key-123', type: 1 },
        { name: 'Recovery', value: 'code1 code2', type: 0 },
      ],
    };

    const result = parseBitwardenItem(item, folderMap);

    expect(result.bitwarden_id).toBe('abc-123');
    expect(result.name).toBe('GitHub');
    expect(result.type).toBe('login');
    expect(result.folder_name).toBe('Social Media');
    expect(result.notes).toBe('my notes');
    expect(result.is_favorite).toBe(true);
    expect(result.uris).toEqual([{ uri: 'https://github.com' }]);
    expect(result.username).toBe('user@example.com');
    expect(result.password).toBe('secret123');
    expect(result.totp).toBe('otpauth://totp/GitHub?secret=ABC');
    expect(result.custom_fields).toEqual([
      { name: 'API Key', value: 'key-123', is_hidden: true },
      { name: 'Recovery', value: 'code1 code2', is_hidden: false },
    ]);
  });

  it('parses a secure note', () => {
    const item = {
      id: 'note-1',
      type: 2,
      name: 'Server Info',
      notes: 'SSH details here',
      favorite: false,
      folderId: null,
      secureNote: {},
      fields: null,
    };

    const result = parseBitwardenItem(item, folderMap);

    expect(result.type).toBe('secure_note');
    expect(result.folder_name).toBeNull();
    expect(result.custom_fields).toEqual([]);
  });

  it('parses a card item', () => {
    const item = {
      id: 'card-1',
      type: 3,
      name: 'Visa',
      notes: null,
      favorite: false,
      folderId: null,
      card: {
        cardholderName: 'Oliver',
        brand: 'Visa',
        number: '4111111111111111',
        expMonth: '12',
        expYear: '2028',
        code: '123',
      },
      fields: null,
    };

    const result = parseBitwardenItem(item, folderMap);

    expect(result.type).toBe('card');
    expect(result.card_number).toBe('4111111111111111');
    expect(result.card_brand).toBe('Visa');
    expect(result.card_exp_month).toBe('12');
    expect(result.card_code).toBe('123');
  });

  it('parses an identity item', () => {
    const item = {
      id: 'id-1',
      type: 4,
      name: 'Personal',
      notes: null,
      favorite: false,
      folderId: null,
      identity: {
        title: 'Mr',
        firstName: 'Oliver',
        middleName: null,
        lastName: 'Smith',
        email: 'oliver@example.com',
        phone: '+441234567890',
        address1: '123 Main St',
        address2: null,
        address3: null,
        city: 'London',
        state: null,
        postalCode: 'SW1A 1AA',
        country: 'GB',
        username: null,
      },
      fields: null,
    };

    const result = parseBitwardenItem(item, folderMap);

    expect(result.type).toBe('identity');
    expect(result.identity_first_name).toBe('Oliver');
    expect(result.identity_email).toBe('oliver@example.com');
    expect(result.identity_phone).toBe('+441234567890');
    expect(result.identity_address).toBe('123 Main St, London, SW1A 1AA, GB');
  });
});
```

**Step 3: Run tests to verify they fail**

Run: `npm test -- src/pages/tools/password-migration/_app/parser.test.js`
Expected: FAIL (module not found)

**Step 4: Implement the parser**

```js
// parser.js

const TYPE_MAP = { 1: 'login', 2: 'secure_note', 3: 'card', 4: 'identity' };
const FIELD_TYPE_HIDDEN = 1;

export function mapFolders(folders) {
  const map = {};
  for (const f of folders) {
    map[f.id] = f.name;
  }
  return map;
}

export function parseBitwardenItem(item, folderMap) {
  const base = {
    bitwarden_id: item.id,
    name: item.name,
    type: TYPE_MAP[item.type] || 'unknown',
    notes: item.notes || null,
    is_favorite: item.favorite || false,
    folder_name: item.folderId ? (folderMap[item.folderId] || null) : null,
    custom_fields: (item.fields || []).map(f => ({
      name: f.name,
      value: f.value,
      is_hidden: f.type === FIELD_TYPE_HIDDEN,
    })),
    attachments: [],
    // Migration state (defaults)
    disposition: null,
    user_notes: '',
    is_pinned: false,
    field_statuses: {
      totp: null,
      notes: null,
      custom_fields: [],
      attachments: [],
    },
  };

  // Login fields
  base.uris = [];
  base.username = null;
  base.password = null;
  base.totp = null;
  if (item.type === 1 && item.login) {
    base.uris = (item.login.uris || []).map(u => ({ uri: u.uri }));
    base.username = item.login.username || null;
    base.password = item.login.password || null;
    base.totp = item.login.totp || null;
  }

  // Card fields
  base.cardholder_name = null;
  base.card_brand = null;
  base.card_number = null;
  base.card_exp_month = null;
  base.card_exp_year = null;
  base.card_code = null;
  if (item.type === 3 && item.card) {
    base.cardholder_name = item.card.cardholderName || null;
    base.card_brand = item.card.brand || null;
    base.card_number = item.card.number || null;
    base.card_exp_month = item.card.expMonth || null;
    base.card_exp_year = item.card.expYear || null;
    base.card_code = item.card.code || null;
  }

  // Identity fields
  base.identity_title = null;
  base.identity_first_name = null;
  base.identity_last_name = null;
  base.identity_email = null;
  base.identity_phone = null;
  base.identity_address = null;
  if (item.type === 4 && item.identity) {
    const id = item.identity;
    base.identity_title = id.title || null;
    base.identity_first_name = id.firstName || null;
    base.identity_last_name = id.lastName || null;
    base.identity_email = id.email || null;
    base.identity_phone = id.phone || null;
    base.identity_address = [id.address1, id.address2, id.address3, id.city, id.state, id.postalCode, id.country]
      .filter(Boolean)
      .join(', ') || null;
  }

  // Initialize field_statuses arrays to match custom_fields length
  base.field_statuses.custom_fields = base.custom_fields.map(() => null);

  return base;
}

export async function parseZipExport(zipFile) {
  const JSZip = (await import('jszip')).default;
  const zip = await JSZip.loadAsync(zipFile);

  const dataFile = zip.file('data.json');
  if (!dataFile) throw new Error('No data.json found in zip');

  const dataJson = await dataFile.async('string');
  const data = JSON.parse(dataJson);

  const folderMap = mapFolders(data.folders || []);
  const entries = (data.items || []).map(item => parseBitwardenItem(item, folderMap));

  // Load attachments
  for (const entry of entries) {
    const itemAttachments = (data.items.find(i => i.id === entry.bitwarden_id)?.attachments) || [];
    for (const att of itemAttachments) {
      const attFile = zip.file(att.fileName);
      let content = null;
      let is_binary = false;
      if (attFile) {
        try {
          content = await attFile.async('string');
          // Check if content looks binary
          if (/[\x00-\x08\x0E-\x1F]/.test(content.substring(0, 1000))) {
            content = null;
            is_binary = true;
          }
        } catch {
          is_binary = true;
        }
      }
      entry.attachments.push({ filename: att.fileName, content, is_binary });
    }
    entry.field_statuses.attachments = entry.attachments.map(() => null);
  }

  return entries;
}
```

**Step 5: Run tests to verify they pass**

Run: `npm test -- src/pages/tools/password-migration/_app/parser.test.js`
Expected: PASS (all 5 tests)

**Step 6: Commit**

```bash
git add package.json package-lock.json src/pages/tools/password-migration/_app/parser.js src/pages/tools/password-migration/_app/parser.test.js
git commit -m "feat(password-migration): add Bitwarden export parser with tests"
```

---

### Task 2: Build the hooks and state management

**Files:**
- Create: `src/pages/tools/password-migration/_app/hooks.js`
- Test: `src/pages/tools/password-migration/_app/hooks.test.js`

**Step 1: Write failing tests for hooks**

```js
// hooks.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './hooks.js';

beforeEach(() => localStorage.clear());

describe('useLocalStorage', () => {
  it('returns initial value when nothing stored', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    act(() => result.current[1]('updated'));
    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('passwordMigration_key'))).toBe('updated');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('passwordMigration_key', JSON.stringify('stored'));
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('stored');
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/pages/tools/password-migration/_app/hooks.test.js`
Expected: FAIL

**Step 3: Implement hooks**

```js
// hooks.js
import { useState, useEffect } from 'react';

const STORAGE_PREFIX = 'passwordMigration_';

export function useLocalStorage(key, initialValue) {
  const fullKey = STORAGE_PREFIX + key;
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(fullKey);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(fullKey, JSON.stringify(value));
  }, [fullKey, value]);

  return [value, setValue];
}

export function clearAllStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(STORAGE_PREFIX)) keys.push(key);
  }
  keys.forEach(k => localStorage.removeItem(k));
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- src/pages/tools/password-migration/_app/hooks.test.js`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/tools/password-migration/_app/hooks.js src/pages/tools/password-migration/_app/hooks.test.js
git commit -m "feat(password-migration): add localStorage hooks and state management"
```

---

### Task 3: Build the UploadView component

**Files:**
- Create: `src/pages/tools/password-migration/_app/components/UploadView.jsx`
- Test: `src/pages/tools/password-migration/_app/components/UploadView.test.jsx`

**Step 1: Write failing test**

```jsx
// UploadView.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UploadView } from './UploadView.jsx';

describe('UploadView', () => {
  it('renders upload prompt', () => {
    render(<UploadView onImport={vi.fn()} isLoading={false} error={null} />);
    expect(screen.getByText(/upload.*bitwarden/i)).toBeInTheDocument();
    expect(screen.getByText(/\.zip/i)).toBeInTheDocument();
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
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/pages/tools/password-migration/_app/components/UploadView.test.jsx`
Expected: FAIL

**Step 3: Implement UploadView**

```jsx
// UploadView.jsx
import React, { useCallback } from 'react';

export function UploadView({ onImport, isLoading, error }) {
  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) onImport(file);
  }, [onImport]);

  return (
    <div className="max-w-xl mx-auto p-8 text-center">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
        Password Migration Helper
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Upload your Bitwarden .zip export to begin tracking your migration
        to Apple Passwords and Uplock.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
          {error}
        </div>
      )}

      {isLoading ? (
        <p className="text-gray-500 dark:text-gray-400">Parsing export...</p>
      ) : (
        <label className="inline-block cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Choose .zip file
          <input
            type="file"
            accept=".zip"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- src/pages/tools/password-migration/_app/components/UploadView.test.jsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/tools/password-migration/_app/components/
git commit -m "feat(password-migration): add UploadView component"
```

---

### Task 4: Build the ProgressDashboard component

**Files:**
- Create: `src/pages/tools/password-migration/_app/components/ProgressDashboard.jsx`
- Test: `src/pages/tools/password-migration/_app/components/ProgressDashboard.test.jsx`

**Step 1: Write failing test**

```jsx
// ProgressDashboard.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProgressDashboard } from './ProgressDashboard.jsx';

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
    expect(screen.getByText(/10/)).toBeInTheDocument(); // delta: 160 - 150
  });

  it('has a reset button', () => {
    render(<ProgressDashboard {...defaults} />);
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/pages/tools/password-migration/_app/components/ProgressDashboard.test.jsx`

**Step 3: Implement ProgressDashboard**

```jsx
// ProgressDashboard.jsx
import React, { useState } from 'react';

export function ProgressDashboard({
  total, done, remaining,
  applePasswordsMarked, applePasswordsReported,
  onApplePasswordsCountChange, onReset,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const delta = applePasswordsReported != null
    ? applePasswordsReported - applePasswordsMarked
    : null;

  return (
    <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Progress
        </h2>
        {showConfirm ? (
          <div className="flex gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Reset all data?</span>
            <button onClick={() => { onReset(); setShowConfirm(false); }}
              className="text-sm px-2 py-1 bg-red-600 text-white rounded">
              Confirm
            </button>
            <button onClick={() => setShowConfirm(false)}
              className="text-sm px-2 py-1 bg-gray-300 dark:bg-gray-600 rounded">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setShowConfirm(true)}
            className="text-sm text-red-600 dark:text-red-400 hover:underline">
            Reset
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
        <div className="bg-green-500 h-3 rounded-full transition-all"
          style={{ width: `${pct}%` }} />
      </div>

      <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <span><strong className="text-gray-900 dark:text-gray-100">{done}</strong> done</span>
        <span><strong className="text-gray-900 dark:text-gray-100">{remaining}</strong> remaining</span>
        <span><strong className="text-gray-900 dark:text-gray-100">{total}</strong> total</span>
      </div>

      {/* Apple Passwords checksum */}
      <div className="flex items-center gap-3 text-sm">
        <label className="text-gray-600 dark:text-gray-400">
          Apple Passwords count:
          <input
            type="number"
            value={applePasswordsReported ?? ''}
            onChange={e => onApplePasswordsCountChange(
              e.target.value === '' ? null : parseInt(e.target.value, 10)
            )}
            className="ml-2 w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
            placeholder="..."
          />
        </label>
        <span className="text-gray-500 dark:text-gray-500">
          Marked: {applePasswordsMarked}
        </span>
        {delta != null && (
          <span className={delta === 0 ? 'text-green-600' : 'text-amber-600'}>
            Delta: {delta > 0 ? '+' : ''}{delta}
          </span>
        )}
      </div>
    </div>
  );
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- src/pages/tools/password-migration/_app/components/ProgressDashboard.test.jsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/tools/password-migration/_app/components/ProgressDashboard.jsx src/pages/tools/password-migration/_app/components/ProgressDashboard.test.jsx
git commit -m "feat(password-migration): add ProgressDashboard component"
```

---

### Task 5: Build the EntryList component with search/filter

**Files:**
- Create: `src/pages/tools/password-migration/_app/components/EntryList.jsx`
- Test: `src/pages/tools/password-migration/_app/components/EntryList.test.jsx`

**Step 1: Write failing test**

```jsx
// EntryList.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
      makeEntry({ bitwarden_id: '2', name: 'Gmail' }),
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
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/pages/tools/password-migration/_app/components/EntryList.test.jsx`

**Step 3: Implement EntryList**

```jsx
// EntryList.jsx
import React, { useState, useMemo } from 'react';

const TYPE_LABELS = {
  login: 'Login',
  secure_note: 'Note',
  card: 'Card',
  identity: 'Identity',
};

const DISPOSITION_LABELS = {
  apple_passwords: 'Apple Passwords',
  uplock: 'Uplock',
  apple_wallet: 'Apple Wallet',
  deleted: 'Deleted',
};

function EntryRow({ entry, onPin }) {
  const hasExtras = entry.custom_fields.length > 0 || entry.totp || entry.attachments.length > 0;
  const isDone = entry.disposition != null;

  return (
    <div
      onClick={() => onPin(entry.bitwarden_id)}
      className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer transition-colors ${
        entry.is_pinned
          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
          : isDone
            ? 'opacity-50 hover:opacity-70'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700/50'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-xs px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 shrink-0">
          {TYPE_LABELS[entry.type] || entry.type}
        </span>
        <span className="text-gray-900 dark:text-gray-100 truncate">{entry.name}</span>
        {entry.folder_name && (
          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">
            {entry.folder_name}
          </span>
        )}
        {hasExtras && (
          <span className="text-xs text-amber-500 shrink-0" title="Has extra fields">*</span>
        )}
      </div>
      {isDone && (
        <span className="text-xs text-green-600 dark:text-green-400 shrink-0 ml-2">
          {DISPOSITION_LABELS[entry.disposition]}
        </span>
      )}
    </div>
  );
}

export function EntryList({ entries, onPin }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = useMemo(() => {
    let result = entries;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(e =>
        e.name.toLowerCase().includes(q) ||
        e.uris?.some(u => u.uri.toLowerCase().includes(q))
      );
    }
    if (typeFilter) {
      result = result.filter(e => e.type === typeFilter);
    }
    return result;
  }, [entries, search, typeFilter]);

  const active = filtered.filter(e => e.disposition == null);
  const done = filtered.filter(e => e.disposition != null);

  // Pinned entry first
  active.sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          placeholder="Search entries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-sm"
        />
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-sm"
        >
          <option value="">All types</option>
          <option value="login">Login</option>
          <option value="secure_note">Note</option>
          <option value="card">Card</option>
          <option value="identity">Identity</option>
        </select>
      </div>

      <div className="space-y-1">
        {active.map(entry => (
          <EntryRow key={entry.bitwarden_id} entry={entry} onPin={onPin} />
        ))}
      </div>

      {done.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-6 mb-2">
            Done ({done.length})
          </h3>
          <div className="space-y-1">
            {done.map(entry => (
              <EntryRow key={entry.bitwarden_id} entry={entry} onPin={onPin} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- src/pages/tools/password-migration/_app/components/EntryList.test.jsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/tools/password-migration/_app/components/EntryList.jsx src/pages/tools/password-migration/_app/components/EntryList.test.jsx
git commit -m "feat(password-migration): add EntryList with search and filter"
```

---

### Task 6: Build the EntryDetail component

**Files:**
- Create: `src/pages/tools/password-migration/_app/components/EntryDetail.jsx`
- Test: `src/pages/tools/password-migration/_app/components/EntryDetail.test.jsx`

**Step 1: Write failing test**

```jsx
// EntryDetail.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
    fireEvent.click(screen.getAllByTitle(/reveal/i)[0]);
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

  it('shows field status toggles for custom fields', () => {
    render(<EntryDetail entry={makeEntry()} {...handlers} />);
    expect(screen.getByText('API Key')).toBeInTheDocument();
  });
});
```

**Step 2: Run tests to verify they fail**

Run: `npm test -- src/pages/tools/password-migration/_app/components/EntryDetail.test.jsx`

**Step 3: Implement EntryDetail**

```jsx
// EntryDetail.jsx
import React, { useState } from 'react';

function RevealField({ label, value, multiline }) {
  const [revealed, setRevealed] = useState(false);
  if (!value) return null;

  return (
    <div className="flex items-start gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400 w-28 shrink-0">{label}</span>
      {revealed ? (
        <div className="flex-1">
          {multiline ? (
            <pre className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">{value}</pre>
          ) : (
            <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{value}</span>
          )}
          <button onClick={() => setRevealed(false)}
            className="ml-2 text-xs text-gray-400 hover:text-gray-600" title="Hide">
            hide
          </button>
        </div>
      ) : (
        <button onClick={() => setRevealed(true)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline" title="Reveal">
          Click to reveal
        </button>
      )}
    </div>
  );
}

function PlainField({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400 w-28 shrink-0">{label}</span>
      <span className="text-sm text-gray-900 dark:text-gray-100">{value}</span>
    </div>
  );
}

function FieldStatusToggle({ label, status, onToggle }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <select
        value={status || ''}
        onChange={e => onToggle(e.target.value || null)}
        className="px-2 py-1 border rounded text-xs dark:bg-gray-700 dark:border-gray-600"
      >
        <option value="">Untracked</option>
        <option value="migrated">Migrated</option>
        <option value="discarded">Discarded</option>
      </select>
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
    </div>
  );
}

const DISPOSITIONS = [
  { value: 'apple_passwords', label: 'Apple Passwords' },
  { value: 'uplock', label: 'Uplock' },
  { value: 'apple_wallet', label: 'Apple Wallet' },
  { value: 'deleted', label: 'Deleted' },
];

export function EntryDetail({
  entry, onSetDisposition, onClearDisposition, onUnpin, onUpdateNotes, onSetFieldStatus,
}) {
  return (
    <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-blue-200 dark:border-blue-800">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{entry.name}</h2>
          <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700">
              {entry.type}
            </span>
            {entry.folder_name && <span>{entry.folder_name}</span>}
          </div>
        </div>
        <button onClick={onUnpin}
          className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          Close
        </button>
      </div>

      {/* Bitwarden fields */}
      <div className="space-y-2 mb-4">
        {entry.uris?.map((u, i) => (
          <PlainField key={i} label={i === 0 ? 'URL' : `URL ${i + 1}`} value={u.uri} />
        ))}
        <PlainField label="Username" value={entry.username} />
        <RevealField label="Password" value={entry.password} />
        <RevealField label="TOTP" value={entry.totp} />
        <PlainField label="Notes" value={entry.notes} />

        {/* Card fields */}
        <PlainField label="Cardholder" value={entry.cardholder_name} />
        <PlainField label="Brand" value={entry.card_brand} />
        <RevealField label="Card Number" value={entry.card_number} />
        <PlainField label="Expires" value={
          entry.card_exp_month && entry.card_exp_year
            ? `${entry.card_exp_month}/${entry.card_exp_year}` : null
        } />
        <RevealField label="CVV" value={entry.card_code} />

        {/* Identity fields */}
        <PlainField label="Title" value={entry.identity_title} />
        <PlainField label="Name" value={
          [entry.identity_first_name, entry.identity_last_name].filter(Boolean).join(' ') || null
        } />
        <PlainField label="Email" value={entry.identity_email} />
        <PlainField label="Phone" value={entry.identity_phone} />
        <PlainField label="Address" value={entry.identity_address} />
      </div>

      {/* Custom fields */}
      {entry.custom_fields.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Custom Fields</h3>
          <div className="space-y-2">
            {entry.custom_fields.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                {f.is_hidden ? (
                  <RevealField label={f.name} value={f.value} />
                ) : (
                  <PlainField label={f.name} value={f.value} />
                )}
                <FieldStatusToggle
                  label=""
                  status={entry.field_statuses.custom_fields[i]}
                  onToggle={v => onSetFieldStatus(entry.bitwarden_id, `custom_field_${i}`, v)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attachments */}
      {entry.attachments.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Attachments</h3>
          <div className="space-y-2">
            {entry.attachments.map((a, i) => (
              <div key={i} className="flex items-center gap-3">
                {a.is_binary ? (
                  <PlainField label={a.filename} value="(binary file)" />
                ) : (
                  <RevealField label={a.filename} value={a.content} multiline />
                )}
                <FieldStatusToggle
                  label=""
                  status={entry.field_statuses.attachments[i]}
                  onToggle={v => onSetFieldStatus(entry.bitwarden_id, `attachment_${i}`, v)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOTP and Notes field tracking */}
      {(entry.totp || entry.notes) && (
        <div className="mb-4 space-y-2">
          {entry.totp && (
            <FieldStatusToggle
              label="TOTP code"
              status={entry.field_statuses.totp}
              onToggle={v => onSetFieldStatus(entry.bitwarden_id, 'totp', v)}
            />
          )}
          {entry.notes && (
            <FieldStatusToggle
              label="Notes"
              status={entry.field_statuses.notes}
              onToggle={v => onSetFieldStatus(entry.bitwarden_id, 'notes', v)}
            />
          )}
        </div>
      )}

      {/* Disposition */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</h3>
        <div className="flex flex-wrap gap-2">
          {DISPOSITIONS.map(d => (
            <button key={d.value}
              onClick={() => entry.disposition === d.value
                ? onClearDisposition(entry.bitwarden_id)
                : onSetDisposition(entry.bitwarden_id, d.value)
              }
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                entry.disposition === d.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* User notes */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Notes</h3>
        <textarea
          value={entry.user_notes}
          onChange={e => onUpdateNotes(entry.bitwarden_id, e.target.value)}
          placeholder="Add notes about this entry..."
          rows={2}
          className="w-full px-3 py-2 border rounded text-sm dark:bg-gray-700 dark:border-gray-600"
        />
      </div>
    </div>
  );
}
```

**Step 4: Run tests to verify they pass**

Run: `npm test -- src/pages/tools/password-migration/_app/components/EntryDetail.test.jsx`
Expected: PASS

**Step 5: Commit**

```bash
git add src/pages/tools/password-migration/_app/components/EntryDetail.jsx src/pages/tools/password-migration/_app/components/EntryDetail.test.jsx
git commit -m "feat(password-migration): add EntryDetail with reveal, disposition, field tracking"
```

---

### Task 7: Wire everything together in App

**Files:**
- Modify: `src/pages/tools/password-migration/_app/app.jsx`
- Modify: `src/pages/tools/password-migration/_app/app.css`

**Step 1: Replace the skeleton app.jsx**

```jsx
// app.jsx
import React, { useState, useCallback, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocalStorage, clearAllStorage } from './hooks.js';
import { parseZipExport } from './parser.js';
import { UploadView } from './components/UploadView.jsx';
import { ProgressDashboard } from './components/ProgressDashboard.jsx';
import { EntryList } from './components/EntryList.jsx';
import { EntryDetail } from './components/EntryDetail.jsx';
import './app.css';

const App = () => {
  const [entries, setEntries] = useLocalStorage('entries', null);
  const [applePasswordsReported, setApplePasswordsReported] = useLocalStorage('applePasswordsReported', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImport = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const parsed = await parseZipExport(file);
      setEntries(parsed);
    } catch (e) {
      setError(e.message || 'Failed to parse export');
    } finally {
      setIsLoading(false);
    }
  }, [setEntries]);

  const handleReset = useCallback(() => {
    clearAllStorage();
    setEntries(null);
    setApplePasswordsReported(null);
  }, [setEntries, setApplePasswordsReported]);

  const updateEntry = useCallback((id, updater) => {
    setEntries(prev => prev.map(e =>
      e.bitwarden_id === id ? updater(e) : e
    ));
  }, [setEntries]);

  const handlePin = useCallback((id) => {
    setEntries(prev => prev.map(e => ({
      ...e,
      is_pinned: e.bitwarden_id === id ? !e.is_pinned : false,
    })));
  }, [setEntries]);

  const handleSetDisposition = useCallback((id, disposition) => {
    updateEntry(id, e => ({ ...e, disposition }));
  }, [updateEntry]);

  const handleClearDisposition = useCallback((id) => {
    updateEntry(id, e => ({ ...e, disposition: null }));
  }, [updateEntry]);

  const handleUnpin = useCallback(() => {
    setEntries(prev => prev.map(e => ({ ...e, is_pinned: false })));
  }, [setEntries]);

  const handleUpdateNotes = useCallback((id, text) => {
    updateEntry(id, e => ({ ...e, user_notes: text }));
  }, [updateEntry]);

  const handleSetFieldStatus = useCallback((id, fieldName, status) => {
    updateEntry(id, e => {
      const fs = { ...e.field_statuses };
      if (fieldName === 'totp') {
        fs.totp = status;
      } else if (fieldName === 'notes') {
        fs.notes = status;
      } else if (fieldName.startsWith('custom_field_')) {
        const idx = parseInt(fieldName.split('_')[2], 10);
        fs.custom_fields = [...fs.custom_fields];
        fs.custom_fields[idx] = status;
      } else if (fieldName.startsWith('attachment_')) {
        const idx = parseInt(fieldName.split('_')[1], 10);
        fs.attachments = [...fs.attachments];
        fs.attachments[idx] = status;
      }
      return { ...e, field_statuses: fs };
    });
  }, [updateEntry]);

  // Show upload view if no entries loaded
  if (!entries) {
    return <UploadView onImport={handleImport} isLoading={isLoading} error={error} />;
  }

  const total = entries.length;
  const done = entries.filter(e => e.disposition != null).length;
  const remaining = total - done;
  const applePasswordsMarked = entries.filter(e => e.disposition === 'apple_passwords').length;
  const pinnedEntry = entries.find(e => e.is_pinned);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Password Migration Helper
      </h1>

      <ProgressDashboard
        total={total}
        done={done}
        remaining={remaining}
        applePasswordsMarked={applePasswordsMarked}
        applePasswordsReported={applePasswordsReported}
        onApplePasswordsCountChange={setApplePasswordsReported}
        onReset={handleReset}
      />

      {pinnedEntry && (
        <EntryDetail
          entry={pinnedEntry}
          onSetDisposition={handleSetDisposition}
          onClearDisposition={handleClearDisposition}
          onUnpin={handleUnpin}
          onUpdateNotes={handleUpdateNotes}
          onSetFieldStatus={handleSetFieldStatus}
        />
      )}

      <EntryList entries={entries} onPin={handlePin} />
    </div>
  );
};

createRoot(document.getElementById('app')).render(<App />);
```

**Step 2: Verify app.css is correct (already has `@import "tailwindcss";`)**

No change needed.

**Step 3: Run all tests**

Run: `npm test -- src/pages/tools/password-migration/`
Expected: All tests pass

**Step 4: Run dev server and manually test**

Run: `npm run dev`
Visit: `http://localhost:4321/tools/password-migration/`
Verify: Upload screen appears. After uploading a Bitwarden zip, entries load and you can pin, set disposition, track fields, search, filter, reset.

**Step 5: Build for production**

Run: `npm run build`
Expected: Build succeeds

**Step 6: Commit**

```bash
git add src/pages/tools/password-migration/_app/app.jsx src/pages/tools/password-migration/_app/app.css
git commit -m "feat(password-migration): wire up all components in main App"
```

---

### Task 8: Update content metadata

**Files:**
- Modify: `src/content/tools/password-migration.json`

**Step 1: Update the description**

```json
{
  "title": "Password Migration Helper",
  "date": "2026-03-07",
  "description": "Audit and track migration of a Bitwarden vault to Apple Passwords and Uplock."
}
```

**Step 2: Commit**

```bash
git add src/content/tools/password-migration.json
git commit -m "chore(password-migration): update tool description"
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Parser (Bitwarden JSON + zip) | `parser.js`, `parser.test.js` |
| 2 | Hooks (localStorage, clearAll) | `hooks.js`, `hooks.test.js` |
| 3 | UploadView | `components/UploadView.jsx`, `.test.jsx` |
| 4 | ProgressDashboard | `components/ProgressDashboard.jsx`, `.test.jsx` |
| 5 | EntryList (search, filter, active/done) | `components/EntryList.jsx`, `.test.jsx` |
| 6 | EntryDetail (reveal, disposition, field tracking) | `components/EntryDetail.jsx`, `.test.jsx` |
| 7 | Wire everything in App | `app.jsx` |
| 8 | Update content metadata | `password-migration.json` |
