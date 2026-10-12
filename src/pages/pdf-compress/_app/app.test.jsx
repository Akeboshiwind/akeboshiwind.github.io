import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, act, waitFor } from '@testing-library/react';
import { App } from './app.jsx';

let workers;
let downloads;

class FakeWorker {
  constructor() {
    this.posted = [];
    this.listeners = [];
    this.terminated = false;
    workers.push(this);
  }
  addEventListener(type, fn) { if (type === 'message') this.listeners.push(fn); }
  postMessage(msg) { this.posted.push(msg); }
  terminate() { this.terminated = true; }
  emit(data) { act(() => { this.listeners.forEach((fn) => fn({ data })); }); }
}

const worker = () => workers[workers.length - 1];

beforeEach(() => {
  localStorage.clear();
  workers = [];
  downloads = [];
  vi.stubGlobal('Worker', FakeWorker);
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
    downloads.push(this.download);
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const MB = 1024 * 1024;
const pdf = (name = 'report.pdf', bytes = 10 * MB, type = 'application/pdf') =>
  new File([new Uint8Array(bytes)], name, { type });
const fileInput = () => document.querySelector('input[type="file"]');
const choose = (file) => fireEvent.change(fileInput(), { target: { files: [file] } });
const compressButton = () => screen.getByRole('button', { name: 'Compress PDF' });

const compress = async () => {
  fireEvent.click(compressButton());
  await waitFor(() => expect(worker().posted).toHaveLength(1));
};

describe('PDF Compress', () => {
  test('starts empty, with eBook chosen and nothing to compress', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'PDF Compress' })).toBeTruthy();
    expect(screen.getByText('Drop a PDF here')).toBeTruthy();
    expect(screen.getByRole('radio', { name: /eBook/ }).checked).toBe(true);
    expect(screen.getAllByRole('radio').map((r) => r.value)).toEqual(['screen', 'ebook', 'printer', 'prepress']);
    expect(compressButton().disabled).toBe(true);
  });

  test('has a home link', () => {
    render(<App />);
    const home = screen.getByText('← Home').closest('a');
    expect(home.getAttribute('href')).toBe('../');
  });

  test('choosing a PDF shows its name, size and an estimate per level, and enables Compress', () => {
    render(<App />);
    choose(pdf());
    expect(screen.getByText('report.pdf')).toBeTruthy();
    expect(screen.getByText('10.00 MB')).toBeTruthy();
    expect(screen.getByText('~1.00 MB (90% smaller)')).toBeTruthy();
    expect(screen.getByText('~3.00 MB (70% smaller)')).toBeTruthy();
    expect(screen.getByText('~5.50 MB (45% smaller)')).toBeTruthy();
    expect(screen.getByText('~8.00 MB (20% smaller)')).toBeTruthy();
    expect(screen.getByText(/Estimates are typical reductions/)).toBeTruthy();
    expect(compressButton().disabled).toBe(false);
  });

  test('dropping a PDF onto the drop zone chooses it', () => {
    render(<App />);
    fireEvent.drop(screen.getByText('Drop a PDF here'), { dataTransfer: { files: [pdf('dropped.pdf')] } });
    expect(screen.getByText('dropped.pdf')).toBeTruthy();
  });

  test('a file that is not a PDF is refused with an error', () => {
    render(<App />);
    choose(pdf('notes.txt', 10, 'text/plain'));
    expect(screen.getByText('Please choose a PDF file.')).toBeTruthy();
    expect(compressButton().disabled).toBe(true);
  });

  test('a .pdf file without a PDF type is accepted', () => {
    render(<App />);
    choose(pdf('scan.PDF', 10, ''));
    expect(screen.getByText('scan.PDF')).toBeTruthy();
  });

  test('compressing sends the file and the chosen level to the worker and shows its progress', async () => {
    render(<App />);
    choose(pdf());
    fireEvent.click(screen.getByRole('radio', { name: /Screen/ }));
    await compress();
    expect(worker().posted[0].type).toBe('compress');
    expect(worker().posted[0].preset).toBe('screen');
    expect(worker().posted[0].buffer.byteLength).toBe(10 * MB);

    worker().emit({ type: 'progress', stage: 'loading' });
    expect(screen.getByRole('button', { name: 'Loading Ghostscript…' }).disabled).toBe(true);
    worker().emit({ type: 'progress', stage: 'compressing', current: 0, total: 0 });
    expect(screen.getByRole('button', { name: 'Compressing…' })).toBeTruthy();
    worker().emit({ type: 'progress', stage: 'compressing', current: 2, total: 5 });
    expect(screen.getByRole('button', { name: 'Compressing — page 2 of 5' })).toBeTruthy();
    expect(screen.getByRole('radio', { name: /Screen/ }).closest('fieldset').disabled).toBe(true);
  });

  test('a finished compression shows both sizes and the saving, and downloads as <name>-compressed.pdf', async () => {
    render(<App />);
    choose(pdf());
    await compress();
    worker().emit({ type: 'done', buffer: new ArrayBuffer(8), size: 4 * MB });

    expect(screen.getByText('Original')).toBeTruthy();
    expect(screen.getByText('Compressed')).toBeTruthy();
    expect(screen.getByText('4.00 MB')).toBeTruthy();
    expect(screen.getByText('60.0% smaller — saved 6.00 MB')).toBeTruthy();
    expect(compressButton().disabled).toBe(false);

    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(downloads).toEqual(['report-compressed.pdf']);
  });

  test('a result no smaller than the original suggests a more aggressive level', async () => {
    render(<App />);
    choose(pdf());
    await compress();
    worker().emit({ type: 'done', buffer: new ArrayBuffer(8), size: 11 * MB });
    expect(screen.getByText('No reduction — try a more aggressive level.')).toBeTruthy();
  });

  test('New file clears the file and the result', async () => {
    render(<App />);
    choose(pdf());
    await compress();
    worker().emit({ type: 'done', buffer: new ArrayBuffer(8), size: 4 * MB });
    fireEvent.click(screen.getByRole('button', { name: 'New file' }));
    expect(screen.queryByText('report.pdf')).toBeNull();
    expect(screen.queryByRole('button', { name: 'Download' })).toBeNull();
    expect(screen.getByText('Drop a PDF here')).toBeTruthy();
    expect(compressButton().disabled).toBe(true);
  });

  test('a worker error is shown', async () => {
    render(<App />);
    choose(pdf());
    await compress();
    worker().emit({ type: 'error', message: 'Ghostscript exploded' });
    expect(screen.getByText('Ghostscript exploded')).toBeTruthy();
  });

  test('the worker is terminated on unmount', () => {
    const { unmount } = render(<App />);
    unmount();
    expect(worker().terminated).toBe(true);
  });
});

describe('PDF Compress storage contract', () => {
  test('the level is read from pdf-compress_preset, stored as JSON', () => {
    localStorage.setItem('pdf-compress_preset', JSON.stringify('prepress'));
    render(<App />);
    expect(screen.getByRole('radio', { name: /Prepress/ }).checked).toBe(true);
  });

  test('choosing a level writes it to pdf-compress_preset', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('radio', { name: /Printer/ }));
    expect(localStorage.getItem('pdf-compress_preset')).toBe('"printer"');
  });
});
