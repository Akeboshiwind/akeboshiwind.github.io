import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor, within } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import { App } from './app.jsx';

const KEY = 'sk-ant-api03-test';

// The two keys and shapes users already have saved: useLocalStorage JSON-encodes
// both, with no prefix.
const savedLists = () => [
  {
    id: 'list-1',
    name: 'Sci-Fi Books',
    description: 'Thoughtful science fiction with complex characters',
    createdAt: 1700000000000,
    recommendations: [
      { id: 'r1', text: 'Dune', status: 'seen', feedback: '', round: 1, generatedAt: 1700000000001, reviewedAt: 1700000000100, note: 'loved the world-building' },
      { id: 'r2', text: 'Foundation', status: 'seen', feedback: '', round: 1, generatedAt: 1700000000001, reviewedAt: 1700000000200, note: 'too dry' },
      { id: 'r3', text: 'Blindsight', status: 'seen', note: 'read it last year', round: null, generatedAt: null, reviewedAt: 1700000000300 },
      { id: 'r4', text: 'Hyperion', status: 'pending', feedback: '', round: 2, generatedAt: 1700000000400, reviewedAt: null },
      { id: 'r5', text: 'Ancillary Justice', status: 'pending', feedback: '', round: 2, generatedAt: 1700000000400, reviewedAt: null },
    ],
  },
  {
    id: 'list-2',
    name: 'Podcasts',
    description: 'Long-form interviews',
    createdAt: 1700000000500,
    recommendations: [],
  },
];

const seed = ({ apiKey = KEY, lists = savedLists() } = {}) => {
  localStorage.setItem('anthropic_apiKey', JSON.stringify(apiKey));
  localStorage.setItem('recommender_lists', JSON.stringify(lists));
};

const storedLists = () => JSON.parse(localStorage.getItem('recommender_lists'));
const storedList = id => storedLists().find(l => l.id === id);

const apiReturns = recommendations =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      content: [{ type: 'tool_use', name: 'provide_recommendations', input: { recommendations } }],
    }),
  });

const apiFails = (status, message) =>
  Promise.resolve({ ok: false, status, json: () => Promise.resolve({ error: { message } }) });

const closeButton = () => screen.getByRole('button', { name: /^(✕|Close)$/ });

let fetchMock;
beforeEach(() => {
  localStorage.clear();
  fetchMock = vi.fn(() => apiReturns(['Should not be called']));
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

test('sits on PixelAppLayout, whose app bar carries the home link', () => {
  expect(readFileSync('src/pages/recommender/index.astro', 'utf8')).toContain("import PixelAppLayout from '../../layouts/PixelAppLayout.astro'");
});

describe('storage contract', () => {
  test('lists and key saved in today\'s format load unchanged', () => {
    seed();
    render(<App />);

    expect(screen.queryByPlaceholderText('sk-ant-api03-...')).toBeNull();
    expect(screen.getByText('Sci-Fi Books')).toBeTruthy();
    expect(screen.getByText('Thoughtful science fiction with complex characters')).toBeTruthy();
    expect(screen.getByText('2 pending')).toBeTruthy();
    expect(screen.getByText('3 reviewed')).toBeTruthy();
    expect(screen.getAllByText('Exploring')).toHaveLength(2);
    expect(screen.getByText('Podcasts')).toBeTruthy();
    expect(screen.getByText('No recommendations yet')).toBeTruthy();
  });

  test('a saved list opens on its pending recommendations without calling the API', () => {
    seed();
    render(<App />);
    fireEvent.click(screen.getByText('Sci-Fi Books'));

    expect(screen.getByText('Hyperion')).toBeTruthy();
    expect(screen.getByText('Ancillary Justice')).toBeTruthy();
    expect(screen.getByText('3 seen so far')).toBeTruthy();
    expect(screen.queryByText('Dune')).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('the saved key is the one sent to the API', async () => {
    seed();
    fetchMock.mockImplementation(() => apiReturns(['Solaris', 'Contact', 'Annihilation']));
    render(<App />);
    fireEvent.click(screen.getByText('Podcasts'));

    await screen.findByText('Solaris');
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.anthropic.com/v1/messages');
    expect(init.headers['x-api-key']).toBe(KEY);
  });
});

describe('API key', () => {
  test('with no key saved, the key screen asks for one in a password field', () => {
    render(<App />);
    expect(screen.getByText('Anthropic API Key')).toBeTruthy();
    const field = screen.getByPlaceholderText('sk-ant-api03-...');
    expect(field.getAttribute('type')).toBe('password');
    expect(screen.getByRole('button', { name: 'Get Started' }).disabled).toBe(true);
  });

  test('a key without the sk-ant- prefix is refused', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('sk-ant-api03-...'), { target: { value: 'not-a-key' } });
    fireEvent.click(screen.getByRole('button', { name: 'Get Started' }));

    expect(screen.getByText('Key should start with sk-ant-')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('anthropic_apiKey'))).toBe('');
  });

  test('a valid key is saved, trimmed, and opens the lists', () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('sk-ant-api03-...'), { target: { value: `  ${KEY}  ` } });
    fireEvent.click(screen.getByRole('button', { name: 'Get Started' }));

    expect(localStorage.getItem('anthropic_apiKey')).toBe(JSON.stringify(KEY));
    expect(screen.getByText('No lists yet')).toBeTruthy();
  });

  test('API Key in the settings menu forgets the key', () => {
    seed();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'API Key' }));

    expect(screen.getByPlaceholderText('sk-ant-api03-...')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('anthropic_apiKey'))).toBe('');
    expect(storedLists()).toHaveLength(2);
  });
});

