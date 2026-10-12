import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, cleanup, within, fireEvent, act } from '@testing-library/react';
import { App } from './app.jsx';
import { savedState, TODAY } from './fixture.js';
import { phaseEndBeep, finalBeep } from './audio.js';

vi.mock('./audio.js', () => ({
  primeAudio: vi.fn(),
  phaseEndBeep: vi.fn(),
  finalBeep: vi.fn(),
}));

const KEY = 'exercise_state';
const stored = () => JSON.parse(localStorage.getItem(KEY));
const card = name => screen.getByRole('heading', { name }).closest('li');
const click = el => fireEvent.click(el);
const button = (name, root = screen) => root.getByRole('button', { name });
const tick = (ms = 1000) => act(() => { vi.advanceTimersByTime(ms); });

const open = (hash, state = savedState()) => {
  localStorage.setItem(KEY, JSON.stringify(state));
  window.location.hash = hash;
  return render(<App />);
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(TODAY);
  localStorage.clear();
  window.location.hash = '';
  vi.stubGlobal('confirm', vi.fn(() => true));
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
});

describe('Today', () => {
  test('a started session ticks sets and finishing it files the day in history', async () => {
    open('', savedState({ inProgress: false }));
    expect(screen.getByText('Sets unlock once a session is running.')).toBeTruthy();
    click(button('Start workout'));
    expect(screen.getByText('Session in progress')).toBeTruthy();

    const goblet = within(card('Goblet Squat'));
    click(button('Set 1', goblet));
    click(button('Set 2', goblet));
    expect(button('Set 2', goblet).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('2 / 8 done')).toBeTruthy();

    click(button('Finish workout'));
    const [entry] = stored().history;
    expect(stored().inProgress).toBeNull();
    expect(entry).toMatchObject({ date: '2026-10-13', day: 'tue', focus: 'Legs and Core' });
    expect(entry.completedSets.r1).toEqual([true, true, false]);
    expect(screen.getByRole('button', { name: 'Start workout' })).toBeTruthy();
  });

  test('the day jumper shows another day and returns to today', () => {
    open('');
    click(button('Next day (Wednesday)'));
    expect(screen.getByText('Wednesday')).toBeTruthy();
    expect(screen.getAllByText('Rest day').length).toBeGreaterThan(0);
    click(button('← Back to today (Tuesday)'));
    expect(screen.getByText('Tuesday')).toBeTruthy();
  });

  test('a session running on another day offers to go back to it or discard it', () => {
    const state = savedState();
    state.template.days.mon = { ...state.template.days.tue, focus: 'Monday Legs' };
    open('', state);
    click(button('Previous day (Monday)'));
    expect(screen.getByText('Workout in progress on Tuesday.')).toBeTruthy();
    click(button('Go to Tuesday'));
    expect(screen.getByText('Session in progress')).toBeTruthy();
    click(button('Previous day (Monday)'));
    click(button('Discard'));
    expect(stored().inProgress).toBeNull();
    expect(button("Start Monday's workout")).toBeTruthy();
  });

  test('how-to details open from a card', () => {
    open('');
    const goblet = within(card('Goblet Squat'));
    click(button('How to do this', goblet));
    expect(goblet.getByText('Hold the bell at your chest and sit between your heels.')).toBeTruthy();
    expect(goblet.getByText('Push your knees out.')).toBeTruthy();
    click(button('Hide', goblet));
    expect(goblet.queryByText('Push your knees out.')).toBeNull();
  });

  test('a circuit ticks children and completes its rounds', () => {
    open('');
    const finisher = within(card('Finisher'));
    click(button('Complete round 1', finisher));
    expect(finisher.getByText('Round 2 of 2')).toBeTruthy();
    expect(button('Mark Burpee done', finisher).getAttribute('aria-pressed')).toBe('false');
    click(button('Complete round 2', finisher));
    expect(button('Circuit complete', finisher).disabled).toBe(true);
    expect(stored().inProgress.completedSets.c1).toEqual([true, true]);
  });
});

