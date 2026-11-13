import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DraggableRenderer, translate } from 'dragology';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { insertAt, insertions, reorders } from './list.js';
import { useDrag } from './useDrag.js';
import { DebugTrace } from './debug.js';

const PREFIX = 'dragology-todo_';
const ROW = 44;
const PLUS = 56;
const BOX = 16;
const TEXT_X = 40;

const SEED = [
  'Drag a to-do to move it', 'Drag the + into the list to add one there', 'Tap + to add one at the end',
  'Drag near the top or bottom to scroll', 'On a phone, hold a to-do to lift it', 'Scroll with a second finger while dragging',
  'Buy milk', 'Call the bank', 'Book a haircut', 'Water the plants', 'Return library books', 'Renew passport',
  'Fix the bike light', 'Plan the weekend', 'Send birthday card', 'Back up photos', 'Clean the oven', 'Reply to Sam',
].map((title, i) => ({ id: `seed-${i}`, title, done: false }));

// Not crypto.randomUUID: it exists only in secure contexts, so not on a phone over http://<lan-ip>.
const newId = () => Array.from(crypto.getRandomValues(new Uint8Array(16)), b => b.toString(16).padStart(2, '0')).join('');
const newItem = () => ({ id: newId(), title: '', done: false });
const rowId = item => `row-${item.id}`;

function Title({ item, editing, onEdit, onSave }) {
  const [draft, setDraft] = useState(item.title);
  if (editing) {
    const save = () => onSave(draft.trim());
    return (
      <div className="h-full flex items-center pr-1">
        <input
          autoFocus aria-label="To-do" className="pixel-field w-full" placeholder="New to-do"
          value={draft} onChange={e => setDraft(e.target.value)} onBlur={save}
          onPointerDown={e => e.stopPropagation()}
          onKeyDown={e => {
            if (e.key === 'Enter') save();
            if (e.key === 'Escape') onSave(item.title);
          }}
        />
      </div>
    );
  }
  return (
    <button
      type="button" onClick={onEdit}
      className={`h-full w-full text-left truncate ${item.done ? 'line-through opacity-50' : 'text-heading'}`}
    >
      {item.title}
    </button>
  );
}

// A component, so Dragology leaves its props alone: it would try to blend `aria-checked` between states.
function Check({ item, onToggle }) {
  return (
    <g
      transform={translate(12, (ROW - BOX) / 2)} className="cursor-pointer"
      role="checkbox" aria-checked={item.done} aria-label={item.title} tabIndex={0}
      onClick={onToggle}
      onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(); } }}
    >
      <rect x={1} y={1} width={BOX - 2} height={BOX - 2} strokeWidth={2} className={item.done ? 'fill-accent stroke-accent' : 'fill-bg stroke-text'} />
      {item.done && <path d="M4 8 L7 11 L12 5" fill="none" strokeWidth={2} className="stroke-bg" />}
    </g>
  );
}

/** Keeps the + at the bottom right of the window, or just under a short list. */
function usePlusY(svgRef, listHeight) {
  const [view, setView] = useState({ top: 0, height: 800 });
  useEffect(() => {
    let frame;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = svgRef.current?.getBoundingClientRect().top ?? 0;
        setView({ top, height: window.innerHeight });
      });
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, []);
  return Math.max(0, Math.min(listHeight + 16, view.height - view.top - PLUS - 24));
}

function useWidth(ref) {
  const [width, setWidth] = useState(640);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth || 640));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return width;
}

export function App() {
  const [items, setItems] = useLocalStorage('items', SEED, { prefix: PREFIX });
  const [editing, setEditing] = useState(null);
  const created = useRef(null);
  const boxRef = useRef(null);
  const width = useWidth(boxRef);
  const plusY = usePlusY(boxRef, items.length * ROW);
  const { bind, onDragStatus } = useDrag();

  const addAtEnd = () => {
    const item = newItem();
    setItems(insertAt(items, items.length, item));
    setEditing(item.id);
  };
  const save = id => title => {
    setItems(title ? items.map(i => (i.id === id ? { ...i, title } : i)) : items.filter(i => i.id !== id));
    setEditing(null);
  };
  const toggle = id => setItems(items.map(i => (i.id === id ? { ...i, done: !i.done } : i)));

  const draggable = ({ state, d, draggedId }) => (
    <g>
      {state.items.map((item, i) => (
        <g
          id={rowId(item)} transform={translate(0, i * ROW)}
          dragologyZIndex={draggedId === rowId(item) ? '/2' : false}
          dragologyOnDrag={editing === item.id ? undefined : () => d.closest(reorders(state.items, item.id)).withFloating()}
        >
          <rect width={width} height={ROW} className="fill-bg stroke-border" strokeWidth={draggedId === rowId(item) ? 2 : 0} />
          <line x1={0} y1={ROW - 1} x2={width} y2={ROW - 1} className="stroke-border" strokeWidth={2} strokeDasharray="2 2" strokeOpacity={draggedId === rowId(item) ? 0 : 1} />
          <Check item={item} onToggle={() => toggle(item.id)} />
          <foreignObject transform={translate(TEXT_X, 0)} width={width - TEXT_X} height={ROW}>
            <Title
              item={item} editing={editing === item.id}
              onEdit={() => setEditing(item.id)} onSave={save(item.id)}
            />
          </foreignObject>
        </g>
      ))}
      <g
        id="plus" data-lift-now transform={translate(width - PLUS, plusY)} dragologyZIndex={1}
        role="button" aria-label="New to-do" tabIndex={0} className="outline-none"
        onClick={addAtEnd}
        onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); addAtEnd(); } }}
        dragologyOnDrag={() => {
          const item = newItem();
          created.current = item.id;
          const all = insertions(state.items, item);
          return d.switchToStateAndFollow(all[all.length - 1], rowId(item), d.closest(all).withFloating());
        }}
      >
        <rect width={PLUS} height={PLUS} className="fill-accent" />
        <path d={`M${PLUS / 2} 18 V${PLUS - 18} M18 ${PLUS / 2} H${PLUS - 18}`} strokeWidth={4} className="stroke-bg" />
      </g>
    </g>
  );

  return (
    <main className="flex flex-col gap-2">
      <DebugTrace />
      <h1 className="page-title">Dragology Todo</h1>
      <p>
        A demo of <a href="https://declarative-dragging.github.io/" target="_blank" rel="noopener noreferrer" className="text-link underline">Dragology</a>,
        a library for declarative dragging. Each to-do declares the lists it could be dropped into, and the + declares
        a new to-do it could drop anywhere; Dragology works out the drag between them.
      </p>
      <p className="label opacity-60">Drag a to-do to move it. Drag + to where a new one goes, or tap it to add one at the end.</p>
      <div
        ref={boxRef} {...bind}
        className="[&_svg]:[touch-action:pan-y]! [-webkit-touch-callout:none] select-none pb-6"
      >
        <DraggableRenderer
          draggable={draggable}
          state={{ items }}
          width={width}
          height={items.length * ROW + 16 + PLUS + 8}
          onDragStatus={onDragStatus}
          onDropState={next => {
            setItems(next.items);
            if (next.items.some(i => i.id === created.current)) setEditing(created.current);
            created.current = null;
          }}
        />
      </div>
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
