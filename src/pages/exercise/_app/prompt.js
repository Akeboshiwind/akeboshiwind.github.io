// Build the prompt that gets copied to Claude. Includes the current pool,
// current week plan, and the last 4 weeks of history so Claude can match
// existing exercises and tailor progression. The optional `brief` lets the
// user say what they want next.

import { DAY_NAMES, DAYS, totalUnits, completedUnits } from './store.js';

const SCHEMA = `\
Output ONE JSON code block (\`\`\`json … \`\`\`) and NOTHING ELSE — no prose,
no follow-up questions. The whole response is consumed by a parser.

JSON shape:

{
  "pool": [ /* every exercise referenced anywhere in days.items appears once */ ],
  "days": {
    "mon": { "rest": false, "focus": "string", "items": [ /* item objects */ ] },
    "tue": { ... },
    "wed": { "rest": true,  "focus": "Rest", "items": [] },
    "thu": { ... },
    "fri": { ... },
    "sat": { ... },
    "sun": { "rest": true,  "focus": "Rest", "items": [] }
  }
}

Pool entry — three kinds. ALL fields below are REQUIRED:

  { "kind": "reps",       "name": "Goblet Squat",        "description": "...", "tip": "...", "equipment": "dumbbell", "tags": ["legs"], "defaultSets": 3, "defaultReps": 15, "defaultRestSec": 90 }
  { "kind": "timed",      "name": "Plank",               "description": "...", "tip": "...", "equipment": "none",     "tags": ["core"], "defaultSets": 3, "defaultDurationSec": 30, "defaultRestSec": 30 }
  { "kind": "continuous", "name": "Easy Elliptical",     "description": "...", "tip": "...", "equipment": "elliptical","tags": ["cardio"], "defaultDurationSec": 300 }

equipment must be one of: "none" | "dumbbell" | "band" | "elliptical" | "other".
description and tip are short strings (use empty string if you have nothing to add).
tags is an array of short lowercase strings.

Item objects (used inside days.items). ALL listed fields are REQUIRED:

  { "kind": "section",             "name": "Warm-Up",         "description": "" }
  { "kind": "reps-exercise",       "name": "<pool reps name>",       "sets": 3, "reps": 12, "restSec": 60, "weightNote": "3-5 kg" }
  { "kind": "timed-exercise",      "name": "<pool timed name>",      "sets": 3, "durationSec": 30, "restSec": 30, "weightNote": "" }
  { "kind": "continuous-exercise", "name": "<pool continuous name>", "durationSec": 300 }
  { "kind": "circuit", "name": "HIIT Circuit", "rounds": 3, "betweenChildSec": 15, "betweenRoundSec": 90,
    "children": [
      { "kind": "continuous-exercise", "name": "Jump Squats",      "durationSec": 45 },
      { "kind": "continuous-exercise", "name": "Mountain Climbers","durationSec": 45 }
    ] }

Strict rules — failing any of these will cause the parse to reject your reply:
- Output ONE \`\`\`json block. No commentary.
- Every "name" referenced in items MUST exist in pool.
- Pool kind ↔ item kind must match: "reps" ↔ "reps-exercise", "timed" ↔ "timed-exercise", "continuous" ↔ "continuous-exercise".
- Circuit children MUST be continuous-exercise.
- All numeric fields are integers (no quotes, no decimals).
- All seven days MUST be present (mon/tue/wed/thu/fri/sat/sun).
- Reuse names from the CURRENT POOL exactly so existing exercises are updated rather than duplicated. Pick new names only for genuinely new exercises.

Minimal example (one workout day, rest of week omitted for brevity — your reply MUST include all seven):

\`\`\`json
{
  "pool": [
    { "kind": "reps", "name": "Bodyweight Squats", "description": "Feet shoulder-width, drop to parallel.", "tip": "Pause 1s at the bottom.", "equipment": "none", "tags": ["legs"], "defaultSets": 3, "defaultReps": 15, "defaultRestSec": 45 },
    { "kind": "continuous", "name": "Easy Elliptical", "description": "Comfortable pace, resistance 1-2.", "tip": "", "equipment": "elliptical", "tags": ["warm-up"], "defaultDurationSec": 300 }
  ],
  "days": {
    "mon": { "rest": false, "focus": "Activation",
      "items": [
        { "kind": "section", "name": "Warm-Up", "description": "" },
        { "kind": "continuous-exercise", "name": "Easy Elliptical", "durationSec": 300 },
        { "kind": "reps-exercise", "name": "Bodyweight Squats", "sets": 3, "reps": 15, "restSec": 45, "weightNote": "" }
      ]
    }
  }
}
\`\`\``;