describe('the timer', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['Date', 'setInterval', 'clearInterval', 'setTimeout', 'clearTimeout'] });
    vi.setSystemTime(TODAY);
  });

  test('counts a rest down, pauses, and cancels', () => {
    open('');
    click(button('Rest 60s', within(card('Goblet Squat'))));
    const bar = within(screen.getByRole('status'));
    expect(bar.getByText('Rest')).toBeTruthy();
    expect(bar.getByText('01:00')).toBeTruthy();
    tick();
    expect(bar.getByText('00:59')).toBeTruthy();
    click(button('Pause', bar));
    tick(3000);
    expect(bar.getByText('00:59')).toBeTruthy();
    click(button('Resume', bar));
    tick();
    expect(bar.getByText('00:58')).toBeTruthy();
    click(button('Cancel', bar));
    expect(screen.queryByRole('status')).toBeNull();
  });

  test('beeps at the end, shows Done, and dismisses itself', () => {
    open('');
    click(button('Start 40s', within(card('Front Plank'))));
    for (let i = 0; i < 40; i++) tick();
    const bar = within(screen.getByRole('status'));
    expect(bar.getByText('Done')).toBeTruthy();
    expect(button('Close', bar)).toBeTruthy();
    expect(finalBeep).toHaveBeenCalledTimes(1);
    expect(phaseEndBeep).not.toHaveBeenCalled();
    tick(2500);
    expect(screen.queryByRole('status')).toBeNull();
  });
});

