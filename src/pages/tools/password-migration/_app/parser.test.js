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
