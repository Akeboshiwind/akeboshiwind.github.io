import { describe, test, expect, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import { App, weekLabel } from './app.jsx';
import { planForWeek, weekIndex, weekStart, SLOT_ORDER, FIRST_WEEK, FRUIT, CURD, grainsOf } from './plan.js';
import { LIBRARY } from './meals.js';

afterEach(cleanup);

const TODAY = new Date(2026, 10, 25); // Wed 25 Nov 2026
const meals = () => within(screen.getByRole('list', { name: 'Meals' })).getAllByRole('listitem').map(li => li.textContent);

describe('Weekly Diet Plan', () => {
  test('shows this week with one line per meal slot', () => {
    render(<App today={TODAY} />);
    expect(screen.getByText('Weekly Diet Plan')).toBeTruthy();
    expect(screen.getByText('This week')).toBeTruthy();
    expect(screen.getByText(weekLabel(weekStart(weekIndex(TODAY))))).toBeTruthy();
    expect(meals().length).toBeGreaterThanOrEqual(5);
  });

  test('sits on PixelAppLayout', () => {
    const page = readFileSync('src/pages/weekly-diet/index.astro', 'utf8');
    expect(page).toContain("import PixelAppLayout from '../../layouts/PixelAppLayout.astro'");
  });

  test('next, previous and back to this week', () => {
    render(<App today={TODAY} />);
    const now = meals();
    fireEvent.click(screen.getByRole('button', { name: 'Next week' }));
    expect(screen.getByText(weekLabel(weekStart(weekIndex(TODAY) + 1)))).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Previous week' }));
    fireEvent.click(screen.getByRole('button', { name: 'Previous week' }));
    expect(screen.getByText(weekLabel(weekStart(weekIndex(TODAY) - 1)))).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Back to this week' }));
    expect(meals()).toEqual(now);
  });

  test('tips sections open and close', () => {
    render(<App today={TODAY} />);
    const travel = screen.getByRole('button', { name: /Travelling/ });
    expect(travel.getAttribute('aria-expanded')).toBe('false');
    fireEvent.click(travel);
    expect(travel.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByText(LIBRARY.travel[0].text)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /If weight stalls or goes up/ }));
    expect(screen.getByText(LIBRARY.weight[2].text)).toBeTruthy();
  });
});

describe('week plans', () => {
  const now = weekIndex(TODAY);
  const range = Array.from({ length: 200 }, (_, i) => FIRST_WEEK + i + 1);

  test('weekIndex maps every day of a week to its Monday', () => {
    const monday = weekStart(now);
    for (let d = 0; d < 7; d++) {
      const day = new Date(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate() + d);
      expect(weekIndex(day)).toBe(now);
    }
    expect(monday.getUTCDay()).toBe(1);
  });

  test('a week is the same whichever order weeks are asked for', () => {
    const later = planForWeek(now + 30).meals;
    const earlier = planForWeek(now - 30).meals;
    expect(planForWeek(now + 30).meals).toEqual(later);
    expect(planForWeek(now - 30).meals).toEqual(earlier);
  });

  test('no protein twice in a week, nor in two weeks running', () => {
    for (const i of range) {
      const week = planForWeek(i);
      const all = SLOT_ORDER.filter(s => week.meals[s]).flatMap(s => week.meals[s].proteins);
      expect(new Set(all).size).toBe(all.length);
      const before = planForWeek(i - 1).proteins;
      expect(week.proteins.filter(p => before.includes(p))).toEqual([]);
    }
  });

  test('fruit appears in at most one meal a day, as in the source plans', () => {
    for (const i of range) {
      const week = planForWeek(i);
      expect(SLOT_ORDER.filter(s => week.meals[s] && FRUIT.test(week.meals[s].text)).length).toBeLessThanOrEqual(1);
    }
  });

  test('the morning drink changes most weeks, as in the source plans', () => {
    let same = 0;
    for (const i of range.slice(1)) if (planForWeek(i).drink === planForWeek(i - 1).drink) same += 1;
    const share = same / (range.length - 1);
    expect(share).toBeGreaterThan(0.15);
    expect(share).toBeLessThan(0.45);
  });

  test('lunch and dinner never share a grain', () => {
    for (const i of range) {
      const { lunch, dinner } = planForWeek(i).meals;
      expect(grainsOf(lunch.text).filter(g => grainsOf(dinner.text).includes(g))).toEqual([]);
    }
  });

  test('curd in at most one meal a day', () => {
    for (const i of range) {
      const week = planForWeek(i);
      expect(SLOT_ORDER.filter(s => week.meals[s] && CURD.test(week.meals[s].text)).length).toBeLessThanOrEqual(1);
    }
  });

  test('every meal is a verbatim line from the library', () => {
    for (const i of range) {
      const week = planForWeek(i);
      for (const s of SLOT_ORDER) if (week.meals[s]) expect(LIBRARY.slots[s].map(x => x.text)).toContain(week.meals[s].text);
    }
  });

  test('no supplements in the library', () => {
    const text = JSON.stringify(LIBRARY.slots);
    expect(text).not.toMatch(/triphala|protein powder|supplement|iron|vit d/i);
  });
});
