import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import QRCode from 'qrcode';
import { App } from './app.jsx';

vi.mock('qrcode', () => ({ default: { toCanvas: vi.fn() } }));

afterEach(cleanup);

const lastCall = () => QRCode.toCanvas.mock.calls.at(-1);

describe('QR Code Generator', () => {
  beforeEach(() => {
    localStorage.clear();
    QRCode.toCanvas.mockReset();
    QRCode.toCanvas.mockResolvedValue(undefined);
  });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('QR Code Generator')).toBeTruthy();
  });

  test('with no text it shows a placeholder and download is disabled', () => {
    render(<App />);
    expect(screen.getByText('QR code will appear here')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download PNG' }).disabled).toBe(true);
    expect(QRCode.toCanvas).not.toHaveBeenCalled();
  });

  test('typing text draws a code at the default level and enables download', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Enter text or URL to encode...'), { target: { value: 'https://example.com' } });
    await waitFor(() => expect(QRCode.toCanvas).toHaveBeenCalled());
    const [, text, options] = lastCall();
    expect(text).toBe('https://example.com');
    expect(options.errorCorrectionLevel).toBe('M');
    expect(screen.queryByText('QR code will appear here')).toBeNull();
    expect(screen.getByRole('button', { name: 'Download PNG' }).disabled).toBe(false);
  });

  test('choosing an error correction level redraws at that level', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Enter text or URL to encode...'), { target: { value: 'hello' } });
    fireEvent.click(screen.getByRole('button', { name: 'H' }));
    await waitFor(() => expect(lastCall()[2].errorCorrectionLevel).toBe('H'));
    for (const l of ['L', 'M', 'Q', 'H']) expect(screen.getByRole('button', { name: l })).toBeTruthy();
  });

  test('a failed draw shows the error and disables download', async () => {
    QRCode.toCanvas.mockRejectedValue(new Error('The amount of data is too big'));
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Enter text or URL to encode...'), { target: { value: 'x' } });
    expect(await screen.findByText('The amount of data is too big')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Download PNG' }).disabled).toBe(true);
  });

  test('download saves the canvas as qr-code.png', async () => {
    const toDataURL = vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,AAAA');
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function () {
      expect(this.download).toBe('qr-code.png');
      expect(this.href).toBe('data:image/png;base64,AAAA');
    });
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Enter text or URL to encode...'), { target: { value: 'hi' } });
    await waitFor(() => expect(QRCode.toCanvas).toHaveBeenCalled());
    fireEvent.click(screen.getByRole('button', { name: 'Download PNG' }));
    expect(click).toHaveBeenCalledTimes(1);
    expect(toDataURL).toHaveBeenCalledWith('image/png');
    click.mockRestore();
    toDataURL.mockRestore();
  });
});

describe('storage contract', () => {
  beforeEach(() => {
    localStorage.clear();
    QRCode.toCanvas.mockReset();
    QRCode.toCanvas.mockResolvedValue(undefined);
  });

  test('saved text and level under qr-code_ load as JSON strings', async () => {
    localStorage.setItem('qr-code_text', JSON.stringify('saved text'));
    localStorage.setItem('qr-code_level', JSON.stringify('Q'));
    render(<App />);
    expect(screen.getByPlaceholderText('Enter text or URL to encode...').value).toBe('saved text');
    await waitFor(() => expect(QRCode.toCanvas).toHaveBeenCalled());
    expect(lastCall()[1]).toBe('saved text');
    expect(lastCall()[2].errorCorrectionLevel).toBe('Q');
  });

  test('edits are written back under the same keys', async () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText('Enter text or URL to encode...'), { target: { value: 'new' } });
    fireEvent.click(screen.getByRole('button', { name: 'L' }));
    await waitFor(() => expect(localStorage.getItem('qr-code_text')).toBe('"new"'));
    expect(localStorage.getItem('qr-code_level')).toBe('"L"');
  });
});
