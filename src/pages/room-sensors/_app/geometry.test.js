import { describe, test, expect } from 'vitest';
import {
  FP300, parseRoom, pointInPolygon, segmentsCross, perimeterPoint, snapToPerimeter, doorGeometry, wallSegments, inRect, rectEdges,
} from './geometry.js';

const pt = (x, y) => ({ x, y });
const square = [pt(0, 0), pt(4, 0), pt(4, 4), pt(0, 4)];
const lShape = [pt(0, 0), pt(4, 0), pt(4, 2), pt(2, 2), pt(2, 4), pt(0, 4)];
const reversed = (poly) => [...poly].reverse();
const close = (p) => ({ x: expect.closeTo(p.x), y: expect.closeTo(p.y) });

describe('FP300', () => {
  test('sees 120° out to 6 m', () => {
    expect(FP300).toEqual({ fovDegrees: 120, range: 6 });
  });
});

describe('parseRoom', () => {
  test('keeps a room already wound with positive area', () => {
    expect(parseRoom(square)).toEqual(square);
  });

  test('rewinds a room drawn the other way', () => {
    expect(parseRoom(reversed(square))).toEqual(square);
  });

  test.each([['square', square], ['L-shape', lShape], ['reversed L-shape', reversed(lShape)]])(
    'every wall of a %s has its normal pointing into the room',
    (_, points) => {
      const room = parseRoom(points);
      room.forEach((_, edge) => {
        const { point, normal } = perimeterPoint(room, { edge, t: 0.5 });
        expect(pointInPolygon(pt(point.x + normal.x * 0.01, point.y + normal.y * 0.01), room)).toBe(true);
      });
    },
  );

  test('drops repeated points, including a closing click on the first', () => {
    expect(parseRoom([pt(0, 0), pt(4, 0), pt(4, 0), pt(4, 4), pt(0, 4), pt(0, 0)])).toEqual(square);
  });

  test.each([
    ['no points', []],
    ['two points', [pt(0, 0), pt(1, 0)]],
    ['three points, two the same', [pt(0, 0), pt(1, 0), pt(1, 0)]],
    ['points on one line', [pt(0, 0), pt(1, 1), pt(2, 2)]],
  ])('%s enclose no room', (_, points) => {
    expect(parseRoom(points)).toBeNull();
  });
});

describe('pointInPolygon', () => {
  test('inside and outside a square', () => {
    expect(pointInPolygon(pt(2, 2), square)).toBe(true);
    expect(pointInPolygon(pt(5, 2), square)).toBe(false);
  });

  test('the notch of an L-shape is outside', () => {
    expect(pointInPolygon(pt(1, 3), lShape)).toBe(true);
    expect(pointInPolygon(pt(3, 3), lShape)).toBe(false);
  });
});

describe('segmentsCross', () => {
  test('an X crosses', () => {
    expect(segmentsCross(pt(0, 0), pt(2, 2), pt(0, 2), pt(2, 0))).toBe(true);
  });

  test('segments that would meet only if extended do not cross', () => {
    expect(segmentsCross(pt(0, 0), pt(1, 1), pt(0, 4), pt(4, 0))).toBe(false);
  });

  test('parallel segments do not cross', () => {
    expect(segmentsCross(pt(0, 0), pt(2, 0), pt(0, 1), pt(2, 1))).toBe(false);
  });

  test('overlapping along one line is not a crossing', () => {
    expect(segmentsCross(pt(0, 0), pt(2, 0), pt(1, 0), pt(3, 0))).toBe(false);
  });

  test('touching at an end is not a crossing', () => {
    expect(segmentsCross(pt(0, 0), pt(1, 1), pt(1, 1), pt(2, 0))).toBe(false);
    expect(segmentsCross(pt(0, 0), pt(2, 0), pt(1, 0), pt(1, 2))).toBe(false);
  });
});

describe('perimeterPoint', () => {
  test('runs from a wall’s first corner at t = 0 towards the next', () => {
    expect(perimeterPoint(square, { edge: 1, t: 0 }).point).toEqual(pt(4, 0));
    expect(perimeterPoint(square, { edge: 1, t: 0.25 }).point).toEqual(pt(4, 1));
  });

  test('the last wall closes the room back to the first corner', () => {
    expect(perimeterPoint(square, { edge: 3, t: 1 }).point).toEqual(pt(0, 0));
  });

  test('the normal is a unit vector into the room', () => {
    expect(perimeterPoint(square, { edge: 0, t: 0.5 }).normal).toEqual(close(pt(0, 1)));
    expect(perimeterPoint(square, { edge: 1, t: 0.5 }).normal).toEqual(close(pt(-1, 0)));
    const slanted = parseRoom([pt(0, 0), pt(3, 4), pt(0, 4)]);
    expect(perimeterPoint(slanted, { edge: 0, t: 0.5 }).normal).toEqual(close(pt(-0.8, 0.6)));
  });
});

