/**
 * The plan the user draws: the room, the draft of the next one, and what is placed in it.
 * The door and sensors stand on the room's walls, so they exist only while the room does.
 */
import { FP300, parseRoom, pointInPolygon, snapToPerimeter, fitDoor } from './geometry.js';

export const DOOR_WIDTH = 0.9;

/** The viewing angles and ranges a sensor can be set to; FP300's lie inside them. */
export const SENSOR_LIMITS = Object.freeze({
  fovDegrees: Object.freeze({ min: 10, max: 180, step: 5 }),
  range: Object.freeze({ min: 0.5, max: 10, step: 0.5 }),
});

export const EMPTY = Object.freeze({ draft: [], room: null, furniture: [], door: null, seats: [], sensors: [] });

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
    case 'tall':
      return typeof action.tall === 'boolean' ? change(plan, 'furniture', action.index, (f) => ({ ...f, tall: action.tall })) : plan;
    case 'flip hinge':
      return rehang(plan, { hinge: plan.door?.hinge === 'start' ? 'end' : 'start' });
    case 'swing':
      return action.swing === 'in' || action.swing === 'out' ? rehang(plan, { swing: action.swing }) : plan;
    case 'spec':
      return fitsSensor(action.spec) ? change(plan, 'sensors', action.index, (sensor) => ({ ...sensor, ...action.spec })) : plan;
    case 'remove':
      return remove(plan, action.kind, action.index);
    case 'clear':
      return EMPTY;
  }
  throw new Error(`Unknown edit: ${action.type}`);
};
