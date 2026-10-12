import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { App } from './app.jsx';

const STORAGE_KEY = 'image-compare';
const DEFAULT_TRANSFORM = { scale: 1, rotation: 0, x: 0, y: 0 };

let imageSize;
let encodes;

class FakeImage {
  set src(_) {
    this.width = imageSize.width;
    this.height = imageSize.height;
    queueMicrotask(() => this.onload());
  }
}

beforeEach(() => {
  localStorage.clear();
  imageSize = { width: 4000, height: 3000 };
  encodes = [];
  vi.stubGlobal('Image', FakeImage);
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:fake');
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ drawImage() {} });
  HTMLCanvasElement.prototype.toDataURL = function (type, quality) {
    encodes.push({ width: this.width, height: this.height, type, quality });
    return `data:${type};${this.width}x${this.height}#${encodes.length}`;
  };
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const photo = (name = 'a.png', type = 'image/png') => new File([new Uint8Array(16)], name, { type });
const fileInputs = () => document.querySelectorAll('input[type="file"]');
const choose = (slot, file) => fireEvent.change(fileInputs()[slot - 1], { target: { files: [file] } });
const compareButton = () => screen.getByRole('button', { name: 'Compare' });
const stored = () => JSON.parse(localStorage.getItem(STORAGE_KEY));
const img = (name) => screen.getByRole('img', { name });

const seed = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
const bothImages = (over = {}) => ({
  image1: 'data:image/jpeg;one',
  image2: 'data:image/jpeg;two',
  transform1: { ...DEFAULT_TRANSFORM },
  transform2: { ...DEFAULT_TRANSFORM },
  ...over,
});

describe('upload', () => {
  test('starts with two empty slots and nothing to compare', () => {
    render(<App />);
    expect(screen.getByText('Image 1')).toBeTruthy();
    expect(screen.getByText('Image 2')).toBeTruthy();
    expect(screen.getAllByText('Drop an image here or click to upload')).toHaveLength(2);
    expect(compareButton().disabled).toBe(true);
    expect(screen.queryByRole('button', { name: /Swap/ })).toBeNull();
  });

  test('choosing an image shrinks it to 2000px as an 85% JPEG, shows it and saves it', async () => {
    render(<App />);
    choose(1, photo());
    expect((await screen.findByRole('img', { name: 'Image 1' })).getAttribute('src')).toBe('data:image/jpeg;2000x1500#1');
    expect(encodes).toEqual([{ width: 2000, height: 1500, type: 'image/jpeg', quality: 0.85 }]);
    expect(stored()).toEqual({
      image1: 'data:image/jpeg;2000x1500#1',
      image2: null,
      transform1: DEFAULT_TRANSFORM,
      transform2: DEFAULT_TRANSFORM,
    });
    expect(compareButton().disabled).toBe(true);
  });

  test('an image already under 2000px is not scaled up', async () => {
    imageSize = { width: 800, height: 600 };
    render(<App />);
    choose(2, photo());
    await screen.findByRole('img', { name: 'Image 2' });
    expect(encodes[0]).toMatchObject({ width: 800, height: 600 });
  });

  test('dropping an image onto an empty slot fills it', async () => {
    render(<App />);
    fireEvent.drop(screen.getAllByText('Drop an image here or click to upload')[1], {
      dataTransfer: { files: [photo()] },
    });
    expect(await screen.findByRole('img', { name: 'Image 2' })).toBeTruthy();
    expect(screen.queryByRole('img', { name: 'Image 1' })).toBeNull();
  });

  test('a file that is not an image is ignored', async () => {
    render(<App />);
    choose(1, photo('notes.txt', 'text/plain'));
    await Promise.resolve();
    expect(screen.queryByRole('img', { name: 'Image 1' })).toBeNull();
    expect(encodes).toEqual([]);
  });

  test('a filled slot can be replaced by dropping or picking again, which resets its adjustment', async () => {
    seed(bothImages({ transform1: { scale: 2, rotation: 45, x: 10, y: 20 } }));
    render(<App />);
    expect(screen.getAllByText('Tap to replace')).toHaveLength(2);

    fireEvent.drop(img('Image 1'), { dataTransfer: { files: [photo()] } });
    await vi.waitFor(() => expect(img('Image 1').getAttribute('src')).toBe('data:image/jpeg;2000x1500#1'));
    expect(stored().transform1).toEqual(DEFAULT_TRANSFORM);

    choose(1, photo());
    await vi.waitFor(() => expect(img('Image 1').getAttribute('src')).toBe('data:image/jpeg;2000x1500#2'));
  });

  test('Swap exchanges the images and their adjustments', () => {
    const t1 = { scale: 2, rotation: 45, x: 10, y: 20 };
    seed(bothImages({ transform1: t1 }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Swap/ }));
    expect(img('Image 1').getAttribute('src')).toBe('data:image/jpeg;two');
    expect(img('Image 2').getAttribute('src')).toBe('data:image/jpeg;one');
    expect(stored()).toEqual({
      image1: 'data:image/jpeg;two',
      image2: 'data:image/jpeg;one',
      transform1: DEFAULT_TRANSFORM,
      transform2: t1,
    });
  });
});

