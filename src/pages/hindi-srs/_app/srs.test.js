import { describe, test, expect } from 'vitest';
import {
  getDefaultCard, scheduleCard, shuffle, buildQueue, formatInterval, formatTimeToDue, getUpcomingCards, getStats,
} from './srs.js';

const MINUTE = 60 * 1000;
const DAY = 24 * 60 * MINUTE;
const NOW = 1_700_000_000_000;
const letter = { char: 'क', roman: 'ka', hint: 'like "k" in "skip"' };
const card = (fields) => ({ ...getDefaultCard(letter, NOW), ...fields });

describe('getDefaultCard', () => {
  test('a new card keeps its letter, is due now and starts at ease 2.5', () => {
    expect(getDefaultCard(letter, NOW)).toEqual({
      ...letter, interval: 0, ease: 2.5, reps: 0, lapses: 0, due: NOW, state: 'new',
    });
  });
});

describe('scheduleCard', () => {
  test('Again sends any card back to learning, due now, with a lapse and less ease', () => {
    const next = scheduleCard(card({ state: 'review', interval: 10, reps: 4, ease: 2.5 }), 0, NOW);
    expect(next).toMatchObject({ state: 'learning', due: NOW, interval: 0, reps: 0, lapses: 1, ease: 2.3 });
  });

  test('Again never lowers ease below 1.3', () => {
    expect(scheduleCard(card({ ease: 1.4 }), 0, NOW).ease).toBe(1.3);
  });

  test('Hard on a new or learning card is due in 6 minutes', () => {
    for (const state of ['new', 'learning']) {
      expect(scheduleCard(card({ state }), 1, NOW)).toMatchObject({ state: 'learning', due: NOW + 6 * MINUTE, reps: 1 });
    }
  });

  test('Hard on a review card grows the interval by 1.2 (at least a day) and drops ease by 0.15', () => {
    const next = scheduleCard(card({ state: 'review', interval: 10, ease: 2.5 }), 1, NOW);
    expect(next.interval).toBe(12);
    expect(next.ease).toBeCloseTo(2.35);
    expect(next.due).toBe(NOW + 12 * DAY);
    expect(scheduleCard(card({ state: 'review', interval: 0.5 }), 1, NOW).interval).toBe(1);
  });

  test('Good moves new → learning (10m) → review (1d) → interval × ease', () => {
    const learning = scheduleCard(card({}), 2, NOW);
    expect(learning).toMatchObject({ state: 'learning', due: NOW + 10 * MINUTE, interval: 0 });
    const review = scheduleCard(learning, 2, NOW);
    expect(review).toMatchObject({ state: 'review', due: NOW + DAY, interval: 1 });
    const again = scheduleCard({ ...review, interval: 4 }, 2, NOW);
    expect(again).toMatchObject({ state: 'review', interval: 10, due: NOW + 10 * DAY });
  });

  test('Easy on a new card goes straight to review in 4 days', () => {
    expect(scheduleCard(card({}), 3, NOW)).toMatchObject({ state: 'review', interval: 4, due: NOW + 4 * DAY });
  });

  test('Easy on a review card multiplies by ease × 1.3 and raises ease, capped at 3', () => {
    const next = scheduleCard(card({ state: 'review', interval: 10, ease: 2 }), 3, NOW);
    expect(next.interval).toBeCloseTo(26);
    expect(next.ease).toBeCloseTo(2.15);
    expect(scheduleCard(card({ state: 'review', interval: 1, ease: 2.95 }), 3, NOW).ease).toBe(3);
  });

  test('does not mutate the card it is given', () => {
    const before = card({});
    scheduleCard(before, 2, NOW);
    expect(before.state).toBe('new');
  });
});

describe('shuffle', () => {
  test('returns a permutation and leaves the input alone', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input);
    expect([...out].sort()).toEqual(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('buildQueue', () => {
  const deck = [
    card({ char: 'a', state: 'review', due: NOW - 1 }),
    card({ char: 'b', state: 'review', due: NOW + DAY }),
    card({ char: 'c', state: 'learning', due: NOW }),
    card({ char: 'd' }),
    card({ char: 'e' }),
    card({ char: 'f' }),
  ];
  const chars = (q) => q.map((c) => c.char).sort();

  test('holds the due cards and new cards up to the learning limit minus those learning', () => {
    expect(chars(buildQueue(deck, { maxLearningCards: 3 }, NOW))).toHaveLength(4);
    expect(chars(buildQueue(deck, { maxLearningCards: 3 }, NOW)).filter((c) => 'def'.includes(c))).toHaveLength(2);
    expect(chars(buildQueue(deck, { maxLearningCards: 3 }, NOW))).toEqual(expect.arrayContaining(['a', 'c']));
  });

  test('adds no new cards once the learning limit is reached', () => {
    expect(chars(buildQueue(deck, { maxLearningCards: 1 }, NOW))).toEqual(['a', 'c']);
  });

  test('never includes a card that is not yet due', () => {
    expect(chars(buildQueue(deck, { maxLearningCards: 50 }, NOW))).not.toContain('b');
  });
});

describe('formatting', () => {
  test('formatInterval shows what each rating would schedule', () => {
    const fresh = card({});
    expect(formatInterval(fresh, 0, NOW)).toBe('1m');
    expect(formatInterval(fresh, 1, NOW)).toBe('6m');
    expect(formatInterval(fresh, 2, NOW)).toBe('10m');
    expect(formatInterval(fresh, 3, NOW)).toBe('4d');
  });

  test('formatTimeToDue reads now, minutes, hours or days', () => {
    expect(formatTimeToDue(card({ due: NOW - 1 }), NOW)).toBe('now');
    expect(formatTimeToDue(card({ due: NOW + 5 * MINUTE }), NOW)).toBe('5m');
    expect(formatTimeToDue(card({ due: NOW + 3 * 60 * MINUTE }), NOW)).toBe('3h');
    expect(formatTimeToDue(card({ due: NOW + 2 * DAY }), NOW)).toBe('2d');
  });
});

describe('getUpcomingCards', () => {
  test('lists started cards soonest first, at most `count`', () => {
    const deck = [card({ char: 'x' }), card({ char: 'late', state: 'review', due: NOW + 2 }), card({ char: 'soon', state: 'learning', due: NOW + 1 })];
    expect(getUpcomingCards(deck).map((c) => c.char)).toEqual(['soon', 'late']);
    expect(getUpcomingCards(deck, 1).map((c) => c.char)).toEqual(['soon']);
  });
});

describe('getStats', () => {
  test('counts new, learning, due, review and mastered (review at 21+ days)', () => {
    const deck = [
      card({}),
      card({ state: 'learning', due: NOW }),
      card({ state: 'review', interval: 21, due: NOW + DAY }),
      card({ state: 'review', interval: 3, due: NOW - 1 }),
    ];
    expect(getStats(deck, NOW)).toEqual({ new: 1, learning: 1, due: 2, review: 2, mastered: 1 });
  });
});
