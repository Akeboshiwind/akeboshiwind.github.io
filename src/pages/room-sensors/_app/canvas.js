/**
 * Drawing the plan, and what its sensors see, onto a canvas showing WORLD metres from the origin.
 * Lengths here are canvas px unless named in metres; `scale` is px per metre.
 */
import { doorGeometry, perimeterPoint } from './geometry.js';
import { SAMPLE_STEP } from './scoring.js';

export const WORLD = Object.freeze({ width: 12, height: 8 });

// CSS px per drawn pixel, as in the bitemporal visualiser.
const CELL = 2;
const LINE = 2 * CELL;
const ARROW = 0.5;
// How far, in metres, a seat's or sensor's number sits from it.
const NUMBER_OFFSET = 0.4;
const NUMBER_PX = 6 * CELL;

function themeColors() {
  const style = getComputedStyle(document.documentElement);
  const cssVar = (name) => style.getPropertyValue(name).trim();
  return { bg: cssVar('--bg'), text: cssVar('--text'), heading: cssVar('--heading'), border: cssVar('--border'), accent: cssVar('--accent') };
}

const direction = (angle) => ({ x: Math.cos(angle), y: Math.sin(angle) });
const offset = (p, d, by) => ({ x: p.x + d.x * by, y: p.y + d.y * by });

const pixelFont = () => getComputedStyle(document.documentElement).getPropertyValue('--font-pixel').trim();

function painter(ctx, scale, font) {
  const at = (p) => [p.x * scale, p.y * scale];
  const path = (points, closed) => {
    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(...at(p)) : ctx.moveTo(...at(p))));
    if (closed) ctx.closePath();
  };
  return {
    stroke(points, { color, width = LINE, dash = [], closed = false }) {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.setLineDash(dash);
      path(points, closed);
      ctx.stroke();
      ctx.setLineDash([]);
    },
    /** Fills the drawn pixels of the square `size` metres wide centred on `p` for which `lit(col, row)` holds. */
    pattern(p, size, color, lit) {
      const [x, y] = at(p);
      const half = (size * scale) / 2;
      ctx.fillStyle = color;
      for (let col = Math.ceil((x - half) / CELL); col < (x + half) / CELL; col++)
        for (let row = Math.ceil((y - half) / CELL); row < (y + half) / CELL; row++)
          if (lit(col, row)) ctx.fillRect(col * CELL, row * CELL, CELL, CELL);
    },
    square(p, px, color) {
      const [x, y] = at(p);
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x - px / 2), Math.round(y - px / 2), px, px);
    },
    /** Outlines the square `px` wide centred on `p` with a border `thickness` px wide, leaving what is inside it to show. */
    frame(p, px, thickness, color) {
      const [x, y] = at(p);
      const left = Math.round(x - px / 2);
      const top = Math.round(y - px / 2);
      ctx.fillStyle = color;
      ctx.fillRect(left, top, px, thickness);
      ctx.fillRect(left, top + px - thickness, px, thickness);
      ctx.fillRect(left, top, thickness, px);
      ctx.fillRect(left + px - thickness, top, thickness, px);
    },
    /** Writes `index + 1` centred on `p`, on a patch of background so it reads over anything drawn there. */
    number(p, index, colors) {
      const text = String(index + 1);
      const [x, y] = at(p);
      ctx.font = `${NUMBER_PX}px ${font}`;
      const w = Math.ceil(ctx.measureText(text).width) + 2 * CELL;
      const h = NUMBER_PX + CELL;
      ctx.fillStyle = colors.bg;
      ctx.fillRect(Math.round(x - w / 2), Math.round(y - h / 2), w, h);
      ctx.fillStyle = colors.heading;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, Math.round(x), Math.round(y));
    },
    arrow(from, angle, color) {
      const d = direction(angle);
      const tip = { x: from.x + d.x * ARROW, y: from.y + d.y * ARROW };
      const barb = (turn) => {
        const b = direction(angle + Math.PI + turn);
        return { x: tip.x + b.x * ARROW * 0.4, y: tip.y + b.y * ARROW * 0.4 };
      };
      this.stroke([from, tip], { color });
      this.stroke([barb(0.6), tip, barb(-0.6)], { color });
    },
    wedge(from, facing, fovDegrees, range, color) {
      const half = (fovDegrees * Math.PI) / 360;
      const [x, y] = at(from);
      ctx.strokeStyle = color;
      ctx.lineWidth = CELL;
      ctx.setLineDash([CELL * 2, CELL * 2]);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, range * scale, facing - half, facing + half);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    },
  };
}

