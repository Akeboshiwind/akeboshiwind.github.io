import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import lockIcon from 'pixelarticons/svg/lock.svg?raw';
import unlockIcon from 'pixelarticons/svg/unlock.svg?raw';
import { PAGE_BACKGROUND } from '../../../lib/accents.js';
import './unlock.css';

// The code TapBlok's own "Your QR Code" screen shows — scanning it starts or
// stops a monitoring session.
const PAYLOAD = 'TAPBLOK_TOGGLE';

// The light theme's --heading on its page colour, in both themes: scanners want dark-on-light.
const INK = '#1c1b19';

function Icon({ svg, className }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block [&>svg]:w-full [&>svg]:h-full [&>svg]:[shape-rendering:crispEdges] ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [touched, setTouched] = useState(false);
  const [drawn, setDrawn] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, PAYLOAD, {
      width: 512,
      margin: 2,
      color: { dark: INK, light: PAGE_BACKGROUND },
    }).then(
      () => {
        // `toCanvas` stamps an inline 512px size on the element, which would
        // otherwise beat the classes below and overflow the panel.
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        setDrawn(true);
      },
      () => setDrawn(false),
    );
  }, []);

  const toggle = (next) => {
    setUnlocked(next);
    setTouched(true);
  };

  const cover = unlocked ? 'out' : touched ? 'in' : 'still';

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-8 py-4">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="page-title">TapBlok Unlock</h1>
        <p className="page-sub max-w-xs">Scan this code to start or stop a monitoring session.</p>
      </header>

      <div className={`border p-3 ${unlocked ? 'border-accent' : 'border-border'}`}>
        <div
          className="relative h-64 w-64 sm:h-80 sm:w-80"
          style={{ backgroundColor: PAGE_BACKGROUND }}
        >
          <canvas
            ref={canvasRef}
            className={drawn ? 'h-full w-full [image-rendering:pixelated]' : 'hidden'}
          />
          {!drawn && (
            <span className="flex h-full items-center justify-center break-all p-3 text-center font-mono text-sm" style={{ color: INK }}>
              {PAYLOAD}
            </span>
          )}

          <div
            data-cover={cover}
            aria-hidden="true"
            className="tapblok-cover pointer-events-none absolute inset-0 flex items-center justify-center bg-bg"
          >
            <span data-dither="rings" className="absolute inset-0" />
            <span className="relative flex flex-col items-center gap-2 border border-border bg-bg px-4 py-3">
              <Icon svg={lockIcon} className="h-10 w-10 text-accent" />
              <span className="label text-heading">Tap to unlock</span>
            </span>
          </div>

          {!unlocked && (
            <button
              type="button"
              onClick={() => toggle(true)}
              aria-label="Unlock the QR code"
              className="absolute inset-0 cursor-pointer focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
            />
          )}
        </div>
      </div>

      <div className="flex h-16 flex-col items-center gap-3">
        {unlocked ? (
          <>
            <p className="label inline-flex items-center gap-2 text-accent">
              <Icon svg={unlockIcon} className="h-4 w-4" />
              Unlocked — ready to scan
            </p>
            <button
              type="button"
              onClick={() => toggle(false)}
              className="label cursor-pointer border border-border px-3 py-1.5 hover:border-accent hover:bg-accent hover:text-bg"
            >
              Lock again
            </button>
          </>
        ) : (
          <p className="label opacity-70">Locked</p>
        )}
      </div>
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
