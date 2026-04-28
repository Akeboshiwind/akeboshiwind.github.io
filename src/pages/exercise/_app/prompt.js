// The prompt to paste into Claude. The model returns a JSON routine that
// can be imported into the app via parseImportedRoutine().

export const ROUTINE_PROMPT = `Design a complete week of workouts and reply with a single JSON object I can import into my exercise tracker. Output ONLY one JSON code block — no commentary before or after.

The week has 7 days (mon, tue, wed, thu, fri, sat, sun). Some are workouts, some are rest days.

Schema:

{
  "pool": [
    // Every exercise referenced anywhere in days.items must appear here once.
    // Three kinds:
    { "kind": "reps",       "name": "...", "description": "...", "tip": "...", "equipment": "none|dumbbell|band|elliptical|other", "tags": ["..."], "defaultSets": 3, "defaultReps": 12, "defaultRestSec": 60 },
    { "kind": "timed",      "name": "...", "description": "...", "tip": "...", "equipment": "...", "tags": ["..."], "defaultSets": 3, "defaultDurationSec": 30, "defaultRestSec": 30 },
    { "kind": "continuous", "name": "...", "description": "...", "tip": "...", "equipment": "...", "tags": ["..."], "defaultDurationSec": 300 }
  ],
  "days": {
    "mon": { "rest": false, "focus": "short focus line", "items": [ /* item objects */ ] },
    "tue": { ... },
    "wed": { "rest": true,  "focus": "Rest", "items": [] },
    "thu": { ... },
    "fri": { ... },
    "sat": { ... },
    "sun": { "rest": true,  "focus": "Rest", "items": [] }
  }
}

Item kinds (used inside days.items):

- { "kind": "section", "name": "Warm-Up", "description": "" }
    Heading that groups exercises beneath it. Use sparingly to break up long days.
- { "kind": "reps-exercise", "name": "<must match a pool entry of kind 'reps'>", "sets": 3, "reps": 12, "restSec": 60, "weightNote": "3-5 kg" }
    weightNote is optional free text.
- { "kind": "timed-exercise", "name": "<pool entry of kind 'timed'>", "sets": 3, "durationSec": 30, "restSec": 30, "weightNote": "" }
- { "kind": "continuous-exercise", "name": "<pool entry of kind 'continuous'>", "durationSec": 300 }
- { "kind": "circuit", "name": "HIIT Circuit", "rounds": 3, "betweenChildSec": 15, "betweenRoundSec": 90,
    "children": [
      { "kind": "continuous-exercise", "name": "Jump Squats",     "durationSec": 45 },
      { "kind": "continuous-exercise", "name": "Mountain Climbers","durationSec": 45 }
    ] }
    Circuit children must all be continuous-exercises (they inherit timing from the circuit). Use circuits for HIIT (45 on / 15 off × N rounds) or alternating intervals.

Rules:
- Every "name" referenced in items must exist in pool.
- Pool kind must match item kind: pool 'reps' → 'reps-exercise', 'timed' → 'timed-exercise', 'continuous' → 'continuous-exercise'.
- Names are matched case-insensitively when importing, so existing exercises with the same name will be updated rather than duplicated.
- Keep descriptions concise (1-3 sentences). Tips should be one short cue.

Now generate a routine based on this brief:

[Replace this with your goal, available equipment, time constraints, intensity preferences, etc.]
`;
