import { describe, test, expect, afterEach, beforeEach, vi } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { App } from './app.jsx';
import { LETTERS } from './letters.js';

const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

const today = () => screen.getByLabelText('Today').textContent;
const saved = () => JSON.parse(localStorage.getItem('hindi-srs-progress'));
const shownLetter = () => {
  const card = screen.getByRole('button', { name: /tap to reveal/ });
  return LETTERS.find((l) => card.textContent === `${l.char}tap to reveal`);
};
const grade = (name) => screen.queryByRole('button', { name: new RegExp(`^${name}`) });

describe('studying', () => {
  test('shows a letter face down, with the grades hidden until it is revealed', () => {
    render(<App />);
    const letter = shownLetter();
    expect(letter).toBeTruthy();
    expect(grade('Good')).toBeNull();
    expect(today()).toBe(`${LETTERS.length} new0 learning0 due`);
  });

  test('revealing shows the romanisation, the hint and what each grade would schedule', () => {
    render(<App />);
    const letter = shownLetter();
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/ }));
    expect(screen.getByText(letter.roman)).toBeTruthy();
    expect(screen.getByText(letter.hint)).toBeTruthy();
    expect(grade('Again').textContent).toBe('Again<1m');
    expect(grade('Hard').textContent).toBe('Hard6m');
    expect(grade('Good').textContent).toBe('Good10m');
    expect(grade('Easy').textContent).toBe('Easy4d');
  });

  test('grading moves on to the next letter, saves the schedule, and Back undoes it', () => {
    render(<App />);
    const letter = shownLetter();
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/ }));
    fireEvent.click(grade('Good'));

    expect(shownLetter().char).not.toBe(letter.char);
    expect(today()).toBe(`${LETTERS.length - 1} new1 learning0 due`);
    expect(saved().find((c) => c.char === letter.char)).toMatchObject({ state: 'learning', reps: 1 });

    fireEvent.click(screen.getByRole('button', { name: '← Back' }));
    expect(shownLetter().char).toBe(letter.char);
    expect(saved().find((c) => c.char === letter.char).state).toBe('new');
    expect(screen.queryByRole('button', { name: '← Back' })).toBeNull();
  });

  test('Space reveals, 1–4 grade and U undoes', () => {
    render(<App />);
    const letter = shownLetter();
    fireEvent.keyDown(document, { code: 'Space', key: ' ' });
    expect(screen.getByText(letter.hint)).toBeTruthy();
    fireEvent.keyDown(document, { key: '4' });
    expect(saved().find((c) => c.char === letter.char)).toMatchObject({ state: 'review', interval: 4 });
    expect(screen.getByRole('progressbar', { name: 'Cards in review' }).value).toBeCloseTo(100 / LETTERS.length);
    fireEvent.keyDown(document, { key: 'u' });
    expect(saved().find((c) => c.char === letter.char).state).toBe('new');
  });

  test('a revealed card turns back over when tapped, and number keys then do nothing', () => {
    render(<App />);
    const letter = shownLetter();
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/ }));
    fireEvent.click(screen.getByRole('button', { name: `${letter.char} ${letter.roman}` }));
    expect(shownLetter().char).toBe(letter.char);
    fireEvent.keyDown(document, { key: '3' });
    expect(localStorage.getItem('hindi-srs-progress')).toBeNull();
  });
});

