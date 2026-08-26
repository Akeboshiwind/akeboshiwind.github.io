import { createRoot } from 'react-dom/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ThemeToggle } from '../../../components/ThemeToggle.jsx';
import { TRACK_SECONDS, embedOrigin, formatOffset, trackFor } from './tracks.js';
import { canSeek, errorMessage, loadYouTubeApi } from './player.js';

const PLAYING = 1;
const PAUSED = 2;
const ENDED = 0;

// How far the video may drift from the wall clock before we nudge it back.
// Tight enough that the mix stays on the hour, loose enough that a seek
// isn't audible every few seconds.
const DRIFT_TOLERANCE = 2;

export function App({ historyUrl }) {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const loadedIdRef = useRef(null);
  const wantsPlayRef = useRef(false);

  const [status, setStatus] = useState('loading');
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [now, setNow] = useState(() => new Date());

  const track = trackFor(now);

  // Line the player up with the wall clock. A player that has never started
  // ignores seekTo, and a new hour needs a different video either way, so
  // both of those go through loadVideoById — which starts playback itself.
  const syncToClock = useCallback(({ play = false } = {}) => {
    const player = playerRef.current;
    if (!player) return;
    const target = trackFor(new Date());
    const state = player.getPlayerState?.() ?? -1;

    if (loadedIdRef.current === target.videoId && canSeek(state)) {
      player.seekTo(target.offset, true);
      if (play) player.playVideo();
      return;
    }
    loadedIdRef.current = target.videoId;
    player.loadVideoById({ videoId: target.videoId, startSeconds: target.offset });
  }, []);

  useEffect(() => {
    let player = null;
    let cancelled = false;

    loadYouTubeApi().then(
      (YT) => {
        if (cancelled || !hostRef.current) return;
        // YT replaces this node with its iframe, so it is created outside of
        // React's tree — React never tries to reconcile a node YouTube owns.
        const host = document.createElement('div');
        hostRef.current.appendChild(host);

        const initial = trackFor(new Date());
        loadedIdRef.current = initial.videoId;

        player = new YT.Player(host, {
          width: '100%',
          height: '100%',
          videoId: initial.videoId,
          playerVars: {
            playsinline: 1,
            rel: 0,
            // A non-http(s) origin makes the embed fail with error 153.
            origin: embedOrigin(window.location.origin),
          },
          events: {
            onReady: () => {
              if (cancelled) return;
              playerRef.current = player;
              setStatus('ready');
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const state = event.data;
              setPlaying(state === PLAYING);
              if (state === PAUSED) wantsPlayRef.current = false;
              if (state === ENDED && wantsPlayRef.current) syncToClock({ play: true });
            },
            onError: (event) => {
              if (cancelled) return;
              setError(errorMessage(event.data));
            },
          },
        });
      },
      (e) => {
        if (!cancelled) {
          setStatus('error');
          setError(e.message);
        }
      },
    );

    return () => {
      cancelled = true;
      playerRef.current = null;
      player?.destroy?.();
    };
  }, [syncToClock]);

  // One ticker drives both the readout and drift correction. Correction is
  // gated on the player actually playing — otherwise a paused player would
  // get reseeked every second.
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());

      const player = playerRef.current;
      if (!player?.getPlayerState) return;
      if (player.getPlayerState() !== PLAYING) return;

      const target = trackFor(new Date());
      if (loadedIdRef.current !== target.videoId) {
        loadedIdRef.current = target.videoId;
        player.loadVideoById({ videoId: target.videoId, startSeconds: target.offset });
        return;
      }
      if (Math.abs(player.getCurrentTime() - target.offset) > DRIFT_TOLERANCE) {
        player.seekTo(target.offset, true);
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const toggle = () => {
    const player = playerRef.current;
    if (!player) return;
    setError(null);
    if (playing) {
      wantsPlayRef.current = false;
      player.pauseVideo();
      return;
    }
    wantsPlayRef.current = true;
    syncToClock({ play: true });
  };

  const clock = now.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

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

      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
        <header className="flex flex-col gap-1">
          <h1 className="text-xl font-semibold">Animal Crossing Hourly</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Scruffy's hour-long <em>Taking Root</em> mixes, played at the point
            your clock is at.
          </p>
        </header>

        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black">
          <div ref={hostRef} className="absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full" />
          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
              Loading the player…
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={status !== 'ready'}
          aria-label={playing ? 'Pause' : `Play ${track.label} in sync`}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 active:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <Icon playing={playing} />
          {playing ? 'Pause' : `Play ${track.label}`}
        </button>

        <dl className="grid grid-cols-3 gap-3 text-center text-sm">
          <Stat label="Local time" value={clock} />
          <Stat label="Hour" value={track.label} />
          <Stat
            label="Position"
            value={`${formatOffset(track.offset)} / ${formatOffset(TRACK_SECONDS)}`}
          />
        </dl>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {playing
            ? 'Playing in sync — the video is nudged back whenever it drifts, and rolls over to the next hour on its own.'
            : 'Paused. Hitting play jumps back to wherever the clock has got to.'}
        </p>

        {error && (
          <div className="rounded-lg p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg py-2 px-1 bg-gray-100 dark:bg-gray-800">
      <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
      <dd className="font-mono tabular-nums">{value}</dd>
    </div>
  );
}

function Icon({ playing }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {playing ? (
        <path d="M7 4h4v16H7zM13 4h4v16h-4z" />
      ) : (
        <path d="M6 4l14 8-14 8z" />
      )}
    </svg>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App historyUrl={mount.dataset.historyUrl} />);
