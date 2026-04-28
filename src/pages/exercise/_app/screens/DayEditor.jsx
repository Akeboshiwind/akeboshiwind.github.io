import { useState } from 'react';
import {
  DndContext, closestCenter, PointerSensor, KeyboardSensor,
  useSensor, useSensors,
} from '@dnd-kit/core';
import {
  SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  DAY_NAMES,
  setRestDay, setFocus, addSection, addExercise,
  reorderItems, removeItem, updateItem, swapExercise, updateSection,
  addCircuit, addCircuitChild,
} from '../store.js';
import { BottomSheet } from '../components/BottomSheet.jsx';
import { ExerciseActionsSheet } from '../components/ExerciseActionsSheet.jsx';
import { CircuitEditSheet } from '../components/CircuitEditSheet.jsx';

export function DayEditor({ state, setState, dayKey, navigate }) {
  const day = state.template.days[dayKey];
  const [actionsItemId, setActionsItemId] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [editingCircuitId, setEditingCircuitId] = useState(null);
  const [showAddPicker, setShowAddPicker] = useState(false);
  const [addSectionOpen, setAddSectionOpen] = useState(false);
  const [addChildToCircuitId, setAddChildToCircuitId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

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

  const onDragEnd = e => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = day.items.map(i => i.id);
    const oldIdx = ids.indexOf(active.id);
    const newIdx = ids.indexOf(over.id);
    if (oldIdx < 0 || newIdx < 0) return;
    setState(s => reorderItems(s, dayKey, arrayMove(ids, oldIdx, newIdx)));
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <button
          type="button"
          onClick={() => navigate('/planner')}
          className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ← Week
        </button>
        <h1 className="text-2xl font-semibold flex-1 text-center">{DAY_NAMES[dayKey]}</h1>
        <span className="w-12" />
      </div>

      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={day.rest}
            onChange={e => setState(s => setRestDay(s, dayKey, e.target.checked))}
            className="w-4 h-4"
          />
          Rest day
        </label>

        {!day.rest && (
          <label className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
            Focus
            <input
              type="text"
              value={day.focus ?? ''}
              onChange={e => setState(s => setFocus(s, dayKey, e.target.value))}
              placeholder="e.g. Upper Body Strength"
              className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-base"
            />
          </label>
        )}
      </div>

      {day.rest ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          Rest day — no exercises.
        </p>
      ) : (
        <>
          {day.items.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
              No exercises yet. Add one below.
            </p>
          )}
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={day.items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <ul className="space-y-2">
                {day.items.map(item => (
                  item.kind === 'circuit'
                    ? <CircuitRow
                        key={item.id}
                        item={item}
                        pool={state.pool}
                        onEditCircuit={() => setEditingCircuitId(item.id)}
                        onEditChild={id => setActionsItemId(id)}
                        onRemoveChild={id => {
                          if (confirm('Remove this exercise from the circuit?')) {
                            setState(s => removeItem(s, dayKey, id));
                          }
                        }}
                        onAddChild={() => setAddChildToCircuitId(item.id)}
                      />
                    : <SortableRow
                        key={item.id}
                        item={item}
                        pool={state.pool}
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
                ))}
              </ul>
            </SortableContext>
          </DndContext>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowAddPicker(true)}
              className="py-3 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
            >
              + Add exercise
            </button>
            <button
              type="button"
              onClick={() => setAddSectionOpen(true)}
              className="py-3 rounded-md border border-gray-300 dark:border-gray-600 font-medium"
            >
              + Add section
            </button>
            <button
              type="button"
              onClick={() => {
                setState(s => addCircuit(s, dayKey));
              }}
              className="col-span-2 py-3 rounded-md border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-medium"
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

function SortableRow({ item, pool, onEdit, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
        <DragHandle attributes={attributes} listeners={listeners} />
        <div className="flex-1 min-w-0">
          <RowSummary item={item} pool={pool} />
        </div>
        <EditButton onClick={onEdit} />
        <RemoveButton onClick={onRemove} />
      </div>
    </li>
  );
}

function CircuitRow({ item, pool, onEditCircuit, onEditChild, onRemoveChild, onAddChild }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li ref={setNodeRef} style={style}>
      <div className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 pl-4">
        <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg bg-emerald-500/70" aria-hidden="true" />

        <div className="flex items-center gap-2">
          <DragHandle attributes={attributes} listeners={listeners} />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-1">
              <LoopIcon />Circuit
            </p>
            <p className="font-medium text-sm truncate">{item.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item.rounds} rounds · {item.children.length} exercises
            </p>
          </div>
          <EditButton onClick={onEditCircuit} />
        </div>

        <ul className="mt-3 space-y-1 pl-7">
          {item.children.map(child => {
            const ex = pool[child.exerciseId];
            return (
              <li key={child.id} className="flex items-center gap-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ex?.name ?? child.exerciseId}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{child.durationSec}s</p>
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
              className="w-full text-left text-xs px-2 py-1.5 rounded-md border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              + Add exercise
            </button>
          </li>
        </ul>
      </div>
    </li>
  );
}

function DragHandle({ attributes, listeners }) {
  return (
    <button
      type="button"
      {...attributes}
      {...listeners}
      aria-label="Drag to reorder"
      className="p-1 rounded text-gray-400 cursor-grab active:cursor-grabbing touch-none"
    >
      <svg viewBox="0 0 16 16" className="w-5 h-5">
        <circle cx="6" cy="4" r="1.2" fill="currentColor"/>
        <circle cx="10" cy="4" r="1.2" fill="currentColor"/>
        <circle cx="6" cy="8" r="1.2" fill="currentColor"/>
        <circle cx="10" cy="8" r="1.2" fill="currentColor"/>
        <circle cx="6" cy="12" r="1.2" fill="currentColor"/>
        <circle cx="10" cy="12" r="1.2" fill="currentColor"/>
      </svg>
    </button>
  );
}

function EditButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Edit"
      className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
    >
      <svg viewBox="0 0 16 16" className="w-4 h-4"><path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M11 2l3 3-8 8H3v-3z"/></svg>
    </button>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Remove"
      className="p-2 rounded-md text-gray-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
    >
      <svg viewBox="0 0 16 16" className="w-4 h-4"><path fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M3 4h10M5 4V2.5h6V4M5 4l1 9.5h4L11 4"/></svg>
    </button>
  );
}

function LoopIcon() {
  return (
    <svg viewBox="0 0 16 16" className="w-3 h-3" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
        d="M3 8a5 5 0 0 1 9-3M13 8a5 5 0 0 1-9 3M11 4l1.5 1L13 3.5M5 12l-1.5-1L3 12.5"/>
    </svg>
  );
}

function RowSummary({ item, pool }) {
  if (item.kind === 'section') {
    return (
      <>
        <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">Section</p>
        <p className="font-medium text-sm truncate">{item.name || '(unnamed section)'}</p>
      </>
    );
  }
  const ex = pool[item.exerciseId];
  return (
    <>
      <p className="font-medium text-sm truncate">{ex?.name ?? item.exerciseId}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{itemSummary(item)}</p>
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
      <label className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
        Name
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          autoFocus
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-base"
        />
      </label>
      <label className="flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
        Description (optional)
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-base resize-none"
        />
      </label>
      <button type="submit" className="self-end px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium">
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
        className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-base"
      />
      <ul className="flex flex-col gap-1 max-h-80 overflow-y-auto">
        {filtered.map(p => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onPick(p.id)}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <p className="font-medium text-sm">{p.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {p.kind} · {p.equipment}
              </p>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-3 py-2 text-sm text-gray-500">No matches.</li>
        )}
      </ul>
    </div>
  );
}
