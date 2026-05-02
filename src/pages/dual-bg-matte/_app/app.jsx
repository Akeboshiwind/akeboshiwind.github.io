import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeToggle } from '../../../components/ThemeToggle.jsx';

const PREVIEW_MAX_DIM = 1024;
const RECOMPUTE_DEBOUNCE_MS = 80;

const DEFAULTS = {
  dx: 0,
  dy: 0,
  lowSnap: 0.05,
  highSnap: 0.95,
  gamma: 1.0,
};

const VIEWS = [
  { id: 'result', label: 'Result' },
  { id: 'strayOpaque', label: 'Stray opaque' },
  { id: 'strayTransparent', label: 'Stray transparent' },
  { id: 'partialAlpha', label: 'Partial alpha' },
  { id: 'difference', label: 'Difference' },
];

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e);
    };
    img.src = url;
  });
}

function imageToImageData(img, maxDim) {
  const longest = Math.max(img.naturalWidth, img.naturalHeight);
  const scale = maxDim ? Math.min(1, maxDim / longest) : 1;
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  return ctx.getImageData(0, 0, w, h);
}

// Core matte computation. Returns alpha (0-255), foreground RGB, and per-pixel
// max-channel difference (0-255).
function computeMatte(white, black, { dx, dy, lowSnap, highSnap, gamma }) {
  const w = white.width;
  const h = white.height;
  const wd = white.data;
  const bd = black.data;
  const N = w * h;
  const alpha = new Uint8ClampedArray(N);
  const fg = new Uint8ClampedArray(N * 3);
  const diff = new Uint8ClampedArray(N);

  const invGamma = 1 / gamma;
  const eps = 1e-3;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const wi = i * 4;

      // Sample black at (x - dx, y - dy) so the visible black image shifts by (dx, dy)
      let bx = x - dx;
      let by = y - dy;
      if (bx < 0) bx = 0; else if (bx >= w) bx = w - 1;
      if (by < 0) by = 0; else if (by >= h) by = h - 1;
      const bi = (by * w + bx) * 4;

      const wr = wd[wi], wg = wd[wi + 1], wb = wd[wi + 2];
      const br = bd[bi], bg = bd[bi + 1], bb = bd[bi + 2];

      // Per-channel α = 1 - (Iw - Ib) / 255
      const ar = 1 - (wr - br) / 255;
      const ag = 1 - (wg - bg) / 255;
      const ab = 1 - (wb - bb) / 255;
      let a = (ar + ag + ab) / 3;
      if (a < 0) a = 0;
      else if (a > 1) a = 1;

      if (gamma !== 1) a = Math.pow(a, invGamma);

      if (a < lowSnap) a = 0;
      else if (a > highSnap) a = 1;

      alpha[i] = Math.round(a * 255);

      // Recover unpremultiplied F = Ib / α
      if (a > eps) {
        const inv = 1 / a;
        let fr = br * inv;
        let fgc = bg * inv;
        let fb = bb * inv;
        if (fr > 255) fr = 255; else if (fr < 0) fr = 0;
        if (fgc > 255) fgc = 255; else if (fgc < 0) fgc = 0;
        if (fb > 255) fb = 255; else if (fb < 0) fb = 0;
        fg[i * 3] = fr;
        fg[i * 3 + 1] = fgc;
        fg[i * 3 + 2] = fb;
      }
      // else: leave fg as zero (default)

      const dr = Math.abs(wr - br);
      const dg = Math.abs(wg - bg);
      const dbb = Math.abs(wb - bb);
      const dmax = dr > dg ? (dr > dbb ? dr : dbb) : (dg > dbb ? dg : dbb);
      diff[i] = dmax;
    }
  }

  return { alpha, fg, diff, width: w, height: h };
}

