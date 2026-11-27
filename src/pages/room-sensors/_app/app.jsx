import { useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { perimeterPoint, snapToPerimeter } from './geometry.js';
import { sampleScene, seenByAny, score } from './scoring.js';
import { SENSOR_LIMITS, edit, parsePlan } from './plan.js';
import { bestPair, bestSingle } from './search.js';
import { WORLD, drawPlan } from './canvas.js';
import { GRID, rectBetween, snap } from './grid.js';

const PREFIX = 'room-sensors_';
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

const same = (a, b) => a.x === b.x && a.y === b.y;
const percent = (fraction) => (fraction === null ? '–' : `${Math.round(fraction * 100)}%`);

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

function Item({ name, onRemove, children }) {
  return (
    <li aria-label={name} className="flex flex-wrap items-center gap-x-4 gap-y-2 p-2">
      <span className="text-heading">{name}</span>
      {children}
      <button className="pixel-button ml-auto" onClick={onRemove}>Remove</button>
    </li>
  );
}

function Slider({ label, limits, value, onChange }) {
  return (
    <label className="flex flex-col gap-1 min-w-32 flex-1">
      <span className="label">{label}</span>
      <input type="range" className="pixel-range" {...limits} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

const metres = (m) => String(Number(m.toFixed(2)));

function SpecSliders({ spec, onChange }) {
  const set = (key) => (value) => onChange({ [key]: value });
  return (
    <>
      <Slider label={`Angle ${spec.fovDegrees}°`} limits={SENSOR_LIMITS.fovDegrees} value={spec.fovDegrees} onChange={set('fovDegrees')} />
      <Slider label={`Range ${metres(spec.range)} m`} limits={SENSOR_LIMITS.range} value={spec.range} onChange={set('range')} />
    </>
  );
}

function Placed({ plan, onEdit }) {
  const { furniture, door, seats, sensors } = plan;
  if (!door && !furniture.length && !seats.length && !sensors.length) return <p>Nothing placed yet.</p>;
  const remove = (kind, index) => () => onEdit({ type: 'remove', kind, index });

  return (
    <ul className="pixel-panel divide-y-2 divide-border">
      {door && (
        <Item name="Door" onRemove={remove('door')}>
          <button className="pixel-button" onClick={() => onEdit({ type: 'flip hinge' })}>Flip hinge</button>
          <span className="flex gap-2">
            {['in', 'out'].map((swing) => (
              <button key={swing} className="pixel-chip" aria-pressed={door.swing === swing} onClick={() => onEdit({ type: 'swing', swing })}>
                Swings {swing}
              </button>
            ))}
          </span>
        </Item>
      )}
      {furniture.map((f, index) => (
        <Item key={`furniture ${index}`} name={`Furniture ${index + 1}`} onRemove={remove('furniture', index)}>
          <span className="pixel-num">{metres(f.w)} × {metres(f.h)} m</span>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="pixel-check" checked={f.tall} onChange={(e) => onEdit({ type: 'tall', index, tall: e.target.checked })} />
            Tall, blocks sensors
          </label>
        </Item>
      ))}
      {seats.map((_, index) => (
        <Item key={`seat ${index}`} name={`Seat ${index + 1}`} onRemove={remove('seat', index)} />
      ))}
      {sensors.map((sensor, index) => (
        <Item key={`sensor ${index}`} name={`Sensor ${index + 1}`} onRemove={remove('sensor', index)}>
          <SpecSliders spec={sensor} onChange={(spec) => onEdit({ type: 'spec', index, spec })} />
        </Item>
      ))}
    </ul>
  );
}

/** The plan, loaded once from storage and stored again after each edit. */
function usePlan() {
  const [stored, store] = useLocalStorage('plan', null, { prefix: PREFIX });
  const [plan, onEdit] = useReducer(edit, stored, parsePlan);
  useEffect(() => store(plan), [plan, store]);
  return [plan, onEdit];
}

export function App() {
  const [plan, onEdit] = usePlan();
  const [tool, setTool] = useState('room');
  const { room, furniture, door, seats, sensors } = plan;

  const samples = useMemo(() => room && sampleScene({ room, furniture, door, seats }), [room, furniture, door, seats]);
  const view = useMemo(() => samples && { samples, flags: seenByAny(room, samples, sensors) }, [room, samples, sensors]);
  const result = view && score(view.samples, view.flags);

  useEffect(() => setTool(room ? 'furniture' : 'room'), [room]);

  const find = (search) => () => onEdit({ type: 'found', sensors: search({ room, furniture, door, seats }, plan.searchWith).sensors });

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
        <button className="pixel-button" data-variant="danger" onClick={() => onEdit({ type: 'clear' })}>Clear</button>
      </div>
      <p className="label">{TOOLS.find(({ id }) => id === tool).hint}</p>
      <Plan plan={plan} view={view} tool={tool} onEdit={onEdit} />

      <SectionLabel className="mt-6">Find sensors</SectionLabel>
      <p>Search the walls for where sensors with this viewing angle and range see the most, and replace the sensors placed with them.</p>
      <div role="group" aria-label="Search with" className="flex flex-wrap gap-x-4 gap-y-2">
        <SpecSliders spec={plan.searchWith} onChange={(spec) => onEdit({ type: 'search with', spec })} />
      </div>
      <div className="flex flex-wrap gap-2">
        <button className="pixel-button" data-variant="primary" disabled={!room} onClick={find(bestSingle)}>Find 1 sensor</button>
        <button className="pixel-button" data-variant="primary" disabled={!room} onClick={find(bestPair)}>Find 2 sensors</button>
      </div>

      <SectionLabel className="mt-6">Score</SectionLabel>
      {result ? <Score result={result} /> : <p>Close a room to score it.</p>}

      <SectionLabel className="mt-6">Placed</SectionLabel>
      <Placed plan={plan} onEdit={onEdit} />
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
