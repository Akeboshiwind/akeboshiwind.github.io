import { useState } from 'react';
import { upsertPoolEntry, deletePoolEntry } from '../store.js';

const EMPTY_REPS = {
  kind: 'reps', name: '', description: '', tip: '',
  equipment: 'none', tags: [],
  defaultSets: 3, defaultReps: 12, defaultRestSec: 60,
};

const EMPTY_BY_KIND = {
  reps: EMPTY_REPS,
  timed: {
    kind: 'timed', name: '', description: '', tip: '',
    equipment: 'none', tags: [],
    defaultSets: 3, defaultDurationSec: 30, defaultRestSec: 30,
  },
  continuous: {
    kind: 'continuous', name: '', description: '', tip: '',
    equipment: 'none', tags: [],
    defaultDurationSec: 300,
  },
};

export function PoolEditor({ state, setState, exerciseId, navigate }) {
  const isNew = exerciseId === 'new';
  const existing = isNew ? null : state.pool[exerciseId];

  if (!isNew && !existing) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Exercise not found.</p>
        <button onClick={() => navigate('/pool')} className="mt-2 text-sm underline">
          Back to pool
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => navigate('/pool')}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Pool
        </button>
        <h1 className="text-xl font-semibold flex-1 text-center">
          {isNew ? 'New exercise' : 'Edit exercise'}
        </h1>
        <span className="w-12" />
      </div>

      <Form
        initial={existing ?? EMPTY_REPS}
        isNew={isNew}
        onSave={entry => {
          setState(s => upsertPoolEntry(s, entry));
          navigate('/pool');
        }}
        onDelete={!isNew ? () => {
          if (confirm(`Delete "${existing.name}"? This won't affect days that already use it.`)) {
            setState(s => deletePoolEntry(s, exerciseId));
            navigate('/pool');
          }
        } : null}
      />
    </>
  );
}

