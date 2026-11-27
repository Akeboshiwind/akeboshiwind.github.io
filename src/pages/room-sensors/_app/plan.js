/**
 * The plan the user draws: the room, the draft of the next one, and what is placed in it.
 * The door and sensors stand on the room's walls, so they exist only while the room does.
 */
import { FP300, parseRoom, pointInPolygon, snapToPerimeter, fitDoor } from './geometry.js';

export const DOOR_WIDTH = 0.9;

export const EMPTY = Object.freeze({ draft: [], room: null, furniture: [], door: null, seats: [], sensors: [] });

const placeDoor = (plan, at) => {
  const placement = fitDoor(plan.room, snapToPerimeter(plan.room, at), DOOR_WIDTH);
  return placement ? { ...plan, door: { ...placement, width: DOOR_WIDTH, hinge: 'start', swing: 'in' } } : plan;
};

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
    case 'clear':
      return EMPTY;
  }
  throw new Error(`Unknown edit: ${action.type}`);
};
