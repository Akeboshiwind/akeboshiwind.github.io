import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';
import chevronLeftSvg from 'pixelarticons/svg/chevron-left.svg?raw';
import chevronRightSvg from 'pixelarticons/svg/chevron-right.svg?raw';
import { LIBRARY } from './meals.js';
import { planForWeek, weekIndex, SLOT_ORDER, SLOT_NAMES } from './plan.js';

const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
const fmtYear = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

export function weekLabel(start) {
  const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
  return `${fmt.format(start)} – ${fmtYear.format(end)}`;
}

const Meal = ({ slot, meal }) => (
  <li className="pixel-line py-3">
    <div className="flex items-baseline justify-between gap-3">
      <span className="label text-heading">{SLOT_NAMES[slot]}</span>
      <span className="label opacity-70">{LIBRARY.times[slot] ?? ''}</span>
    </div>
    <p className="mt-1">{meal.text}</p>
  </li>
);

const Tips = ({ title, open, onToggle, children }) => (
  <section className="mt-6">
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="pixel-button w-full text-left"
      data-variant={open ? 'primary' : undefined}
    >
      {open ? '−' : '+'} {title}
    </button>
    {open && <div className="pixel-panel mt-2 p-3">{children}</div>}
  </section>
);

const Tip = ({ text }) => <li className="pixel-line py-2">{text}</li>;

export function App({ today = new Date() }) {
  const thisWeek = weekIndex(today);
  const [index, setIndex] = useState(thisWeek);
  const [open, setOpen] = useState({ travel: false, weight: false });
  const week = planForWeek(index);
  const toggle = key => setOpen(o => ({ ...o, [key]: !o[key] }));

  const travelBySlot = LIBRARY.travel.reduce((acc, t) => {
    (acc[t.slot] ||= []).push(t);
    return acc;
  }, {});

  return (
    <main className="flex flex-col gap-2">
      <h1 className="page-title">Weekly Diet Plan</h1>
      <p className="page-sub">One daily routine for the week.</p>

      <nav aria-label="Week" className="mt-4 flex items-center justify-between gap-2">
        <button type="button" className="pixel-button flex h-10 items-center" aria-label="Previous week" onClick={() => setIndex(i => i - 1)}>
          <Icon svg={chevronLeftSvg} />
        </button>
        <div className="flex flex-col items-center text-center">
          <span className="label text-heading" aria-live="polite">{weekLabel(week.start)}</span>
          {index === thisWeek
            ? <span className="label opacity-70">This week</span>
            : <button type="button" className="label text-link underline" onClick={() => setIndex(thisWeek)}>Back to this week</button>}
        </div>
        <button type="button" className="pixel-button flex h-10 items-center" aria-label="Next week" onClick={() => setIndex(i => i + 1)}>
          <Icon svg={chevronRightSvg} />
        </button>
      </nav>

      <SectionLabel className="mt-4">Every day this week</SectionLabel>
      <ul aria-label="Meals">
        {SLOT_ORDER.filter(slot => week.meals[slot]).map(slot => <Meal key={slot} slot={slot} meal={week.meals[slot]} />)}
      </ul>
      <ul className="mt-2">
        {LIBRARY.notes.map(n => <li key={n} className="label opacity-70">{n}</li>)}
      </ul>

      <Tips title="Travelling" open={open.travel} onToggle={() => toggle('travel')}>
        <p className="mb-2">Swap these in for the meals above while away.</p>
        {Object.entries(travelBySlot).map(([slot, tips]) => (
          <div key={slot} className="mt-3">
            <h3 className="label text-heading">{slot}</h3>
            <ul>{tips.map(t => <Tip key={t.text} text={t.text} />)}</ul>
          </div>
        ))}
      </Tips>

      <Tips title="If weight stalls or goes up" open={open.weight} onToggle={() => toggle('weight')}>
        <p className="mb-2">Keep the same kind of plan, and tighten a few things for a week or two.</p>
        <ul>{LIBRARY.weight.map(t => <Tip key={t.text} text={t.text} />)}</ul>
      </Tips>

      <p className="label mt-8 opacity-70">{LIBRARY.source}. Not medical advice.</p>
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