// Convert a precomputed matte into an ImageData for the requested view.
// 'result' returns RGBA with real alpha; the canvas-draw step paints a
// checkerboard behind it. The other views return fully opaque diagnostic
// imagery that can be putImageData'd directly.
function renderView(matte, view) {
  const { alpha, fg, diff, width: w, height: h } = matte;
  const N = w * h;
  const out = new ImageData(w, h);
  const od = out.data;
  const cbSize = 12;

  if (view === 'result') {
    for (let i = 0; i < N; i++) {
      od[i * 4] = fg[i * 3];
      od[i * 4 + 1] = fg[i * 3 + 1];
      od[i * 4 + 2] = fg[i * 3 + 2];
      od[i * 4 + 3] = alpha[i];
    }
    return out;
  }

  if (view === 'strayOpaque') {
    for (let i = 0; i < N; i++) {
      const a = alpha[i] / 255;
      const baseR = fg[i * 3] * a + 255 * (1 - a);
      const baseG = fg[i * 3 + 1] * a + 255 * (1 - a);
      const baseB = fg[i * 3 + 2] * a + 255 * (1 - a);
      let r = baseR, g = baseG, b = baseB;
      if (alpha[i] === 255) {
        r = Math.min(255, baseR * 0.4 + 255 * 0.6);
        g = baseG * 0.4;
        b = baseB * 0.4;
      }
      od[i * 4] = r;
      od[i * 4 + 1] = g;
      od[i * 4 + 2] = b;
      od[i * 4 + 3] = 255;
    }
    return out;
  }

  if (view === 'strayTransparent') {
    const grey = 80;
    for (let i = 0; i < N; i++) {
      const a = alpha[i] / 255;
      const baseR = fg[i * 3] * a + grey * (1 - a);
      const baseG = fg[i * 3 + 1] * a + grey * (1 - a);
      const baseB = fg[i * 3 + 2] * a + grey * (1 - a);
      let r = baseR, g = baseG, b = baseB;
      if (alpha[i] === 0) {
        r = baseR * 0.3;
        g = baseG * 0.3;
        b = Math.min(255, baseB * 0.3 + 255 * 0.7);
      }
      od[i * 4] = r;
      od[i * 4 + 1] = g;
      od[i * 4 + 2] = b;
      od[i * 4 + 3] = 255;
    }
    return out;
  }

  if (view === 'partialAlpha') {
    for (let i = 0; i < N; i++) {
      const a = alpha[i];
      const isPartial = a > 0 && a < 255;
      const x = i % w;
      const y = (i / w) | 0;
      const checker =
        (((x / cbSize) | 0) + ((y / cbSize) | 0)) % 2 === 0 ? 220 : 180;
      const af = a / 255;
      const baseR = fg[i * 3] * af + checker * (1 - af);
      const baseG = fg[i * 3 + 1] * af + checker * (1 - af);
      const baseB = fg[i * 3 + 2] * af + checker * (1 - af);
      let r = baseR, g = baseG, b = baseB;
      if (isPartial) {
        r = baseR * 0.3;
        g = Math.min(255, baseG * 0.3 + 255 * 0.7);
        b = baseB * 0.3;
      }
      od[i * 4] = r;
      od[i * 4 + 1] = g;
      od[i * 4 + 2] = b;
      od[i * 4 + 3] = 255;
    }
    return out;
  }

  if (view === 'difference') {
    for (let i = 0; i < N; i++) {
      const v = diff[i] / 255;
      let r, g, b;
      if (v < 0.33) {
        const t = v / 0.33;
        r = 30 + t * 190;
        g = 30 + t * 30;
        b = 60 + t * 60;
      } else if (v < 0.66) {
        const t = (v - 0.33) / 0.33;
        r = 220 + t * 30;
        g = 60 + t * 160;
        b = 120;
      } else {
        const t = (v - 0.66) / 0.34;
        r = 250;
        g = 220 + t * 35;
        b = 120 + t * 135;
      }
      od[i * 4] = r;
      od[i * 4 + 1] = g;
      od[i * 4 + 2] = b;
      od[i * 4 + 3] = 255;
    }
    return out;
  }

  return out;
}

function alphaStats(alpha) {
  let op = 0, tr = 0, pa = 0;
  for (let i = 0; i < alpha.length; i++) {
    const a = alpha[i];
    if (a === 0) tr++;
    else if (a === 255) op++;
    else pa++;
  }
  const total = alpha.length || 1;
  return {
    opaquePct: (op / total) * 100,
    transparentPct: (tr / total) * 100,
    partialPct: (pa / total) * 100,
  };
}

function drawMatteToCanvas(canvas, matte, view) {
  const { width: w, height: h } = matte;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  if (view === 'result') {
    const cell = 12;
    for (let y = 0; y < h; y += cell) {
      for (let x = 0; x < w; x += cell) {
        const dark = (((x / cell) | 0) + ((y / cell) | 0)) % 2 === 0;
        ctx.fillStyle = dark ? '#cccccc' : '#ffffff';
        ctx.fillRect(x, y, cell, cell);
      }
    }
    const data = renderView(matte, 'result');
    // putImageData replaces alpha; round-trip via a temp canvas so drawImage
    // composites the RGBA over the checker we just painted.
    const tmp = document.createElement('canvas');
    tmp.width = w;
    tmp.height = h;
    tmp.getContext('2d').putImageData(data, 0, 0);
    ctx.drawImage(tmp, 0, 0);
    return;
  }

  ctx.putImageData(renderView(matte, view), 0, 0);
}

