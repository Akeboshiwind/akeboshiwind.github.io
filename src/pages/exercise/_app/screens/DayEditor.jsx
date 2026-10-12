import { useState } from 'react';
import {
  DAY_NAMES,
  setRestDay, setFocus, addSection, addExercise,
  moveItem, removeItem, updateItem, swapExercise, updateSection,
  addCircuit, addCircuitChild,
} from '../store.js';
import { BottomSheet } from '../components/BottomSheet.jsx';
import { Field, inputClass } from '../components/Field.jsx';
import { Icon, upSvg, downSvg, pencilSvg, trashSvg, loopSvg } from '../icons.js';
import { ExerciseActionsSheet } from '../components/ExerciseActionsSheet.jsx';
import { CircuitEditSheet } from '../components/CircuitEditSheet.jsx';
import { ScreenHeader } from '../components/ScreenHeader.jsx';

export function DayEditor({ state, setState, dayKey, navigate }) {
  const day = state.template.days[dayKey];
  const [actionsItemId, setActionsItemId] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingCircuitId, setEditingCircuitId] = useState(null);
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addChildToCircuitId, setAddChildToCircuitId] = useState(null);

  const findItem = id => {
    for (const it of day.items) {
      if (it.id === id) return it;
      if (it.kind === 'circuit') {
        for (const c of it.children) if (c.id === id) return c;
      }
    }
    return null;
  };
  const actionsItem = actionsItemId ? findItem(actionsItemId) : null;
  const editingCircuit = editingCircuitId ? findItem(editingCircuitId) : null;

  const moveUp = id => setState(s => moveItem(s, dayKey, id, -1));
  const moveDown = id => setState(s => moveItem(s, dayKey, id, +1));

  return (
    <>
      <ScreenHeader backLabel="← Week" onBack={() => navigate('/planner')} title={DAY_NAMES[dayKey]} />

      <div className="space-y-3 mb-6">
        <label className="label flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={day.rest}
            onChange={e => setState(s => setRestDay(s, dayKey, e.target.checked))}
            className="pixel-check"
          />
          Rest day
        </label>

        {!day.rest && (
          <Field label="Focus">
            <input
              type="text"
              value={day.focus ?? ''}
              onChange={e => setState(s => setFocus(s, dayKey, e.target.value))}
              placeholder="e.g. Upper Body Strength"
              className={inputClass}
            />
          </Field>
        )}
      </div>

      {day.rest ? (
        <p className="text-sm opacity-70 text-center py-8">
          Rest day — no exercises.
        </p>
      ) : (
        <>
          {day.items.length === 0 && (
            <p className="text-sm opacity-70 text-center py-8">
              No exercises yet. Add one below.
            </p>
          )}
          <ul className="space-y-2">
            {day.items.map((item, i) => {
              const canUp = i > 0;
              const canDown = i < day.items.length - 1;
              if (item.kind === 'circuit') {
                return (
                  <CircuitRow
                    key={item.id}
                    item={item}
                    pool={state.pool}
                    canUp={canUp}
                    canDown={canDown}
                    onMoveUp={() => moveUp(item.id)}
                    onMoveDown={() => moveDown(item.id)}
                    onEditCircuit={() => setEditingCircuitId(item.id)}
                    onEditChild={id => setActionsItemId(id)}
                    onRemoveChild={id => {
                      if (confirm('Remove this exercise from the circuit?')) {
                        setState(s => removeItem(s, dayKey, id));
                      }
                    }}
                    onMoveChild={(id, dir) => setState(s => moveItem(s, dayKey, id, dir))}
                    onAddChild={() => setAddChildToCircuitId(item.id)}
                  />
                );
              }
              return (
                <Row
                  key={item.id}
                  item={item}
                  pool={state.pool}
                  canUp={canUp}
                  canDown={canDown}
                  onMoveUp={() => moveUp(item.id)}
                  onMoveDown={() => moveDown(item.id)}
                  onEdit={() => {
                    if (item.kind === 'section') setEditingSection(item);
                    else setActionsItemId(item.id);
                  }}
                  onRemove={() => {
                    if (confirm('Remove this item?')) {
                      setState(s => removeItem(s, dayKey, item.id));
                    }
                  }}
                />
              );
            })}
          </ul>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowAddPicker(true)}
              data-variant="primary"
              className="pixel-button py-3"
            >
              + Add exercise
            </button>
            <button
              type="button"
              onClick={() => setAddSectionOpen(true)}
              className="pixel-button py-3"
            >
              + Add section
            </button>
            <button
              type="button"
              onClick={() => setState(s => addCircuit(s, dayKey))}
              className="pixel-button col-span-2 py-3"
            >
              + Add circuit
            </button>
          </div>
        </>
      )}

      <ExerciseActionsSheet
        open={!!actionsItem}
        onClose={() => setActionsItemId(null)}
        item={actionsItem}
        exercise={actionsItem ? state.pool[actionsItem.exerciseId] : null}
        pool={state.pool}
        onUpdate={patch => setState(s => updateItem(s, dayKey, actionsItemId, patch))}
        onSwap={newId => setState(s => swapExercise(s, dayKey, actionsItemId, newId))}
        onRemove={() => setState(s => removeItem(s, dayKey, actionsItemId))}
      />

      <CircuitEditSheet
        open={!!editingCircuit}
        circuit={editingCircuit}
        onClose={() => setEditingCircuitId(null)}
        onSave={patch => {
          setState(s => updateItem(s, dayKey, editingCircuitId, patch));
          setEditingCircuitId(null);
        }}
        onRemove={() => {
          setState(s => removeItem(s, dayKey, editingCircuitId));
          setEditingCircuitId(null);
        }}
      />

      <BottomSheet
        open={!!editingSection}
        onClose={() => setEditingSection(null)}
        title="Edit section"
      >
        {editingSection && (
          <SectionForm
            section={editingSection}
            onSave={patch => {
              setState(s => updateSection(s, dayKey, editingSection.id, patch));
              setEditingSection(null);
            }}
          />
        )}
      </BottomSheet>

      <BottomSheet
        open={addSectionOpen}
        onClose={() => setAddSectionOpen(false)}
        title="New section"
      >
        <SectionForm
          section={{ name: '', description: '' }}
          onSave={patch => {
            setState(s => addSection(s, dayKey, patch.name, patch.description));
            setAddSectionOpen(false);
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={showAddPicker}
        onClose={() => setShowAddPicker(false)}
        title="Add exercise"
      >
        <PoolPicker
          pool={state.pool}
          onPick={id => {
            setState(s => addExercise(s, dayKey, id));
            setShowAddPicker(false);
          }}
        />
      </BottomSheet>

      <BottomSheet
        open={!!addChildToCircuitId}
        onClose={() => setAddChildToCircuitId(null)}
        title="Add to circuit"
      >
        <PoolPicker
          pool={state.pool}
          filterKind="continuous"
          onPick={id => {
            setState(s => addCircuitChild(s, dayKey, addChildToCircuitId, id));
            setAddChildToCircuitId(null);
          }}
        />
      </BottomSheet>
    </>
  );
}

