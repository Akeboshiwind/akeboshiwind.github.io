import { useState } from 'react';
import { upsertPoolEntry, deletePoolEntry } from '../store.js';
import { Field, inputClass } from '../components/Field.jsx';
import { ScreenHeader } from '../components/ScreenHeader.jsx';

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
        <p className="opacity-70">Exercise not found.</p>
        <button onClick={() => navigate('/pool')} className="pixel-button mt-2">
          Back to pool
        </button>
      </div>
    );
  }

  return (
    <>
      <ScreenHeader backLabel="← Pool" onBack={() => navigate('/pool')} title={isNew ? 'New exercise' : 'Edit exercise'} />

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
      <Field label="Name *">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          className={inputClass}
        />
      </Field>

      <fieldset className="flex flex-col gap-1">
        <legend className="label mb-1">Type</legend>
        <div className="flex gap-2">
          {['reps', 'timed', 'continuous'].map(k => (
            <button
              key={k}
              type="button"
              onClick={() => onChangeKind(k)}
              aria-pressed={kind === k}
              className="pixel-chip py-1"
            >
              {k}
            </button>
          ))}
        </div>
        <p className="text-sm opacity-70 mt-1">
          {kind === 'reps' && 'Sets × reps with rest between sets.'}
          {kind === 'timed' && 'Sets × duration (e.g. plank 3 × 30s).'}
          {kind === 'continuous' && 'A single block of time (e.g. cardio 15 min).'}
        </p>
      </fieldset>

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
            <span key={t} className="pixel-chip inline-flex items-center gap-2">
              {t}
              <button type="button" onClick={() => setTags(tags.filter(x => x !== t))} aria-label={`Remove ${t}`} className="pixel-icon-button min-w-0 min-h-0 p-0" data-variant="danger">×</button>
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
          <button type="button" onClick={addTag} className="pixel-button">Add</button>
        </div>
      </Field>

      <div className="pixel-bar flex gap-2" data-position="sticky">
        <button type="submit" data-variant="primary" className="pixel-button flex-1 py-3">Save</button>
        {onDelete && (
          <button type="button" onClick={onDelete} data-variant="danger" className="pixel-button px-4 py-3">Delete</button>
        )}
      </div>
    </form>
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
