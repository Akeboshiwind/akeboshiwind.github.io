import { useEffect, useRef } from 'react';
import { GRAPH_DAYS, GRAPH_PADDING, graphWindow, inWindow, yMax, plotArea, xOf, yOf, hitTest } from './graph.js';

const FONT = "11px 'Departure Mono', ui-monospace, monospace";

function themeColours() {
  const style = getComputedStyle(document.documentElement);
  const cssVar = (name) => style.getPropertyValue(name).trim();
  return { bg: cssVar('--bg'), text: cssVar('--text'), border: cssVar('--border'), accent: cssVar('--accent') };
}

function draw(canvas, entries, win) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const pad = GRAPH_PADDING;
  const area = plotArea(w, h);
  const colours = themeColours();

  ctx.fillStyle = colours.bg;
  ctx.fillRect(0, 0, w, h);

  const shown = entries.filter((e) => inWindow(e, win));
  const top = yMax(shown);

  ctx.font = FONT;
  ctx.lineWidth = 1;
  ctx.strokeStyle = colours.border;
  ctx.fillStyle = colours.text;
  ctx.textAlign = 'center';
  for (let i = 0; i < GRAPH_DAYS; i++) {
    const x = Math.round(pad.left + (i / (GRAPH_DAYS - 1)) * area.w) + 0.5;
    const d = new Date(win.start);
    d.setDate(d.getDate() + i);
    ctx.beginPath();
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, pad.top + area.h);
    ctx.stroke();
    // Every day's number overlaps its neighbours' on a phone.
    if (area.w / GRAPH_DAYS >= 18 || i % 2 === 0) ctx.fillText(d.getDate(), x, h - 8);
  }

  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const y = Math.round(pad.top + area.h - (i / 4) * area.h) + 0.5;
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(w - pad.right, y);
    ctx.stroke();
    ctx.fillText((i * top / 4).toFixed(2), pad.left - 5, y + 4);
  }

  if (shown.length === 0) {
    ctx.textAlign = 'center';
    ctx.fillText('No tests in this period', w / 2, h / 2);
    return;
  }

  const points = shown
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    .map((e) => [xOf(e.timestamp, win, area), yOf(e.score, top, area)]);

  ctx.strokeStyle = colours.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
  ctx.stroke();

  for (const [x, y] of points) {
    ctx.fillStyle = colours.accent;
    ctx.fillRect(Math.round(x) - 5, Math.round(y) - 5, 10, 10);
    ctx.fillStyle = colours.bg;
    ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, 4, 4);
  }
}

/** The 30-day score chart; clicking a point calls `onPick` with its index in `entries`. */
export function Graph({ entries, offset, onPick }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const repaint = () => draw(canvas, entries, graphWindow(new Date(), offset));
    repaint();
    window.addEventListener('resize', repaint);
    const themes = new MutationObserver(repaint);
    themes.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'style'] });
    return () => {
      window.removeEventListener('resize', repaint);
      themes.disconnect();
    };
  }, [entries, offset]);

  const pick = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const index = hitTest(entries, graphWindow(new Date(), offset), rect.width, rect.height, e.clientX - rect.left, e.clientY - rect.top);
    if (index >= 0) onPick(index);
  };

  return <canvas ref={ref} onClick={pick} className="block w-full h-[250px] cursor-pointer" aria-label="Scores over 30 days" role="img" />;
}
