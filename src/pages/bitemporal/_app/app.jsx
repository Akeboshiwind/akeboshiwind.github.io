import './entry.css';
import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import * as ably from './ably.js';
import { config, renderCanvas, rgbToCss } from './canvas.js';
import {
  normalizeRoomCode,
  generateRoomCode,
  hitTest,
  pointHitTest,
  eventsInSelection,
  pointsInSelection,
  moveEvent,
  movePoint,
  resizeEvent,
  spanScale,
  scaleEvent,
  eventFromDrag,
  isDrag,
  toggleOpen,
  removeIndices,
  updateIndices,
  generateDml,
  isTextEntry,
} from './model.js';

const ABLY_API_KEY = 'Vr1zhQ.IsKO2g:nY_BkeBtmxQxs0W_MYZNkx-34cZBzzNLOrrAARrygfQ';
const GLOBAL_CHANNEL = 'global';
const STORAGE_KEY = 'bitemporal-visualizer';
const SAVED_STATES_KEY = 'bitemporal-saved-states';

const PRESET_COLORS = [
  [59, 130, 246],
  [34, 197, 94],
  [249, 115, 22],
  [168, 85, 247],
  [236, 72, 153],
];
const NEW_ITEM_COLOR = [100, 116, 139];

const DEFAULT_EVENTS = [
  { _valid_from: 0.1, _valid_to: 0.4, _system_from: 0.1, color: PRESET_COLORS[0] },
  { _valid_from: 0.2, _valid_to: 0.6, _system_from: 0.2, color: PRESET_COLORS[1] },
  { _valid_from: 0.3, _valid_to: 0.7, _system_from: 0.3, color: PRESET_COLORS[2] },
  { _valid_from: 0.1, _valid_to: 0.5, _system_from: 0.4, color: PRESET_COLORS[3] },
  { _valid_from: 0.5, _valid_to: 0.9, _system_from: 0.5, color: PRESET_COLORS[4] },
];

const roomChannel = (code) => `room:${code}`;

function readJson(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}

function createStore(initial) {
  let state = initial;
  const listeners = new Set();
  return {
    get: () => state,
    /** `remote` marks an update that arrived from the room, so it isn't broadcast back. */
    update(patch, { remote = false } = {}) {
      const prev = state;
      state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) };
      for (const listener of listeners) listener(state, prev, remote);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function initialState() {
  const stored = readJson(STORAGE_KEY) ?? {};
  return {
    events: stored.events ?? DEFAULT_EVENTS,
    points: stored.points ?? [],
    showGrid: stored['show-grid'] ?? false,
    snapToGrid: stored['snap-to-grid'] ?? false,
    showTicks: stored['show-ticks'] ?? false,
    showVtEqSt: stored['show-vt-eq-st'] ?? false,
    zoomRect: stored['zoom-rect'] ?? null,
    tool: 'select',
    autoSelect: true,
    roomCode: normalizeRoomCode(new URLSearchParams(location.search).get('room')) ?? generateRoomCode(),
    /** The room code being typed, or null when the field isn't being edited. */
    roomCodeInput: null,
    roomCount: 0,
    globalCount: 0,
    connectionStatus: 'initialized',
    savedStates: readJson(SAVED_STATES_KEY) ?? [],
    dmlStart: '2024-01-01',
    dmlEnd: '2025-01-01',
    shareCopied: false,
    /** `{x, y, events, points}`: screen position and the index sets it acts on, or null when closed. */
    contextMenu: null,
  };
}

const store = createStore(initialState());
const useAppState = () => useSyncExternalStore(store.subscribe, store.get);

const changed = (keys, a, b) => keys.some((k) => a[k] !== b[k]);

store.subscribe((s, prev) => {
  if (changed(['events', 'points', 'showGrid', 'snapToGrid', 'showTicks', 'showVtEqSt', 'zoomRect'], s, prev))
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        events: s.events,
        points: s.points,
        'show-grid': s.showGrid,
        'snap-to-grid': s.snapToGrid,
        'show-ticks': s.showTicks,
        'show-vt-eq-st': s.showVtEqSt,
        'zoom-rect': s.zoomRect,
      }),
    );
  if (s.savedStates !== prev.savedStates) localStorage.setItem(SAVED_STATES_KEY, JSON.stringify(s.savedStates));
});