function drawGrid(ctx, scale, width, height, color) {
  ctx.fillStyle = color;
  for (let m = 0; m <= WORLD.width; m++)
    for (let y = 0; y < height; y += 2 * CELL) ctx.fillRect(Math.round(m * scale), y, CELL, CELL);
  for (let m = 0; m <= WORLD.height; m++)
    for (let x = 0; x < width; x += 2 * CELL) ctx.fillRect(x, Math.round(m * scale), CELL, CELL);
}

const checker = (col, row) => (col + row) % 2 === 0;
const hatch = (col, row) => (col + row) % 4 === 0;

function drawView(p, samples, flags, colors) {
  samples.forEach(({ kind, point }, i) => {
    if (kind === 'room' && flags[i]) p.pattern(point, SAMPLE_STEP, colors.accent, checker);
    if (kind === 'outside' && flags[i]) p.pattern(point, SAMPLE_STEP, colors.heading, hatch);
  });
}

/** The flags of the samples of `kind`, in order: for people and fronts, one per seat. */
const flagsOf = ({ samples, flags }, kind) => samples.flatMap((s, i) => (s.kind === kind ? [flags[i]] : []));

function drawFurniture(ctx, p, scale, furniture, colors) {
  furniture.forEach(({ x, y, w, h, tall }, i) => {
    ctx.fillStyle = tall ? colors.text : colors.border;
    ctx.fillRect(x * scale, y * scale, w * scale, h * scale);
    p.number({ x: x + w / 2, y: y + h / 2 }, i, colors);
  });
}

function drawSeats(p, seats, view, colors) {
  const seen = { people: flagsOf(view, 'people'), front: flagsOf(view, 'front') };
  seats.forEach((seat, i) => {
    p.arrow(seat, seat.facing, seen.front[i] ? colors.accent : colors.text);
    p.square(seat, 6 * CELL, colors.heading);
    if (!seen.people[i]) p.square(seat, 4 * CELL, colors.bg);
    p.number(offset(seat, direction(seat.facing), -NUMBER_OFFSET), i, colors);
  });
}

function drawDoor(p, room, door, colors) {
  const { gap, leaf } = doorGeometry(room, door);
  p.stroke(gap, { color: colors.bg, width: LINE + 2 * CELL });
  p.stroke(leaf.open, { color: colors.accent });
  p.stroke([leaf.open[1], leaf.closed[1]], { color: colors.accent, width: CELL, dash: [CELL * 2, CELL * 2] });
}

function drawSensors(p, room, sensors, colors) {
  sensors.forEach((sensor, i) => {
    const { point, normal } = perimeterPoint(room, sensor);
    p.wedge(point, sensor.facing, sensor.fovDegrees, sensor.range, colors.accent);
    p.square(point, 7 * CELL, colors.heading);
    p.square(point, 4 * CELL, colors.accent);
    p.number(offset(point, normal, NUMBER_OFFSET), i, colors);
  });
}

function drawGesture(p, gesture, colors) {
  if (gesture.tool === 'furniture') {
    const { x, y, w, h } = gesture.rect;
    p.stroke([{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }], { color: colors.heading, width: CELL, dash: [CELL * 2, CELL * 2], closed: true });
  } else {
    p.arrow(gesture.at, gesture.facing, colors.accent);
  }
}

function drawHandles(p, handles, colors) {
  handles.forEach(({ at }) => p.frame(at, 12 * CELL, 2 * CELL, colors.heading));
}

export function drawPlan(canvas, { plan, view, gesture, handles }) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const scale = width / WORLD.width;
  const colors = themeColors();
  const p = painter(ctx, scale, pixelFont());

  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, width, height);
  drawGrid(ctx, scale, width, height, colors.border);
  if (view) drawView(p, view.samples, view.flags, colors);
  drawFurniture(ctx, p, scale, plan.furniture, colors);
  if (plan.room) p.stroke(plan.room, { color: colors.heading, closed: true });
  if (plan.room && plan.door) drawDoor(p, plan.room, plan.door, colors);
  if (view) drawSeats(p, plan.seats, view, colors);
  if (plan.room) drawSensors(p, plan.room, plan.sensors, colors);
  if (plan.draft.length) {
    p.stroke(plan.draft, { color: colors.heading, dash: [CELL * 3, CELL * 2] });
    plan.draft.forEach((corner, i) => p.square(corner, (i ? 4 : 7) * CELL, colors.heading));
  }
  drawHandles(p, handles, colors);
  if (gesture) drawGesture(p, gesture, colors);
}
