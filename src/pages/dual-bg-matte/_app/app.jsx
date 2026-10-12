import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import imageIcon from 'pixelarticons/svg/image.svg?raw';
import closeIcon from 'pixelarticons/svg/close.svg?raw';
import downloadIcon from 'pixelarticons/svg/download.svg?raw';
import { FileDrop } from '../../../components/pixel/FileDrop.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';

const PREVIEW_MAX_DIM = 1024;
const RECOMPUTE_DEBOUNCE_MS = 80;

const DEFAULTS = {
  dx: 0,
  dy: 0,
  lowSnap: 0.05,
  highSnap: 0.95,
  gamma: 1.0,
};

const CHECKERBOARD =
  'bg-[conic-gradient(var(--border)_25%,var(--bg)_0_50%,var(--border)_0_75%,var(--bg)_0)] bg-size-[16px_16px]';

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
  canvas.width = matte.width;
  canvas.height = matte.height;
  canvas.getContext('2d').putImageData(renderView(matte, view), 0, 0);
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

function FilePicker({ label, fileName, onPick }) {
  return (
    <FileDrop accept="image/*" onFiles={(files) => onPick(files[0] ?? null)} className="min-w-0">
      <Icon svg={imageIcon} className="w-6 h-6" />
      <span>{label}</span>
      <span className="font-sans text-xs normal-case tracking-normal opacity-70 max-w-full truncate">
        {fileName ? fileName : 'Tap to choose…'}
      </span>
    </FileDrop>
  );
}

function Slider({ id, label, value, min, max, step, onChange, format }) {
  const display = format ? format(value) : String(value);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-baseline gap-2">
        <label htmlFor={id} className="label">{label}</label>
        <span className="font-pixel text-pixel tabular-nums text-heading">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="pixel-range touch-pan-y"
      />
    </div>
  );
}

function HelpPanel({ open, onClose }) {
  if (!open) return null;
  return (
    <div className="pixel-panel p-4 text-sm leading-relaxed space-y-4 [&_strong]:text-heading">
      <SectionLabel
        action={
          <button type="button" onClick={onClose} className="pixel-button p-1" aria-label="Close help">
            <Icon svg={closeIcon} className="w-4 h-4" />
          </button>
        }
      >
        How this works
      </SectionLabel>

      <div>
        <h3 className="label text-heading mb-1">What this does</h3>
        <p>
          Turns two AI-generated images into one transparent PNG that keeps soft
          edges and partial transparency (glass, smoke, hair) — things a normal
          background remover destroys.
        </p>
      </div>

      <div>
        <h3 className="label text-heading mb-1">What you need</h3>
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
        <h3 className="label text-heading mb-1">How to use it</h3>
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
        <h3 className="label text-heading mb-1">Tips</h3>
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

export function App() {
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
    <div className="text-text w-full max-w-[1200px] mx-auto flex flex-col gap-6">
      <header className="flex items-start justify-between gap-4 mt-4">
        <div>
          <h1 className="page-title mb-2">Dual-Background Matte</h1>
          <p className="page-sub m-0">
            Two renders of one image, on white and on black, make one transparent PNG with its soft edges intact.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setHelpOpen((v) => !v)}
          aria-expanded={helpOpen}
          className="pixel-chip shrink-0 min-h-[36px] sm:min-h-0"
        >
          {helpOpen ? 'Hide help' : 'Help'}
        </button>
      </header>

      <HelpPanel open={helpOpen} onClose={() => setHelpOpen(false)} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 items-start">
        <section className="flex flex-col gap-4 min-w-0 lg:col-start-2 lg:row-start-1">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            <FilePicker
              label="Photo on white background"
              fileName={whiteFile?.name}
              onPick={setWhiteFile}
            />
            <FilePicker
              label="Photo on black background"
              fileName={blackFile?.name}
              onPick={setBlackFile}
            />
          </div>

          {error && (
            <p role="alert" className="pixel-panel border-danger text-danger text-sm px-3 py-2 m-0">{error}</p>
          )}
          {mismatch && (
            <p role="alert" className="pixel-panel border-danger text-danger text-sm px-3 py-2 m-0">{mismatch}</p>
          )}
        </section>

        <section className="flex flex-col gap-3 min-w-0 lg:col-start-1 lg:row-start-1 lg:row-span-3">
          <div className="pixel-panel bg-code-bg flex items-center justify-center p-2 min-h-[220px]">
            {ready ? (
              <canvas
                ref={canvasRef}
                className={
                  'block max-w-full max-h-[55vh] lg:max-h-[70vh] w-auto h-auto' +
                  (view === 'result' ? ' ' + CHECKERBOARD : '')
                }
              />
            ) : (
              <p className="label opacity-60 text-center px-4 py-12">
                Upload both images to see the matte preview.
              </p>
            )}
          </div>

          <div className="-mx-4 px-4 overflow-x-auto sm:mx-0 sm:px-0 sm:overflow-visible">
            <div className="flex gap-1 w-max sm:w-auto sm:flex-wrap pb-1">
              {VIEWS.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setView(v.id)}
                  aria-pressed={view === v.id}
                  className="pixel-chip min-h-[36px] sm:min-h-0"
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 font-pixel text-pixel tabular-nums">
            <span>
              Opaque:{' '}
              <strong className="font-normal text-heading">{stats.opaquePct.toFixed(1)}%</strong>
            </span>
            <span>
              Transparent:{' '}
              <strong className="font-normal text-heading">{stats.transparentPct.toFixed(1)}%</strong>
            </span>
            <span>
              Partial:{' '}
              <strong className="font-normal text-heading">{stats.partialPct.toFixed(1)}%</strong>
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-4 min-w-0 lg:col-start-2 lg:row-start-2">
          <SectionLabel>Controls</SectionLabel>
          <div className="flex flex-col gap-5">
            <Slider id="nudge-x" label="Nudge X" value={dx} min={-20} max={20} step={1} onChange={setDx} format={(v) => `${v} px`} />
            <Slider id="nudge-y" label="Nudge Y" value={dy} min={-20} max={20} step={1} onChange={setDy} format={(v) => `${v} px`} />
            <Slider id="low-snap" label="Snap to transparent below" value={lowSnap} min={0} max={0.4} step={0.01} onChange={setLowSnap} format={(v) => v.toFixed(2)} />
            <Slider id="high-snap" label="Snap to opaque above" value={highSnap} min={0.6} max={1.0} step={0.01} onChange={setHighSnap} format={(v) => v.toFixed(2)} />
            <Slider id="gamma" label="Edge softness" value={gamma} min={0.5} max={2.0} step={0.05} onChange={setGamma} format={(v) => v.toFixed(2)} />
            <button type="button" onClick={reset} className="pixel-button self-start">
              Reset controls
            </button>
          </div>
        </section>

        <div className="sticky bottom-0 -mx-4 px-4 py-3 bg-bg border-t-2 border-border lg:static lg:col-start-2 lg:row-start-3 lg:m-0 lg:p-0 lg:border-0">
          <button
            type="button"
            onClick={handleDownload}
            disabled={!ready || downloading}
            className="pixel-button w-full py-2 flex items-center justify-center gap-2"
            data-variant="primary"
          >
            <Icon svg={downloadIcon} className="w-4 h-4" />
            {downloading ? 'Rendering full-resolution PNG…' : 'Download transparent PNG'}
          </button>
        </div>
      </div>
    </div>
  );
}

const mount = typeof document !== 'undefined' ? document.getElementById('app') : null;
if (mount) createRoot(mount).render(<App />);
