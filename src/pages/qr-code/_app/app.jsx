import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { ThemeToggle } from '../../../components/ThemeToggle.jsx';

const PREFIX = 'qr-code_';
const ERROR_LEVELS = ['L', 'M', 'Q', 'H'];

export function App({ historyUrl }) {
  const [text, setText] = useLocalStorage('text', '', { prefix: PREFIX });
  const [level, setLevel] = useLocalStorage('level', 'M', { prefix: PREFIX });
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!text) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      setError(null);
      return;
    }
    QRCode.toCanvas(canvas, text, {
      errorCorrectionLevel: level,
      width: 320,
      margin: 2,
    }).then(
      () => setError(null),
      (e) => setError(e.message || 'Failed to generate QR code'),
    );
  }, [text, level]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !text) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'qr-code.png';
    a.click();
  };

  return (
    <div className="flex flex-col min-h-screen p-4 gap-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
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

      <h1 className="text-xl font-semibold">QR Code Generator</h1>

      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <textarea
            className="w-full min-h-40 md:flex-1 resize-none rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
            placeholder="Enter text or URL to encode..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Error correction
              <span className="ml-2 text-gray-400 font-normal">
                (higher = more resistant, larger code)
              </span>
            </label>
            <div className="flex gap-2">
              {ERROR_LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                    level === l
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center md:w-80">
          <div className="w-full aspect-square rounded-lg bg-white border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              className={`max-w-full max-h-full ${text ? '' : 'hidden'}`}
            />
            {!text && (
              <span className="text-gray-400 text-sm text-center px-4">
                QR code will appear here
              </span>
            )}
          </div>

          {error && (
            <div className="w-full rounded-lg p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleDownload}
            disabled={!text || !!error}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed font-medium transition-colors"
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
