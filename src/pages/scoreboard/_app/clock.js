/**
 * A clock is the time banked from earlier runs plus, while running, when this run started.
 * Elapsed time is read off the wall clock rather than counted in ticks, so a throttled
 * background tab or a sleeping phone still shows the right time when it wakes.
 *
 * @typedef {{ banked: number, since: number | null }} Clock  times in ms
 */

/** @type {Clock} */
export const STOPPED = { banked: 0, since: null };

export const STOPWATCH_CAP = 99 * 60 + 59;

export const isRunning = (c) => c.since !== null;

export const start = (c, now) => (isRunning(c) ? c : { ...c, since: now });

export const stop = (c, now) => (isRunning(c) ? { banked: c.banked + now - c.since, since: null } : c);

export const elapsed = (c, now) => c.banked + (isRunning(c) ? now - c.since : 0);

/** The seconds on the display: left of the match, or up on the stopwatch. */
export const shown = (c, now, { mode, duration }) => {
  const s = Math.floor(elapsed(c, now) / 1000);
  return mode === 'down' ? Math.max(0, duration - s) : Math.min(STOPWATCH_CAP, s);
};

export const fmtTime = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
