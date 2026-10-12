import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import fileTextIcon from 'pixelarticons/svg/file-text.svg?raw';
import uploadIcon from 'pixelarticons/svg/upload.svg?raw';
import downloadIcon from 'pixelarticons/svg/download.svg?raw';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { FileDrop } from '../../../components/pixel/FileDrop.jsx';
import { Icon } from '../../../components/pixel/Icon.jsx';

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

const Size = ({ label, bytes }) => (
  <div>
    <div className="label opacity-60 mb-1">{label}</div>
    <div className="pixel-num text-heading">{formatSize(bytes)}</div>
  </div>
);

export function App() {
  const [file, setFile] = useState(null);
  const [preset, setPreset] = useLocalStorage('preset', 'ebook', { prefix: PREFIX });
  const [stage, setStage] = useState('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const workerRef = useRef(null);

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
  const pagesKnown = stage === 'compressing' && progress.total > 0;

  return (
    <div className="text-text">
      <h1 className="page-title mt-4 mb-2">PDF Compress</h1>
      <p className="page-sub mt-0 mb-8">
        Powered by Ghostscript in WebAssembly. Files never leave your device.
      </p>

      <FileDrop accept="application/pdf,.pdf" onFiles={(files) => handleFile(files[0])} className="py-10 mb-6">
        {file ? (
          <>
            <Icon svg={fileTextIcon} className="w-8 h-8" />
            <span className="break-all">{file.name}</span>
            <span className="pixel-num">{formatSize(file.size)}</span>
            <span className="opacity-60">Tap to choose a different file</span>
          </>
        ) : (
          <>
            <Icon svg={uploadIcon} className="w-8 h-8" />
            <span>Drop a PDF here</span>
            <span className="opacity-60">or tap to choose a file</span>
          </>
        )}
      </FileDrop>

      <fieldset className="mb-6 min-w-0" disabled={busy}>
        <legend className="label mb-2">Compression level</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {PRESETS.map((p) => {
            const est = file ? estimateSavings(file.size, p.ratio) : null;
            return (
              <label
                key={p.id}
                className={`pixel-panel flex items-start gap-3 p-3 has-checked:border-accent ${
                  busy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-accent'
                }`}
              >
                <input
                  type="radio"
                  name="preset"
                  value={p.id}
                  checked={p.id === preset}
                  onChange={() => setPreset(p.id)}
                  className="pixel-radio mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="label text-heading">{p.label}</div>
                  <div className="text-sm opacity-70">{p.blurb}</div>
                  {est && (
                    <div className="font-pixel text-pixel mt-1 text-ok">
                      ~{formatSize(est.out)} ({est.pct.toFixed(0)}% smaller)
                    </div>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {file && (
          <p className="text-sm opacity-60 mt-2 mb-0">
            Estimates are typical reductions — actual size depends on the PDF's content.
          </p>
        )}
      </fieldset>

      <button
        disabled={!file || busy}
        onClick={handleCompress}
        className="pixel-button w-full py-2"
        data-variant="primary"
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
        <progress
          className="pixel-progress mt-4"
          aria-label="Compression progress"
          value={pagesKnown ? progress.current : undefined}
          max={pagesKnown ? progress.total : undefined}
        />
      )}

      {error && (
        <p className="pixel-panel border-danger text-danger mt-4 mb-0 p-3 text-sm">
          {error}
        </p>
      )}

      {result && file && (
        <div className="pixel-panel mt-8 p-4 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Size label="Original" bytes={file.size} />
            <Size label="Compressed" bytes={result.size} />
          </div>

          {result.size < file.size ? (
            <p className="font-pixel text-pixel text-ok m-0">
              {((1 - result.size / file.size) * 100).toFixed(1)}% smaller — saved {formatSize(file.size - result.size)}
            </p>
          ) : (
            <p className="font-pixel text-pixel text-warn m-0">
              No reduction — try a more aggressive level.
            </p>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              className="pixel-button flex-1 py-2 flex items-center justify-center gap-2"
              data-variant="primary"
            >
              <Icon svg={downloadIcon} className="w-4 h-4" />
              Download
            </button>
            <button onClick={reset} className="pixel-button py-2 px-4">
              New file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const mount = typeof document !== 'undefined' ? document.getElementById('app') : null;
if (mount) createRoot(mount).render(<App />);
