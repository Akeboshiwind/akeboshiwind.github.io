import { useEffect, useRef, useState } from 'react';
import { sampleSpan, readLine, lineRatio, dragCrop, dragMarker } from './analysis.js';

const MARKERS = [
  { id: 'control', label: 'Control', colour: 'text-link', start: 25 },
  { id: 'test', label: 'Test', colour: 'text-accent', start: 45 },
  { id: 'base', label: 'Base', colour: 'text-heading', start: 65 },
];

const startMarkers = () => Object.fromEntries(MARKERS.map((m) => [m.id, m.start]));

function drawPhoto(canvas, img, { rotation, zoom, crop }) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;
  const maxWidth = canvas.parentElement.parentElement.clientWidth;
  const scale = Math.min(1, maxWidth / img.width);
  canvas.width = img.width * scale;
  canvas.height = img.height * scale;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  const cropCentre = crop.left + (100 - crop.left - crop.right) / 2;
  ctx.translate(-((cropCentre / 100 - 0.5) * canvas.width) * (zoom - 1), 0);
  ctx.scale(zoom, zoom);
  ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
  ctx.restore();
}

function analyse(canvas, crop, markers) {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx || canvas.width === 0 || canvas.height === 0) return null;
  const span = sampleSpan(canvas.width, crop.left, crop.right);
  if (!span) return null;
  const read = (pct) => readLine(ctx, span, Math.round((pct / 100) * canvas.height), canvas.height);
  const colours = { control: read(markers.control), test: read(markers.test), base: read(markers.base) };
  return { colours, ...lineRatio(colours.control, colours.test, colours.base) };
}

const rgb = ({ r, g, b }) => `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
const Swatch = ({ colour }) => <span className="inline-block w-8 h-4 align-middle border-2 border-border" style={{ background: rgb(colour) }} />;

/** Reads one photo: the user lines up the markers and crop, and Save hands back the ratio. */
export function PhotoReader({ img, onSave, onCancel }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ left: 0, right: 0 });
  const [markers, setMarkers] = useState(startMarkers);
  const [drawn, setDrawn] = useState(0);
  const [reading, setReading] = useState(null);
  const cropRef = useRef(crop);
  cropRef.current = crop;

  // The zoom centres on the crop as it was when the photo was last drawn, so a crop drag doesn't move the photo under the handle.
  useEffect(() => {
    drawPhoto(canvasRef.current, img, { rotation, zoom, crop: cropRef.current });
    setDrawn((n) => n + 1);
  }, [img, rotation, zoom]);

  useEffect(() => {
    const next = analyse(canvasRef.current, crop, markers);
    if (next) setReading(next);
  }, [drawn, crop, markers]);

  const drag = (target) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const frame = frameRef.current;
    const move = (ev) => {
      const rect = frame.getBoundingClientRect();
      if (target === 'left' || target === 'right') {
        setCrop((c) => dragCrop(target, ((ev.clientX - rect.left) / rect.width) * 100, c));
      } else {
        setMarkers((m) => ({ ...m, [target]: dragMarker(((ev.clientY - rect.top) / rect.height) * 100) }));
      }
    };
    const end = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
  };

  const ratio = reading?.ratio ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <div ref={frameRef} className="relative touch-none select-none pixel-panel">
        <canvas ref={canvasRef} className="block w-full" aria-label="Test strip photo" role="img" />

        <div className="absolute inset-y-0 left-0 bg-bg/60 pointer-events-none" style={{ width: `${crop.left}%` }} />
        <div className="absolute inset-y-0 right-0 bg-bg/60 pointer-events-none" style={{ width: `${crop.right}%` }} />
        <div onPointerDown={drag('left')} aria-label="Left crop edge" className="absolute inset-y-0 w-3 bg-accent/70 hover:bg-accent cursor-ew-resize z-10" style={{ left: `${crop.left}%` }} />
        <div onPointerDown={drag('right')} aria-label="Right crop edge" className="absolute inset-y-0 w-3 bg-accent/70 hover:bg-accent cursor-ew-resize z-10" style={{ right: `${crop.right}%` }} />

        {MARKERS.map((m) => (
          <div
            key={m.id}
            onPointerDown={drag(m.id)}
            className={`absolute inset-x-0 h-4 -translate-y-1/2 flex items-center cursor-ns-resize z-20 ${m.colour}`}
            style={{ top: `${markers[m.id]}%` }}
          >
            <span className="flex-1 border-t-2 border-dashed border-current" />
            <span className="label px-1 bg-bg border-2 border-current">{m.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="rotation" className="label block mb-2">Rotate: {rotation}°</label>
          <input id="rotation" type="range" min="-180" max="180" step="1" value={rotation} onChange={(e) => setRotation(parseInt(e.target.value, 10))} className="pixel-range" />
        </div>
        <div>
          <label htmlFor="zoom" className="label block mb-2">Zoom: {zoom.toFixed(1)}x</label>
          <input id="zoom" type="range" min="1" max="4" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} className="pixel-range" />
        </div>
      </div>

      <p className="label opacity-70 leading-relaxed">
        Drag edges to crop. Drag markers to align:{' '}
        <span className="text-link">Control</span> → control line ·{' '}
        <span className="text-accent">Test</span> → test line ·{' '}
        <span className="text-heading">Base</span> → background
      </p>

      <section className="pixel-panel p-4 flex flex-col gap-3" aria-label="Reading">
        <div className="label text-center opacity-70">Test / Control Ratio</div>
        <div className="font-pixel text-[44px] leading-none text-heading text-center tabular-nums" data-testid="ratio">{ratio.toFixed(2)}</div>
        <div className="relative h-2 my-2 bg-border">
          <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${Math.min(ratio, 1) * 100}%` }} />
        </div>
        {reading && (
          <table className="pixel-table">
            <tbody>
              <tr>
                <th>Control line</th>
                <td className="text-right"><Swatch colour={reading.colours.control} /> <span className="pixel-num">intensity: {reading.controlIntensity.toFixed(1)}</span></td>
              </tr>
              <tr>
                <th>Test line</th>
                <td className="text-right"><Swatch colour={reading.colours.test} /> <span className="pixel-num">intensity: {reading.testIntensity.toFixed(1)}</span></td>
              </tr>
              <tr>
                <th>Base/background</th>
                <td className="text-right"><Swatch colour={reading.colours.base} /></td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="pixel-button flex-1 py-2">Cancel</button>
        <button type="button" onClick={() => onSave(ratio)} className="pixel-button flex-1 py-2" data-variant="primary">Save</button>
      </div>
    </div>
  );
}