store.subscribe((s, prev, remote) => {
  if (!remote && changed(['events', 'points', 'snapToGrid', 'showTicks', 'zoomRect'], s, prev)) broadcastState();
});

let canvasEl = null;

const IDLE = { mode: 'idle' };
/**
 * The pointer gesture in progress.
 * `offsets` maps each dragged index to the pointer's offset from the item's anchor:
 * an event's (valid-from, system-from) corner, or a point's centre.
 */
let drag = IDLE;

const NOTHING_SELECTED = { events: new Set(), points: new Set() };
let selection = NOTHING_SELECTED;

store.subscribe(repaint);

function drawSize() {
  return { w: canvasEl.width - 2 * config.padding, h: canvasEl.height - 2 * config.padding };
}

function toNormalized(e) {
  const rect = canvasEl.getBoundingClientRect();
  const { w, h } = drawSize();
  return {
    x: (e.clientX - rect.left - config.padding) / w,
    y: 1 - (e.clientY - rect.top - config.padding) / h,
  };
}

function hitAt({ x, y }) {
  const { events, points } = store.get();
  const { w, h } = drawSize();
  const point = pointHitTest(points, x, y, w, h);
  return point ? { point } : { event: hitTest(events, x, y, w) };
}

const boxOf = (a, b) => ({ x1: a.x, y1: a.y, x2: b.x, y2: b.y });

function repaint() {
  if (!canvasEl) return;
  const { clientWidth: width, clientHeight: height } = canvasEl.parentElement;
  if (width <= 0 || height <= 0) return;
  canvasEl.width = width;
  canvasEl.height = height;
  const s = store.get();
  renderCanvas(canvasEl, s.events, {
    showGrid: s.showGrid,
    showTicks: s.showTicks,
    showVtEqSt: s.showVtEqSt,
    selectionBox: drag.mode === 'select' || drag.mode === 'draw' ? { start: drag.start, end: drag.end } : null,
    zoomRect: s.zoomRect,
    zoomRectDraft: drag.mode === 'zoom-draw' ? boxOf(drag.start, drag.end) : null,
    selected: selection.events,
    points: s.points,
    selectedPoints: selection.points,
  });
}

const offsetsFor = (indices, offset) => new Map([...indices].map((i) => [i, offset(i)]));

function onMouseDown(e) {
  if (store.get().contextMenu) closeContextMenu();
  if (e.button !== 0) return;
  const p = toNormalized(e);
  const { events, points, tool, autoSelect } = store.get();

  if (tool === 'rectangle' || tool === 'zoom') {
    drag = { mode: tool === 'rectangle' ? 'draw' : 'zoom-draw', start: p, end: p };
    selection = NOTHING_SELECTED;
  } else if (tool === 'point') {
    store.update({ points: [...points, { x: p.x, y: p.y, color: NEW_ITEM_COLOR }], ...(autoSelect && { tool: 'select' }) });
  } else {
    const { point, event } = hitAt(p);
    if (point) {
      const pointOffset = (i) => ({ x: p.x - points[i].x, y: p.y - points[i].y });
      const group = selection.points.has(point.index) && selection.points.size > 1;
      if (!group) selection = { events: new Set(), points: new Set([point.index]) };
      drag = { mode: 'move-points', offsets: offsetsFor(selection.points, pointOffset) };
    } else if (event) {
      const { index, onHandle } = event;
      const group = selection.events.has(index) && selection.events.size > 1;
      if (onHandle && group) {
        const dragged = [...selection.events].map((i) => events[i]);
        const anchor = Math.min(...dragged.map((ev) => ev._valid_from));
        drag = {
          mode: 'resize-group',
          offsetX: events[index]._valid_to - p.x,
          anchor,
          span: Math.max(...dragged.map((ev) => ev._valid_to)) - anchor,
          originals: new Map([...selection.events].map((i) => [i, events[i]])),
        };
      } else if (onHandle) {
        drag = { mode: 'resize', index, offsetX: events[index]._valid_to - p.x };
      } else {
        const eventOffset = (i) => ({ x: p.x - events[i]._valid_from, y: events[i]._system_from - p.y });
        if (!group) selection = { events: new Set([index]), points: new Set() };
        drag = { mode: 'move-events', offsets: offsetsFor(selection.events, eventOffset) };
      }
    } else {
      drag = { mode: 'select', start: p, end: p };
      selection = NOTHING_SELECTED;
    }
  }
  repaint();
}

