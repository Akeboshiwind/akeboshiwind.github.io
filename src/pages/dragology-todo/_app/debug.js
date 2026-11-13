import { createElement, useEffect, useState } from 'react';

// `?debug` shows the last few second-finger events on the page, for finding iOS's scroll jitter.
const ON = typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug');
const rows = [];
const t0 = typeof performance !== 'undefined' ? performance.now() : 0;

export function trace(row) {
  if (!ON) return;
  rows.push({ t: Math.round(performance.now() - t0), ...row });
  if (rows.length > 14) rows.shift();
}

const cell = v => (typeof v === 'number' ? Math.round(v * 10) / 10 : v ?? '-');

export function DebugTrace() {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!ON) return;
    const id = setInterval(() => tick(n => n + 1), 100);
    return () => clearInterval(id);
  }, []);
  if (!ON) return null;
  return createElement('pre', {
    className: 'fixed top-0 inset-x-0 z-50 m-0 p-1 text-[10px] leading-tight bg-bg text-text border-b-2 border-border pointer-events-none whitespace-pre-wrap',
  }, rows.length
    ? rows.map(r => Object.entries(r).map(([k, v]) => `${k}:${cell(v)}`).join(' ')).join('\n')
    : 'debug: hold a to-do, then move a second finger');
}
