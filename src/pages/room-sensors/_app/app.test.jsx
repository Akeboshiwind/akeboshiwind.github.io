import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { App } from './app.jsx';
import { WORLD } from './canvas.js';

const noop = () => {};
const fakeContext = new Proxy({}, { get: (_, key) => (key === 'measureText' ? () => ({ width: 0 }) : noop), set: () => true });
// One CSS px per centimetre of the plan.
const PX = 100;

beforeEach(() => {
  localStorage.clear();
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

  describe('once the room closes, the next click furnishes it rather than starting another', () => {
    const pressed = (name) => screen.getByRole('button', { name }).getAttribute('aria-pressed');

    test('closed by clicking the first corner', () => {
      render(<App />);
      drawSquareRoom();
      expect([pressed('Room'), pressed('Furniture')]).toEqual(['false', 'true']);
    });

    test('closed with Close room', () => {
      render(<App />);
      const canvas = screen.getByLabelText('Room plan');
      [[1, 1], [5, 1], [5, 5]].forEach(([x, y]) => click(canvas, x, y));
      fireEvent.click(screen.getByRole('button', { name: 'Close room' }));
      expect([pressed('Room'), pressed('Furniture')]).toEqual(['false', 'true']);
    });

    test('closed in place of another', () => {
      render(<App />);
      drawSquareRoom();
      fireEvent.click(screen.getByRole('button', { name: 'Room' }));
      drawSquareRoom();
      expect([pressed('Room'), pressed('Furniture')]).toEqual(['false', 'true']);
    });

    test('until it is cleared', () => {
      render(<App />);
      drawSquareRoom();
      fireEvent.click(screen.getByRole('button', { name: 'Clear' }));
      expect([pressed('Room'), pressed('Furniture')]).toEqual(['true', 'false']);
    });
  });

  test('a sensor on a wall, aimed into the room, scores what it sees', () => {
    render(<App />);
    const canvas = drawSquareRoom();
    placeSensor(canvas);
    expect(total()).not.toBe('0%');
    const roomRow = within(screen.getByRole('table')).getByText('Room').closest('tr');
    expect(roomRow.textContent).not.toContain('0%');
  });

  describe('finding sensors', () => {
    const sensorsListed = () => screen.queryAllByRole('listitem', { name: /^Sensor / }).length;

    test('waits for a room', () => {
      render(<App />);
      ['Find 1 sensor', 'Find 2 sensors'].forEach((name) => expect(screen.getByRole('button', { name }).disabled).toBe(true));
    });

    test.each([
      ['Find 1 sensor', 1],
      ['Find 2 sensors', 2],
    ])('%s replaces the sensors placed with what it finds', (name, count) => {
      render(<App />);
      placeSensor(drawSquareRoom());
      const placedByHand = total();
      fireEvent.click(screen.getByRole('button', { name }));
      expect(sensorsListed()).toBe(count);
      expect(Number.parseInt(total())).toBeGreaterThanOrEqual(Number.parseInt(placedByHand));
    });

    test('looks for sensors of the angle and range set beside the buttons, FP300 until changed', () => {
      render(<App />);
      drawSquareRoom();
      const search = within(screen.getByRole('group', { name: 'Search with' }));
      const angle = search.getByRole('slider', { name: /Angle/ });
      const range = search.getByRole('slider', { name: /Range/ });
      expect([angle.value, range.value]).toEqual(['120', '6']);
      fireEvent.change(angle, { target: { value: '60' } });
      fireEvent.change(range, { target: { value: '3' } });
      fireEvent.click(screen.getByRole('button', { name: 'Find 1 sensor' }));
      const found = within(screen.getByRole('listitem', { name: 'Sensor 1' }));
      expect([found.getByRole('slider', { name: /Angle/ }).value, found.getByRole('slider', { name: /Range/ }).value]).toEqual(['60', '3']);
    });
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

  describe('selecting on the plan', () => {
    const choose = (name) => fireEvent.click(screen.getByRole('button', { name }));
    const selected = () => screen.queryByRole('group', { name: /^Selected/ });
    const placeDoor = (canvas) => {
      choose('Door');
      click(canvas, 3, 5);
    };

    test('waits for a room', () => {
      render(<App />);
      expect(screen.getByRole('button', { name: 'Select' }).disabled).toBe(true);
    });

    test('picks what is clicked, and nothing where nothing is', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      placeSensor(canvas);
      choose('Select');
      click(canvas, 3, 1);
      expect(selected().getAttribute('aria-label')).toBe('Selected: Sensor 1');
      click(canvas, 3, 4);
      expect(selected()).toBeNull();
      click(canvas, 5, 3);
      expect(selected().getAttribute('aria-label')).toBe('Selected: Room');
    });

    test('reaches what is a few screen pixels from the pointer', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      placeSensor(canvas);
      choose('Select');
      fireEvent.pointerDown(canvas, { clientX: 3 * PX + 10, clientY: 1 * PX + 10, pointerId: 1 });
      expect(selected().getAttribute('aria-label')).toBe('Selected: Sensor 1');
    });

    test.each([
      ['with its button', () => choose('Delete')],
      ['with the Delete key', () => fireEvent.keyDown(screen.getByLabelText('Room plan'), { key: 'Delete' })],
      ['with the Backspace key, which Mac keyboards label delete', () => fireEvent.keyDown(screen.getByLabelText('Room plan'), { key: 'Backspace' })],
    ])('deletes the selection %s', (_, del) => {
      render(<App />);
      const canvas = drawSquareRoom();
      placeSensor(canvas);
      choose('Select');
      click(canvas, 3, 1);
      del();
      expect(screen.queryByRole('listitem', { name: 'Sensor 1' })).toBeNull();
      expect(selected()).toBeNull();
    });

    test('keeps the room, which Clear removes', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      choose('Select');
      click(canvas, 1, 3);
      expect(within(selected()).queryByRole('button', { name: 'Delete' })).toBeNull();
      fireEvent.keyDown(canvas, { key: 'Delete' });
      expect(total()).toBe('0%');
    });

    test('flips a selected door on its hinge and its swing', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      placeDoor(canvas);
      choose('Select');
      click(canvas, 3, 5);
      const door = within(screen.getByRole('listitem', { name: 'Door' }));
      fireEvent.click(within(selected()).getByRole('button', { name: 'Flip swing' }));
      expect(door.getByRole('button', { name: 'Swings out' }).getAttribute('aria-pressed')).toBe('true');
      fireEvent.click(within(selected()).getByRole('button', { name: 'Flip swing' }));
      expect(door.getByRole('button', { name: 'Swings in' }).getAttribute('aria-pressed')).toBe('true');
      expect(within(selected()).getByRole('button', { name: 'Flip hinge' })).toBeTruthy();
    });

    test('lets go of what is removed some other way', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      placeSensor(canvas);
      choose('Select');
      click(canvas, 3, 1);
      fireEvent.click(within(screen.getByRole('listitem', { name: 'Sensor 1' })).getByRole('button', { name: 'Remove' }));
      expect(selected()).toBeNull();
    });

    test('lets go on choosing another tool', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      placeSensor(canvas);
      choose('Select');
      click(canvas, 3, 1);
      choose('Seat');
      choose('Select');
      expect(selected()).toBeNull();
    });
  });

  describe('dragging on the plan', () => {
    const choose = (name) => fireEvent.click(screen.getByRole('button', { name }));
    const size = () => within(screen.getByRole('listitem', { name: 'Furniture 1' })).getByText(/ m$/).textContent;
    const selected = () => screen.queryByRole('group', { name: /^Selected/ })?.getAttribute('aria-label');
    const furnish = () => {
      const canvas = drawSquareRoom();
      choose('Furniture');
      fireEvent.pointerDown(canvas, at(2, 2));
      fireEvent.pointerMove(canvas, at(3, 3));
      fireEvent.pointerUp(canvas, at(3, 3));
      choose('Select');
      return canvas;
    };

    test('moves furniture by its body, selecting it', () => {
      render(<App />);
      const canvas = furnish();
      fireEvent.pointerDown(canvas, at(2.5, 2.5));
      fireEvent.pointerMove(canvas, at(3.5, 3));
      fireEvent.pointerUp(canvas, at(3.5, 3));
      expect(size()).toBe('1 × 1 m');
      click(canvas, 2.2, 2.2);
      expect(selected()).toBeUndefined();
      click(canvas, 3.8, 3.3);
      expect(selected()).toBe('Selected: Furniture 1');
    });

    test('resizes selected furniture by a corner', () => {
      render(<App />);
      const canvas = furnish();
      click(canvas, 2.5, 2.5);
      fireEvent.pointerDown(canvas, at(3, 3));
      fireEvent.pointerMove(canvas, at(4, 3.5));
      fireEvent.pointerUp(canvas, at(4, 3.5));
      expect(size()).toBe('2 × 1.5 m');
    });

    test('changes the plan once, on letting go', () => {
      render(<App />);
      const canvas = furnish();
      const stored = () => Object.values(localStorage)[0];
      const before = stored();
      click(canvas, 2.5, 2.5);
      fireEvent.pointerDown(canvas, at(3, 3));
      fireEvent.pointerMove(canvas, at(4, 3.5));
      fireEvent.pointerMove(canvas, at(4.5, 4));
      expect(size()).toBe('1 × 1 m');
      expect(stored()).toBe(before);
      fireEvent.pointerUp(canvas, at(4.5, 4));
      expect(size()).toBe('2.5 × 2 m');
    });

    const seat = () => {
      const canvas = drawSquareRoom();
      placeSensor(canvas);
      choose('Seat');
      click(canvas, 3, 3);
      choose('Select');
      return canvas;
    };
    const dragOn = (canvas, from, to) => {
      fireEvent.pointerDown(canvas, at(...from));
      fireEvent.pointerMove(canvas, at(...to));
      fireEvent.pointerUp(canvas, at(...to));
    };
    const front = () => within(screen.getByRole('table')).getByText('People from the front').closest('tr').lastChild.textContent;

    test('moves a seat by its body, selecting it, and keeps it in the room', () => {
      render(<App />);
      const canvas = seat();
      dragOn(canvas, [3, 3], [2, 4]);
      dragOn(canvas, [2, 4], [6, 4]);
      click(canvas, 3, 3);
      expect(selected()).toBeUndefined();
      click(canvas, 2, 4);
      expect(selected()).toBe('Selected: Seat 1');
    });

    test('turns a selected seat by its facing handle', () => {
      render(<App />);
      const canvas = seat();
      expect(front()).toBe('100%');
      click(canvas, 3, 3);
      dragOn(canvas, [3, 2.4], [3, 4]);
      expect(front()).toBe('0%');
    });

    test('slides a sensor along the walls, round onto another, aimed into the room as it was', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      placeSensor(canvas);
      choose('Select');
      const before = total();
      dragOn(canvas, [3, 1], [4.9, 3]);
      expect(total()).toBe(before);
      click(canvas, 5, 3);
      expect(selected()).toBe('Selected: Sensor 1');
      click(canvas, 3, 1);
      expect(selected()).toBe('Selected: Room');
    });

    test('turns a selected sensor by its facing handle', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      placeSensor(canvas);
      choose('Select');
      click(canvas, 3, 1);
      dragOn(canvas, [3, 1.6], [3, 0.5]);
      expect(total()).toBe('0%');
    });

    test('slides the door along the walls', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      choose('Door');
      click(canvas, 3, 5);
      choose('Select');
      dragOn(canvas, [3, 5], [5.1, 3]);
      click(canvas, 5, 3);
      expect(selected()).toBe('Selected: Door');
      click(canvas, 3, 5);
      expect(selected()).toBe('Selected: Room');
    });

    test('moves a corner of the selected room, staying on Select', () => {
      render(<App />);
      const canvas = drawSquareRoom();
      choose('Select');
      click(canvas, 5, 3);
      dragOn(canvas, [5, 5], [7, 5]);
      expect(screen.getByRole('button', { name: 'Select' }).getAttribute('aria-pressed')).toBe('true');
      click(canvas, 6, 3);
      expect(selected()).toBe('Selected: Room');
    });

    test('a drag let go of some other way changes nothing', () => {
      render(<App />);
      const canvas = furnish();
      fireEvent.pointerDown(canvas, at(2.5, 2.5));
      fireEvent.pointerMove(canvas, at(3.5, 3));
      fireEvent.pointerCancel(canvas, at(3.5, 3));
      click(canvas, 2.2, 2.2);
      expect(selected()).toBe('Selected: Furniture 1');
    });
  });

  describe('the plan is kept between visits', () => {
    test('as it was left', () => {
      render(<App />);
      placeSensor(drawSquareRoom());
      const left = total();
      cleanup();
      render(<App />);
      expect(screen.getByRole('listitem', { name: 'Sensor 1' })).toBeTruthy();
      expect(total()).toBe(left);
    });

    test('unless what was stored is no longer a plan', () => {
      render(<App />);
      drawSquareRoom();
      const stored = Object.keys(localStorage);
      expect(stored).toHaveLength(1);
      localStorage.setItem(stored[0], JSON.stringify({ room: 'square' }));
      cleanup();
      render(<App />);
      expect(screen.getByText('Close a room to score it.')).toBeTruthy();
    });
  });
});
