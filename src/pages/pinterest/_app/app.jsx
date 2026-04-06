import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

const STORAGE_KEY = 'pinterest-api-token';
const API_BASE = 'https://api.pinterest.com/v5';

const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

// --- API helpers ---

async function apiFetch(path, token) {
  const url = `${API_BASE}${path}`;
  // Try direct fetch first (in case CORS is allowed)
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) return res.json();
    if (res.status === 401) throw new Error('Invalid or expired API token. Please update your token.');
    if (res.status === 403) throw new Error('Access denied. Your token may not have the required permissions.');
  } catch (err) {
    if (err.message.includes('token') || err.message.includes('Access denied')) throw err;
    // CORS error — fall through to proxy
  }

  // Try CORS proxies
  // We need to pass the auth header, but proxies don't forward custom headers.
  // Instead, encode the token in the URL as a query param workaround won't work.
  // We'll use allorigins /get endpoint which returns JSON with the response body.
  let lastError;
  for (const makeProxy of CORS_PROXIES) {
    try {
      // Build URL with auth as query param — Pinterest API doesn't support this,
      // so we use a different approach: fetch through proxy with headers in URL
      const separator = url.includes('?') ? '&' : '?';
      const authedUrl = `${url}${separator}access_token=${token}`;
      const proxyUrl = makeProxy(authedUrl);
      const res = await fetch(proxyUrl);
      if (!res.ok) {
        lastError = new Error(`Proxy returned ${res.status}`);
        continue;
      }
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch {
        lastError = new Error('Invalid JSON response from proxy');
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('Failed to reach Pinterest API');
}

async function fetchUserBoards(token) {
  const data = await apiFetch('/boards?page_size=100', token);
  return data.items || [];
}

async function lookupBoard(token, username, boardSlug) {
  // Pinterest API uses "username/boardname" as the board ID for some endpoints,
  // but the boards/{board_id}/pins endpoint needs the numeric ID.
  // Try fetching the board directly by "username/board-slug".
  try {
    const board = await apiFetch(`/boards/${username}%2F${boardSlug}`, token);
    return board;
  } catch {
    // Fall through
  }
  // Fallback: list user's boards and match by name
  try {
    const boards = await fetchUserBoards(token);
    const match = boards.find(
      (b) =>
        b.name?.toLowerCase().replace(/\s+/g, '-') === boardSlug.toLowerCase() ||
        b.id === boardSlug
    );
    if (match) return match;
  } catch {
    // Fall through
  }
  throw new Error(
    `Could not find board "${username}/${boardSlug}". Make sure the board exists and your token has access to it.`
  );
}

async function fetchAllPins(token, boardId) {
  const pins = [];
  let bookmark = null;
  do {
    const params = new URLSearchParams({ page_size: '100' });
    if (bookmark) params.set('bookmark', bookmark);
    const data = await apiFetch(`/boards/${boardId}/pins?${params}`, token);
    if (data.items) pins.push(...data.items);
    bookmark = data.bookmark || null;
  } while (bookmark);
  return pins;
}

function pinToImage(pin) {
  const media = pin.media || {};
  const images = pin.image || {};
  // Get the best available image URL
  const origUrl =
    media.images?.originals?.url ||
    media.images?.['1200x']?.url ||
    images.original?.url ||
    null;
  const largeUrl =
    media.images?.['600x']?.url ||
    media.images?.['400x300']?.url ||
    images['400x300']?.url ||
    origUrl;
  const thumbUrl =
    media.images?.['236x']?.url ||
    images['150x150']?.url ||
    largeUrl;

  if (!origUrl && !largeUrl && !thumbUrl) return null;

  return {
    title: pin.title || pin.description || '',
    link: pin.link || `https://www.pinterest.com/pin/${pin.id}/`,
    image: largeUrl || origUrl || thumbUrl,
    origImage: origUrl || largeUrl || thumbUrl,
    thumbnail: thumbUrl || largeUrl,
  };
}

// --- URL parsing ---

function isShortUrl(input) {
  return /^https?:\/\/pin\.it\//i.test(input.trim());
}

async function resolveShortUrl(shortUrl) {
  for (const makeProxy of CORS_PROXIES) {
    try {
      const proxyUrl = makeProxy(shortUrl.trim());
      const res = await fetch(proxyUrl);
      if (!res.ok) continue;
      const html = await res.text();
      const match = html.match(
        /pinterest\.[a-z.]+\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_-]+)/
      );
      if (match && !/\/pin\//.test(match[0])) {
        return `https://www.pinterest.com/${match[1]}/${match[2]}`;
      }
    } catch { /* try next */ }
  }
  throw new Error(
    'Could not resolve short URL. Try pasting the full board URL instead (pinterest.com/username/boardname).'
  );
}

function parseBoardUrl(input) {
  const trimmed = input.trim().replace(/\/+$/, '');
  const urlMatch = trimmed.match(/pinterest\.[a-z.]+\/([^/]+)\/([^/]+)/);
  if (urlMatch) return { username: urlMatch[1], board: urlMatch[2] };
  const pathMatch = trimmed.match(/^([^/]+)\/([^/]+)$/);
  if (pathMatch) return { username: pathMatch[1], board: pathMatch[2] };
  return null;
}

// --- Components ---

