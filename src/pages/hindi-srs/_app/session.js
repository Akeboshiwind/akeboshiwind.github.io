import { buildQueue, scheduleCard } from './srs.js';
import { newDeck } from './storage.js';

/**
 * A study session: the deck, the shuffled queue still to show, the card on screen and the last rating to undo.
 * `ratingsVisible` outlives `flipped`: turning a revealed card back over keeps the grades on screen.
 */
function draw(session, settings) {
  const queue = session.queue.length ? session.queue : buildQueue(session.cards, settings);
  const [current = null, ...rest] = queue;
  return { ...session, queue: rest, current, flipped: false, ratingsVisible: false, undoVisible: false };
}

export function start(cards, settings) {
  return draw({ cards, queue: [], lastAction: null }, settings);
}

export function flip(session) {
  if (!session.current) return session;
  return session.flipped
    ? { ...session, flipped: false }
    : { ...session, flipped: true, ratingsVisible: true };
}

export function rate(session, rating, settings) {
  const { current, cards } = session;
  if (!current) return session;
  const idx = cards.findIndex((c) => c.char === current.char);
  const lastAction = { cardChar: current.char, previousState: { ...cards[idx] }, card: { ...current } };
  const rated = cards.map((c, i) => (i === idx ? scheduleCard(c, rating) : c));
  return { ...draw({ ...session, cards: rated, lastAction }, settings), undoVisible: true };
}

/** The undone card goes back on screen; the card it replaced is dropped until the queue is next rebuilt. */
export function undo(session, settings) {
  const { lastAction, cards } = session;
  if (!lastAction) return session;
  const restored = cards.map((c) => (c.char === lastAction.cardChar ? { ...lastAction.previousState } : c));
  return draw({ ...session, cards: restored, queue: [lastAction.card, ...session.queue], lastAction: null }, settings);
}

export function refresh(session, settings) {
  return draw({ ...session, queue: buildQueue(session.cards, settings) }, settings);
}

export function reset(session, settings) {
  return draw({ ...session, cards: newDeck() }, settings);
}
