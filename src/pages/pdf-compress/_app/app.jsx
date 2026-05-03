import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { ThemeToggle } from '../../../components/ThemeToggle.jsx';

const PREFIX = 'pdf-compress_';

const PRESETS = [
  {
    id: 'screen',
    label: 'Screen',
    blurb: '72 dpi — smallest, low quality',
    ratio: 0.10,
  },
  {
    id: 'ebook',
    label: 'eBook',
    blurb: '150 dpi — good for reading',
    ratio: 0.30,
  },
  {
    id: 'printer',
    label: 'Printer',
    blurb: '300 dpi — balanced',
    ratio: 0.55,
  },
  {
    id: 'prepress',
    label: 'Prepress',
    blurb: '300 dpi, preserves color — highest quality',
    ratio: 0.80,
  },
];

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function estimateSavings(originalSize, ratio) {
  const out = originalSize * ratio;
  const saved = originalSize - out;
  const pct = (1 - ratio) * 100;
  return { out, saved, pct };
}

export function App({ historyUrl }) {
  const [file, setFile] = useState(null);
  const [preset, setPreset] = useLocalStorage('preset', 'ebook', { prefix: PREFIX });
  const [stage, setStage] = useState('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const workerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof Worker === 'undefined') return;
    const w = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    workerRef.current = w;
    w.addEventListener('message', (e) => {
      const msg = e.data;
      if (msg.type === 'progress') {
        setStage(msg.stage);
        if (msg.stage === 'compressing') {
          setProgress({ current: msg.current || 0, total: msg.total || 0 });
        }
      } else if (msg.type === 'done') {
        const blob = new Blob([msg.buffer], { type: 'application/pdf' });
        setResult({
          blob,
          url: URL.createObjectURL(blob),
          size: msg.size,
        });
        setStage('done');
      } else if (msg.type === 'error') {
        setError(msg.message);
        setStage('error');
      }
    });
    return () => {
      w.terminate();
      workerRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => { if (result?.url) URL.revokeObjectURL(result.url); };
  }, [result]);

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      setError('Please choose a PDF file.');
      setStage('error');
      return;
    }
    setError(null);
    setFile(f);
    setResult(null);
    setStage('idle');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleCompress = async () => {
    if (!file || !workerRef.current) return;
    setError(null);
    setResult(null);
    setStage('loading');
    setProgress({ current: 0, total: 0 });
    const buffer = await file.arrayBuffer();
    workerRef.current.postMessage({ type: 'compress', buffer, preset }, [buffer]);
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    const baseName = file.name.replace(/\.pdf$/i, '');
    a.download = `${baseName}-compressed.pdf`;
    a.click();
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setStage('idle');
    setProgress({ current: 0, total: 0 });
  };

  const busy = stage === 'loading' || stage === 'compressing';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-6">
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

        <h1 className="text-2xl font-bold mt-4 mb-2">PDF Compress</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Powered by Ghostscript in WebAssembly. Files never leave your device.
        </p>

        <button
          type="button"
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => inputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-lg p-8 sm:p-10 flex flex-col items-center justify-center gap-2 transition-colors mb-6 text-center ${
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
        >
          {file ? (
            <>
              <div className="text-base font-medium break-all">{file.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatSize(file.size)}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Tap to choose a different file
              </div>
            </>
          ) : (
            <>
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              <div className="text-base font-medium">Drop a PDF here</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">or tap to choose a file</div>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </button>

        <fieldset className="mb-6" disabled={busy}>
          <legend className="text-sm font-medium mb-2">Compression level</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESETS.map((p) => {
              const est = file ? estimateSavings(file.size, p.ratio) : null;
              const active = p.id === preset;
              return (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${busy ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <input
                    type="radio"
                    name="preset"
                    value={p.id}
                    checked={active}
                    onChange={() => setPreset(p.id)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{p.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{p.blurb}</div>
                    {est && (
                      <div className="text-xs mt-1 text-green-600 dark:text-green-400">
                        ~{formatSize(est.out)} ({est.pct.toFixed(0)}% smaller)
                      </div>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
          {file && (
            <p className="text-xs text-gray-400 mt-2">
              Estimates are typical reductions — actual size depends on the PDF's content.
            </p>
          )}
        </fieldset>

        <button
          disabled={!file || busy}
          onClick={handleCompress}
          className="w-full py-3 px-6 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {stage === 'loading' && 'Loading Ghostscript…'}
          {stage === 'compressing' && (
            progress.total > 0
              ? `Compressing — page ${progress.current} of ${progress.total}`
              : 'Compressing…'
          )}
          {!busy && 'Compress PDF'}
        </button>

        {busy && (
          <div className="mt-4">
            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div
                className={`h-full bg-blue-500 transition-all ${
                  stage === 'loading' || progress.total === 0 ? 'animate-pulse w-1/3' : ''
                }`}
                style={
                  stage === 'compressing' && progress.total > 0
                    ? { width: `${(progress.current / progress.total) * 100}%` }
                    : undefined
                }
              />
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {result && file && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-5 space-y-4 border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-400 mb-1">Original</div>
                <div className="font-medium">{formatSize(file.size)}</div>
              </div>
              <div>
                <div className="text-gray-400 mb-1">Compressed</div>
                <div className="font-medium">{formatSize(result.size)}</div>
              </div>
            </div>

            <div className="text-sm">
              {result.size < file.size ? (
                <span className="text-green-500 font-medium">
                  {((1 - result.size / file.size) * 100).toFixed(1)}% smaller — saved {formatSize(file.size - result.size)}
                </span>
              ) : (
                <span className="text-amber-500 font-medium">
                  No reduction — try a more aggressive level.
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 py-3 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Download
              </button>
              <button
                onClick={reset}
                className="py-3 px-4 rounded-lg font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                New file
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const mount = typeof document !== 'undefined' ? document.getElementById('app') : null;
if (mount) createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
