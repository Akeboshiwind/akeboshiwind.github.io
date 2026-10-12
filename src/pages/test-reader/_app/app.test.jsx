import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within, waitFor } from '@testing-library/react';
import { App } from './app.jsx';

const PAPER = [235, 232, 228];
const CONTROL = [140, 40, 70];
const TEST_LINE = [190, 120, 140];
const pixel = (y) => (y >= 140 && y < 160 ? CONTROL : y >= 260 && y < 280 ? TEST_LINE : PAPER);

class FakeImage {
  set src(_) {
    this.width = 300;
    this.height = 600;
    queueMicrotask(() => this.onload());
  }
}

const fakeContext = () => new Proxy({
  getImageData(x, y, w) {
    const data = new Uint8ClampedArray(w * 4);
    for (let i = 0; i < w; i++) data.set([...pixel(y), 255], i * 4);
    return { data };
  },
}, { get: (target, key) => (key in target ? target[key] : () => {}), set: () => true });

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('Image', FakeImage);
  vi.stubGlobal('confirm', vi.fn(() => true));
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake');
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(fakeContext);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(300);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const stored = () => JSON.parse(localStorage.getItem('testReaderData'));
const click = (name) => fireEvent.click(screen.getByRole('button', { name }));
const results = () => within(screen.getByRole('region', { name: 'Results' }));
const at = (iso) => new Date(iso).toLocaleDateString();

const seed = {
  tests: [{
    id: 'covid',
    name: 'COVID',
    createdAt: '2026-01-01T09:00:00.000Z',
    data: [
      { score: 0.42, timestamp: '2026-01-02T09:00:00.000Z' },
      { score: 1.1, timestamp: '2026-01-03T09:00:00.000Z', manual: true },
    ],
  }],
};

const createTest = (name) => {
  click('+ Create Test');
  fireEvent.change(screen.getByRole('textbox', { name: 'Test name' }), { target: { value: name } });
  click('Create');
};

describe('Lateral Flow Test Reader', () => {
  test('starts with no tests', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Lateral Flow Test Reader' })).toBeTruthy();
    expect(screen.getByText(/No tests yet\./)).toBeTruthy();
  });

  test('a test needs a name, and creating one opens it and stores it', () => {
    render(<App />);
    createTest('   ');
    expect(screen.getByRole('alert').textContent).toBe('Please enter a test name');

    fireEvent.change(screen.getByRole('textbox', { name: 'Test name' }), { target: { value: 'Ovulation' } });
    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Test name' }), { key: 'Enter' });
    expect(screen.getByRole('heading', { name: 'Ovulation' })).toBeTruthy();
    expect(stored().tests.map((t) => [t.name, t.data])).toEqual([['Ovulation', []]]);

    click('← Back to Tests');
    expect(screen.getByText('0 entries · Last: No entries')).toBeTruthy();
  });

  test('a photo of a strip is read as the test line over the control line, and Save records it', async () => {
    render(<App />);
    createTest('COVID');
    click('+ New Test');
    fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [new File(['x'], 'strip.png', { type: 'image/png' })] } });

    const reading = within(await screen.findByRole('region', { name: 'Reading' }));
    await waitFor(() => expect(reading.getByText('0.55')).toBeTruthy());
    expect(reading.getByText('intensity: 148.3')).toBeTruthy();
    expect(reading.getByText('intensity: 81.7')).toBeTruthy();

    click('Save');
    expect(screen.queryByRole('region', { name: 'Reading' })).toBeNull();
    expect(results().getByText('0.55')).toBeTruthy();
    const [entry] = stored().tests[0].data;
    expect(entry.score).toBeCloseTo(0.5506, 4);
    expect(entry.manual).toBeUndefined();
  });

  test('Cancel discards a photo reading', async () => {
    render(<App />);
    createTest('COVID');
    click('+ New Test');
    fireEvent.change(document.querySelector('input[type="file"]'), { target: { files: [new File(['x'], 'strip.png', { type: 'image/png' })] } });
    await screen.findByRole('region', { name: 'Reading' });
    click('Cancel');
    expect(stored().tests[0].data).toEqual([]);
    expect(screen.getByRole('button', { name: '+ New Test' })).toBeTruthy();
  });

  test('a manual entry needs a score above 0 and is stored as manual', () => {
    render(<App />);
    createTest('COVID');
    click('Manual Entry');
    expect(screen.getByRole('spinbutton').value).toBe('0.5');

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0' } });
    click('Save');
    expect(screen.getByRole('alert').textContent).toBe('Score must be greater than 0');

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0.8' } });
    fireEvent.change(screen.getByLabelText('Date & Time:'), { target: { value: '2026-01-05T08:30' } });
    click('Save');
    expect(stored().tests[0].data).toEqual([{ score: 0.8, timestamp: new Date('2026-01-05T08:30').toISOString(), manual: true }]);
    expect(results().getByText('0.80')).toBeTruthy();
  });
});

describe('saved results', () => {
  test('tests stored under testReaderData are listed and their results shown', () => {
    localStorage.setItem('testReaderData', JSON.stringify(seed));
    render(<App />);
    expect(screen.getByText(`2 entries · Last: ${at('2026-01-03T09:00:00.000Z')}`)).toBeTruthy();

    click(/COVID/);
    expect(results().getByText('0.42')).toBeTruthy();
    expect(results().getByText('1.10')).toBeTruthy();
  });

  test('a series stored under the legacy ovulationTests key shows as Migrated Data', () => {
    localStorage.setItem('ovulationTests', JSON.stringify([{ score: 0.3, timestamp: '2026-01-04T09:00:00.000Z' }]));
    render(<App />);
    expect(screen.getByText('Migrated Data')).toBeTruthy();
    expect(screen.getByText(`1 entries · Last: ${at('2026-01-04T09:00:00.000Z')}`)).toBeTruthy();
    expect(localStorage.getItem('ovulationTests')).toBeNull();
    expect(stored().tests[0].data).toEqual([{ score: 0.3, timestamp: '2026-01-04T09:00:00.000Z' }]);
  });

  test('a result can be edited', () => {
    localStorage.setItem('testReaderData', JSON.stringify(seed));
    render(<App />);
    click(/COVID/);
    click('Edit result 0.42');
    expect(screen.getByRole('spinbutton').value).toBe('0.42');

    fireEvent.change(screen.getByRole('spinbutton'), { target: { value: '0.6' } });
    click('Save');
    expect(stored().tests[0].data[0]).toEqual({ score: 0.6, timestamp: '2026-01-02T09:00:00.000Z' });
    expect(results().getByText('0.60')).toBeTruthy();
  });

  test('a result is deleted once confirmed', () => {
    localStorage.setItem('testReaderData', JSON.stringify(seed));
    render(<App />);
    click(/COVID/);

    confirm.mockReturnValueOnce(false);
    click('Edit result 1.10');
    click('Delete');
    expect(stored().tests[0].data).toHaveLength(2);

    click('Delete');
    expect(confirm).toHaveBeenLastCalledWith('Delete this test result?');
    expect(stored().tests[0].data).toEqual([{ score: 0.42, timestamp: '2026-01-02T09:00:00.000Z' }]);
    expect(results().queryByText('1.10')).toBeNull();
  });
});
