// Builds one week's plan from lines in real dietician-written plans, following
// the patterns found in those plans:
// - one daily routine per week, as the original plans were written
// - the plan carries over from last week: lines sharing last week's foods are
//   favoured; the lunch base stays the same about half the time, the dinner
//   base about one week in five
// - each week keeps to one "era" of the source plans; lines are weighted by how close
//   they sit in time to a slowly drifting point, so early and late lines don't mix
// - the morning drink changes about 7 weeks in 10, celery water most often
// - flaxseed is the usual breakfast seed for long runs; seed mix, pumpkin and
//   no-seed weeks come as short blocks
// - the evening drink (green tea, coffee, herbal tea, milk) and the late-night
//   choice (none, a warm drink or chamomile) usually hold from week to week
// - egg, paneer, tofu and soya never twice in a week, nor in two weeks running
// - fruit and curd appear in at most one meal a day; lunch and dinner never
//   share a grain, and besan isn't at both breakfast and dinner
// - lunch and dinner lines aren't repeated within 3 weeks
// - no smoothies in a week that touches winter (December to February)
// Weeks are generated in order from FIRST_WEEK, so every week is fixed: going
// back always shows the same plan.
import { LIBRARY } from './meals.js';

export const SLOT_ORDER = ['early_morning', 'breakfast', 'mid_day', 'lunch', 'evening', 'dinner', 'late_night'];
export const SLOT_NAMES = {
  early_morning: 'Early morning',
  breakfast: 'Breakfast',
  mid_day: 'Mid-day',
  lunch: 'Lunch',
  evening: 'Evening',
  dinner: 'Dinner',
  late_night: 'Late night',
};

const DAY = 24 * 60 * 60 * 1000;
export const EPOCH = Date.UTC(2025, 0, 6); // a Monday

// Monday (UTC midnight) of the week containing `date`, as a week number since EPOCH.
export function weekIndex(date) {
  const d = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dow = (new Date(d).getUTCDay() + 6) % 7; // Mon = 0
  return Math.floor((d - dow * DAY - EPOCH) / (7 * DAY));
}

export const weekStart = index => new Date(EPOCH + index * 7 * DAY);

