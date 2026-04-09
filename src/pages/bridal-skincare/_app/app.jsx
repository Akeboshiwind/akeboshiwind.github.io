import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const AM_ROUTINE = [
  'Wash',
  'Alpha Arbutin',
  'Vitamin C',
  'Cicaplast B5',
  'SPF 50',
];

const PM_ROUTINES = {
  Monday: [
    'Double cleanse (makeup days)',
    'Haruharu toner',
    'Anua (niacinamide + TX)',
    'Argireline (crows feet, forehead, neck)',
    'HA \u2192 Retinol \u2192 Eye cream',
    'Almond oil lymph massage',
    'Cicaplast B5',
  ],
  Tuesday: [
    'Double cleanse (makeup days)',
    'Haruharu toner',
    '\ud83d\udea8 LED Mask \u2014 Red + NIR (20 min)',
    'Anua \u2192 Argireline \u2192 HA',
    'Retinol \u2192 Eye cream',
    'Almond oil lymph massage',
    'Cicaplast B5',
  ],
  Wednesday: [
    'Double cleanse (makeup days)',
    'Haruharu toner',
    '\ud83e\uddca Cryo Jelly Sheet Mask (15\u201320 min)',
    'Anua \u2192 Argireline \u2192 HA',
    'Retinol \u2192 Eye cream',
    'Almond oil lymph massage',
    'Cicaplast B5',
  ],
  Thursday: [
    'Double cleanse (makeup days)',
    'Haruharu toner',
    'Anua \u2192 Argireline \u2192 HA',
    'Retinol \u2192 Eye cream',
    'Almond oil lymph massage',
    'Cicaplast B5',
  ],
  Friday: [
    'Double cleanse (makeup days)',
    'Haruharu toner',
    '\ud83d\udea8 LED Mask \u2014 Blue + NIR (20 min)',
    'Anua \u2192 Argireline \u2192 HA',
    'Lactic Acid 5% (skip retinol tonight)',
    'Eye cream \u2192 Almond oil massage',
    'Cicaplast B5',
  ],
  Saturday: [
    'Double cleanse',
    '\ud83d\udc8e Qure Micro-Infusion (every 2 wks) OR LED Full Spectrum (non-Qure Sat)',
    'HA \u2192 Cicaplast B5 only after Qure',
    '\u26a0\ufe0f NO retinol, NO Anua, NO Argireline after Qure',
  ],
  Sunday: [
    'Gentle cleanse',
    'Haruharu toner',
    'HA \u2192 Cicaplast B5',
    '\u26a0\ufe0f Barrier repair only \u2014 NO actives',
    '(Especially after Qure Saturday)',
  ],
};

const WEEKLY_TREATMENTS = {
  Monday: { label: 'Enzyme Mask', detail: 'Ordinary Pumpkin', icon: '\ud83e\uddea' },
  Tuesday: { label: 'Gua Sha + Lymph Massage', detail: '10 min', icon: '\ud83e\uddd8' },
  Wednesday: { label: "L'Or\u00e9al Cryo Jelly", detail: 'Sheet Mask', icon: '\ud83e\uddca' },
  Thursday: { label: 'Rest Day', detail: 'Regular PM routine only', icon: '\ud83c\udf19' },
  Friday: { label: 'Lactic Acid Night', detail: 'Ordinary 5% \u2014 NO retinol', icon: '\ud83e\uddea' },
  Saturday: { label: 'Qure Micro-Infusion', detail: 'Every 2 wks / LED mask other Sats', icon: '\ud83d\udc8e' },
  Sunday: { label: 'Skin Rest Day', detail: 'Barrier repair only', icon: '\ud83c\udf3f' },
};