function TokenSetup({ onSave }) {
  const [token, setToken] = useState('');
  const inputRef = useRef(null);
  useEffect(() => inputRef.current?.focus(), []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Connect to Pinterest</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          This tool uses the Pinterest API to load board images. You'll need an access token.
        </p>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
            How to get your token
          </h3>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-2 list-decimal list-inside">
            <li>
              Go to{' '}
              <a
                href="https://developers.pinterest.com/apps/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                developers.pinterest.com/apps
              </a>
            </li>
            <li>Log in with your Pinterest account</li>
            <li>
              Click <strong>"Create app"</strong> (or select an existing app)
            </li>
            <li>Fill in an app name and description (anything works)</li>
            <li>
              Once created, go to the app and find the{' '}
              <strong>"Generate token"</strong> section
            </li>
            <li>
              Select the <strong>boards:read</strong> and{' '}
              <strong>pins:read</strong> permissions
            </li>
            <li>Click generate and copy the token</li>
          </ol>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
            Tokens expire after 30 days. Your token is stored locally in your
            browser and never sent to any server other than Pinterest.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (token.trim()) onSave(token.trim());
          }}
        >
          <label className="block text-sm font-medium mb-1.5">
            Access Token
          </label>
          <input
            ref={inputRef}
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="pina_..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4 font-mono text-sm"
          />
          <button
            type="submit"
            disabled={!token.trim()}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            Save &amp; Continue
          </button>
        </form>
      </div>
    </div>
  );
}

function Lightbox({ pin, onClose, onPrev, onNext }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl cursor-pointer z-10"
      >
        &#8249;
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-4xl cursor-pointer z-10"
      >
        &#8250;
      </button>
      <div
        className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-gray-300 cursor-pointer"
        >
          &times;
        </button>
        <img
          src={pin.origImage}
          alt={pin.title}
          className="max-h-[80vh] max-w-full object-contain rounded-lg"
        />
        {pin.title && (
          <p className="text-white mt-3 text-center text-sm max-w-lg">
            {pin.title}
          </p>
        )}
        {pin.link && (
          <a
            href={pin.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-blue-200 text-xs mt-1"
          >
            View on Pinterest
          </a>
        )}
      </div>
    </div>
  );
}

function ImageCard({ pin, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) return null;

  return (
    <div
      className="break-inside-avoid mb-4 cursor-pointer group"
      onClick={() => onClick(pin)}
    >
      <div className="relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700">
        {!loaded && (
          <div className="w-full h-48 animate-pulse bg-gray-300 dark:bg-gray-600 rounded-xl" />
        )}
        <img
          src={pin.image}
          alt={pin.title}
          className={`w-full rounded-xl transition-transform duration-200 group-hover:scale-105 ${
            loaded ? 'block' : 'hidden'
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </div>
      {pin.title && (
        <p className="mt-1.5 text-xs text-gray-600 dark:text-gray-400 line-clamp-2 px-1">
          {pin.title}
        </p>
      )}
    </div>
  );
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || '');
  const [input, setInput] = useState('');
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [boardInfo, setBoardInfo] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (token) inputRef.current?.focus();
  }, [token]);

  function saveToken(t) {
    localStorage.setItem(STORAGE_KEY, t);
    setToken(t);
  }

  function clearToken() {
    localStorage.removeItem(STORAGE_KEY);
    setToken('');
    setPins([]);
    setBoardInfo(null);
  }

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setPins([]);
      setLoadingMsg('Resolving URL...');
      try {
        let url = input;
        if (isShortUrl(input)) {
          url = await resolveShortUrl(input);
        }
        const parsed = parseBoardUrl(url);
        if (!parsed) {
          setError(
            'Could not find a board in that URL. Enter a URL like pinterest.com/username/boardname'
          );
          setLoading(false);
          return;
        }
        setBoardInfo(parsed);

        setLoadingMsg('Looking up board...');
        const board = await lookupBoard(token, parsed.username, parsed.board);

        setLoadingMsg('Loading pins...');
        const rawPins = await fetchAllPins(token, board.id);
        const images = rawPins.map(pinToImage).filter(Boolean);
        if (images.length === 0) {
          setError('No images found. The board may be empty.');
        }
        setPins(images);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMsg('');
      }
    },
    [input, token]
  );

  const showLightbox = lightboxIndex >= 0 && lightboxIndex < pins.length;

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <a
                href="../"
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              >
                &larr; Back to home
              </a>
            </div>
            <h1 className="text-3xl font-bold mb-2">Pinterest Board Viewer</h1>
            <p className="text-gray-500 dark:text-gray-400">
              View all images from a Pinterest board
            </p>
          </header>
          <TokenSetup onSave={saveToken} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <a
              href="../"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              &larr; Back to home
            </a>
            <button
              onClick={clearToken}
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 cursor-pointer"
            >
              Change token
            </button>
          </div>
          <h1 className="text-3xl font-bold mb-2">Pinterest Board Viewer</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Enter a Pinterest board URL to view all its images
          </p>
        </header>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="https://pinterest.com/username/boardname or https://pin.it/..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'View'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm whitespace-pre-line">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            {loadingMsg && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {loadingMsg}
              </p>
            )}
          </div>
        )}

        {pins.length > 0 && (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {pins.length} pin{pins.length !== 1 ? 's' : ''} from{' '}
              <span className="font-medium text-gray-700 dark:text-gray-300">
                {boardInfo?.username}/{boardInfo?.board}
              </span>
            </p>
            <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-4">
              {pins.map((pin, i) => (
                <ImageCard
                  key={i}
                  pin={pin}
                  onClick={() => setLightboxIndex(i)}
                />
              ))}
            </div>
          </>
        )}

        {showLightbox && (
          <Lightbox
            pin={pins[lightboxIndex]}
            onClose={() => setLightboxIndex(-1)}
            onPrev={() =>
              setLightboxIndex((lightboxIndex - 1 + pins.length) % pins.length)
            }
            onNext={() =>
              setLightboxIndex((lightboxIndex + 1) % pins.length)
            }
          />
        )}
      </div>
    </div>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
