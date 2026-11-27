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
const placeSensor = (canvas) => {
  fireEvent.click(screen.getByRole('button', { name: 'Sensor' }));
  fireEvent.pointerDown(canvas, at(3, 1));
  fireEvent.pointerMove(canvas, at(3, 3));
  fireEvent.pointerUp(canvas, at(3, 3));
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
    placeSensor(canvas);
    expect(total()).not.toBe('0%');
    const roomRow = within(screen.getByRole('table')).getByText('Room').closest('tr');
    expect(roomRow.textContent).not.toContain('0%');
  });

  describe('what is placed', () => {
    const item = (name) => screen.getByRole('listitem', { name });

    test('furniture is short until ticked tall', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      fireEvent.click(screen.getByRole('button', { name: 'Furniture' }));
      fireEvent.pointerDown(canvas, at(2, 2));
      fireEvent.pointerMove(canvas, at(3, 3));
      fireEvent.pointerUp(canvas, at(3, 3));
      const tall = within(item('Furniture 1')).getByRole('checkbox', { name: /Tall/ });
      expect(tall.checked).toBe(false);
      fireEvent.click(tall);
      expect(tall.checked).toBe(true);
    });

    test('the door swings in until told to swing out', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      fireEvent.click(screen.getByRole('button', { name: 'Door' }));
      click(canvas, 3, 1);
      const door = within(item('Door'));
      expect(door.getByRole('button', { name: 'Swings in' }).getAttribute('aria-pressed')).toBe('true');
      fireEvent.click(door.getByRole('button', { name: 'Swings out' }));
      expect(door.getByRole('button', { name: 'Swings out' }).getAttribute('aria-pressed')).toBe('true');
      expect(door.getByRole('button', { name: 'Flip hinge' })).toBeTruthy();
    });

    test('a sensor is an FP300 until its angle and range are changed', () => {
      render(<App />);
      placeSensor(drawSquareRoom());
      const sensor = within(item('Sensor 1'));
      const angle = sensor.getByRole('slider', { name: /Angle/ });
      const range = sensor.getByRole('slider', { name: /Range/ });
      expect([angle.value, range.value]).toEqual(['120', '6']);
      const before = total();
      fireEvent.change(range, { target: { value: '1' } });
      expect(sensor.getByText('Range 1 m')).toBeTruthy();
      expect(total()).not.toBe(before);
    });

    test('removing the only sensor leaves nothing seen', () => {
      render(<App />);
      placeSensor(drawSquareRoom());
      fireEvent.click(within(item('Sensor 1')).getByRole('button', { name: 'Remove' }));
      expect(screen.queryByRole('listitem', { name: 'Sensor 1' })).toBeNull();
      expect(total()).toBe('0%');
    });
  });
});
