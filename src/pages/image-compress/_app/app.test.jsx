import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { App } from './app.jsx';

let imageSize;
let toBlobCalls;
let downloads;

class FakeImage {
  set src(_) {
    this.width = imageSize.width;
    this.height = imageSize.height;
    queueMicrotask(() => this.onload());
  }
}

beforeEach(() => {
  imageSize = { width: 4000, height: 3000 };
  toBlobCalls = [];
  downloads = [];
  vi.stubGlobal('Image', FakeImage);
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake');
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage() {} });
  HTMLCanvasElement.prototype.toBlob = function (cb, type, quality) {
    toBlobCalls.push({ width: this.width, height: this.height, type, quality });
    cb(new Blob([new Uint8Array(Math.round(quality * 1000) * 1024)], { type }));
  };
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
    downloads.push(this.download);
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const photo = (name = 'holiday.png', bytes = 2 * 1024 * 1024, type = 'image/png') =>
  new File([new Uint8Array(bytes)], name, { type });
const fileInput = () => document.querySelector('input[type="file"]');
const choose = (file) => fireEvent.change(fileInput(), { target: { files: [file] } });
const compressButton = () => screen.getByRole('button', { name: 'Compress' });

describe('Image Compress', () => {
  test('starts empty, with the default size and quality, and nothing to compress', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Image Compress' })).toBeTruthy();
    expect(screen.getByText('Drop an image here or click to upload')).toBeTruthy();
    expect(screen.getByText('Max dimension: 2000px')).toBeTruthy();
    expect(screen.getByText('JPEG quality: 85%')).toBeTruthy();
    expect(compressButton().disabled).toBe(true);
  });

  test('choosing an image previews it and enables Compress', () => {
    render(<App />);
    choose(photo());
    expect(screen.getByRole('img', { name: 'Original' })).toBeTruthy();
    expect(compressButton().disabled).toBe(false);
  });

  test('dropping an image onto the drop zone previews it', () => {
    render(<App />);
    fireEvent.drop(screen.getByText('Drop an image here or click to upload'), {
      dataTransfer: { files: [photo()] },
    });
    expect(screen.getByRole('img', { name: 'Original' })).toBeTruthy();
  });

  test('a file that is not an image is ignored', () => {
    render(<App />);
    choose(photo('notes.txt', 10, 'text/plain'));
    expect(screen.queryByRole('img', { name: 'Original' })).toBeNull();
    expect(compressButton().disabled).toBe(true);
  });

  test('the sliders set the max dimension and the JPEG quality', () => {
    render(<App />);
    const [maxDim, quality] = screen.getAllByRole('slider');
    fireEvent.change(maxDim, { target: { value: '1000' } });
    fireEvent.change(quality, { target: { value: '50' } });
    expect(screen.getByText('Max dimension: 1000px')).toBeTruthy();
    expect(screen.getByText('JPEG quality: 50%')).toBeTruthy();
  });

  test('compressing scales the image to the max dimension and reports the saving', async () => {
    render(<App />);
    choose(photo());
    fireEvent.click(compressButton());

    expect(await screen.findByText('58.5% smaller')).toBeTruthy();
    expect(toBlobCalls).toEqual([{ width: 2000, height: 1500, type: 'image/jpeg', quality: 0.85 }]);
    expect(screen.getByText('Original')).toBeTruthy();
    expect(screen.getByText('4000 × 3000')).toBeTruthy();
    expect(screen.getByText('2.00 MB')).toBeTruthy();
    expect(screen.getByText('Compressed')).toBeTruthy();
    expect(screen.getByText('2000 × 1500')).toBeTruthy();
    expect(screen.getByText('850.0 KB')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'Compressed' })).toBeTruthy();
  });

  test('an output larger than the original is a warning, not a saving', async () => {
    render(<App />);
    choose(photo('small.jpg', 500 * 1024));
    fireEvent.click(compressButton());

    const result = await screen.findByText('70.0% larger — try a lower quality or a smaller max size');
    expect(result.getAttribute('data-variant')).toBe('warn');
    expect(screen.queryByText(/% smaller/)).toBeNull();
  });

  test('an image already under the max dimension is not scaled up', async () => {
    imageSize = { width: 800, height: 600 };
    render(<App />);
    choose(photo());
    fireEvent.click(compressButton());
    await screen.findByText(/% smaller/);
    expect(toBlobCalls[0]).toMatchObject({ width: 800, height: 600 });
  });

  test('Download saves the result as <name>-compressed.jpg', async () => {
    render(<App />);
    choose(photo('holiday.png'));
    fireEvent.click(compressButton());
    fireEvent.click(await screen.findByRole('button', { name: 'Download' }));
    expect(downloads).toEqual(['holiday-compressed.jpg']);
  });
});
