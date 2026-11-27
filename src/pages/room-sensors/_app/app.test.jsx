import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { App } from './app.jsx';
import { WORLD } from './canvas.js';

const noop = () => {};
const fakeContext = new Proxy({}, { get: () => noop, set: () => true });
// One CSS px per centimetre of the plan.
const PX = 100;

beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(fakeContext);
  vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockReturnValue({ left: 0, top: 0, width: WORLD.width * PX, height: WORLD.height * PX });
  HTMLCanvasElement.prototype.setPointerCapture = noop;
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const at = (x, y) => ({ clientX: x * PX, clientY: y * PX, pointerId: 1 });
const click = (canvas, x, y) => {
  fireEvent.pointerDown(canvas, at(x, y));
  fireEvent.pointerUp(canvas, at(x, y));
};
const drawSquareRoom = () => {
  const canvas = screen.getByLabelText('Room plan');
  [[1, 1], [5, 1], [5, 5], [1, 5], [1, 1]].forEach(([x, y]) => click(canvas, x, y));
  return canvas;
};
const total = () => screen.getByText('Score').closest('h2').nextElementSibling.textContent;

describe('Room Sensors', () => {
  test('asks for a room before anything can go in it', () => {
    render(<App />);
    expect(screen.getByText('Close a room to score it.')).toBeTruthy();
    ['Furniture', 'Door', 'Seat', 'Sensor'].forEach((tool) => expect(screen.getByRole('button', { name: tool }).disabled).toBe(true));
  });

  test('clicking back on the first corner closes the room, which no sensor yet sees', () => {
    render(<App />);
    drawSquareRoom();
    expect(screen.getByRole('button', { name: 'Sensor' }).disabled).toBe(false);
    expect(total()).toBe('0%');
  });

  test('a sensor on a wall, aimed into the room, scores what it sees', () => {
    render(<App />);
    const canvas = drawSquareRoom();
    fireEvent.click(screen.getByRole('button', { name: 'Sensor' }));
    fireEvent.pointerDown(canvas, at(3, 1));
    fireEvent.pointerMove(canvas, at(3, 3));
    fireEvent.pointerUp(canvas, at(3, 3));
    expect(total()).not.toBe('0%');
    const roomRow = within(screen.getByRole('table')).getByText('Room').closest('tr');
    expect(roomRow.textContent).not.toContain('0%');
  });
});
