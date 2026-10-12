// A small saved state in the exact shape the app keeps under `exercise_state`.
// Tuesday 2026-10-13 is "today" in the tests that use it.

export const TODAY = new Date('2026-10-13T09:00:00');

const pool = {
  goblet: {
    id: 'goblet', kind: 'reps', name: 'Goblet Squat',
    description: 'Hold the bell at your chest and sit between your heels.',
    tip: 'Push your knees out.', equipment: 'dumbbell', tags: ['legs'],
    defaultSets: 3, defaultReps: 10, defaultRestSec: 60,
  },
  pushup: {
    id: 'pushup', kind: 'reps', name: 'Push-up', description: '', tip: '',
    equipment: 'none', tags: ['chest'],
    defaultSets: 3, defaultReps: 8, defaultRestSec: 45,
  },
  plank: {
    id: 'plank', kind: 'timed', name: 'Front Plank', description: '', tip: '',
    equipment: 'none', tags: ['core'],
    defaultSets: 2, defaultDurationSec: 40, defaultRestSec: 20,
  },
  jog: {
    id: 'jog', kind: 'continuous', name: 'Easy Jog', description: '', tip: '',
    equipment: 'other', tags: ['cardio'], defaultDurationSec: 600,
  },
  burpee: {
    id: 'burpee', kind: 'continuous', name: 'Burpee', description: 'Down, jump back, jump up.', tip: '',
    equipment: 'none', tags: ['hiit'], defaultDurationSec: 30,
  },
};

const rest = { rest: true, focus: 'Rest', items: [] };

const tuesday = {
  rest: false,
  focus: 'Legs and Core',
  items: [
    { kind: 'section', id: 's1', name: 'Main Work', description: 'Steady tempo.' },
    { kind: 'reps-exercise', id: 'r1', exerciseId: 'goblet', sets: 3, reps: 10, restSec: 60, weightNote: '12 kg' },
    { kind: 'timed-exercise', id: 't1', exerciseId: 'plank', sets: 2, durationSec: 40, restSec: 20, weightNote: '' },
    { kind: 'continuous-exercise', id: 'j1', exerciseId: 'jog', durationSec: 600 },
    {
      kind: 'circuit', id: 'c1', name: 'Finisher', rounds: 2, betweenChildSec: 0, betweenRoundSec: 30,
      children: [{ kind: 'continuous-exercise', id: 'c1a', exerciseId: 'burpee', durationSec: 30 }],
    },
  ],
};

const oldUpper = {
  rest: false,
  focus: 'Old Upper Day',
  items: [
    { kind: 'reps-exercise', id: 'o1', exerciseId: 'pushup', sets: 2, reps: 8, restSec: 45, weightNote: '' },
  ],
};

export const savedState = ({ inProgress = true } = {}) => ({
  pool,
  template: {
    days: { mon: rest, tue: tuesday, wed: rest, thu: rest, fri: rest, sat: rest, sun: rest },
  },
  inProgress: inProgress
    ? {
        day: 'tue',
        startedAt: TODAY.getTime() - 5 * 60_000,
        completedSets: { r1: [true, false, false] },
        circuitProgress: { c1: [true] },
      }
    : null,
  history: [
    {
      id: 'h_1759780000000',
      date: '2026-10-06',
      startedAt: Date.parse('2026-10-06T08:00:00'),
      finishedAt: Date.parse('2026-10-06T08:42:00'),
      day: 'tue',
      focus: 'Legs and Core',
      snapshot: tuesday,
      completedSets: { r1: [true, true, true], t1: [true, true], j1: [true], c1: [true, false] },
    },
    {
      id: 'h_1759170000000',
      date: '2026-09-29',
      startedAt: Date.parse('2026-09-29T18:00:00'),
      finishedAt: Date.parse('2026-09-29T19:05:00'),
      day: 'tue',
      focus: 'Old Upper Day',
      snapshot: oldUpper,
      completedSets: { o1: [true, false] },
    },
  ],
});