function cursorFor(tool, p) {
  if (tool === 'rectangle' || tool === 'point') return 'crosshair';
  if (tool === 'zoom') return 'zoom-in';
  if (drag.mode === 'select') return 'crosshair';
  if (drag.mode === 'resize' || drag.mode === 'resize-group') return 'ew-resize';
  if (drag.mode !== 'idle') return 'move';
  const { point, event } = hitAt(p);
  if (point) return 'move';
  if (event) return event.onHandle ? 'ew-resize' : 'move';
  return 'crosshair';
}

const updateAt = (items, offsets, f) => items.map((item, i) => (offsets.has(i) ? f(item, offsets.get(i)) : item));

function onMouseMove(e) {
  if (!canvasEl) return;
  const p = toNormalized(e);
  const s = store.get();
  canvasEl.style.cursor = cursorFor(s.tool, p);

  switch (drag.mode) {
    case 'draw':
    case 'zoom-draw':
      drag = { ...drag, end: p };
      repaint();
      break;
    case 'select':
      drag = { ...drag, end: p };
      selection = {
        events: eventsInSelection(s.events, drag.start, p),
        points: pointsInSelection(s.points, drag.start, p),
      };
      repaint();
      break;
    case 'move-points':
      store.update({
        points: updateAt(s.points, drag.offsets, (pt, o) => movePoint(pt, p.x - o.x, p.y - o.y, s.snapToGrid)),
      });
      break;
    case 'move-events':
      store.update({
        events: updateAt(s.events, drag.offsets, (ev, o) => moveEvent(ev, p.x - o.x, p.y + o.y, s.snapToGrid)),
      });
      break;
    case 'resize':
      store.update({
        events: updateIndices(s.events, new Set([drag.index]), (ev) => resizeEvent(ev, p.x + drag.offsetX, s.snapToGrid)),
      });
      break;
    case 'resize-group': {
      const scale = spanScale(p.x + drag.offsetX, drag.anchor, drag.span, s.snapToGrid);
      store.update({
        events: updateAt(s.events, drag.originals, (ev, original) => {
          const { _valid_from, _valid_to } = scaleEvent(original, drag.anchor, scale);
          return { ...ev, _valid_from, _valid_to };
        }),
      });
      break;
    }
  }
}

function onMouseUp() {
  const { mode, start, end } = drag;
  const autoSelect = store.get().autoSelect && { tool: 'select' };
  if (mode === 'draw' && isDrag(start, end))
    store.update((s) => ({ events: [...s.events, eventFromDrag(start, end, NEW_ITEM_COLOR)], ...autoSelect }));
  if (mode === 'zoom-draw') store.update({ zoomRect: isDrag(start, end) ? boxOf(start, end) : null, ...autoSelect });
  drag = IDLE;
  repaint();
}

function onContextMenu(e) {
  e.preventDefault();
  const { point, event } = hitAt(toNormalized(e));
  const at = { x: e.clientX, y: e.clientY };
  if (point) {
    const inSelection = selection.points.has(point.index);
    store.update({
      contextMenu: inSelection ? { ...at, ...selection } : { ...at, events: new Set(), points: new Set([point.index]) },
    });
  } else if (event) {
    const inSelection = selection.events.has(event.index);
    store.update({
      contextMenu: inSelection ? { ...at, ...selection } : { ...at, events: new Set([event.index]), points: new Set() },
    });
  }
}

function onKeyDown(e) {
  if (isTextEntry(e.target)) return;
  if ((e.key === 'Delete' || e.key === 'Backspace') && (selection.events.size || selection.points.size)) {
    e.preventDefault();
    deleteSelected(selection);
  }
}

function closeContextMenu() {
  store.update({ contextMenu: null });
}