describe('saved progress', () => {
  const deck = (overrides) => LETTERS.map((l, i) => ({
    ...l, interval: 0, ease: 2.5, reps: 0, lapses: 0, due: 0, state: 'new', ...overrides(l, i),
  }));

  test('a deck saved in today\'s format loads: its due learning card is shown and its counts are right', () => {
    const now = Date.now();
    const cards = deck((l, i) => {
      if (i === 0) return { state: 'learning', due: now - 1000, lapses: 1, ease: 2.3 };
      if (i < 4) return { state: 'review', interval: 30, due: now + 30 * DAY, reps: 5 };
      return {};
    });
    localStorage.setItem('hindi-srs-progress', JSON.stringify(cards));
    localStorage.setItem('hindi-srs-settings', JSON.stringify({ maxLearningCards: 1 }));
    render(<App />);
    expect(shownLetter().char).toBe(LETTERS[0].char);
    expect(today()).toBe(`${LETTERS.length - 4} new1 learning1 due`);

    fireEvent.click(screen.getByRole('button', { name: /Settings/ }));
    const progress = within(screen.getByRole('region', { name: 'Statistics & Settings' }));
    expect(progress.getByText('Mastered').previousSibling.textContent).toBe('3');
    expect(progress.getByText('1 / 1 learning cards')).toBeTruthy();
  });

  test('settings in the old daily-counter shape load as the learning limit', () => {
    localStorage.setItem('hindi-srs-settings', JSON.stringify({ newCardsPerDay: 4, lastNewCardsDate: 'Mon Jan 01 2024', newCardsToday: 2 }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Settings/ }));
    expect(screen.getByLabelText('Max learning cards').value).toBe('4');
    expect(JSON.parse(localStorage.getItem('hindi-srs-settings'))).toEqual({ maxLearningCards: 4 });
  });

  test('with everything scheduled ahead it is all caught up, listing what comes next', () => {
    const now = Date.now();
    localStorage.setItem('hindi-srs-progress', JSON.stringify(deck((l, i) => ({ state: 'review', interval: 2, due: now + (i + 1) * DAY }))));
    render(<App />);
    expect(screen.getByText('All caught up!')).toBeTruthy();
    const upcoming = within(screen.getByRole('list', { name: 'Upcoming' })).getAllByRole('listitem');
    expect(upcoming).toHaveLength(10);
    expect(upcoming[0].textContent).toBe(`${LETTERS[0].char}1d`);
  });

  test('at the learning limit with nothing due it asks to focus on learning', () => {
    const now = Date.now();
    localStorage.setItem('hindi-srs-progress', JSON.stringify(deck((l, i) => (i < 2 ? { state: 'learning', due: now + DAY } : {}))));
    localStorage.setItem('hindi-srs-settings', JSON.stringify({ maxLearningCards: 2 }));
    render(<App />);
    expect(screen.getByText('Focus on learning!')).toBeTruthy();
    expect(screen.getByText('You have 2 cards in learning. Review them before adding more!')).toBeTruthy();
  });
});

describe('settings', () => {
  test('the learning limit is clamped to 1–50 and saved', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Settings/ }));
    const field = screen.getByLabelText('Max learning cards');
    fireEvent.change(field, { target: { value: '99' } });
    expect(field.value).toBe('50');
    expect(JSON.parse(localStorage.getItem('hindi-srs-settings'))).toEqual({ maxLearningCards: 50 });
    expect(screen.getByText('0 / 50 learning cards')).toBeTruthy();
  });

  test('tapping a letter in the grid previews its romanisation and hint', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Settings/ }));
    const ka = LETTERS.find((l) => l.roman === 'ka');
    fireEvent.click(screen.getByRole('button', { name: ka.char, pressed: false }));
    const preview = within(screen.getByRole('region', { name: 'Letter preview' }));
    expect(preview.getByText('ka')).toBeTruthy();
    expect(preview.getByText(ka.hint)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Close preview' }));
    expect(screen.queryByRole('region', { name: 'Letter preview' })).toBeNull();
  });

  test('keys do nothing while settings are open', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Settings/ }));
    fireEvent.keyDown(document, { code: 'Space', key: ' ' });
    fireEvent.click(screen.getByRole('button', { name: /Settings/ }));
    expect(shownLetter()).toBeTruthy();
  });

  test('Reset All Progress asks first, then starts every letter over', () => {
    const now = Date.now();
    localStorage.setItem('hindi-srs-progress', JSON.stringify(LETTERS.map((l) => ({ ...l, interval: 30, ease: 2.5, reps: 5, lapses: 0, due: now + DAY, state: 'review' }))));
    const confirm = vi.fn().mockReturnValueOnce(false).mockReturnValueOnce(true);
    vi.stubGlobal('confirm', confirm);
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Settings/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Reset All Progress' }));
    expect(saved().every((c) => c.state === 'review')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Reset All Progress' }));
    expect(confirm).toHaveBeenCalledWith('Reset all progress? This cannot be undone.');
    expect(saved().every((c) => c.state === 'new')).toBe(true);
  });
});

describe('refresh', () => {
  test('Refresh draws a fresh queue and turns the card face down', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /tap to reveal/ }));
    fireEvent.click(screen.getByRole('button', { name: /Refresh/ }));
    expect(shownLetter()).toBeTruthy();
    expect(grade('Good')).toBeNull();
  });
});