export function buildPrompt(state, brief = '') {
  const pool = compactPool(state.pool);
  const plan = compactPlan(state);
  const history = compactHistory(state.history, 28);

  const briefBlock = brief.trim()
    ? `BRIEF (the user's request for the new routine):\n${brief.trim()}`
    : `BRIEF: (none — adjust the current plan based on what they've been doing in history, or maintain a sensible progression.)`;

  return [
    `Design a complete week of workouts for an existing user. Reply with a single JSON object I can paste back into the tracker.`,
    SCHEMA,
    `CURRENT POOL (reuse these names verbatim so they get updated rather than duplicated):\n${pool || '(empty pool)'}`,
    `CURRENT WEEK PLAN (what they're doing now — feel free to revise):\n${plan}`,
    `RECENT HISTORY (last 4 weeks of completed sessions, newest first):\n${history || '(no completed workouts yet)'}`,
    briefBlock,
  ].join('\n\n');
}

function compactPool(pool) {
  const lines = [];
  for (const p of Object.values(pool)) {
    let line = `- ${p.name} [${p.kind}, ${p.equipment}`;
    if (p.tags?.length) line += `, tags: ${p.tags.join('/')}`;
    line += `] `;
    if (p.kind === 'reps') line += `${p.defaultSets}×${p.defaultReps}, ${p.defaultRestSec}s rest`;
    else if (p.kind === 'timed') line += `${p.defaultSets}×${p.defaultDurationSec}s, ${p.defaultRestSec}s rest`;
    else line += `${p.defaultDurationSec}s`;
    lines.push(line);
  }
  return lines.join('\n');
}

function compactPlan(state) {
  const out = [];
  for (const d of DAYS) {
    const day = state.template.days[d];
    if (day.rest) { out.push(`${DAY_NAMES[d]}: rest`); continue; }
    const items = day.items.map(i => compactItem(i, state.pool)).filter(Boolean);
    out.push(`${DAY_NAMES[d]} (${day.focus || 'no focus'}):\n  ${items.join('\n  ')}`);
  }
  return out.join('\n');
}

function compactItem(item, pool) {
  switch (item.kind) {
    case 'section':
      return `# ${item.name}`;
    case 'reps-exercise': {
      const ex = pool[item.exerciseId];
      const wt = item.weightNote ? `, ${item.weightNote}` : '';
      return `${ex?.name ?? item.exerciseId} — ${item.sets}×${item.reps}${wt}, ${item.restSec}s rest`;
    }
    case 'timed-exercise': {
      const ex = pool[item.exerciseId];
      return `${ex?.name ?? item.exerciseId} — ${item.sets}×${item.durationSec}s, ${item.restSec}s rest`;
    }
    case 'continuous-exercise': {
      const ex = pool[item.exerciseId];
      return `${ex?.name ?? item.exerciseId} — ${item.durationSec}s`;
    }
    case 'circuit': {
      const children = item.children.map(c => pool[c.exerciseId]?.name ?? c.exerciseId).join(' / ');
      return `Circuit "${item.name}" — ${item.rounds} rounds [${children}], ${item.betweenChildSec}s between, ${item.betweenRoundSec}s between rounds`;
    }
    default: return null;
  }
}

function compactHistory(history, days) {
  if (!history.length) return '';
  const cutoffMs = Date.now() - days * 86400000;
  const recent = history.filter(h => {
    const d = new Date(h.date + 'T12:00:00').getTime();
    return d >= cutoffMs;
  });
  if (!recent.length) return '';
  return recent.map(h => {
    const total = totalUnits(h.snapshot);
    const done = completedUnits(h.snapshot, h.completedSets);
    return `${h.date} · ${DAY_NAMES[h.day]} · ${h.focus || 'no focus'} · ${done}/${total} sets`;
  }).join('\n');
}