/** Delete the events and points at the given indices; indices shift, so the selection is cleared. */
function deleteSelected({ events, points }) {
  selection = NOTHING_SELECTED;
  store.update((s) => ({ events: removeIndices(s.events, events), points: removeIndices(s.points, points) }));
}

function setColors({ events, points }, color) {
  store.update((s) => ({
    events: updateIndices(s.events, events, (ev) => ({ ...ev, color })),
    points: updateIndices(s.points, points, (pt) => ({ ...pt, color })),
    contextMenu: null,
  }));
}

function setOpen(indices, makeOpen) {
  store.update((s) => ({ events: updateIndices(s.events, indices, (ev) => toggleOpen(ev, makeOpen)) }));
}

const toggle = (key) => () => store.update((s) => ({ [key]: !s[key] }));

function hexToRgb(hex) {
  const h = hex.replace(/^#/, '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

function copyDml() {
  const { events, dmlStart, dmlEnd } = store.get();
  navigator.clipboard
    .writeText(generateDml(events, dmlStart, dmlEnd))
    .then(() => console.log('Copied DML to clipboard'))
    .catch((e) => console.error('Failed to copy DML:', e));
}

function captureThumbnail() {
  const thumb = document.createElement('canvas');
  thumb.width = 120;
  thumb.height = 80;
  thumb.getContext('2d').drawImage(canvasEl, 0, 0, thumb.width, thumb.height);
  return thumb.toDataURL('image/png');
}

function saveCurrentState() {
  if (!canvasEl) return;
  const { events, points } = store.get();
  const saved = {
    id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    events,
    points,
    thumbnail: captureThumbnail(),
    timestamp: Date.now(),
  };
  store.update((s) => ({ savedStates: [...s.savedStates, saved] }));
}

function loadSavedState({ events, points }) {
  selection = NOTHING_SELECTED;
  store.update({ events, points });
}

function deleteSavedState(id) {
  store.update((s) => ({ savedStates: s.savedStates.filter((saved) => saved.id !== id) }));
}

function syncRoomCodeToUrl(code) {
  const url = new URL(location.href);
  url.searchParams.set('room', code);
  history.replaceState(null, '', url.toString());
}

function shareRoomUrl() {
  const url = new URL(location.href);
  url.searchParams.set('room', store.get().roomCode);
  navigator.clipboard
    .writeText(url.toString())
    .then(() => {
      store.update({ shareCopied: true });
      setTimeout(() => store.update({ shareCopied: false }), 1500);
    })
    .catch((e) => console.error('Failed to copy:', e));
}

function broadcastState() {
  const { roomCode, events, points, snapToGrid, showTicks, zoomRect } = store.get();
  ably.publish(roomChannel(roomCode), 'state-sync', {
    events,
    points,
    snapToGrid,
    showTicks,
    zoomRect,
    from: ably.clientId,
  });
}

function handleRoomMessage({ name, data }) {
  if (data.from === ably.clientId) return;
  if (name === 'state-request') broadcastState();
  if (name === 'state-sync')
    store.update(
      {
        events: data.events ?? [],
        ...(data.points && { points: data.points }),
        ...(data.snapToGrid != null && { snapToGrid: data.snapToGrid }),
        ...(data.showTicks != null && { showTicks: data.showTicks }),
        zoomRect: data.zoomRect ?? null,
      },
      { remote: true },
    );
}

function updateRoomCount() {
  ably.presenceCount(roomChannel(store.get().roomCode), (roomCount) => store.update({ roomCount }));
}

function enterRoom(code) {
  store.update({ roomCode: code, roomCount: 0 });
  syncRoomCodeToUrl(code);
  ably.enterPresence(roomChannel(code));
  ably.onPresenceChange(roomChannel(code), updateRoomCount);
  ably.subscribe(roomChannel(code), handleRoomMessage);
  setTimeout(() => ably.publish(roomChannel(code), 'state-request', { from: ably.clientId }), 500);
}

function commitRoomCodeEdit() {
  const { roomCodeInput, roomCode } = store.get();
  const code = normalizeRoomCode(roomCodeInput);
  if (code && code !== roomCode) {
    ably.leavePresence(roomChannel(roomCode));
    enterRoom(code);
  }
  store.update({ roomCodeInput: null });
}

const button = 'label px-2 py-1 border-2 border-border text-text hover:border-accent hover:text-accent cursor-pointer';
const primaryButton =
  'label px-2 py-1 border-2 border-accent bg-accent text-bg hover:bg-transparent hover:text-accent cursor-pointer';
const dateInput =
  'flex-1 px-2 py-1 font-pixel text-pixel bg-bg border-2 border-border text-heading focus:border-accent focus:outline-none';

// Paths from pixelarticons (https://pixelarticons.com/), drawn on a 24-unit grid.
const ICONS = {
  cursor: 'M6 4h2v16H6zm2 0h2v2H8zm2 2h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2zm2 2h2v2h-2zm-8 6h2v2H8zm2-2h2v2h-2zm2-2h6v2h-6z',
  square: 'M2 4h2v16H2zm2 16h16v2H4zM20 4h2v16h-2zM4 2h16v2H4z',
  circle: 'M6 2h12v2H6zm0 18h12v2H6zM2 6h2v12H2zm18 0h2v12h-2zm-2-2h2v2h-2zm0 14h2v2h-2zM4 4h2v2H4zm0 14h2v2H4z',
  search:
    'M22 22h-2v-2h2v2Zm-2-2h-2v-2h2v2Zm-6-2H6v-2h8v2Zm4 0h-2v-2h2v2ZM6 16H4v-2h2v2Zm10 0h-2v-2h2v2ZM4 14H2V6h2v8Zm14 0h-2V6h2v8ZM6 6H4V4h2v2Zm10 0h-2V4h2v2Zm-2-2H6V2h8v2Z',
  reload:
    'M16 4h2v6h-2zm-2-2h2v2h-2zm0 2h2v8h-2zM4 8H2v5h2zM4 6h16v2H4zm4 14H6v-6h2zm2 2H8v-2h2zm0-2H8v-8h2zm10-4h2v-5h-2zM20 18H4v-2h16z',
  close:
    'M7 19H5V17H7V19ZM19 19H17V17H19V19ZM9 15V17H7V15H9ZM17 17H15V15H17V17ZM11 15H9V13H11V15ZM15 15H13V13H15V15ZM13 13H11V11H13V13ZM11 11H9V9H11V11ZM15 11H13V9H15V11ZM9 9H7V7H9V9ZM17 9H15V7H17V9ZM7 7H5V5H7V7ZM19 7H17V5H19V7Z',
};

const Icon = ({ name, size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d={ICONS[name]} />
  </svg>
);

const CONNECTION_LABELS = {
  initialized: 'Connecting...',
  connecting: 'Connecting...',
  disconnected: 'Disconnected',
  suspended: 'Connection suspended',
  failed: 'Connection failed',
  closing: 'Closing...',
  closed: 'Closed',
};

function ConnectionPill({ status }) {
  if (status === 'connected') return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-heading text-bg label animate-pulse z-10">
      {CONNECTION_LABELS[status] ?? `Status: ${status}`}
    </div>
  );
}

const PresenceIndicator = ({ roomCount, globalCount }) => (
  <div className="fixed bottom-4 right-4 px-3 py-2 bg-bg border-2 border-border label text-text z-10">
    <span className="inline-flex items-center gap-2">
      <span className="w-2 h-2 bg-accent" />
      {`${roomCount}/${globalCount} online`}
    </span>
  </div>
);

/** A colour picker that reports only the committed colour, not every value dragged through on the way. */
function ColorInput({ onPick }) {
  const ref = useRef(null);
  useEffect(() => {
    const input = ref.current;
    const onChange = () => onPick(hexToRgb(input.value));
    input.addEventListener('change', onChange);
    return () => input.removeEventListener('change', onChange);
  }, [onPick]);
  return <input ref={ref} type="color" className="w-6 h-6 cursor-pointer border-0 p-0" />;
}

function ContextMenu({ menu, events }) {
  if (!menu) return null;
  const allOpen = menu.events.size > 0 && [...menu.events].every((i) => events[i]?._valid_to == null);
  return (
    <div className="fixed bg-bg border-2 border-heading p-2 z-50" style={{ left: `${menu.x}px`, top: `${menu.y}px` }}>
      <div className="flex gap-1 items-center">
        {PRESET_COLORS.map((color) => (
          <button
            key={rgbToCss(color)}
            className="w-6 h-6 border-2 border-transparent hover:border-heading cursor-pointer"
            style={{ backgroundColor: rgbToCss(color) }}
            onClick={() => setColors(menu, color)}
          />
        ))}
        <ColorInput onPick={(color) => setColors(menu, color)} />
      </div>
      {menu.events.size > 0 && (
        <div>
          <div className="pixel-line h-0.5 my-2" />
          <label className="flex items-center gap-2 label text-text cursor-pointer select-none px-1">
            <input
              type="checkbox"
              checked={allOpen}
              onChange={() => setOpen(menu.events, !allOpen)}
              className="pixel-check"
            />
            Open
          </label>
        </div>
      )}
      <div className="pixel-line h-0.5 my-2" />
      <button
        className="w-full text-left label text-red-600 hover:bg-red-600 hover:text-bg px-1 py-1 cursor-pointer"
        onClick={() => {
          deleteSelected(menu);
          closeContextMenu();
        }}
      >
        Delete
      </button>
    </div>
  );
}

const TOOLS = [
  ['select', 'Select', 'cursor'],
  ['rectangle', 'Rectangle', 'square'],
  ['point', 'Point', 'circle'],
  ['zoom', 'Zoom overlay (shared)', 'search'],
];

const Toolbar = ({ current }) => (
  <div className="absolute top-2 left-2 bg-bg border-2 border-border p-1 flex flex-col gap-1 z-10">
    {TOOLS.map(([tool, title, icon]) => (
      <button
        key={tool}
        className={`w-8 h-8 flex items-center justify-center cursor-pointer ${
          current === tool ? 'bg-accent text-bg' : 'text-text hover:text-accent'
        }`}
        title={title}
        onClick={() => store.update({ tool })}
      >
        <Icon name={icon} size={24} />
      </button>
    ))}
  </div>
);

const Option = ({ checked, onChange, synced, children }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="pixel-check" />
    <span>{children}</span>
    {synced && (
      <span className="opacity-60" title="Synced to room">
        <Icon name="reload" size={12} />
      </span>
    )}
  </label>
);

const SectionLabel = ({ children, action }) => (
  <h2 className="label flex items-center gap-3 text-heading mt-6 mb-2">
    <span className="shrink-0">{children}</span>
    <span data-dither="fade-x" className="flex-1 h-[6px]" aria-hidden="true" />
    {action}
  </h2>
);

const SavedStateCard = ({ saved }) => (
  <div className="relative group cursor-pointer" onClick={() => loadSavedState(saved)}>
    <img src={saved.thumbnail} className="w-full border-2 border-border hover:border-accent" />
    <button
      className="absolute -top-2 -right-2 w-5 h-5 bg-heading text-bg hover:bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        deleteSavedState(saved.id);
      }}
    >
      <Icon name="close" size={12} />
    </button>
  </div>
);