const LED_MASK = {
  Monday: null,
  Tuesday: { color: 'Red + NIR', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
  Wednesday: null,
  Thursday: null,
  Friday: { color: 'Blue + NIR', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  Saturday: { color: 'Full Spectrum (non-Qure)', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  Sunday: null,
};

const REMINDERS = [
  'Never skip SPF 50 \u2014 UV is the #1 driver of perioral pigmentation',
  'LED Mask: always on cleansed dry skin, before serums',
  'Qure Micro-Infusion: every 2 weeks on Saturday \u2014 last session at Week 9 (3 weeks before wedding)',
  'After Qure Saturday: Sunday is barrier repair only \u2014 no actives',
  'Do not introduce new products in the final 2 weeks before the wedding',
  'Face yoga: 10 min daily \u2014 V shape, smile smoother, puffer fish, forehead resistance, jawline/neck, gua sha',
  'LED mask tip: 1\u20132cm from face, clean lens after each use, no photosensitising actives (retinol/AHA) immediately after',
];

function Section({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function StepList({ steps, done, onToggle }) {
  return (
    <ul className="space-y-2">
      {steps.map((step, i) => (
        <li key={i} className="flex items-start gap-3">
          <button
            onClick={() => onToggle(i)}
            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
              done.has(i)
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
            }`}
          >
            {done.has(i) && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          <span className={`text-sm leading-relaxed ${done.has(i) ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
            {step}
          </span>
        </li>
      ))}
    </ul>
  );
}

function App() {
  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today);
  const [amDone, setAmDone] = useState(new Set());
  const [pmDone, setPmDone] = useState(new Set());

  const dayName = DAYS[selectedDay];
  const isToday = selectedDay === today;
  const pm = PM_ROUTINES[dayName];
  const treatment = WEEKLY_TREATMENTS[dayName];
  const led = LED_MASK[dayName];

  const toggleAm = (i) => setAmDone((prev) => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const togglePm = (i) => setPmDone((prev) => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });

  const changeDay = (delta) => {
    setSelectedDay((d) => (d + delta + 7) % 7);
    setAmDone(new Set());
    setPmDone(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-lg mx-auto px-4 py-6">
        <a
          href="../"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          \u2190 Home
        </a>

        <h1 className="text-2xl font-bold mt-4 mb-1">\ud83c\udf38 Bridal Skincare Routine</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
          3-Month Pre-Wedding Plan &mdash; Stop Qure &amp; all new products 2&ndash;3 weeks before wedding day
        </p>

        {/* Day selector */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => changeDay(-1)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-center">
            <div className="text-lg font-semibold">{dayName}</div>
            {isToday && <div className="text-xs text-green-500 font-medium">Today</div>}
          </div>
          <button
            onClick={() => changeDay(1)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Day pills */}
        <div className="flex gap-1 mb-6 justify-center">
          {DAYS.map((d, i) => (
            <button
              key={d}
              onClick={() => { setSelectedDay(i); setAmDone(new Set()); setPmDone(new Set()); }}
              className={`w-9 h-9 rounded-full text-xs font-medium transition-colors ${
                i === selectedDay
                  ? 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900'
                  : i === today
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {d.slice(0, 2)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Weekly treatment highlight */}
          {treatment && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                {treatment.icon} {treatment.label}
              </div>
              <div className="text-xs text-amber-600 dark:text-amber-400 mt-1">{treatment.detail}</div>
            </div>
          )}

          {/* LED Mask */}
          {led && (
            <div className={`${led.bg} rounded-xl p-4 border border-transparent`}>
              <div className={`text-sm font-semibold ${led.text} flex items-center gap-2`}>
                <span className={`w-3 h-3 rounded-full ${led.dot}`}></span>
                LED Mask: {led.color}
              </div>
              <div className={`text-xs mt-1 ${led.text} opacity-75`}>
                Cleansed dry skin, before serums &middot; 20 min &middot; 1&ndash;2cm from face
              </div>
            </div>
          )}

          {/* AM Routine */}
          <Section title="AM Routine" icon="\u2600\ufe0f">
            <StepList steps={AM_ROUTINE} done={amDone} onToggle={toggleAm} />
          </Section>

          {/* PM Routine */}
          <Section title="PM Routine" icon="\ud83c\udf19">
            <StepList steps={pm} done={pmDone} onToggle={togglePm} />
          </Section>

          {/* Reminders */}
          <Section title="Key Reminders" icon="\u26a0\ufe0f">
            <ul className="space-y-2">
              {REMINDERS.map((r, i) => (
                <li key={i} className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex gap-2">
                  <span className="text-gray-300 dark:text-gray-600 select-none">&bull;</span>
                  {r}
                </li>
              ))}
            </ul>
          </Section>
        </div>

        <div className="text-center text-xs text-gray-300 dark:text-gray-600 mt-8 mb-4">
          Face yoga: 10 min daily
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById('app')).render(<App />);