describe('the exercise actions sheet', () => {
  test('adds a set, edits the numbers and swaps the exercise', () => {
    open('');
    click(button('Edit exercise', within(card('Goblet Squat'))));
    const sheet = within(screen.getByRole('dialog', { name: 'Goblet Squat' }));
    click(button('Add a set', sheet));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('4 × 10 · 12 kg · 60s rest')).toBeTruthy();

    click(button('Edit exercise', within(card('Goblet Squat'))));
    click(button('Edit', within(screen.getByRole('dialog'))));
    const edit = within(screen.getByRole('dialog', { name: 'Edit' }));
    fireEvent.change(edit.getByLabelText('Reps'), { target: { value: '8' } });
    click(button('Save', edit));
    expect(screen.getByText('4 × 8 · 12 kg · 60s rest')).toBeTruthy();

    click(button('Edit exercise', within(card('Goblet Squat'))));
    click(button('Swap exercise', within(screen.getByRole('dialog'))));
    const swap = within(screen.getByRole('dialog', { name: 'Swap exercise' }));
    expect(swap.queryByText('Front Plank')).toBeNull();
    click(swap.getByText('Push-up'));
    expect(screen.getByRole('heading', { name: 'Push-up' })).toBeTruthy();
    expect(stored().template.days.tue.items[1].exerciseId).toBe('pushup');
  });

  test('closes on Escape and on its close button', () => {
    open('');
    click(button('Edit exercise', within(card('Goblet Squat'))));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    click(button('Edit exercise', within(card('Goblet Squat'))));
    click(button('Close', within(screen.getByRole('dialog'))));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  test('removes an exercise from the day after confirming', () => {
    open('');
    click(button('Edit exercise', within(card('Front Plank'))));
    click(button('Remove from this day', within(screen.getByRole('dialog'))));
    expect(screen.queryByRole('heading', { name: 'Front Plank' })).toBeNull();
  });

  test('the circuit sheet saves new rounds', () => {
    open('');
    click(button('Edit circuit', within(card('Finisher'))));
    const sheet = within(screen.getByRole('dialog', { name: 'Edit circuit' }));
    fireEvent.change(sheet.getByLabelText('Rounds'), { target: { value: '4' } });
    click(button('Save', sheet));
    expect(within(card('Finisher')).getByText('Round 1 of 4')).toBeTruthy();
  });
});

describe('Planner', () => {
  test('lists the week and opens a day', async () => {
    open('');
    click(button('Plan'));
    expect(await screen.findByText('Week template')).toBeTruthy();
    const tuesday = button(/^Tuesday/);
    expect(within(tuesday).getByText('Legs and Core')).toBeTruthy();
    expect(within(tuesday).getByText('4 items')).toBeTruthy();
    click(tuesday);
    expect(await screen.findByLabelText('Focus')).toBeTruthy();
    expect(screen.getByLabelText('Focus').value).toBe('Legs and Core');
  });

  test('generates a routine from pasted JSON, after a preview', async () => {
    open('#/planner');
    click(button('Generate routine with Claude'));
    const sheet = within(screen.getByRole('dialog', { name: 'Generate routine with Claude' }));
    expect(button('Copy prompt', sheet)).toBeTruthy();
    expect(button('Preview changes', sheet).disabled).toBe(true);

    const reply = sheet.getByPlaceholderText(/"pool"/);
    fireEvent.change(reply, { target: { value: '{not json' } });
    click(button('Preview changes', sheet));
    expect(sheet.getByText(/^Invalid JSON/)).toBeTruthy();

    const rest = { rest: true, focus: 'Rest', items: [] };
    const routine = {
      pool: [],
      days: {
        mon: { rest: false, focus: 'Imported Monday', items: [
          { kind: 'reps-exercise', name: 'Push-up', sets: 2, reps: 5, restSec: 30, weightNote: '' },
        ] },
        tue: rest, wed: rest, thu: rest, fri: rest, sat: rest, sun: rest,
      },
    };
    fireEvent.change(reply, { target: { value: JSON.stringify(routine) } });
    click(button('Preview changes', sheet));
    const confirm = within(screen.getByRole('dialog', { name: 'Confirm import' }));
    expect(confirm.getByText('1 items')).toBeTruthy();
    click(button('Apply changes', confirm));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(within(button(/^Monday/)).getByText('Imported Monday')).toBeTruthy();
    expect(stored().inProgress).toBeNull();
  });
});

describe('the day editor', () => {
  test('adds an exercise from the pool and reorders it', () => {
    open('#/planner/tue');
    click(screen.getAllByRole('button', { name: '+ Add exercise' }).at(-1));
    const picker = within(screen.getByRole('dialog', { name: 'Add exercise' }));
    fireEvent.change(picker.getByPlaceholderText('Search exercises…'), { target: { value: 'push' } });
    expect(picker.queryByText('Goblet Squat')).toBeNull();
    click(picker.getByText('Push-up'));
    expect(screen.queryByRole('dialog')).toBeNull();

    const ids = () => stored().template.days.tue.items.map(i => i.exerciseId ?? i.kind);
    expect(ids().at(-1)).toBe('pushup');
    const moveUps = screen.getAllByRole('button', { name: 'Move up' });
    click(moveUps.at(-1));
    expect(ids().slice(-2)).toEqual(['pushup', 'circuit']);
  });

  test('adds a section and a circuit', () => {
    open('#/planner/tue');
    click(button('+ Add section'));
    const sheet = within(screen.getByRole('dialog', { name: 'New section' }));
    fireEvent.change(sheet.getByLabelText('Name'), { target: { value: 'Stretch' } });
    click(button('Save', sheet));
    expect(screen.getByText('Stretch')).toBeTruthy();

    click(button('+ Add circuit'));
    expect(screen.getByText('New circuit')).toBeTruthy();
    expect(stored().template.days.tue.items.at(-1)).toMatchObject({ kind: 'circuit', rounds: 3 });
  });

  test('marks the day as rest', () => {
    open('#/planner/tue');
    click(screen.getByLabelText('Rest day'));
    expect(screen.getByText('Rest day — no exercises.')).toBeTruthy();
    expect(stored().template.days.tue).toMatchObject({ rest: true, items: [] });
  });
});

describe('Pool', () => {
  test('filters by search and equipment, and adds a new exercise', async () => {
    open('#/pool');
    expect(screen.getByText('Exercises')).toBeTruthy();
    fireEvent.change(screen.getByPlaceholderText('Search exercises…'), { target: { value: 'plank' } });
    expect(screen.getByText('Front Plank')).toBeTruthy();
    expect(screen.queryByText('Goblet Squat')).toBeNull();
    fireEvent.change(screen.getByPlaceholderText('Search exercises…'), { target: { value: '' } });

    click(button('dumbbell'));
    expect(screen.getByText('Goblet Squat')).toBeTruthy();
    expect(screen.queryByText('Front Plank')).toBeNull();
    click(button('all'));

    click(button('New exercise'));
    expect(await screen.findByText('New exercise')).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/^Name/), { target: { value: 'Wall Sit' } });
    click(screen.getByText('timed'));
    expect(screen.getByText('Sets × duration (e.g. plank 3 × 30s).')).toBeTruthy();
    click(button('Save'));
    expect(await screen.findByText('Wall Sit')).toBeTruthy();
    expect(Object.values(stored().pool).find(p => p.name === 'Wall Sit')).toMatchObject({ kind: 'timed', defaultSets: 3 });
  });
});

describe('Settings', () => {
  test('clears history after confirming', () => {
    open('#/settings');
    click(button(/^Clear history/));
    expect(window.confirm).toHaveBeenCalled();
    expect(stored().history).toEqual([]);
    expect(stored().template.days.tue.focus).toBe('Legs and Core');
  });

  test('erases everything back to the seed', () => {
    open('#/settings');
    click(button(/^Erase all data/));
    expect(stored().history).toEqual([]);
    expect(stored().pool.goblet).toBeUndefined();
  });
});
