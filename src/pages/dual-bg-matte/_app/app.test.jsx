import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import { App } from './app.jsx';

// Each fake image is a 2×2 grid of grey pixels, keyed by file name.
let images;
let downloads;
let encoded;

class FakeImageData {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
}

class FakeImage {
  set src(url) {
    const image = images[url.replace('blob:', '')];
    queueMicrotask(() => {
      if (!image) return this.onerror(new Error('unreadable'));
      this.name = url.replace('blob:', '');
      this.naturalWidth = image.width;
      this.naturalHeight = image.height;
      this.onload();
    });
  }
}

function fakeContext(canvas) {
  let drawn = null;
  return {
    drawImage(img) { if (img instanceof FakeImage) drawn = images[img.name]; },
    getImageData(x, y, w, h) {
      const out = new FakeImageData(w, h);
      drawn.greys.forEach((v, i) => out.data.set([v, v, v, 255], i * 4));
      return out;
    },
    putImageData(data) { canvas.put = data; },
    fillRect() {},
  };
}

const grey = (width, height, greys) => ({ width, height, greys });

beforeEach(() => {
  // Pixels: pure background, solid subject, a faint wisp (α = 75/255), solid subject.
  images = {
    'cat-white.png': grey(2, 2, [255, 100, 230, 100]),
    'cat-black.png': grey(2, 2, [0, 100, 50, 100]),
    'wide-black.png': grey(3, 2, [0, 0, 0, 0, 0, 0]),
  };
  downloads = [];
  encoded = [];
  vi.stubGlobal('Image', FakeImage);
  vi.stubGlobal('ImageData', FakeImageData);
  vi.spyOn(URL, 'createObjectURL').mockImplementation((f) => `blob:${f.name ?? 'png'}`);
  URL.revokeObjectURL = () => {};
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(function () {
    this.ctx ??= fakeContext(this);
    return this.ctx;
  });
  HTMLCanvasElement.prototype.toBlob = function (cb, type) {
    encoded.push({ type, alpha: [...this.put.data].filter((_, i) => i % 4 === 3) });
    cb(new Blob([], { type }));
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

const file = (name) => new File([new Uint8Array(4)], name, { type: 'image/png' });
const pick = (label, name) =>
  fireEvent.change(screen.getByLabelText(new RegExp(label)), { target: { files: [file(name)] } });
const pickPair = (white = 'cat-white.png', black = 'cat-black.png') => {
  pick('Photo on white background', white);
  pick('Photo on black background', black);
};

// The innermost element whose whole text is `text`, so "Opaque: 50.0%" matches across its <strong>.
const exactly = (text) => (_, el) =>
  el.textContent.replace(/\s+/g, ' ').trim() === text &&
  [...el.children].every((c) => c.textContent.replace(/\s+/g, ' ').trim() !== text);

const sliders = () => {
  const [nudgeX, nudgeY, lowSnap, highSnap, softness] = screen.getAllByRole('slider');
  return { nudgeX, nudgeY, lowSnap, highSnap, softness };
};

const download = () => screen.getByRole('button', { name: /Download transparent PNG/ });

describe('Dual-Background Matte', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Dual-Background Matte')).toBeTruthy();
  });

  test('has a home link', () => {
    render(<App />);
    const home = screen.getByText('← Home').closest('a');
    expect(home.getAttribute('href')).toBe('../');
  });

  test('shows help by default and can hide it', () => {
    render(<App />);
    expect(screen.getByText('How this works')).toBeTruthy();
    fireEvent.click(screen.getByText('Hide help'));
    expect(screen.queryByText('How this works')).toBeNull();
  });

  test('shows both file pickers and the five view pills', () => {
    render(<App />);
    expect(screen.getByText('Photo on white background')).toBeTruthy();
    expect(screen.getByText('Photo on black background')).toBeTruthy();
    for (const label of ['Result', 'Stray opaque', 'Stray transparent', 'Partial alpha', 'Difference']) {
      // Each view label is rendered as a button in the pill row.
      const btn = screen.getAllByRole('button', { name: label })[0];
      expect(btn).toBeTruthy();
    }
  });

  test('shows the sticky download button (disabled before upload)', () => {
    render(<App />);
    const btn = screen.getByText('Download transparent PNG').closest('button');
    expect(btn.disabled).toBe(true);
  });

  test('starts with no preview, zeroed stats and default controls', () => {
    render(<App />);
    expect(screen.getByText('Upload both images to see the matte preview.')).toBeTruthy();
    expect(screen.getByText(exactly('Opaque: 0.0%'))).toBeTruthy();
    expect(screen.getByText(exactly('Transparent: 0.0%'))).toBeTruthy();
    expect(screen.getByText(exactly('Partial: 0.0%'))).toBeTruthy();
    expect(screen.getAllByText('0 px')).toHaveLength(2);
    expect(screen.getByText('0.05')).toBeTruthy();
    expect(screen.getByText('0.95')).toBeTruthy();
    expect(screen.getByText('1.00')).toBeTruthy();
    expect(screen.getAllByText('Tap to choose…')).toHaveLength(2);
  });

  test('picking a file shows its name in place of the prompt', () => {
    render(<App />);
    pick('Photo on white background', 'cat-white.png');
    expect(screen.getByText('cat-white.png')).toBeTruthy();
    expect(screen.getAllByText('Tap to choose…')).toHaveLength(1);
  });

  test('a matched pair reports how much of the matte is opaque, transparent and partial', async () => {
    render(<App />);
    pickPair();
    expect(await screen.findByText(exactly('Opaque: 50.0%'))).toBeTruthy();
    expect(screen.getByText(exactly('Transparent: 25.0%'))).toBeTruthy();
    expect(screen.getByText(exactly('Partial: 25.0%'))).toBeTruthy();
    expect(screen.queryByText('Upload both images to see the matte preview.')).toBeNull();
    expect(download().disabled).toBe(false);
  });

  test('raising Snap to transparent below swallows the faint wisp', async () => {
    render(<App />);
    pickPair();
    await screen.findByText(exactly('Partial: 25.0%'));
    fireEvent.change(sliders().lowSnap, { target: { value: '0.3' } });
    expect(screen.getByText('0.30')).toBeTruthy();
    expect(await screen.findByText(exactly('Transparent: 50.0%'))).toBeTruthy();
    expect(screen.getByText(exactly('Partial: 0.0%'))).toBeTruthy();
  });

  test('the sliders show their values and Reset controls restores the defaults', () => {
    render(<App />);
    const { nudgeX, nudgeY, highSnap, softness } = sliders();
    fireEvent.change(nudgeX, { target: { value: '5' } });
    fireEvent.change(nudgeY, { target: { value: '-3' } });
    fireEvent.change(highSnap, { target: { value: '0.8' } });
    fireEvent.change(softness, { target: { value: '1.5' } });
    expect(screen.getByText('5 px')).toBeTruthy();
    expect(screen.getByText('-3 px')).toBeTruthy();
    expect(screen.getByText('0.80')).toBeTruthy();
    expect(screen.getByText('1.50')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Reset controls' }));
    expect(screen.getAllByText('0 px')).toHaveLength(2);
    expect(screen.getByText('0.95')).toBeTruthy();
    expect(screen.getByText('1.00')).toBeTruthy();
  });

  test('every view can be chosen once a pair is loaded', async () => {
    render(<App />);
    pickPair();
    await screen.findByText(exactly('Opaque: 50.0%'));
    for (const name of ['Stray opaque', 'Stray transparent', 'Partial alpha', 'Difference', 'Result']) {
      fireEvent.click(screen.getByRole('button', { name }));
    }
    expect(screen.getByText(exactly('Opaque: 50.0%'))).toBeTruthy();
  });

  test('Download saves <white name>-matte.png with the matte as its alpha', async () => {
    render(<App />);
    pickPair();
    await screen.findByText(exactly('Opaque: 50.0%'));
    fireEvent.click(download());
    await waitFor(() => expect(downloads).toEqual(['cat-white-matte.png']));
    expect(encoded).toEqual([{ type: 'image/png', alpha: [0, 255, 75, 255] }]);
  });

  test('images of different sizes are refused', async () => {
    render(<App />);
    pickPair('cat-white.png', 'wide-black.png');
    expect(await screen.findByText(
      'Images have different dimensions (2×2 vs 3×2). They must match.',
    )).toBeTruthy();
    expect(download().disabled).toBe(true);
  });

  test('an unreadable image is reported', async () => {
    render(<App />);
    pick('Photo on white background', 'broken.png');
    expect(await screen.findByText('Could not read the white-background image.')).toBeTruthy();
  });

  test('the help panel closes from its own close button', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Close help' }));
    expect(screen.queryByText('How this works')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Help' }));
    expect(screen.getByText('How this works')).toBeTruthy();
  });
});