function Row({ item, pool, canUp, canDown, onMoveUp, onMoveDown, onEdit, onRemove }) {
  return (
    <li>
      <div className="pixel-panel flex items-center gap-2 p-2">
        <MoveArrows canUp={canUp} canDown={canDown} onUp={onMoveUp} onDown={onMoveDown} />
        <div className="flex-1 min-w-0">
          <RowSummary item={item} pool={pool} />
        </div>
        <EditButton onClick={onEdit} />
        <RemoveButton onClick={onRemove} />
      </div>
    </li>
  );
}

function CircuitRow({ item, pool, canUp, canDown, onMoveUp, onMoveDown, onEditCircuit, onEditChild, onRemoveChild, onMoveChild, onAddChild }) {
  return (
    <li>
      <div className="pixel-panel border-l-accent border-l-8 p-2">
        <div className="flex items-center gap-2">
          <MoveArrows canUp={canUp} canDown={canDown} onUp={onMoveUp} onDown={onMoveDown} />
          <div className="flex-1 min-w-0">
            <p className="label text-accent inline-flex items-center gap-1">
              <Icon svg={loopSvg} className="w-4 h-4" />Circuit
            </p>
            <p className="text-sm text-heading truncate">{item.name}</p>
            <p className="text-xs opacity-70">
              {item.rounds} rounds · {item.children.length} exercises
            </p>
          </div>
          <EditButton onClick={onEditCircuit} />
        </div>

        <ul className="mt-3 space-y-1 pl-7">
          {item.children.map((child, i) => {
            const ex = pool[child.exerciseId];
            const childCanUp = i > 0;
            const childCanDown = i < item.children.length - 1;
            return (
              <li key={child.id} className="flex items-center gap-2 border-2 border-border p-1">
                <MoveArrows
                  canUp={childCanUp}
                  canDown={childCanDown}
                  onUp={() => onMoveChild(child.id, -1)}
                  onDown={() => onMoveChild(child.id, +1)}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-heading truncate">{ex?.name ?? child.exerciseId}</p>
                  <p className="text-xs opacity-70">{child.durationSec}s</p>
                </div>
                <EditButton onClick={() => onEditChild(child.id)} />
                <RemoveButton onClick={() => onRemoveChild(child.id)} />
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={onAddChild}
              className="pixel-button w-full text-left border-dashed"
            >
              + Add exercise
            </button>
          </li>
        </ul>
      </div>
    </li>
  );
}

function MoveArrows({ canUp, canDown, onUp, onDown }) {
  return (
    <div className="flex flex-col gap-0.5 flex-shrink-0">
      <button
        type="button"
        onClick={onUp}
        disabled={!canUp}
        aria-label="Move up"
        className="pixel-icon-button"
      >
        <Icon svg={upSvg} className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={!canDown}
        aria-label="Move down"
        className="pixel-icon-button"
      >
        <Icon svg={downSvg} className="w-4 h-4" />
      </button>
    </div>
  );
}

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Edit"
      className="pixel-icon-button"
    >
      <Icon svg={pencilSvg} className="w-4 h-4" />
    </button>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove"
      className="pixel-icon-button"
      data-variant="danger"
    >
      <Icon svg={trashSvg} className="w-4 h-4" />
    </button>
  );
}

function RowSummary({ item, pool }) {
  if (item.kind === 'section') {
    return (
      <>
        <p className="label text-accent">Section</p>
        <p className="text-sm text-heading truncate">{item.name || '(unnamed section)'}</p>
      </>
    );
  }
  const ex = pool[item.exerciseId];
  return (
    <>
      <p className="text-sm text-heading truncate">{ex?.name ?? item.exerciseId}</p>
      <p className="text-xs opacity-70 truncate">{itemSummary(item)}</p>
    </>
  );
}

function itemSummary(item) {
  switch (item.kind) {
    case 'reps-exercise':
      return `${item.sets}×${item.reps}${item.weightNote ? ' · ' + item.weightNote : ''} · ${item.restSec}s rest`;
    case 'timed-exercise':
      return `${item.sets}×${item.durationSec}s · ${item.restSec}s rest`;
    case 'continuous-exercise':
      return `${item.durationSec}s`;
    default: return '';
  }
}

function SectionForm({ section, onSave }) {
  const [name, setName] = useState(section.name ?? '');
  const [description, setDescription] = useState(section.description ?? '');
  return (
    <form
      onSubmit={e => { e.preventDefault(); onSave({ name: name.trim(), description: description.trim() }); }}
      className="flex flex-col gap-3"
    >
      <Field label="Name">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoFocus
          className={inputClass}
        />
      </Field>
      <Field label="Description (optional)">
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className={`${inputClass} resize-none`}
        />
      </Field>
      <button type="submit" data-variant="primary" className="pixel-button self-end py-2">
        Save
      </button>
    </form>
  );
}

function PoolPicker({ pool, onPick, filterKind }) {
  const [q, setQ] = useState('');
  const all = Object.values(pool).filter(p => filterKind ? p.kind === filterKind : true);
  const filtered = q
    ? all.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase())
        || p.tags?.some(t => t.toLowerCase().includes(q.toLowerCase())))
    : all;

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
              <p className="label opacity-70">
                {p.kind} · {p.equipment}
              </p>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-1 py-2 text-sm opacity-70">No matches.</li>
        )}
      </ul>
    </div>
  );
}
