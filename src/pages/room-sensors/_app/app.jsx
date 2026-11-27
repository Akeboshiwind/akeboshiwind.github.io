import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { perimeterPoint, snapToPerimeter } from './geometry.js';
import { sampleScene, seenByAny, score } from './scoring.js';
import { EMPTY, edit } from './plan.js';
import { WORLD, drawPlan } from './canvas.js';

const GRID = 0.25;
// How far the pointer moves, in metres, before a drag aims rather than a click placing.
const AIM_FROM = 0.15;
const UP = -Math.PI / 2;

const TOOLS = [
  { id: 'room', label: 'Room', hint: 'Click each corner, then click the first again or Close room.' },
  { id: 'furniture', label: 'Furniture', hint: 'Drag out a piece of furniture.' },
  { id: 'door', label: 'Door', hint: 'Click a wall at least 90 cm long.' },
  { id: 'seat', label: 'Seat', hint: 'Click inside the room, and drag the way the person faces.' },
  { id: 'sensor', label: 'Sensor', hint: 'Click a wall, and drag the way the sensor faces.' },
];

const PARTS = [
  ['room', 'Room'],
  ['people', 'People'],
  ['front', 'People from the front'],
  ['door', 'By the door, open'],
  ['outside', 'Outside the door, lower is better'],
];

const snap = (p) => ({ x: Math.round(p.x / GRID) * GRID, y: Math.round(p.y / GRID) * GRID });
const same = (a, b) => a.x === b.x && a.y === b.y;
const percent = (fraction) => (fraction === null ? '–' : `${Math.round(fraction * 100)}%`);

const rectBetween = (a, b) => ({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(a.x - b.x), h: Math.abs(a.y - b.y) });

const aimed = (gesture, p) =>
  Math.hypot(p.x - gesture.at.x, p.y - gesture.at.y) < AIM_FROM ? gesture : { ...gesture, facing: Math.atan2(p.y - gesture.at.y, p.x - gesture.at.x) };

function press(tool, plan, p) {
  switch (tool) {
    case 'room': {
      const corner = snap(p);
      return plan.draft.length >= 3 && same(corner, plan.draft[0]) ? { edit: { type: 'close' } } : { edit: { type: 'corner', point: corner } };
    }
    case 'door':
      return { edit: { type: 'door', at: p } };
    case 'furniture':
      return { gesture: { tool, from: snap(p), rect: rectBetween(snap(p), snap(p)) } };
    case 'seat':
      return { gesture: { tool, at: snap(p), facing: UP } };
    case 'sensor': {
      const placement = snapToPerimeter(plan.room, p);
      const { point, normal } = perimeterPoint(plan.room, placement);
      return { gesture: { tool, placement, at: point, facing: Math.atan2(normal.y, normal.x) } };
    }
  }
}

const drag = (gesture, p) => (gesture.tool === 'furniture' ? { ...gesture, rect: rectBetween(gesture.from, snap(p)) } : aimed(gesture, p));

function release(gesture) {
  switch (gesture.tool) {
    case 'furniture':
      return gesture.rect.w >= GRID && gesture.rect.h >= GRID ? { type: 'furniture', rect: gesture.rect } : null;
    case 'seat':
      return { type: 'seat', seat: { ...gesture.at, facing: gesture.facing } };
    case 'sensor':
      return { type: 'sensor', sensor: { ...gesture.placement, facing: gesture.facing } };
  }
}

/** A count that ticks whenever the page's theme or accent changes, as the canvas takes its colours from them. */
function useThemeVersion() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
    return () => observer.disconnect();
  }, []);
  return version;
}

function useWidth(ref) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver(() => setWidth(ref.current.clientWidth));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return width;
}

function Plan({ plan, view, tool, onEdit }) {
  const canvas = useRef(null);
  const width = useWidth(canvas);
  const theme = useThemeVersion();
  const [gesture, setGesture] = useState(null);

  useEffect(() => {
    const el = canvas.current;
    el.width = width;
    el.height = Math.round((width * WORLD.height) / WORLD.width);
    drawPlan(el, { plan, view, gesture });
  }, [plan, view, gesture, width, theme]);

  const toWorld = (e) => {
    const r = canvas.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * WORLD.width, y: ((e.clientY - r.top) / r.height) * WORLD.height };
  };

  const onPointerDown = (e) => {
    const started = press(tool, plan, toWorld(e));
    if (started.edit) onEdit(started.edit);
    if (started.gesture) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setGesture(started.gesture);
    }
  };
  const onPointerMove = (e) => gesture && setGesture(drag(gesture, toWorld(e)));
  const onPointerUp = () => {
    if (!gesture) return;
    const made = release(gesture);
    if (made) onEdit(made);
    setGesture(null);
  };

  return (
    <canvas
      ref={canvas}
      aria-label="Room plan"
      className="w-full pixel-panel touch-none select-none [image-rendering:pixelated]"
      style={{ aspectRatio: `${WORLD.width} / ${WORLD.height}` }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setGesture(null)}
    />
  );
}

function Score({ result }) {
  return (
    <>
      <p className="font-pixel text-pixel-lg text-heading">{percent(result.total)}</p>
      <table className="pixel-table">
        <thead>
          <tr><th>Seen</th><th className="text-right">Share</th></tr>
        </thead>
        <tbody>
          {PARTS.map(([part, label]) => (
            <tr key={part}><td>{label}</td><td className="text-right pixel-num">{percent(result.parts[part])}</td></tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export function App() {
  const [plan, onEdit] = useReducer(edit, EMPTY);
  const [tool, setTool] = useState('room');
  const { room, furniture, door, seats, sensors } = plan;

  const samples = useMemo(() => room && sampleScene({ room, furniture, door, seats }), [room, furniture, door, seats]);
  const view = useMemo(() => samples && { samples, flags: seenByAny(room, samples, sensors) }, [room, samples, sensors]);
  const result = view && score(view.samples, view.flags);

  const clear = () => {
    onEdit({ type: 'clear' });
    setTool('room');
  };

  return (
    <main className="flex flex-col gap-2">
      <h1 className="page-title">Room Sensors</h1>
      <p className="page-sub">Draw a room and what's in it, place presence sensors on its walls, and see how much they see.</p>

      <div className="flex flex-wrap gap-2">
        {TOOLS.map(({ id, label }) => (
          <button key={id} className="pixel-chip" aria-pressed={tool === id} disabled={id !== 'room' && !room} onClick={() => setTool(id)}>
            {label}
          </button>
        ))}
        {tool === 'room' && plan.draft.length >= 3 && <button className="pixel-button" onClick={() => onEdit({ type: 'close' })}>Close room</button>}
        <button className="pixel-button" data-variant="danger" onClick={clear}>Clear</button>
      </div>
      <p className="label">{TOOLS.find(({ id }) => id === tool).hint}</p>
      <Plan plan={plan} view={view} tool={tool} onEdit={onEdit} />

      <SectionLabel className="mt-6">Score</SectionLabel>
      {result ? <Score result={result} /> : <p>Close a room to score it.</p>}
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