describe('creating a list', () => {
  test('a new list is saved and its first recommendations generated', async () => {
    seed({ lists: [] });
    fetchMock.mockImplementation(() => apiReturns(['Serial', 'Radiolab', 'Hardcore History']));
    render(<App />);

    expect(screen.getByText('No lists yet')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Create your first list' }));

    const create = screen.getByRole('button', { name: 'Create & Generate' });
    expect(create.disabled).toBe(true);
    fireEvent.change(screen.getByPlaceholderText(/^e\.g\. Sci-Fi Books/), { target: { value: ' Podcasts ' } });
    fireEvent.change(screen.getByPlaceholderText(/^Describe what you want/), { target: { value: 'Story-driven audio' } });
    fireEvent.click(create);

    expect(await screen.findByText('Serial')).toBeTruthy();
    expect(screen.getByText('Radiolab')).toBeTruthy();
    expect(screen.getByText('Hardcore History')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Podcasts' })).toBeTruthy();

    await waitFor(() => {
      const [saved] = storedLists();
      expect(saved).toMatchObject({ name: 'Podcasts', description: 'Story-driven audio' });
      expect(saved.recommendations.map(r => [r.text, r.status, r.round])).toEqual([
        ['Serial', 'pending', 1],
        ['Radiolab', 'pending', 1],
        ['Hardcore History', 'pending', 1],
      ]);
    });
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.messages[0].content).toContain('Story-driven audio');
  });

  test('+ New List opens the form, and Cancel closes it without saving', () => {
    seed();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: '+ New List' }));
    expect(screen.getByText('New List')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByText('New List')).toBeNull();
    expect(storedLists()).toHaveLength(2);
  });
});

describe('recommendations', () => {
  test('an API failure is shown, and Try again retries', async () => {
    seed();
    fetchMock.mockImplementationOnce(() => apiFails(401, 'invalid x-api-key'));
    render(<App />);
    fireEvent.click(screen.getByText('Podcasts'));

    expect(await screen.findByText('Failed to generate recommendations')).toBeTruthy();
    expect(screen.getByText('invalid x-api-key')).toBeTruthy();

    fetchMock.mockImplementationOnce(() => apiReturns(['Serial', 'Radiolab', 'Reply All']));
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByText('Reply All')).toBeTruthy();
    expect(screen.queryByText('Failed to generate recommendations')).toBeNull();
  });

  test('Regenerate replaces the pending recommendations and keeps the seen ones', async () => {
    seed();
    fetchMock.mockImplementation(() => apiReturns(['Solaris', 'Contact', 'Annihilation']));
    render(<App />);
    fireEvent.click(screen.getByText('Sci-Fi Books'));
    fireEvent.click(screen.getByRole('button', { name: 'Regenerate' }));

    expect(await screen.findByText('Solaris')).toBeTruthy();
    expect(screen.queryByText('Hyperion')).toBeNull();
    await waitFor(() => {
      const recs = storedList('list-1').recommendations;
      expect(recs.filter(r => r.status === 'seen').map(r => r.text)).toEqual(['Dune', 'Foundation', 'Blindsight']);
      expect(recs.filter(r => r.status === 'pending').map(r => [r.text, r.round])).toEqual([
        ['Solaris', 3], ['Contact', 3], ['Annihilation', 3],
      ]);
    });
  });

  test('marking one as seen takes a note and moves it out of the pending list', () => {
    seed();
    render(<App />);
    fireEvent.click(screen.getByText('Sci-Fi Books'));
    fireEvent.click(screen.getByText('Hyperion'));

    expect(screen.getByText('Marked as seen')).toBeTruthy();
    const save = screen.getByRole('button', { name: 'Save' });
    expect(save.disabled).toBe(true);
    fireEvent.change(screen.getByPlaceholderText(/^e\.g\. already read it/), { target: { value: ' a classic ' } });
    fireEvent.click(save);

    expect(screen.queryByText('Marked as seen')).toBeNull();
    expect(screen.queryByText('Hyperion')).toBeNull();
    expect(screen.getByText('4 seen so far')).toBeTruthy();
    const hyperion = storedList('list-1').recommendations.find(r => r.id === 'r4');
    expect(hyperion).toMatchObject({ status: 'seen', note: 'a classic' });
    expect(typeof hyperion.reviewedAt).toBe('number');
  });

  test('the seen note can be dismissed without marking', () => {
    seed();
    render(<App />);
    fireEvent.click(screen.getByText('Sci-Fi Books'));
    fireEvent.click(screen.getByText('Hyperion'));
    fireEvent.click(closeButton());

    expect(screen.queryByText('Marked as seen')).toBeNull();
    expect(screen.getByText('Hyperion')).toBeTruthy();
    expect(storedList('list-1').recommendations.find(r => r.id === 'r4').status).toBe('pending');
  });

  test('Back returns to the lists', () => {
    seed();
    render(<App />);
    fireEvent.click(screen.getByText('Sci-Fi Books'));
    fireEvent.click(screen.getByRole('button', { name: /Back/ }));
    expect(screen.getByText('Podcasts')).toBeTruthy();
  });
});