describe('compare', () => {
  const openCompare = () => {
    render(<App />);
    fireEvent.click(compareButton());
  };

  test('Compare overlays both images with Back and Adjust', () => {
    seed(bothImages());
    openCompare();
    expect(img('Image 1').getAttribute('src')).toBe('data:image/jpeg;one');
    expect(img('Image 2').getAttribute('src')).toBe('data:image/jpeg;two');
    expect(screen.getByRole('button', { name: /Adjust/ })).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Compare' })).toBeNull();
  });

  test('Back returns to the upload screen', () => {
    seed(bothImages());
    openCompare();
    fireEvent.click(screen.getByRole('button', { name: /Back/ }));
    expect(compareButton().disabled).toBe(false);
  });

  test('Adjust edits image 1 first: rotate and zoom are shown and saved', () => {
    seed(bothImages());
    openCompare();
    fireEvent.click(screen.getByRole('button', { name: /Adjust/ }));
    expect(screen.getByText('Adjusting Image 1')).toBeTruthy();
    expect(screen.getByText('Rotate')).toBeTruthy();
    expect(screen.getByText('Zoom')).toBeTruthy();
    expect(screen.getByText('0°')).toBeTruthy();
    expect(screen.getByText('100%')).toBeTruthy();

    const [rotate, zoom] = screen.getAllByRole('slider');
    fireEvent.change(rotate, { target: { value: '45' } });
    fireEvent.change(zoom, { target: { value: '150' } });
    expect(screen.getByText('45°')).toBeTruthy();
    expect(screen.getByText('150%')).toBeTruthy();
    expect(stored().transform1).toEqual({ scale: 1.5, rotation: 45, x: 0, y: 0 });
    expect(stored().transform2).toEqual(DEFAULT_TRANSFORM);
  });

  test('Switch to Image 2 adjusts the other image, and Reset clears only it', () => {
    seed(bothImages({ transform1: { scale: 2, rotation: 10, x: 0, y: 0 }, transform2: { scale: 0.5, rotation: -20, x: 3, y: 4 } }));
    openCompare();
    fireEvent.click(screen.getByRole('button', { name: /Adjust/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Image 2' }));
    expect(screen.getByText('Adjusting Image 2')).toBeTruthy();
    expect(screen.getByText('-20°')).toBeTruthy();
    expect(screen.getByText('50%')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Switch to Image 1' })).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('0°')).toBeTruthy();
    expect(stored().transform2).toEqual(DEFAULT_TRANSFORM);
    expect(stored().transform1).toEqual({ scale: 2, rotation: 10, x: 0, y: 0 });
  });

  test('Lock ends adjusting', () => {
    seed(bothImages());
    openCompare();
    fireEvent.click(screen.getByRole('button', { name: /Adjust/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Lock' }));
    expect(screen.queryByText('Adjusting Image 1')).toBeNull();
    expect(screen.queryAllByRole('slider')).toHaveLength(0);
    expect(screen.getByRole('button', { name: /Adjust/ })).toBeTruthy();
  });
});

describe('storage contract: localStorage "image-compare" holds { image1, image2, transform1, transform2 }', () => {
  test('saved images and adjustments load', () => {
    seed({
      image1: 'data:image/jpeg;saved-one',
      image2: 'data:image/jpeg;saved-two',
      transform1: { scale: 1.25, rotation: 30, x: 5, y: -5 },
      transform2: { scale: 3, rotation: -90, x: 0, y: 0 },
    });
    render(<App />);
    expect(img('Image 1').getAttribute('src')).toBe('data:image/jpeg;saved-one');
    expect(img('Image 2').getAttribute('src')).toBe('data:image/jpeg;saved-two');

    fireEvent.click(compareButton());
    fireEvent.click(screen.getByRole('button', { name: /Adjust/ }));
    expect(screen.getByText('30°')).toBeTruthy();
    expect(screen.getByText('125%')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Switch to Image 2' }));
    expect(screen.getByText('-90°')).toBeTruthy();
    expect(screen.getByText('300%')).toBeTruthy();
  });

  test('a save with only one image and no adjustments loads that image', () => {
    seed({ image1: null, image2: 'data:image/jpeg;only' });
    render(<App />);
    expect(screen.queryByRole('img', { name: 'Image 1' })).toBeNull();
    expect(img('Image 2').getAttribute('src')).toBe('data:image/jpeg;only');
    expect(compareButton().disabled).toBe(true);
  });

  test('a corrupt save starts empty', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    render(<App />);
    expect(screen.getAllByText('Drop an image here or click to upload')).toHaveLength(2);
  });
});

test('the page is titled Image Compare', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: 'Image Compare' })).toBeTruthy();
});
