import { describe, test, expect } from 'vitest';
import { FP300, parseRoom, perimeterPoint } from './geometry.js';
import { sampleScene, seenByAny } from './scoring.js';
import { EMPTY } from './plan.js';
import { WORLD, drawPlan } from './canvas.js';

// One canvas px per centimetre of the plan.
const PX = 100;

function recordingCanvas() {
  const texts = [];
  const fills = [];
  const noop = () => {};
  const ctx = new Proxy({}, {
    get: (_, key) => {
      if (key === 'fillText') return (text, x, y) => texts.push({ text, x: x / PX, y: y / PX });
      if (key === 'fillRect') return (x, y, w, h) => fills.push({ x: x / PX, y: y / PX, w: w / PX, h: h / PX });
      if (key === 'measureText') return (text) => ({ width: text.length * 8 });
      return noop;
    },
    set: () => true,
  });
  return { canvas: { width: WORLD.width * PX, height: WORLD.height * PX, getContext: () => ctx }, texts, fills };
}

const pt = (x, y) => ({ x, y });
const UP = -Math.PI / 2;
const DOWN = Math.PI / 2;

describe('drawPlan', () => {
  test('numbers each piece of furniture, seat and sensor as its row in the Placed list', () => {
    const room = parseRoom([pt(1, 1), pt(6, 1), pt(6, 6), pt(1, 6)]);
    const plan = {
      ...EMPTY,
      room,
      furniture: [{ x: 2, y: 2, w: 1, h: 1, tall: false }, { x: 4, y: 2, w: 1, h: 1, tall: true }],
      seats: [{ x: 2, y: 5, facing: UP }, { x: 3.5, y: 5, facing: UP }, { x: 5, y: 5, facing: UP }],
      sensors: [{ ...FP300, edge: 0, t: 0.3, facing: DOWN }, { ...FP300, edge: 0, t: 0.7, facing: DOWN }],
    };
    const samples = sampleScene(plan);
    const view = { samples, flags: seenByAny(room, samples, plan.sensors) };
    const { canvas, texts } = recordingCanvas();

    drawPlan(canvas, { plan, view, gesture: null, handles: [] });

    const nearest = (p) => texts.reduce((a, b) => (Math.hypot(a.x - p.x, a.y - p.y) <= Math.hypot(b.x - p.x, b.y - p.y) ? a : b));
    const numbered = (items) => items.map((p) => nearest(p).text);
    expect(numbered(plan.furniture.map(({ x, y, w, h }) => pt(x + w / 2, y + h / 2)))).toEqual(['1', '2']);
    expect(numbered(plan.seats)).toEqual(['1', '2', '3']);
    expect(numbered(plan.sensors.map((sensor) => perimeterPoint(room, sensor).point))).toEqual(['1', '2']);
    expect(texts).toHaveLength(7);
  });

  test('draws a handle around what it marks, never over it, so a seat still shows whether it is seen', () => {
    const at = pt(2.5, 2.5);
    const { canvas, fills } = recordingCanvas();

    drawPlan(canvas, { plan: EMPTY, view: null, gesture: null, handles: [{ part: 'body', at }] });

    const [background, ...drawn] = fills;
    expect(background).toMatchObject({ w: WORLD.width, h: WORLD.height });
    const covers = ({ x, y, w, h }, p, by) => x < p.x + by && p.x - by < x + w && y < p.y + by && p.y - by < y + h;
    const handle = drawn.filter((fill) => covers(fill, at, 0.2));
    expect(handle).not.toHaveLength(0);
    expect(handle.filter((fill) => covers(fill, at, 0.07))).toEqual([]);
  });
});
