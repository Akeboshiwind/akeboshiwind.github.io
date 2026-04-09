import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const LS_PREFIX = 'skincare';
const LS_WEDDING_DATE = `${LS_PREFIX}-wedding-date`;
const LS_QURE_LAST = `${LS_PREFIX}-qure-last-date`;

function lsGet(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key, val) {
  try { localStorage.setItem(key, val); } catch { /* noop */ }
}
function lsRemove(key) {
  try { localStorage.removeItem(key); } catch { /* noop */ }
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function loadChecks(date, period) {
  const raw = lsGet(`${LS_PREFIX}-checks-${date}-${period}`);
  if (!raw) return new Set();
  try { return new Set(JSON.parse(raw)); } catch { return new Set(); }
}

function saveChecks(date, period, set) {
  lsSet(`${LS_PREFIX}-checks-${date}-${period}`, JSON.stringify([...set]));
}

function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

function isQureSaturday(qureLastDate, viewDate) {
  if (!qureLastDate) return true; // default to Qure if no history
  const last = new Date(qureLastDate + 'T00:00:00');
  const view = new Date(viewDate + 'T00:00:00');
  const weeksSince = Math.round(daysBetween(last, view) / 7);
  return weeksSince >= 2;
}

function wasQureLastSaturday(qureLastDate) {
  const today = new Date();
  const lastSat = new Date(today);
  lastSat.setDate(today.getDate() - ((today.getDay() + 7) % 7)); // most recent Sunday's Saturday = yesterday if Sunday
  // Actually, find the most recent Saturday
  const dayOfWeek = today.getDay(); // 0=Sun
  const daysSinceSat = dayOfWeek === 0 ? 1 : dayOfWeek === 6 ? 0 : dayOfWeek + 1;
  // Hmm, let's simplify: for Sunday, was yesterday (Saturday) a Qure day?
  if (!qureLastDate) return false;
  const lastSaturday = new Date(today);
  lastSaturday.setDate(today.getDate() - (dayOfWeek === 0 ? 1 : dayOfWeek + 1));
  const satStr = `${lastSaturday.getFullYear()}-${String(lastSaturday.getMonth() + 1).padStart(2, '0')}-${String(lastSaturday.getDate()).padStart(2, '0')}`;
  return qureLastDate === satStr;
}

function dateForDayIndex(dayIndex) {
  const today = new Date();
  const todayIndex = today.getDay();
  const diff = dayIndex - todayIndex;
  const target = new Date(today);
  target.setDate(today.getDate() + diff);
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}-${String(target.getDate()).padStart(2, '0')}`;
}

function weeksUntilWedding(weddingDate) {
  if (!weddingDate) return null;
  const now = new Date();
  const wedding = new Date(weddingDate + 'T00:00:00');
  const days = daysBetween(now, wedding);
  if (days < 0) return null;
  return Math.floor(days / 7);
}

// --- Routine Data ---

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
    'HA → Retinol → Eye cream',
    'Almond oil lymph massage',
    'Cicaplast B5',
  ],
  Tuesday: [
    'Double cleanse (makeup days)',
    'Haruharu toner',
    '🚨 LED Mask — Red + NIR (20 min)',
    'Anua → Argireline → HA',
    'Retinol → Eye cream',
    'Almond oil lymph massage',
    'Cicaplast B5',
  ],
  Wednesday: [
    'Double cleanse (makeup days)',
    'Haruharu toner',
    '🧊 Cryo Jelly Sheet Mask (15–20 min)',
    'Anua → Argireline → HA',
    'Retinol → Eye cream',
    'Almond oil lymph massage',
    'Cicaplast B5',
  ],
  Thursday: [
    'Double cleanse (makeup days)',
    'Haruharu toner',
    'Anua → Argireline → HA',
    'Retinol → Eye cream',
    'Almond oil lymph massage',
    'Cicaplast B5',
  ],
  Friday: [
    'Double cleanse (makeup days)',
    'Haruharu toner',
    '🚨 LED Mask — Blue + NIR (20 min)',
    'Anua → Argireline → HA',
    'Lactic Acid 5% (skip retinol tonight)',
    'Eye cream → Almond oil massage',
    'Cicaplast B5',
  ],
  SaturdayQure: [
    'Double cleanse',
    '💎 Qure Micro-Infusion',
    'HA → Cicaplast B5 only',
    '⚠️ NO retinol, NO Anua, NO Argireline after Qure',
  ],
  SaturdayLed: [
    'Double cleanse',
    'Haruharu toner',
    '🚨 LED Full Spectrum (20 min)',
    'Anua → Argireline → HA',
    'Retinol → Eye cream',
    'Almond oil lymph massage',
    'Cicaplast B5',
  ],
  SundayAfterQure: [
    'Gentle cleanse',
    'Haruharu toner',
    'HA → Cicaplast B5',
    '⚠️ Barrier repair only — NO actives',
  ],
  SundayNormal: [
    'Gentle cleanse',
    'Haruharu toner',
    'HA → Cicaplast B5',
    'Barrier repair only — light routine',
  ],
};

const WEEKLY_TREATMENTS_BASE = {
  Monday: { label: 'Enzyme Mask', detail: 'Ordinary Pumpkin', icon: '🧪' },
  Tuesday: { label: 'Gua Sha + Lymph Massage', detail: '10 min', icon: '🧘' },
  Wednesday: { label: "L'Oréal Cryo Jelly", detail: 'Sheet Mask', icon: '🧊' },
  Thursday: { label: 'Rest Day', detail: 'Regular PM routine only', icon: '🌙' },
  Friday: { label: 'Lactic Acid Night', detail: 'Ordinary 5% — NO retinol', icon: '🧪' },
  Sunday: { label: 'Skin Rest Day', detail: 'Barrier repair only', icon: '🌿' },
};

const LED_MASK_BASE = {
  Tuesday: { color: 'Red + NIR', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
  Friday: { color: 'Blue + NIR', bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
};

const LED_FULL_SPECTRUM = { color: 'Full Spectrum', bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' };

const REMINDERS = [
  'Never skip SPF 50 — UV is the #1 driver of perioral pigmentation',
  'LED Mask: always on cleansed dry skin, before serums',
  'Qure Micro-Infusion: every 2 weeks on Saturday — last session at Week 9 (3 weeks before wedding)',
  'After Qure Saturday: Sunday is barrier repair only — no actives',
  'Do not introduce new products in the final 2 weeks before the wedding',
  'Face yoga: 10 min daily — V shape, smile smoother, puffer fish, forehead resistance, jawline/neck, gua sha',
  'LED mask tip: 1–2cm from face, clean lens after each use, no photosensitising actives (retinol/AHA) immediately after',
];

// --- Components ---

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

function WeddingDateInput({ weddingDate, onChange }) {
  const [editing, setEditing] = useState(!weddingDate);
  const [value, setValue] = useState(weddingDate || '');

  if (!editing && weddingDate) {
    const weeks = weeksUntilWedding(weddingDate);
    return (
      <div className="flex items-center justify-between bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-4">
        <div>
          <div className="text-sm font-semibold text-pink-800 dark:text-pink-200">
            {weeks !== null && weeks >= 0
              ? `${weeks} weeks to go`
              : 'Wedding day!'}
          </div>
          <div className="text-xs text-pink-600 dark:text-pink-400 mt-0.5">
            {new Date(weddingDate + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          {weeks !== null && weeks <= 2 && weeks >= 0 && (
            <div className="text-xs font-medium text-red-600 dark:text-red-400 mt-1">
              ⚠️ No new products — final stretch!
            </div>
          )}
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-xs text-pink-400 hover:text-pink-600 dark:hover:text-pink-300"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800 rounded-xl p-4">
      <label className="block text-sm font-medium text-pink-800 dark:text-pink-200 mb-2">
        When's the wedding?
      </label>
      <div className="flex gap-2">
        <input
          type="date"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-pink-300 dark:border-pink-700 bg-white dark:bg-gray-800 text-sm"
        />
        <button
          onClick={() => { onChange(value); setEditing(false); }}
          disabled={!value}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 disabled:opacity-40 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  );
}

function App() {
  const today = new Date().getDay();
  const [selectedDay, setSelectedDay] = useState(today);
  const [weddingDate, setWeddingDate] = useState(() => lsGet(LS_WEDDING_DATE) || '');
  const [qureLastDate, setQureLastDate] = useState(() => lsGet(LS_QURE_LAST) || '');

  const viewDate = dateForDayIndex(selectedDay);
  const [amDone, setAmDone] = useState(() => loadChecks(viewDate, 'am'));
  const [pmDone, setPmDone] = useState(() => loadChecks(viewDate, 'pm'));

  // Reload checks when day changes
  useEffect(() => {
    const d = dateForDayIndex(selectedDay);
    setAmDone(loadChecks(d, 'am'));
    setPmDone(loadChecks(d, 'pm'));
  }, [selectedDay]);

  const dayName = DAYS[selectedDay];
  const isToday = selectedDay === today;

  // Determine Saturday/Sunday variants
  const isSaturday = dayName === 'Saturday';
  const isSunday = dayName === 'Sunday';
  const qureSat = isSaturday && isQureSaturday(qureLastDate, viewDate);
  const qurePastWeek9 = weddingDate && weeksUntilWedding(weddingDate) !== null && weeksUntilWedding(weddingDate) < 3;
  const showQure = qureSat && !qurePastWeek9;
  const afterQureSunday = isSunday && wasQureLastSaturday(qureLastDate);

  let pmKey = dayName;
  if (isSaturday) pmKey = showQure ? 'SaturdayQure' : 'SaturdayLed';
  if (isSunday) pmKey = afterQureSunday ? 'SundayAfterQure' : 'SundayNormal';
  const pm = PM_ROUTINES[pmKey];

  // Treatment card
  let treatment = WEEKLY_TREATMENTS_BASE[dayName] || null;
  if (isSaturday) {
    treatment = showQure
      ? { label: 'Qure Micro-Infusion', detail: 'Bi-weekly session', icon: '💎' }
      : { label: 'LED Full Spectrum', detail: 'Non-Qure Saturday', icon: '🚨' };
  }
  if (isSunday && afterQureSunday) {
    treatment = { label: 'Skin Rest Day', detail: 'After Qure — barrier repair only, no actives', icon: '🌿' };
  }

  // LED mask
  let led = LED_MASK_BASE[dayName] || null;
  if (isSaturday && !showQure) led = LED_FULL_SPECTRUM;

  const saveAndToggle = (period, i) => {
    const setter = period === 'am' ? setAmDone : setPmDone;
    setter((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      saveChecks(viewDate, period, next);

      // If checking off the Qure step on Saturday, record the date
      if (period === 'pm' && isSaturday && showQure && i === 1 && next.has(i)) {
        setQureLastDate(viewDate);
        lsSet(LS_QURE_LAST, viewDate);
      }
      return next;
    });
  };

  const handleWeddingDate = (date) => {
    setWeddingDate(date);
    if (date) lsSet(LS_WEDDING_DATE, date);
    else lsRemove(LS_WEDDING_DATE);
  };

  const weeks = weeksUntilWedding(weddingDate);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-lg mx-auto px-4 py-6">
        <a
          href="../"
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← Home
        </a>

        <h1 className="text-2xl font-bold mt-4 mb-1">🌸 Bridal Skincare Routine</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">
          3-Month Pre-Wedding Plan — Stop Qure &amp; all new products 2–3 weeks before wedding day
        </p>

        {/* Wedding date */}
        <div className="mb-6">
          <WeddingDateInput weddingDate={weddingDate} onChange={handleWeddingDate} />
        </div>

        {/* Day selector */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setSelectedDay((d) => (d - 1 + 7) % 7)}
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
            onClick={() => setSelectedDay((d) => (d + 1) % 7)}
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
              onClick={() => setSelectedDay(i)}
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
          {/* Qure past week 9 warning */}
          {isSaturday && qureSat && qurePastWeek9 && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
              <div className="text-sm font-semibold text-red-800 dark:text-red-200">
                ⚠️ No more Qure sessions
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                Less than 3 weeks to wedding — LED Full Spectrum only
              </div>
            </div>
          )}

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
                Cleansed dry skin, before serums · 20 min · 1–2cm from face
              </div>
            </div>
          )}

          {/* AM Routine */}
          <Section title="AM Routine" icon="☀️">
            <StepList steps={AM_ROUTINE} done={amDone} onToggle={(i) => saveAndToggle('am', i)} />
          </Section>

          {/* PM Routine */}
          <Section title="PM Routine" icon="🌙">
            <StepList steps={pm} done={pmDone} onToggle={(i) => saveAndToggle('pm', i)} />
          </Section>

          {/* Reminders */}
          <Section title="Key Reminders" icon="⚠️">
            <ul className="space-y-2">
              {REMINDERS.map((r, i) => (
                <li key={i} className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed flex gap-2">
                  <span className="text-gray-300 dark:text-gray-600 select-none">•</span>
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
