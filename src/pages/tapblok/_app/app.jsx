import { createRoot } from 'react-dom/client';
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import lockIcon from 'lucide-static/icons/lock.svg?raw';
import lockOpenIcon from 'lucide-static/icons/lock-open.svg?raw';
import scanIcon from 'lucide-static/icons/scan-line.svg?raw';
import { ThemeToggle } from '../../../components/ThemeToggle.jsx';
import './unlock.css';

// The code TapBlok's own "Your QR Code" screen shows — scanning it starts or
// stops a monitoring session.
const PAYLOAD = 'TAPBLOK_TOGGLE';

function Icon({ svg, className }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block [&>svg]:w-full [&>svg]:h-full ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function App({ historyUrl }) {
  const [unlocked, setUnlocked] = useState(false);
  // Bumped on every unlock so the CSS animations remount and replay.
  const [run, setRun] = useState(0);
  const [drawn, setDrawn] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    QRCode.toCanvas(canvas, PAYLOAD, {
      width: 512,
      margin: 2,
      color: { dark: '#0f172a', light: '#ffffff' },
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

  const unlock = () => {
    setUnlocked(true);
    setRun((n) => n + 1);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 gap-4 text-gray-900 dark:text-gray-100">
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

      <main className="flex-1 flex flex-col items-center justify-center gap-8 py-4">
        <header className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-xl font-semibold tracking-tight">TapBlok Unlock</h1>
          <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
            Scan this code to start or stop a monitoring session.
          </p>
        </header>

        {/* The canvas must stay mounted across lock/unlock — everything that
            animates is a sibling, keyed on `run` so it replays. */}
        <div
          className={`relative rounded-[2rem] bg-gradient-to-b from-slate-800 to-slate-950 p-4 shadow-2xl ring-1 transition-colors duration-700 ${
            unlocked ? 'ring-emerald-400/40' : 'ring-white/10'
          }`}
        >
          {unlocked && (
            <span
              key={`halo-${run}`}
              className="tapblok-halo pointer-events-none absolute inset-0 rounded-[2rem]"
            />
          )}

          <div className="relative h-64 w-64 overflow-hidden rounded-3xl bg-white sm:h-80 sm:w-80">
            <div
              className={`flex h-full w-full items-center justify-center p-3 transition-[filter,transform] duration-700 ${
                unlocked ? 'scale-100 blur-0' : 'scale-[0.97] blur-md'
              }`}
            >
              <canvas
                ref={canvasRef}
                className={drawn ? 'h-full w-full' : 'hidden'}
              />
              {!drawn && (
                <span className="break-all text-center font-mono text-sm text-slate-900">
                  {PAYLOAD}
                </span>
              )}
            </div>

            {unlocked && (
              <span
                key={run}
                className="tapblok-sweep pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-white/80 to-transparent"
              />
            )}

            {!unlocked && (
              <button
                type="button"
                onClick={unlock}
                aria-label="Unlock the QR code"
                className="group absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-3 bg-slate-950/75 text-white backdrop-blur-sm focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-emerald-400"
              >
                <Icon
                  svg={lockIcon}
                  className="tapblok-breathe h-10 w-10 text-amber-300 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="text-sm font-medium tracking-wide">Tap to unlock</span>
              </button>
            )}
          </div>

          {unlocked && (
            <Icon
              key={`open-${run}`}
              svg={lockOpenIcon}
              className="tapblok-spring absolute -top-4 -right-3 h-9 w-9 rounded-full bg-emerald-500 p-1.5 text-slate-950 shadow-lg shadow-emerald-500/40"
            />
          )}
        </div>

        <div className="flex h-16 flex-col items-center gap-3">
          {unlocked ? (
            <div key={run} className="tapblok-pop flex flex-col items-center gap-3">
              <p className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Icon svg={scanIcon} className="h-4 w-4" />
                Unlocked — ready to scan
              </p>
              <button
                type="button"
                onClick={() => setUnlocked(false)}
                className="cursor-pointer rounded-full border border-gray-300 px-4 py-1.5 text-xs text-gray-500 transition-colors hover:border-gray-400 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-200"
              >
                Lock again
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400 dark:text-gray-500">Locked</p>
          )}
        </div>
      </main>
    </div>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
