/**
 * The plan the user draws: the room, the draft of the next one, what is placed in it, and the sensor a search looks for.
 * The door and sensors stand on the room's walls, so they exist only while the room does.
 */
import { FP300, parseRoom, pointInPolygon, snapToPerimeter, fitDoor } from './geometry.js';

export const DOOR_WIDTH = 0.9;

/** The viewing angles and ranges a sensor can be set to; FP300's lie inside them. */
export const SENSOR_LIMITS = Object.freeze({
  fovDegrees: Object.freeze({ min: 10, max: 180, step: 5 }),
  range: Object.freeze({ min: 0.5, max: 10, step: 0.5 }),
});

export const EMPTY = Object.freeze({ draft: [], room: null, furniture: [], door: null, seats: [], sensors: [], searchWith: FP300 });

const placeDoor = (plan, at) => {
  const placement = fitDoor(plan.room, snapToPerimeter(plan.room, at), DOOR_WIDTH);
  return placement ? { ...plan, door: { ...placement, width: DOOR_WIDTH, hinge: 'start', swing: 'in' } } : plan;
};

const LISTS = new Map([['furniture', 'furniture'], ['seat', 'seats'], ['sensor', 'sensors']]);

const has = (items, index) => Number.isInteger(index) && index >= 0 && index < items.length;

const change = (plan, list, index, update) =>
  has(plan[list], index) ? { ...plan, [list]: plan[list].map((item, i) => (i === index ? update(item) : item)) } : plan;

const remove = (plan, kind, index) => {
  if (kind === 'door') return plan.door ? { ...plan, door: null } : plan;
  const list = LISTS.get(kind);
  return list && has(plan[list], index) ? { ...plan, [list]: plan[list].filter((_, i) => i !== index) } : plan;
};

const fitsSensor = (spec) =>
  Object.entries(spec).every(([key, value]) => Object.hasOwn(SENSOR_LIMITS, key) && value >= SENSOR_LIMITS[key].min && value <= SENSOR_LIMITS[key].max);

const rehang = (plan, door) => (plan.door ? { ...plan, door: { ...plan.door, ...door } } : plan);

/** The plan after `action`; the same plan where the action has nowhere to go. */
export const edit = (plan, action) => {
  switch (action.type) {
    case 'corner':
      return { ...plan, draft: [...plan.draft, action.point] };
    case 'close': {
      const room = parseRoom(plan.draft);
      return room ? { ...plan, room, draft: [], door: null, sensors: [] } : plan;
    }
    case 'furniture':
      return { ...plan, furniture: [...plan.furniture, { ...action.rect, tall: false }] };
    case 'door':
      return plan.room ? placeDoor(plan, action.at) : plan;
    case 'seat':
      return plan.room && pointInPolygon(action.seat, plan.room) ? { ...plan, seats: [...plan.seats, action.seat] } : plan;
    case 'sensor':
      return plan.room ? { ...plan, sensors: [...plan.sensors, { ...FP300, ...action.sensor }] } : plan;
    case 'found':
      return plan.room ? { ...plan, sensors: action.sensors } : plan;
    case 'rect': {
      const { x, y, w, h } = action.rect;
      return w > 0 && h > 0 ? change(plan, 'furniture', action.index, (f) => ({ ...f, x, y, w, h })) : plan;
    }
    case 'set seat':
      return plan.room && pointInPolygon(action.seat, plan.room) ? change(plan, 'seats', action.index, () => action.seat) : plan;
    case 'tall':
      return typeof action.tall === 'boolean' ? change(plan, 'furniture', action.index, (f) => ({ ...f, tall: action.tall })) : plan;
    case 'flip hinge':
      return rehang(plan, { hinge: plan.door?.hinge === 'start' ? 'end' : 'start' });
    case 'swing':
      return action.swing === 'in' || action.swing === 'out' ? rehang(plan, { swing: action.swing }) : plan;
    case 'spec':
      return fitsSensor(action.spec) ? change(plan, 'sensors', action.index, (sensor) => ({ ...sensor, ...action.spec })) : plan;
    case 'search with':
      return fitsSensor(action.spec) ? { ...plan, searchWith: { ...plan.searchWith, ...action.spec } } : plan;
    case 'remove':
      return remove(plan, action.kind, action.index);
    case 'clear':
      return EMPTY;
  }
  throw new Error(`Unknown edit: ${action.type}`);
};

class Unparsable extends Error {}
const reject = () => {
  throw new Unparsable();
};

const record = (v) => (typeof v === 'object' && v !== null && !Array.isArray(v) ? v : reject());
const list = (v, parse) => (Array.isArray(v) ? v.map(parse) : reject());
const nullable = (v, parse) => (v === null ? null : parse(v));
const number = (v) => (Number.isFinite(v) ? v : reject());
const positive = (v) => (number(v) > 0 ? v : reject());
const within = (v, { min, max }) => (number(v) >= min && v <= max ? v : reject());
const oneOf = (v, options) => (options.includes(v) ? v : reject());
const index = (v, length) => (Number.isInteger(v) && v >= 0 && v < length ? v : reject());

const point = (v) => {
  const { x, y } = record(v);
  return { x: number(x), y: number(y) };
};

const facingPoint = (v) => ({ ...point(v), facing: number(v.facing) });

/** Only a room `parseRoom` would give back unchanged, as the door and sensors are placed by its edges' order. */
const storedRoom = (v) => {
  const points = list(v, point);
  const room = parseRoom(points);
  return room && room.length === points.length && room.every((p, i) => p === points[i]) ? room : reject();
};

const placement = (room, v) => {
  const { edge, t } = record(v);
  return { edge: index(edge, room.length), t: within(t, { min: 0, max: 1 }) };
};

const furnishing = (v) => {
  const { x, y, w, h, tall } = record(v);
  return { x: number(x), y: number(y), w: positive(w), h: positive(h), tall: oneOf(tall, [true, false]) };
};

const door = (room, v) => {
  const at = placement(room, v);
  const width = positive(v.width);
  const fitted = fitDoor(room, at, width);
  if (!fitted || fitted.t !== at.t) reject();
  return { ...at, width, hinge: oneOf(v.hinge, ['start', 'end']), swing: oneOf(v.swing, ['in', 'out']) };
};

const sensorSpec = (v) => {
  const { fovDegrees, range } = record(v);
  return { fovDegrees: within(fovDegrees, SENSOR_LIMITS.fovDegrees), range: within(range, SENSOR_LIMITS.range) };
};

const sensor = (room, v) => ({ ...placement(room, v), facing: number(v.facing), ...sensorSpec(v) });

const parse = (v) => {
  const plan = record(v);
  const room = nullable(plan.room, storedRoom);
  const onWalls = () => room ?? reject();
  return {
    draft: list(plan.draft, point),
    room,
    furniture: list(plan.furniture, furnishing),
    door: nullable(plan.door, (d) => door(onWalls(), d)),
    seats: list(plan.seats, facingPoint),
    sensors: list(plan.sensors, (s) => sensor(onWalls(), s)),
    searchWith: sensorSpec(plan.searchWith),
  };
};

/** The plan stored as `value`, which may be stale or malformed; EMPTY where any part of it is malformed or no longer fits its room. */
export const parsePlan = (value) => {
  try {
    return parse(value);
  } catch (error) {
    if (error instanceof Unparsable) return EMPTY;
    throw error;
  }
};