function Form({ initial, isNew, onSave, onDelete }) {
  const [kind, setKind] = useState(initial.kind);
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description ?? '');
  const [tip, setTip] = useState(initial.tip ?? '');
  const [equipment, setEquipment] = useState(initial.equipment ?? 'none');
  const [tags, setTags] = useState(initial.tags ?? []);
  const [tagDraft, setTagDraft] = useState('');

  const [defaultSets, setDefaultSets] = useState(initial.defaultSets ?? 3);
  const [defaultReps, setDefaultReps] = useState(initial.defaultReps ?? 12);
  const [defaultDurationSec, setDefaultDurationSec] = useState(initial.defaultDurationSec ?? 30);
  const [defaultRestSec, setDefaultRestSec] = useState(initial.defaultRestSec ?? 60);

  const onChangeKind = k => {
    setKind(k);
    // Snap defaults to that kind's defaults if currently empty for that kind.
    const def = EMPTY_BY_KIND[k];
    if (k === 'reps' || k === 'timed') {
      if (defaultSets === undefined || defaultSets === '') setDefaultSets(def.defaultSets);
      if (defaultRestSec === undefined || defaultRestSec === '') setDefaultRestSec(def.defaultRestSec);
    }
    if (k === 'reps' && (defaultReps === undefined || defaultReps === '')) {
      setDefaultReps(def.defaultReps);
    }
    if ((k === 'timed' || k === 'continuous') && (defaultDurationSec === undefined || defaultDurationSec === '')) {
      setDefaultDurationSec(def.defaultDurationSec);
    }
  };

  const submit = e => {
    e.preventDefault();
    if (!name.trim()) return;
    const id = isNew ? slugify(name) + '-' + Math.random().toString(36).slice(2, 5) : initial.id;
    let entry = {
      id, kind,
      name: name.trim(),
      description: description.trim(),
      tip: tip.trim(),
      equipment, tags,
    };
    if (kind === 'reps') {
      entry.defaultSets = clampInt(defaultSets, 1, 50);
      entry.defaultReps = clampInt(defaultReps, 1, 999);
      entry.defaultRestSec = clampInt(defaultRestSec, 0, 999);
    } else if (kind === 'timed') {
      entry.defaultSets = clampInt(defaultSets, 1, 50);
      entry.defaultDurationSec = clampInt(defaultDurationSec, 1, 7200);
      entry.defaultRestSec = clampInt(defaultRestSec, 0, 999);
    } else {
      entry.defaultDurationSec = clampInt(defaultDurationSec, 1, 7200);
    }
    onSave(entry);
  };

  const addTag = () => {
    const t = tagDraft.trim();
    if (!t) return;
    if (!tags.includes(t)) setTags([...tags, t]);
    setTagDraft('');
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <Field label="Name" required>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className={inputClass}
        />
      </Field>

      <Field label="Type">
        <div className="flex gap-2">
          {['reps', 'timed', 'continuous'].map(k => (
            <button
              key={k}
              type="button"
              onClick={() => onChangeKind(k)}
              className={[
                'px-3 py-1.5 rounded-md text-sm border',
                kind === k
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600',
              ].join(' ')}
            >
              {k}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {kind === 'reps' && 'Sets × reps with rest between sets.'}
          {kind === 'timed' && 'Sets × duration (e.g. plank 3 × 30s).'}
          {kind === 'continuous' && 'A single block of time (e.g. cardio 15 min).'}
        </p>
      </Field>

      <Field label="Description">
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className={inputClass + ' resize-none'}
        />
      </Field>

      <Field label="Coaching tip (optional)">
        <textarea
          value={tip}
          onChange={e => setTip(e.target.value)}
          rows={2}
          className={inputClass + ' resize-none'}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        {kind !== 'continuous' && (
          <Field label="Default sets">
            <input type="number" inputMode="numeric" value={defaultSets} onChange={e => setDefaultSets(e.target.value)} className={inputClass} />
          </Field>
        )}
        {kind === 'reps' && (
          <Field label="Default reps">
            <input type="number" inputMode="numeric" value={defaultReps} onChange={e => setDefaultReps(e.target.value)} className={inputClass} />
          </Field>
        )}
        {(kind === 'timed' || kind === 'continuous') && (
          <Field label="Default duration (s)">
            <input type="number" inputMode="numeric" value={defaultDurationSec} onChange={e => setDefaultDurationSec(e.target.value)} className={inputClass} />
          </Field>
        )}
        {kind !== 'continuous' && (
          <Field label="Default rest (s)">
            <input type="number" inputMode="numeric" value={defaultRestSec} onChange={e => setDefaultRestSec(e.target.value)} className={inputClass} />
          </Field>
        )}
      </div>

      <Field label="Equipment">
        <select value={equipment} onChange={e => setEquipment(e.target.value)} className={inputClass}>
          <option value="none">None / bodyweight</option>
          <option value="dumbbell">Dumbbell</option>
          <option value="band">Resistance band</option>
          <option value="elliptical">Elliptical</option>
          <option value="other">Other</option>
        </select>
      </Field>

      <Field label="Tags">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(t => (
            <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs">
              {t}
              <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} aria-label={`Remove ${t}`} className="text-gray-500 hover:text-red-600">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagDraft}
            onChange={e => setTagDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Add a tag…"
            className={inputClass + ' flex-1'}
          />
          <button type="button" onClick={addTag} className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600">Add</button>
        </div>
      </Field>

      <div className="flex gap-2 pt-2 sticky bottom-0 bg-gray-50 dark:bg-gray-900 -mx-4 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <button type="submit" className="flex-1 py-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">Save</button>
        {onDelete && (
          <button type="button" onClick={onDelete} className="px-4 py-3 rounded-md border border-red-500/40 text-red-700 dark:text-red-400 font-medium">Delete</button>
        )}
      </div>
    </form>
  );
}

const inputClass = 'w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-base';

function Field({ label, required, children }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
      <span>{label}{required && ' *'}</span>
      {children}
    </label>
  );
}

function clampInt(v, lo, hi) {
  const n = parseInt(v, 10);
  if (Number.isNaN(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

function slugify(s) {
  return s.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'exercise';
}