function RoomCodeInput({ roomCode, roomCodeInput }) {
  return (
    <input
      type="text"
      className="font-pixel text-pixel-lg tracking-wider bg-transparent text-heading w-28 px-1 -mx-1 py-0 border-2 border-transparent hover:border-border focus:border-accent focus:outline-none cursor-text"
      title="Click to change room"
      maxLength={6}
      spellCheck={false}
      autoComplete="off"
      value={roomCodeInput ?? roomCode}
      onFocus={(e) => {
        store.update({ roomCodeInput: roomCode });
        e.target.select();
      }}
      onChange={(e) => store.update({ roomCodeInput: e.target.value.slice(0, 6).toUpperCase() })}
      onBlur={commitRoomCodeEdit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.target.blur();
        if (e.key === 'Escape') {
          store.update({ roomCodeInput: null });
          e.target.blur();
        }
      }}
    />
  );
}

function SidePanel({ s }) {
  return (
    <div className="w-72 shrink-0 bg-code-bg text-text border-2 border-border p-4 flex flex-col min-h-0 overflow-y-auto font-pixel text-pixel-md">
      <h1 className="page-title mb-4">Bitemporal Visualizer</h1>
      <div className="p-3 border-2 border-border">
        <div className="label opacity-70 mb-1">Room</div>
        <div className="flex items-center gap-2">
          <RoomCodeInput roomCode={s.roomCode} roomCodeInput={s.roomCodeInput} />
          <button
            className={`${s.shareCopied ? primaryButton : button} w-20 text-center`}
            title="Copy shareable link to this room"
            onClick={shareRoomUrl}
          >
            {s.shareCopied ? 'Copied!' : 'Share'}
          </button>
        </div>
      </div>

      <SectionLabel>View</SectionLabel>
      <div className="flex flex-col gap-2">
        <Option checked={s.showGrid} onChange={toggle('showGrid')}>Grid</Option>
        <Option checked={s.autoSelect} onChange={toggle('autoSelect')}>Auto-select after draw</Option>
        <Option checked={s.showVtEqSt} onChange={toggle('showVtEqSt')}>vt = st</Option>
      </div>

      <SectionLabel>Room Settings</SectionLabel>
      <div className="flex flex-col gap-2">
        <Option checked={s.snapToGrid} onChange={toggle('snapToGrid')} synced>Snap to grid</Option>
        <Option checked={s.showTicks} onChange={toggle('showTicks')} synced>Axis ticks</Option>
      </div>

      <SectionLabel>DML Export</SectionLabel>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <label className="label w-12">Start</label>
          <input
            type="date"
            value={s.dmlStart}
            onChange={(e) => store.update({ dmlStart: e.target.value })}
            className={dateInput}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="label w-12">End</label>
          <input
            type="date"
            value={s.dmlEnd}
            onChange={(e) => store.update({ dmlEnd: e.target.value })}
            className={dateInput}
          />
        </div>
        <button className={`${primaryButton} w-full mt-1`} onClick={copyDml}>
          Copy DML
        </button>
      </div>

      <SectionLabel
        action={
          <button className={primaryButton} onClick={saveCurrentState}>
            Save
          </button>
        }
      >
        Saved States
      </SectionLabel>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto pt-2 pr-2">
          {s.savedStates.length ? (
            <div className="grid grid-cols-2 gap-2">
              {s.savedStates.map((saved) => (
                <SavedStateCard key={saved.id} saved={saved} />
              ))}
            </div>
          ) : (
            <div className="label opacity-50 text-center py-4">No saved states yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

function MainCanvas({ tool }) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    canvasEl = canvas;
    window.addEventListener('resize', repaint);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('keydown', onKeyDown);
    repaint();
    return () => {
      window.removeEventListener('resize', repaint);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('keydown', onKeyDown);
      canvasEl = null;
    };
  }, []);
  return (
    <div className="flex-1 min-w-0">
      <div className="relative w-full h-full overflow-hidden">
        <div className="absolute inset-0 left-5">
          <canvas ref={ref} className="w-full h-full [image-rendering:pixelated]" />
        </div>
        <Toolbar current={tool} />
      </div>
    </div>
  );
}

function App() {
  const s = useAppState();
  return (
    <div className="flex-1 flex gap-4 min-h-0">
      <SidePanel s={s} />
      <MainCanvas tool={s.tool} />
      <PresenceIndicator roomCount={s.roomCount} globalCount={s.globalCount} />
      <ConnectionPill status={s.connectionStatus} />
      <ContextMenu menu={s.contextMenu} events={s.events} />
    </div>
  );
}

createRoot(document.getElementById('app')).render(<App />);
// The canvas reads its colours from the theme's CSS variables, which ThemeInit sets as attributes on <html>.
new MutationObserver(repaint).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme', 'style'],
});
document.fonts.load(config.font).then(repaint);
ably.init(ABLY_API_KEY, (connectionStatus) => store.update({ connectionStatus }));
ably.enterPresence(GLOBAL_CHANNEL);
ably.onPresenceChange(GLOBAL_CHANNEL, () =>
  ably.presenceCount(GLOBAL_CHANNEL, (globalCount) => store.update({ globalCount })),
);
enterRoom(store.get().roomCode);
