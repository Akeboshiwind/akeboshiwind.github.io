import { useState } from 'react';
import { BottomSheet } from './BottomSheet.jsx';
import { Field as LabelledField, inputClass } from './Field.jsx';

export function ExerciseActionsSheet({ open, onClose, item, exercise, pool, onUpdate, onSwap, onRemove }) {
  const [view, setView] = useState('menu'); // 'menu' | 'edit' | 'swap'

  if (!open) return null;

  return (
    <BottomSheet
      open={open}
      onClose={() => { setView('menu'); onClose(); }}
      title={
        view === 'menu' ? (exercise?.name ?? item.exerciseId)
        : view === 'edit' ? 'Edit'
        : 'Swap exercise'
      }
    >
      {view === 'menu' && (
        <Menu
          item={item}
          onEdit={() => setView('edit')}
          onSwap={() => setView('swap')}
          onAddSet={() => { onUpdate({ sets: (item.sets ?? 0) + 1 }); onClose(); }}
          onRemoveSet={() => { onUpdate({ sets: Math.max(1, (item.sets ?? 1) - 1) }); onClose(); }}
          onRemove={() => {
            if (confirm(`Remove "${exercise?.name ?? 'this exercise'}" from this day?`)) {
              onRemove();
              onClose();
            }
          }}
        />
      )}
      {view === 'edit' && (
        <EditForm
          item={item}
          onSave={patch => { onUpdate(patch); setView('menu'); onClose(); }}
          onCancel={() => setView('menu')}
        />
      )}
      {view === 'swap' && (
        <SwapList
          item={item}
          pool={pool}
          onPick={id => { onSwap(id); setView('menu'); onClose(); }}
          onCancel={() => setView('menu')}
        />
      )}
    </BottomSheet>
  );
}

function Menu({ item, onEdit, onSwap, onAddSet, onRemoveSet, onRemove }) {
  const isExercise = item.kind === 'reps-exercise' || item.kind === 'timed-exercise' || item.kind === 'continuous-exercise';
  const hasSets = item.kind === 'reps-exercise' || item.kind === 'timed-exercise';
  return (
    <div className="flex flex-col gap-2">
      {isExercise && <Action label="Edit" onClick={onEdit} />}
      {isExercise && <Action label="Swap exercise" onClick={onSwap} />}
      {hasSets && <Action label="Add a set" onClick={onAddSet} />}
      {hasSets && item.sets > 1 && <Action label="Remove a set" onClick={onRemoveSet} />}
      <Action label="Remove from this day" onClick={onRemove} danger />
    </div>
  );
}

function Action({ label, onClick, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-variant={danger ? 'danger' : undefined}
      className="pixel-button text-left px-3 py-3"
    >
      {label}
    </button>
  );
}

function EditForm({ item, onSave, onCancel }) {
  const [sets, setSets] = useState(item.sets ?? '');
  const [reps, setReps] = useState(item.reps ?? '');
  const [duration, setDuration] = useState(item.durationSec ?? '');
  const [rest, setRest] = useState(item.restSec ?? '');
  const [weight, setWeight] = useState(item.weightNote ?? '');

  const submit = e => {
    e.preventDefault();
    const patch = {};
    if (item.sets !== undefined) patch.sets = clamp(parseInt(sets, 10), 1, 50);
    if (item.reps !== undefined) patch.reps = clamp(parseInt(reps, 10), 1, 999);
    if (item.durationSec !== undefined) patch.durationSec = clamp(parseInt(duration, 10), 1, 7200);
    if (item.restSec !== undefined) patch.restSec = clamp(parseInt(rest, 10), 0, 999);
    if (item.weightNote !== undefined || weight) patch.weightNote = weight;
    onSave(patch);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {item.sets !== undefined && (
          <Field label="Sets" value={sets} onChange={setSets} />
        )}
        {item.reps !== undefined && (
          <Field label="Reps" value={reps} onChange={setReps} />
        )}
        {item.durationSec !== undefined && (
          <Field label="Duration (s)" value={duration} onChange={setDuration} />
        )}
        {item.restSec !== undefined && (
          <Field label="Rest (s)" value={rest} onChange={setRest} />
        )}
      </div>
      {item.kind === 'reps-exercise' || item.kind === 'timed-exercise' ? (
        <Field label="Weight / band" value={weight} onChange={setWeight} type="text" />
      ) : null}
      <div className="flex gap-2 justify-end pt-2">
        <button type="button" onClick={onCancel} className="pixel-button py-2">Cancel</button>
        <button type="submit" data-variant="primary" className="pixel-button py-2">Save</button>
      </div>
    </form>
  );
}

function Field({ label, value, onChange, type = 'number' }) {
  return (
    <LabelledField label={label}>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        inputMode={type === 'number' ? 'numeric' : 'text'}
        className={inputClass}
      />
    </LabelledField>
  );
}

function clamp(n, lo, hi) {
  if (Number.isNaN(n)) return lo;
  return Math.min(hi, Math.max(lo, n));
}

function SwapList({ item, pool, onPick, onCancel }) {
  const [q, setQ] = useState('');
  // Filter pool to entries whose kind would produce the same item kind.
  const compatible = Object.values(pool).filter(p => poolMatchesItem(p, item));
  const filtered = q
    ? compatible.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase())
        || p.tags?.some(t => t.toLowerCase().includes(q.toLowerCase())))
    : compatible;

  return (
    <div className="flex flex-col gap-3">
      <input
        type="search"
        placeholder="Search exercises…"
        value={q}
        onChange={e => setQ(e.target.value)}
        className={inputClass}
      />
      <ul className="flex flex-col">
        {filtered.map(p => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onPick(p.id)}
              className="pixel-line w-full text-left px-1 py-2 hover:text-accent"
            >
              <p className="text-sm text-heading">{p.name}</p>
              <p className="label opacity-70">{poolDescriptor(p)}</p>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-1 py-2 text-sm opacity-70">No matches.</li>
        )}
      </ul>
      <button type="button" onClick={onCancel} className="pixel-button self-end">Cancel</button>
    </div>
  );
}

function poolMatchesItem(p, item) {
  switch (item.kind) {
    case 'reps-exercise':       return p.kind === 'reps';
    case 'timed-exercise':      return p.kind === 'timed';
    case 'continuous-exercise': return p.kind === 'continuous';
    default: return false;
  }
}

function poolDescriptor(p) {
  switch (p.kind) {
    case 'reps':       return `${p.defaultSets}×${p.defaultReps} · ${p.equipment}`;
    case 'timed':      return `${p.defaultSets}×${p.defaultDurationSec}s · ${p.equipment}`;
    case 'continuous': return `${p.defaultDurationSec}s · ${p.equipment}`;
    default: return '';
  }
}
