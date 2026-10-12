const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const RATINGS = [
  { rating: 0, label: 'Again' },
  { rating: 1, label: 'Hard' },
  { rating: 2, label: 'Good' },
  { rating: 3, label: 'Easy' },
];

export function getDefaultCard(letter, now = Date.now()) {
  return {
    ...letter,
    interval: 0,
    ease: 2.5,
    reps: 0,
    lapses: 0,
    due: now,
    state: 'new',
  };
}

/** SM-2 inspired. `interval` is in days; `state` is new | learning | review. */
export function scheduleCard(card, rating, now = Date.now()) {
  const next = { ...card };

  if (rating === 0) {
    next.lapses++;
    next.reps = 0;
    next.interval = 0;
    next.ease = Math.max(1.3, next.ease - 0.2);
    next.due = now;
    next.state = 'learning';
  } else if (rating === 1) {
    if (next.state === 'new' || next.state === 'learning') {
      next.interval = 0;
      next.due = now + 6 * MINUTE;
      next.state = 'learning';
    } else {
      next.interval = Math.max(1, next.interval * 1.2);
      next.ease = Math.max(1.3, next.ease - 0.15);
      next.due = now + next.interval * DAY;
    }
    next.reps++;
  } else if (rating === 2) {
    if (next.state === 'new') {
      next.interval = 0;
      next.due = now + 10 * MINUTE;
      next.state = 'learning';
    } else if (next.state === 'learning') {
      next.interval = 1;
      next.due = now + DAY;
      next.state = 'review';
    } else {
      next.interval = next.interval * next.ease;
      next.due = now + next.interval * DAY;
    }
    next.reps++;
  } else if (rating === 3) {
    if (next.state === 'new' || next.state === 'learning') {
      next.interval = 4;
      next.due = now + 4 * DAY;
      next.state = 'review';
    } else {
      next.interval = next.interval * next.ease * 1.3;
      next.ease = Math.min(3.0, next.ease + 0.15);
      next.due = now + next.interval * DAY;
    }
    next.reps++;
  }

  return next;
}

export function shuffle(array, random = Math.random) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function countLearning(cards) {
  return cards.filter((c) => c.state === 'learning').length;
}

/** The due cards, plus new cards up to `maxLearningCards` minus those already learning, shuffled. */
export function buildQueue(cards, settings, now = Date.now(), random = Math.random) {
  const dueCards = cards.filter((c) => c.due <= now && c.state !== 'new');
  const remainingSlots = settings.maxLearningCards - countLearning(cards);
  const newCards = remainingSlots > 0
    ? shuffle(cards.filter((c) => c.state === 'new'), random).slice(0, remainingSlots)
    : [];
  return shuffle([...dueCards, ...newCards], random);
}

function formatDuration(diff) {
  const minutes = Math.round(diff / MINUTE);
  const hours = Math.round(diff / HOUR);
  const days = Math.round(diff / DAY);

  if (minutes < 60) return `${Math.max(1, minutes)}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}

/** How long until `card` is due again if rated `rating` now. */
export function formatInterval(card, rating, now = Date.now()) {
  return formatDuration(scheduleCard(card, rating, now).due - now);
}

export function formatTimeToDue(card, now = Date.now()) {
  const diff = card.due - now;
  if (diff <= 0) return 'now';
  return formatDuration(diff);
}

export function getUpcomingCards(cards, count = 10) {
  return [...cards]
    .filter((c) => c.state !== 'new')
    .sort((a, b) => a.due - b.due)
    .slice(0, count);
}

/** `mastered` is a review card with an interval of three weeks or more. */
export function getStats(cards, now = Date.now()) {
  return {
    new: cards.filter((c) => c.state === 'new').length,
    learning: countLearning(cards),
    due: cards.filter((c) => c.due <= now && c.state !== 'new').length,
    review: cards.filter((c) => c.state === 'review').length,
    mastered: cards.filter((c) => c.state === 'review' && c.interval >= 21).length,
  };
}