const openListMenu = item => {
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
  fireEvent.click(screen.getByRole('menuitem', { name: item }));
};

describe('history', () => {
  const openHistory = () => {
    seed();
    render(<App />);
    fireEvent.click(screen.getByText('Sci-Fi Books'));
    openListMenu('History');
  };

  test('shows current and reviewed items, newest review first, with their notes', () => {
    openHistory();
    expect(screen.getByText('Current (2)')).toBeTruthy();
    expect(screen.getByText('Reviewed (3)')).toBeTruthy();
    expect(screen.getByText('"loved the world-building"')).toBeTruthy();
    expect(screen.getByText('"read it last year"')).toBeTruthy();

    const reviewed = screen.getByText('Reviewed (3)').parentElement;
    const order = ['Blindsight', 'Foundation', 'Dune'].map(t => within(reviewed).getByText(t));
    expect(order[0].compareDocumentPosition(order[1]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(order[1].compareDocumentPosition(order[2]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('+ Add item saves a custom seen item with its note', () => {
    openHistory();
    fireEvent.click(screen.getByRole('button', { name: '+ Add item' }));
    fireEvent.change(screen.getByPlaceholderText('Item name'), { target: { value: 'Neuromancer' } });
    fireEvent.change(screen.getByPlaceholderText('Add a note...'), { target: { value: 'too bleak' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('Reviewed (4)')).toBeTruthy();
    expect(screen.getByText('"too bleak"')).toBeTruthy();
    const added = storedList('list-1').recommendations.find(r => r.text === 'Neuromancer');
    expect(added).toMatchObject({ status: 'seen', note: 'too bleak', round: null, generatedAt: null });
  });

  test('an item can be renamed and its note edited', () => {
    openHistory();
    const edits = screen.getAllByRole('button', { name: 'Edit' });
    fireEvent.click(edits[edits.length - 1]); // Dune, the oldest review
    fireEvent.change(screen.getByDisplayValue('Dune'), { target: { value: 'Dune Messiah' } });
    fireEvent.change(screen.getByDisplayValue('loved the world-building'), { target: { value: 'darker' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByText('Dune Messiah')).toBeTruthy();
    expect(storedList('list-1').recommendations.find(r => r.id === 'r1')).toMatchObject({ text: 'Dune Messiah', note: 'darker' });
  });

  test('a pending item can be marked as seen from history', () => {
    openHistory();
    fireEvent.click(screen.getAllByRole('button', { name: 'Mark as seen' })[0]);
    const note = screen.getByPlaceholderText('Add a note (optional)...');
    fireEvent.change(note, { target: { value: 'next up' } });
    fireEvent.click(within(note.parentElement).getByRole('button', { name: 'Mark as seen' }));

    expect(screen.getByText('Current (1)')).toBeTruthy();
    expect(screen.getByText('Reviewed (4)')).toBeTruthy();
    expect(storedList('list-1').recommendations.find(r => r.id === 'r4')).toMatchObject({ status: 'seen', note: 'next up' });
  });

  test('an item is deleted after confirming', () => {
    const confirm = vi.fn(() => true);
    vi.stubGlobal('confirm', confirm);
    openHistory();
    const deletes = screen.getAllByRole('button', { name: 'Delete' });
    fireEvent.click(deletes[deletes.length - 1]);

    expect(confirm).toHaveBeenCalledWith('Delete "Dune"?');
    expect(screen.getByText('Reviewed (2)')).toBeTruthy();
    expect(storedList('list-1').recommendations.some(r => r.id === 'r1')).toBe(false);
  });

  test('View prompt shows what will be sent, including seen notes', () => {
    openHistory();
    fireEvent.click(screen.getByRole('button', { name: 'View prompt' }));
    expect(screen.getByText('Current prompt')).toBeTruthy();
    expect(screen.getByText(/- Dune — "loved the world-building"/)).toBeTruthy();
  });

  test('closes', () => {
    openHistory();
    fireEvent.click(closeButton());
    expect(screen.queryByText('Reviewed (3)')).toBeNull();
  });
});

describe('list settings', () => {
  const openSettings = () => {
    seed();
    render(<App />);
    fireEvent.click(screen.getByText('Sci-Fi Books'));
    openListMenu('Settings');
  };

  test('shows the phase and how many have been reviewed', () => {
    openSettings();
    expect(screen.getByText('Exploring')).toBeTruthy();
    expect(screen.getByText('Getting a broad sense of your preferences')).toBeTruthy();
    expect(screen.getByText('3 recommendations reviewed')).toBeTruthy();
  });

  test('renaming and redescribing a list saves it', () => {
    openSettings();
    fireEvent.change(screen.getByDisplayValue('Sci-Fi Books'), { target: { value: 'Space Opera' } });
    fireEvent.change(screen.getByDisplayValue('Thoughtful science fiction with complex characters'), { target: { value: 'Big ships' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

    expect(screen.getByRole('heading', { name: 'Space Opera' })).toBeTruthy();
    expect(storedList('list-1')).toMatchObject({ name: 'Space Opera', description: 'Big ships' });
  });

  test('deleting a list asks first, then removes it', () => {
    openSettings();
    fireEvent.click(screen.getByRole('button', { name: 'Delete list' }));
    expect(screen.getByText('Delete "Sci-Fi Books"? This cannot be undone.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.queryByText('Sci-Fi Books')).toBeNull();
    expect(screen.getByText('Podcasts')).toBeTruthy();
    expect(storedLists().map(l => l.id)).toEqual(['list-2']);
  });
});

describe('import / export', () => {
  const openImportExport = () => {
    seed();
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Import / Export' }));
  };

  test('export shows every list as JSON and copies it', async () => {
    const writeText = vi.fn(() => Promise.resolve());
    vi.stubGlobal('navigator', { ...navigator, clipboard: { writeText } });
    openImportExport();

    const exported = screen.getByDisplayValue(/"name": "Sci-Fi Books"/);
    expect(JSON.parse(exported.value)).toEqual(savedLists());
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith(JSON.stringify(savedLists(), null, 2));
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeTruthy();
  });

  test('invalid JSON and non-arrays are refused', () => {
    openImportExport();
    const field = screen.getByPlaceholderText('[{"id": "...", "name": "...", ...}]');
    fireEvent.change(field, { target: { value: '{not json' } });
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));
    expect(screen.getByText('Invalid JSON. Please check your data.')).toBeTruthy();

    fireEvent.change(field, { target: { value: '{"a": 1}' } });
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));
    expect(screen.getByText('Data must be a JSON array of lists.')).toBeTruthy();
    expect(storedLists()).toHaveLength(2);
  });

  test('import replaces every list after a confirmation', () => {
    openImportExport();
    const incoming = [{ id: 'list-9', name: 'Board Games', description: 'Co-op', createdAt: 1, recommendations: [] }];
    fireEvent.change(screen.getByPlaceholderText('[{"id": "...", "name": "...", ...}]'), { target: { value: JSON.stringify(incoming) } });
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));

    expect(screen.getByText('This will replace all 2 existing lists. Click Import again to confirm.')).toBeTruthy();
    expect(storedLists()).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Import' }));

    expect(screen.getByText('Board Games')).toBeTruthy();
    expect(screen.queryByText('Sci-Fi Books')).toBeNull();
    expect(storedLists()).toEqual(incoming);
  });

  test('a chosen .json file fills the import, which still asks to confirm', async () => {
    openImportExport();
    const incoming = [{ id: 'list-9', name: 'Board Games', description: 'Co-op', createdAt: 1, recommendations: [] }];
    const file = new File([JSON.stringify(incoming)], 'lists.json', { type: 'application/json' });
    fireEvent.change(screen.getByLabelText(/Or choose a \.json file/), { target: { files: [file] } });

    await waitFor(() => expect(screen.getByPlaceholderText('[{"id": "...", "name": "...", ...}]').value).toBe(JSON.stringify(incoming)));
    fireEvent.click(screen.getByRole('button', { name: 'Import' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm Import' }));
    expect(storedLists()).toEqual(incoming);
  });
});
