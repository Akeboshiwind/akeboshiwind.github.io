import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';
import { PAGE_BACKGROUND, PAGE_INK } from '../../../lib/accents.js';

const PREFIX = 'qr-code_';
const ERROR_LEVELS = ['L', 'M', 'Q', 'H'];

export function App() {
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
      color: { dark: PAGE_INK, light: PAGE_BACKGROUND },
    }).then(
      () => {
        canvas.style.width = '';
        canvas.style.height = '';
        setError(null);
      },
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
    <div className="text-text">
      <h1 className="page-title mt-4 mb-2">QR Code Generator</h1>
      <p className="page-sub mt-0 mb-8">Turn text or a URL into a QR code and save it as a PNG.</p>

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          <section>
            <SectionLabel className="mb-3">Text</SectionLabel>
            <textarea
              className="pixel-field w-full min-h-40 resize-y font-mono text-sm block"
              placeholder="Enter text or URL to encode..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
            />
          </section>

          <section>
            <SectionLabel className="mb-3">Error correction</SectionLabel>
            <div className="flex gap-2">
              {ERROR_LEVELS.map((l) => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  aria-pressed={level === l}
                  className="pixel-chip flex-1 min-h-[36px]"
                >
                  {l}
                </button>
              ))}
            </div>
            <p className="label opacity-60 mt-2">Higher = more resistant, larger code</p>
          </section>
        </div>

        <div className="flex flex-col gap-3 sm:w-64 shrink-0">
          <div className="pixel-panel p-2">
            <div
              className={`w-full aspect-square flex items-center justify-center overflow-hidden ${text ? '' : 'bg-bg'}`}
              style={text ? { backgroundColor: PAGE_BACKGROUND } : undefined}
            >
              <canvas
                ref={canvasRef}
                className={text ? 'w-full h-full [image-rendering:pixelated]' : 'hidden'}
              />
              {!text && (
                <span className="label opacity-60 text-center px-4">
                  QR code will appear here
                </span>
              )}
            </div>
          </div>

          {error && <p className="label text-danger">{error}</p>}

          <button
            onClick={handleDownload}
            disabled={!text || !!error}
            className="pixel-button w-full min-h-[36px]"
            data-variant="primary"
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