function buildDownloadBlob(whiteFull, blackFull, params) {
  const matte = computeMatte(whiteFull, blackFull, params);
  const { alpha, fg, width: w, height: h } = matte;
  const out = new ImageData(w, h);
  const od = out.data;
  for (let i = 0; i < alpha.length; i++) {
    od[i * 4] = fg[i * 3];
    od[i * 4 + 1] = fg[i * 3 + 1];
    od[i * 4 + 2] = fg[i * 3 + 2];
    od[i * 4 + 3] = alpha[i];
  }
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d').putImageData(out, 0, 0);
  return new Promise((resolve) => c.toBlob((b) => resolve(b), 'image/png'));
}

function FilePicker({ id, label, fileName, onPick }) {
  return (
    <label
      htmlFor={id}
      className="flex flex-col gap-1 p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors min-h-[60px]"
    >
      <span className="text-sm font-medium">{label}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
        {fileName ? fileName : 'Tap to choose…'}
      </span>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] || null)}
      />
    </label>
  );
}

function Slider({ label, value, min, max, step, onChange, format }) {
  const display = format ? format(value) : String(value);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-gray-600 dark:text-gray-300">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
        style={{ minHeight: '44px', touchAction: 'pan-y' }}
      />
    </div>
  );
}

function HelpPanel({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-4 text-sm leading-relaxed space-y-3">
      <div className="flex justify-between items-start gap-3">
        <h2 className="text-base font-semibold">How this works</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 text-xl leading-none cursor-pointer px-2"
          aria-label="Close help"
        >
          ×
        </button>
      </div>

      <div>
        <h3 className="font-semibold">What this does</h3>
        <p>
          Turns two AI-generated images into one transparent PNG that keeps soft
          edges and partial transparency (glass, smoke, hair) — things a normal
          background remover destroys.
        </p>
      </div>

      <div>
        <h3 className="font-semibold">What you need</h3>
        <p>
          The same image generated twice from your AI tool, identical in every
          way except the background:
        </p>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>One with a <strong>pure white</strong> background</li>
          <li>One with a <strong>pure black</strong> background</li>
        </ul>
        <p className="mt-1">
          Tell the AI:{' '}
          <em>
            “Regenerate this exact image, identical composition and pixel
            positions, only change the background to solid black”
          </em>{' '}
          (or white).
        </p>
      </div>

      <div>
        <h3 className="font-semibold">How to use it</h3>
        <ol className="list-decimal pl-5 mt-1 space-y-1">
          <li>Upload both images.</li>
          <li>
            Look at the <strong>Difference</strong> view. If you see bright
            outlines around your subject, the two images aren’t perfectly
            aligned — use <strong>Nudge X / Nudge Y</strong> until the outlines
            fade.
          </li>
          <li>
            Switch to <strong>Stray opaque</strong> view. Red specks in empty
            areas mean leftover background. Raise{' '}
            <strong>Snap to transparent below</strong> until they vanish.
          </li>
          <li>
            Switch to <strong>Stray transparent</strong> view. Blue holes inside
            your subject mean it’s becoming see-through where it shouldn’t.
            Lower <strong>Snap to opaque above</strong> until they fill in.
          </li>
          <li>
            Switch to <strong>Partial alpha</strong> view. Green should appear
            on glass, edges, and soft details — that’s the partial transparency
            you want to preserve. If green is missing from glass, your alignment
            is probably off; go back to step 2.
          </li>
          <li>
            Switch back to <strong>Result</strong> to see the final transparent
            PNG on a checkerboard.
          </li>
          <li>Tap <strong>Download</strong> when happy.</li>
        </ol>
      </div>

      <div>
        <h3 className="font-semibold">Tips</h3>
        <ul className="list-disc pl-5 mt-1 space-y-1">
          <li>
            If alignment is hopeless no matter what you nudge, regenerate the
            pair with a tighter prompt about identical composition.
          </li>
          <li>
            Text and sharp logos suffer most from misalignment — ghosting around
            them is common.
          </li>
          <li>
            <strong>Edge softness</strong> is a fine-tuning knob; leave it at
            1.0 unless edges look wrong.
          </li>
        </ul>
      </div>
    </div>
  );
}

