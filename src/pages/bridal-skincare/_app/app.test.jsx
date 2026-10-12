import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, act, fireEvent, within } from '@testing-library/react';

// Wednesday. The tool's week runs Mon–Sun, so this week is 2026-10-12 … 2026-10-18.
const NOW = new Date(2026, 9, 14, 9, 0);

async function mount(seed = {}) {
  localStorage.clear();
  for (const [key, value] of Object.entries(seed)) localStorage.setItem(key, value);
  document.body.innerHTML = '<div id="app"></div>';
  vi.resetModules();
  await act(async () => { await import('./app.jsx'); });
}

function stepControl(text) {
  const li = screen.getAllByText(text).map((el) => el.closest('li')).find(Boolean);
  return within(li).queryByRole('checkbox') ?? within(li).getByRole('button');
}

const stored = (key) => localStorage.getItem(key);

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  document.body.innerHTML = '';
});

describe('Bridal Skincare Routine', () => {
  test("opens on today's routine", async () => {
    await mount();
    expect(screen.getByText('Wednesday')).toBeTruthy();
    expect(screen.getByText('Today')).toBeTruthy();
    expect(screen.getByText('Face wash')).toBeTruthy();
    expect(screen.getByText(/Cryo Jelly Sheet Mask \(15–20 min\)/)).toBeTruthy();
    expect(screen.getByText(/Face yoga — smile smoother/)).toBeTruthy();
  });

  test("a day pill shows that day's routine", async () => {
    await mount();
    fireEvent.click(screen.getByText('Fr'));
    expect(screen.getByText('Friday')).toBeTruthy();
    expect(screen.queryByText('Today')).toBeNull();
    expect(screen.getByText(/LED Mask: Blue \+ NIR/)).toBeTruthy();
    expect(screen.getByText('Lactic Acid 5% — NO retinol tonight')).toBeTruthy();
  });

  test('the collapsed sections open on a click', async () => {
    await mount();
    expect(screen.queryByText(/Perioral Hyperpigmentation/)).toBeNull();
    fireEvent.click(screen.getByText(/Problem Areas/));
    expect(screen.getByText(/Perioral Hyperpigmentation/)).toBeTruthy();

    expect(screen.queryByText('Month 1')).toBeNull();
    fireEvent.click(screen.getByText(/3-Month Timeline/));
    expect(screen.getByText('Month 1')).toBeTruthy();
  });

  test('without a wedding date it asks for one, and saves it', async () => {
    await mount();
    expect(screen.getByText("When's the wedding?")).toBeTruthy();
    const input = document.querySelector('input[type="date"]');
    fireEvent.change(input, { target: { value: '2027-01-13' } });
    fireEvent.click(screen.getByText('Save'));
    expect(stored('skincare-wedding-date')).toBe('2027-01-13');
    expect(screen.getByText('13 weeks to go')).toBeTruthy();
  });

  test('Saturday with no Qure history is a Qure night, and ticking it records the date', async () => {
    await mount();
    fireEvent.click(screen.getByText('Sa'));
    expect(screen.getByText('Bi-weekly session')).toBeTruthy();
    fireEvent.click(stepControl(/Qure Micro-Infusion$/));
    expect(stored('skincare-qure-last-date')).toBe('2026-10-17');

    fireEvent.click(screen.getByText('Su'));
    expect(screen.getByText('After Qure — barrier repair only, no actives')).toBeTruthy();
  });
});

describe('storage contract', () => {
  test('ticking a step stores its index under skincare-checks-<date>-<period>', async () => {
    await mount();
    fireEvent.click(stepControl('Face wash'));
    fireEvent.click(stepControl('Vitamin C'));
    expect(JSON.parse(stored('skincare-checks-2026-10-14-am'))).toEqual([0, 2]);

    fireEvent.click(stepControl('Haruharu toner'));
    expect(JSON.parse(stored('skincare-checks-2026-10-14-pm'))).toEqual([1]);

    fireEvent.click(stepControl('Scalp massage + rosemary oil'));
    expect(JSON.parse(stored('skincare-checks-2026-10-14-extras'))).toEqual([1]);
  });

  test("saved ticks load for the day they were made on", async () => {
    await mount({
      'skincare-checks-2026-10-14-am': '[0,2]',
      'skincare-checks-2026-10-16-pm': '[1]',
    });
    fireEvent.click(stepControl('Face wash'));
    expect(JSON.parse(stored('skincare-checks-2026-10-14-am'))).toEqual([2]);

    fireEvent.click(screen.getByText('Fr'));
    fireEvent.click(stepControl('Haruharu toner'));
    expect(JSON.parse(stored('skincare-checks-2026-10-16-pm'))).toEqual([]);
  });

  test('a saved wedding date shows the countdown, and the final-stretch warning inside two weeks', async () => {
    await mount({ 'skincare-wedding-date': '2026-10-25' });
    expect(screen.queryByText("When's the wedding?")).toBeNull();
    expect(screen.getByText('1 week to go')).toBeTruthy();
    expect(screen.getByText(/No new products — final stretch!/)).toBeTruthy();
  });

  test('a Qure session last Saturday makes this Saturday an LED night', async () => {
    await mount({ 'skincare-qure-last-date': '2026-10-10' });
    fireEvent.click(screen.getByText('Sa'));
    expect(screen.getByText('Non-Qure Saturday')).toBeTruthy();
    expect(screen.getByText(/LED Mask: Full Spectrum/)).toBeTruthy();
  });

  test('inside three weeks of the wedding, Saturday warns there are no more Qure sessions', async () => {
    await mount({ 'skincare-wedding-date': '2026-10-25' });
    fireEvent.click(screen.getByText('Sa'));
    expect(screen.getByText(/No more Qure sessions/)).toBeTruthy();
  });
});