// mulberry32: small, deterministic
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickWeighted(rand, items, weight = () => 1) {
  const ws = items.map(weight);
  const total = ws.reduce((s, w) => s + w, 0);
  if (total <= 0) return items[Math.floor(rand() * items.length)];
  let r = rand() * total;
  for (let i = 0; i < items.length; i++) {
    r -= ws[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

const WINTER_MONTHS = [11, 0, 1];
export const isWinter = index => Array.from({ length: 7 }, (_, d) => new Date(weekStart(index).getTime() + d * DAY))
  .some(day => WINTER_MONTHS.includes(day.getUTCMonth()));
const SMOOTHIE = /smoothie/i;

const between = (rand, lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

export const FRUIT = /\b(apples?|pears?|oranges?|peach(es)?|papaya|pineapple|berries|fruit)\b/i;
export const CURD = /\b(curd|buttermilk)\b/i;
// Grains/bases; each may appear in only one meal a day.
export const GRAINS = {
  kodo: /kodo/i,
  roti: /\b(roti|chapatt?i|phulkas?|parantha|thepla)\b/i,
  bread: /\b(bread|toast|sandwich|pita|wrap)\b/i,
  dalia: /dalia/i,
  quinoa: /quinoa/i,
  besan: /\b(besan|khamand|khaman)\b/i,
  ragi: /ragi/i,
};
const FOODS = [
  'kodo', 'roti|chapat|phulka', 'bread|toast|sandwich', 'dalia', 'quinoa', 'besan|chilla', 'ragi', 'dal\\b', 'curd',
  'milk', 'weetabix', 'sprouts', 'almond', 'walnut', 'flax', 'seed ?mix', 'pumpkin', 'upma', 'parantha', 'salad',
  'veg', 'biscuit', 'cheese', 'makhana', 'green tea', 'coffee', 'herbal', 'apple', 'papaya', 'pineapple', 'berries',
  'pear', 'mushroom', 'chana', 'moong', 'pasta', 'rice', 'soup',
].map(f => new RegExp(f, 'i'));
const foods = text => new Set(FOODS.filter(rx => rx.test(text)).map(rx => rx.source));
const overlap = (a, b) => {
  if (!a.size || !b.size) return 0;
  let n = 0;
  for (const x of a) if (b.has(x)) n++;
  return n / (a.size + b.size - n);
};
// Slots that may not share a grain (the source plans almost never did).
const CLASH = { lunch: ['dinner'], dinner: ['lunch'] };
const clashes = (g, slot, other) => CLASH[slot]?.includes(other)
  || (g === 'besan' && ((slot === 'dinner' && other === 'breakfast') || (slot === 'breakfast' && other === 'dinner')));
// How strongly each slot favours last week's foods (the source plans kept lunch and evening foods more than chance).
const CARRY = { lunch: 4, evening: 2, dinner: 0.5, breakfast: 0 };
export const grainsOf = text => Object.keys(GRAINS).filter(g => GRAINS[g].test(text));

export const lateIsDrink = text => !/chamomile|milk/i.test(text);

export function eveningKind(text) {
  if (/green tea/i.test(text)) return 'green tea';
  if (/coffee/i.test(text)) return 'coffee';
  if (/herbal|\btea\b/i.test(text)) return 'herbal';
  return 'other';
}
const EVENING_SHARE = { 'green tea': 0.55, coffee: 0.15, herbal: 0.15, other: 0.15 };

// A point that drifts across the source plans' timeline and back over ~130 weeks.
const ERA_PERIOD = 130;
export function eraAt(index) {
  const t = (((index % ERA_PERIOD) + ERA_PERIOD) % ERA_PERIOD) / (ERA_PERIOD / 2);
  return t <= 1 ? t : 2 - t;
}
const eraWeight = (line, era) => Math.exp(-Math.abs((line.pos ?? 0.5) - era) / 0.2);

function startState() {
  return {
    drink: null,
    seed: 'flaxseed', seedLeft: 0,
    evening: null, eveningLeft: 0,
    late: null,
    lunchBase: null, lunchRun: 0,
    dinnerBase: null, dinnerRun: 0,
    lastProteins: [], recent: [], lastFoods: {},
  };
}

function nextWeek(state, index, lib) {
  const rand = rng(index * 2654435761 + 12345);
  const winter = isWinter(index);
  const s = Object.fromEntries(Object.entries(lib.slots)
    .map(([slot, lines]) => [slot, winter ? lines.filter(x => !SMOOTHIE.test(x.text)) : lines]));
  const era = eraAt(index);
  const st = { ...state };

  // Morning drink: changes about 70% of weeks; celery the most common.
  const drinkWeight = k => s.early_morning.filter(x => x.drink === k).reduce((t, x) => t + x.n * eraWeight(x, era), 0);
  if (!st.drink || rand() < 0.7) {
    const kinds = [...new Set(s.early_morning.map(x => x.drink))].filter(k => k !== st.drink);
    st.drink = pickWeighted(rand, kinds, drinkWeight);
  }

  // Seed: flaxseed for long runs, others as short blocks.
  if (st.seedLeft <= 0) {
    if (st.seed !== 'flaxseed') {
      st.seed = 'flaxseed';
      st.seedLeft = between(rand, 3, 12);
    } else {
      // Early on: seed mix; middle: pumpkin; on the plateau mostly no seed, then sunflower.
      st.seed = pickWeighted(rand, ['seedmix', 'pumpkin', 'none', 'sunflower'],
        k => ({ seedmix: Math.max(0, 1 - 2 * era), pumpkin: 0.6 * (1 - Math.abs(era - 0.5) * 2), none: 0.4 + 2 * era, sunflower: era > 0.8 ? 1 : 0 })[k]);
      st.seedLeft = between(rand, 2, 5);
    }
  }
  st.seedLeft -= 1;

  // Evening drink family: held for 3–6 weeks.
  if (st.eveningLeft <= 0) {
    st.evening = pickWeighted(rand, Object.keys(EVENING_SHARE), k => EVENING_SHARE[k]);
    st.eveningLeft = between(rand, 3, 6);
  }
  st.eveningLeft -= 1;

  // Late night: nothing, a warm drink (repeat the morning drink, celery, ajwain…)
  // or chamomile. The source plans left it out about 45% of the time, in long blocks; the
  // choice held from week to week about 6 times in 7.
  if (!st.late || rand() < 0.15) {
    const kinds = ['none', 'drink', 'chamomile'].filter(k => k !== st.late);
    st.late = pickWeighted(rand, kinds, k => ({ none: 0.45, drink: 0.3 + 0.3 * era, chamomile: 0.25 * (1 - era) })[k]);
  }

  const used = new Set();
  const banned = new Set(st.lastProteins);
  const grainsAt = {};
  let fruitUsed = false;
  let curdUsed = false;
  const fits = x => x.proteins.every(p => !used.has(p) && !banned.has(p))
    && !st.recent.includes(x.text)
    && !(fruitUsed && FRUIT.test(x.text))
    && !(curdUsed && CURD.test(x.text))
    && grainsOf(x.text).every(g => ![...(grainsAt[g] ?? [])].some(o => clashes(g, slotNow, o)));
  const take = x => {
    if (!x) return x;
    x.proteins.forEach(p => used.add(p));
    grainsOf(x.text).forEach(g => (grainsAt[g] ||= new Set()).add(slotNow));
    if (FRUIT.test(x.text)) fruitUsed = true;
    if (CURD.test(x.text)) curdUsed = true;
    return x;
  };
  // Lines that share last week's foods are favoured (the source plans were rewritten rather than replaced).
  const carry = (slot, x) => 1 + (CARRY[slot] ?? 0) * overlap(foods(x.text), st.lastFoods[slot] ?? new Set());
  let slotNow = null;
  const choose = (slot, filter = () => true, weight = () => 1) => {
    slotNow = slot;
    // Hard rules (grain clash, fruit, curd, proteins) are kept over the soft
    // preference in `filter` (e.g. "same base as last week") when both can't hold.
    const grainOk = x => grainsOf(x.text).every(g => ![...(grainsAt[g] ?? [])].some(o => clashes(g, slotNow, o)));
    const ok = s[slot].filter(filter);
    const pool = ok.filter(fits);
    const anyFit = s[slot].filter(fits);
    const loose = s[slot].filter(x => grainOk(x) && x.proteins.length === 0 && !FRUIT.test(x.text) && !CURD.test(x.text));
    const from = pool.length ? pool : anyFit.length ? anyFit : loose.length ? loose : s[slot];
    return take(pickWeighted(rand, from, x => eraWeight(x, era) * carry(slot, x) * weight(x)));
  };

  const meals = {};
  const drinkLines = s.early_morning.filter(x => x.drink === st.drink);
  slotNow = 'early_morning';
  meals.early_morning = pickWeighted(rand, drinkLines, x => eraWeight(x, era));
  meals.breakfast = choose('breakfast', x => x.seed === st.seed || (st.seed === 'none' && x.seed === 'none'));
  const weetabix = /weetabix/i.test(meals.breakfast.text);
  const sprouts = /sprouts/i.test(meals.breakfast.text);
  // Lunch keeps last week's base (kodo millet, roti, bread…) about half the time,
  // dinner about one week in five; lunch and dinner never share a grain.
  const baseOf = x => grainsOf(x.text)[0] ?? 'other';
  const keepLunch = st.lunchBase && st.lunchRun < 8 && rand() < 0.45;
  // Sprouts at breakfast come with bread elsewhere and a fruit later (as in the source plans).
  meals.lunch = choose('lunch', keepLunch ? x => baseOf(x) === st.lunchBase : () => true,
    x => (sprouts && GRAINS.bread.test(x.text) ? 12 : 1));
  const keepBase = st.dinnerBase && st.dinnerRun < 3 && rand() < 0.2;
  meals.dinner = choose('dinner', keepBase ? x => baseOf(x) === st.dinnerBase : () => true,
    x => (sprouts && !GRAINS.bread.test(meals.lunch.text) && GRAINS.bread.test(x.text) ? 12 : 1));
  meals.evening = choose('evening', x => eveningKind(x.text) === st.evening,
    x => ((weetabix || sprouts) && !fruitUsed && FRUIT.test(x.text) ? 8 : 1));
  meals.mid_day = !fruitUsed && s.mid_day?.length && rand() < 0.15 ? choose('mid_day') : null;
  meals.late_night = st.late === 'none' ? null
    : choose('late_night', x => lateIsDrink(x.text) === (st.late === 'drink'));

  const base = baseOf(meals.dinner);
  st.dinnerRun = base === st.dinnerBase ? st.dinnerRun + 1 : 1;
  st.dinnerBase = base;
  // A pinned week replaces the generated meals; later weeks carry on from it.
  const pinned = OVERRIDES[weekStart(index).toISOString().slice(0, 10)];
  if (pinned) {
    used.clear();
    for (const [slot, text] of Object.entries(pinned)) {
      meals[slot] = text && (s[slot].find(x => x.text === text) ?? { text, proteins: [] });
      meals[slot]?.proteins.forEach(p => used.add(p));
    }
    for (const slot of SLOT_ORDER) if (!(slot in pinned)) meals[slot] = null;
  }

  const lbase = baseOf(meals.lunch);
  st.lunchRun = lbase === st.lunchBase ? st.lunchRun + 1 : 1;
  st.lunchBase = lbase;
  st.lastProteins = [...used];
  st.recent = [meals.lunch.text, meals.dinner.text, ...st.recent].slice(0, 6);
  st.lastFoods = Object.fromEntries(SLOT_ORDER.filter(k => meals[k]).map(k => [k, foods(meals[k].text)]));

  return {
    week: { index, start: weekStart(index), meals, drink: st.drink, seed: st.seed, proteins: st.lastProteins, era },
    state: st,
  };
}

// Weeks pinned by hand, keyed by the week's Monday (YYYY-MM-DD). Each value maps a
// slot to the exact library line to show; slots left out are empty that week.
export const OVERRIDES = {
  '2026-11-23': {
    early_morning: 'Warm water',
    breakfast: '½ tsp pumpkin mix; Veg sandwich with Cheese slice',
    lunch: 'Kodo millet with veg + curd',
    evening: 'Herbal tea + biscuits; Salad or Makhane',
    dinner: 'Tofu with stir fried veggies + Veg soup/Bread',
    late_night: 'Repeat morning drink',
  },
};

export const FIRST_WEEK = -104;
let cache = null;

// The plan for week `index` (weeks since EPOCH).
export function planForWeek(index, lib = LIBRARY) {
  const i = Math.max(index, FIRST_WEEK);
  if (!cache || cache.lib !== lib) cache = { lib, weeks: [], state: startState() };
  while (cache.weeks.length <= i - FIRST_WEEK) {
    const next = nextWeek(cache.state, FIRST_WEEK + cache.weeks.length, lib);
    cache.weeks.push(next.week);
    cache.state = next.state;
  }
  return cache.weeks[i - FIRST_WEEK];
}