export function App({ historyUrl }) {
  const [whiteFile, setWhiteFile] = useState(null);
  const [blackFile, setBlackFile] = useState(null);
  const [whiteImg, setWhiteImg] = useState(null);
  const [blackImg, setBlackImg] = useState(null);
  const [whitePreview, setWhitePreview] = useState(null);
  const [blackPreview, setBlackPreview] = useState(null);
  const [error, setError] = useState(null);
  const [helpOpen, setHelpOpen] = useState(true);
  const [view, setView] = useState('result');
  const [downloading, setDownloading] = useState(false);

  const [dx, setDx] = useState(DEFAULTS.dx);
  const [dy, setDy] = useState(DEFAULTS.dy);
  const [lowSnap, setLowSnap] = useState(DEFAULTS.lowSnap);
  const [highSnap, setHighSnap] = useState(DEFAULTS.highSnap);
  const [gamma, setGamma] = useState(DEFAULTS.gamma);

  const canvasRef = useRef(null);
  const recomputeTimer = useRef(null);
  const [stats, setStats] = useState({ opaquePct: 0, transparentPct: 0, partialPct: 0 });
  const matteRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    if (!whiteFile) { setWhiteImg(null); setWhitePreview(null); return; }
    loadImageFromFile(whiteFile).then((img) => {
      if (cancelled) return;
      setWhiteImg(img);
      setWhitePreview(imageToImageData(img, PREVIEW_MAX_DIM));
    }).catch(() => {
      if (!cancelled) setError('Could not read the white-background image.');
    });
    return () => { cancelled = true; };
  }, [whiteFile]);

  useEffect(() => {
    let cancelled = false;
    if (!blackFile) { setBlackImg(null); setBlackPreview(null); return; }
    loadImageFromFile(blackFile).then((img) => {
      if (cancelled) return;
      setBlackImg(img);
      setBlackPreview(imageToImageData(img, PREVIEW_MAX_DIM));
    }).catch(() => {
      if (!cancelled) setError('Could not read the black-background image.');
    });
    return () => { cancelled = true; };
  }, [blackFile]);

  const mismatch = useMemo(() => {
    if (!whiteImg || !blackImg) return null;
    if (whiteImg.naturalWidth !== blackImg.naturalWidth ||
        whiteImg.naturalHeight !== blackImg.naturalHeight) {
      return `Images have different dimensions (${whiteImg.naturalWidth}×${whiteImg.naturalHeight} vs ${blackImg.naturalWidth}×${blackImg.naturalHeight}). They must match.`;
    }
    return null;
  }, [whiteImg, blackImg]);

  useEffect(() => {
    if (!whitePreview || !blackPreview || mismatch) return;
    if (whitePreview.width !== blackPreview.width ||
        whitePreview.height !== blackPreview.height) return;

    if (recomputeTimer.current) clearTimeout(recomputeTimer.current);
    recomputeTimer.current = setTimeout(() => {
      const matte = computeMatte(whitePreview, blackPreview, {
        dx, dy, lowSnap, highSnap, gamma,
      });
      matteRef.current = matte;
      setStats(alphaStats(matte.alpha));
      if (canvasRef.current) drawMatteToCanvas(canvasRef.current, matte, view);
    }, RECOMPUTE_DEBOUNCE_MS);
    return () => {
      if (recomputeTimer.current) clearTimeout(recomputeTimer.current);
    };
  }, [whitePreview, blackPreview, dx, dy, lowSnap, highSnap, gamma, view, mismatch]);

  useEffect(() => {
    if (matteRef.current && canvasRef.current) {
      drawMatteToCanvas(canvasRef.current, matteRef.current, view);
    }
  }, [view]);

  const reset = () => {
    setDx(DEFAULTS.dx);
    setDy(DEFAULTS.dy);
    setLowSnap(DEFAULTS.lowSnap);
    setHighSnap(DEFAULTS.highSnap);
    setGamma(DEFAULTS.gamma);
  };

  const handleDownload = useCallback(async () => {
    if (!whiteImg || !blackImg || mismatch) return;
    setDownloading(true);
    try {
      const whiteFull = imageToImageData(whiteImg, null);
      const blackFull = imageToImageData(blackImg, null);
      const blob = await buildDownloadBlob(whiteFull, blackFull, {
        dx, dy, lowSnap, highSnap, gamma,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const baseName = (whiteFile?.name || 'matte').replace(/\.[^.]+$/, '');
      a.download = `${baseName}-matte.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } finally {
      setDownloading(false);
    }
  }, [whiteImg, blackImg, whiteFile, dx, dy, lowSnap, highSnap, gamma, mismatch]);

  const ready = whitePreview && blackPreview && !mismatch;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-2xl mx-auto px-3 pt-3 pb-4 flex flex-col gap-3">
        <nav className="flex items-center gap-3 text-sm text-gray-400">
          <a
            href="../"
            className="inline-flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            ← Home
          </a>
          {historyUrl && (
            <a
              href={historyUrl}
              target="_blank"
              rel="noopener"
              className="hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              history
            </a>
          )}
          <ThemeToggle className="ml-auto" />
        </nav>

        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Dual-Background Matte</h1>
          <button
            type="button"
            onClick={() => setHelpOpen((v) => !v)}
            className="text-sm px-3 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            {helpOpen ? 'Hide help' : 'Help'}
          </button>
        </div>

        <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />

        <div className="grid grid-cols-1 gap-2">
          <FilePicker
            id="white-file"
            label="Photo on white background"
            fileName={whiteFile?.name}
            onPick={setWhiteFile}
          />
          <FilePicker
            id="black-file"
            label="Photo on black background"
            fileName={blackFile?.name}
            onPick={setBlackFile}
          />
        </div>

        {error && (
          <div className="rounded border border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 px-3 py-2 text-sm">
            {error}
          </div>
        )}
        {mismatch && (
          <div className="rounded border border-red-400 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 px-3 py-2 text-sm">
            {mismatch}
          </div>
        )}

        <div
          className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          style={{ maxHeight: '55vh', minHeight: '220px' }}
        >
          {ready ? (
            <canvas
              ref={canvasRef}
              className="block w-full h-auto max-h-[55vh] object-contain"
            />
          ) : (
            <div className="px-4 py-12 text-center text-gray-500 text-sm">
              Upload both images to see the matte preview.
            </div>
          )}
        </div>

        <div
          className="-mx-3 px-3 overflow-x-auto"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          <div className="flex gap-2 w-max pb-1">
            {VIEWS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setView(v.id)}
                className={
                  'px-3 py-2 rounded-full text-sm whitespace-nowrap border cursor-pointer transition-colors min-h-[40px] ' +
                  (view === v.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700')
                }
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400 tabular-nums">
          <span>
            Opaque:{' '}
            <strong className="text-gray-800 dark:text-gray-200">
              {stats.opaquePct.toFixed(1)}%
            </strong>
          </span>
          <span>
            Transparent:{' '}
            <strong className="text-gray-800 dark:text-gray-200">
              {stats.transparentPct.toFixed(1)}%
            </strong>
          </span>
          <span>
            Partial:{' '}
            <strong className="text-gray-800 dark:text-gray-200">
              {stats.partialPct.toFixed(1)}%
            </strong>
          </span>
        </div>

        <div className="flex flex-col gap-4 mt-1">
          <Slider
            label="Nudge X"
            value={dx}
            min={-20}
            max={20}
            step={1}
            onChange={setDx}
            format={(v) => `${v} px`}
          />
          <Slider
            label="Nudge Y"
            value={dy}
            min={-20}
            max={20}
            step={1}
            onChange={setDy}
            format={(v) => `${v} px`}
          />
          <Slider
            label="Snap to transparent below"
            value={lowSnap}
            min={0}
            max={0.4}
            step={0.01}
            onChange={setLowSnap}
            format={(v) => v.toFixed(2)}
          />
          <Slider
            label="Snap to opaque above"
            value={highSnap}
            min={0.6}
            max={1.0}
            step={0.01}
            onChange={setHighSnap}
            format={(v) => v.toFixed(2)}
          />
          <Slider
            label="Edge softness"
            value={gamma}
            min={0.5}
            max={2.0}
            step={0.05}
            onChange={setGamma}
            format={(v) => v.toFixed(2)}
          />

          <button
            type="button"
            onClick={reset}
            className="self-start text-sm px-3 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
          >
            Reset controls
          </button>
        </div>

        <div className="sticky bottom-0 -mx-3 px-3 pt-3 pb-3 mt-2 bg-gray-50/85 dark:bg-gray-900/85 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!ready || downloading}
            className="w-full py-3 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors min-h-[44px]"
          >
            {downloading ? 'Rendering full-resolution PNG…' : 'Download transparent PNG'}
          </button>
        </div>
      </div>
    </div>
  );
}

const mount = typeof document !== 'undefined' ? document.getElementById('app') : null;
if (mount) createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