describe('snapToPerimeter', () => {
  test('projects a point onto the nearest wall', () => {
    expect(snapToPerimeter(square, pt(1, 0.3))).toEqual({ edge: 0, t: 0.25 });
    expect(snapToPerimeter(square, pt(4.5, 3))).toEqual({ edge: 1, t: 0.75 });
  });

  test('a point past a corner snaps to the corner', () => {
    expect(snapToPerimeter(square, pt(6, -1))).toEqual({ edge: 0, t: 1 });
  });

  test('round-trips through perimeterPoint', () => {
    const placement = { edge: 4, t: 0.3 };
    const { point } = perimeterPoint(lShape, placement);
    expect(snapToPerimeter(lShape, point)).toEqual({ edge: 4, t: expect.closeTo(0.3) });
  });
});

describe('doorGeometry', () => {
  const door = { edge: 0, t: 0.5, width: 1, hinge: 'start', swing: 'in' };

  test('the gap is the door’s width, centred on its placement', () => {
    expect(doorGeometry(square, door).gap).toEqual([pt(1.5, 0), pt(2.5, 0)]);
  });

  test('closed, the leaf spans the gap from its hinge', () => {
    expect(doorGeometry(square, door).leaf.closed).toEqual([pt(1.5, 0), pt(2.5, 0)]);
    expect(doorGeometry(square, { ...door, hinge: 'end' }).leaf.closed).toEqual([pt(2.5, 0), pt(1.5, 0)]);
  });

  test('open, the leaf stands square to the wall at its hinge, on the side it swings to', () => {
    expect(doorGeometry(square, door).leaf.open).toEqual([pt(1.5, 0), close(pt(1.5, 1))]);
    expect(doorGeometry(square, { ...door, hinge: 'end' }).leaf.open).toEqual([pt(2.5, 0), close(pt(2.5, 1))]);
    expect(doorGeometry(square, { ...door, swing: 'out' }).leaf.open).toEqual([pt(1.5, 0), close(pt(1.5, -1))]);
  });

  test('swinging in, the open leaf’s tip is inside the room; swinging out, outside', () => {
    const tip = (swing) => doorGeometry(lShape, { edge: 3, t: 0.5, width: 0.8, hinge: 'start', swing }).leaf.open[1];
    expect(pointInPolygon(tip('in'), lShape)).toBe(true);
    expect(pointInPolygon(tip('out'), lShape)).toBe(false);
  });
});

describe('wallSegments', () => {
  test('without a door, the walls run corner to corner', () => {
    expect(wallSegments(square, null)).toEqual([
      [pt(0, 0), pt(4, 0)], [pt(4, 0), pt(4, 4)], [pt(4, 4), pt(0, 4)], [pt(0, 4), pt(0, 0)],
    ]);
  });

  test('a door leaves a gap in its wall', () => {
    const door = { edge: 1, t: 0.5, width: 1, hinge: 'start', swing: 'in' };
    expect(wallSegments(square, door)).toEqual([
      [pt(0, 0), pt(4, 0)], [pt(4, 0), pt(4, 1.5)], [pt(4, 2.5), pt(4, 4)], [pt(4, 4), pt(0, 4)], [pt(0, 4), pt(0, 0)],
    ]);
  });
});

describe('furniture rectangles', () => {
  const table = { x: 1, y: 2, w: 2, h: 1 };

  test('a point is in a rectangle up to and including its edges', () => {
    expect(inRect(pt(2, 2.5), table)).toBe(true);
    expect(inRect(pt(3, 3), table)).toBe(true);
    expect(inRect(pt(3.01, 2.5), table)).toBe(false);
  });

  test('a rectangle’s edges go round its corners', () => {
    expect(rectEdges(table)).toEqual([
      [pt(1, 2), pt(3, 2)], [pt(3, 2), pt(3, 3)], [pt(3, 3), pt(1, 3)], [pt(1, 3), pt(1, 2)],
    ]);
  });
});
