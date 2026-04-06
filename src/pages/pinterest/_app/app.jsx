import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

function isShortUrl(input) {
  return /^https?:\/\/pin\.it\//i.test(input.trim());
}

async function resolveShortUrl(shortUrl) {
  // Fetch the short URL through the CORS proxy — allorigins follows redirects
  // and returns the final page, whose URL we can extract from the content.
  const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(shortUrl.trim())}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error('Failed to resolve short URL.');
  }
  const data = await response.json();
  // allorigins /get returns { contents, status: { url } } where url is the final URL
  const finalUrl = data.status?.url || '';
  if (finalUrl && /pinterest\.[a-z.]+/.test(finalUrl)) {
    return finalUrl;
  }
  // Fallback: try to find a canonical or og:url in the returned HTML
  const ogMatch = data.contents?.match(/property="og:url"\s+content="([^"]+)"/);
  if (ogMatch) return ogMatch[1];
  const canonMatch = data.contents?.match(/rel="canonical"\s+href="([^"]+)"/);
  if (canonMatch) return canonMatch[1];
  throw new Error('Could not resolve short URL to a Pinterest board.');
}

function parseBoardUrl(input) {
  const trimmed = input.trim().replace(/\/+$/, '');
  // Match pinterest.com/username/boardname or pinterest.co.uk/username/boardname etc.
  const urlMatch = trimmed.match(
    /pinterest\.[a-z.]+\/([^/]+)\/([^/]+)/
  );
  if (urlMatch) {
    return { username: urlMatch[1], board: urlMatch[2] };
  }
  // Match "username/boardname" directly
  const pathMatch = trimmed.match(/^([^/]+)\/([^/]+)$/);
  if (pathMatch) {
    return { username: pathMatch[1], board: pathMatch[2] };
  }
  return null;
}

function parseRssXml(xmlText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  const items = doc.querySelectorAll('item');
  const pins = [];
  for (const item of items) {
    const title = item.querySelector('title')?.textContent || '';
    const link = item.querySelector('link')?.textContent || '';
    const description = item.querySelector('description')?.textContent || '';
    // Extract image URL from description HTML
    const imgMatch = description.match(/src="([^"]+)"/);
    const image = imgMatch ? imgMatch[1] : null;
    // Pinterest RSS images use /236x/ for thumbnails, upgrade to /736x/ for larger
    const largeImage = image?.replace('/236x/', '/736x/') || null;
    const origImage = image?.replace('/236x/', '/originals/') || null;
    if (image) {
      pins.push({ title, link, image: largeImage, origImage, thumbnail: image });
    }
  }
  return pins;
}

async function fetchBoard(username, board) {
  const rssUrl = `https://www.pinterest.com/${username}/${board}.rss`;
  // Use allorigins as a CORS proxy
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch board (${response.status}). Make sure the board is public.`);
  }
  const text = await response.text();
  if (text.includes('<html') || !text.includes('<rss')) {
    throw new Error('Could not load RSS feed. The board may be private or the URL may be incorrect.');
  }
  return parseRssXml(text);
}

function Lightbox({ pin, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
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
          <p className="text-white mt-3 text-center text-sm max-w-lg">{pin.title}</p>
        )}
        <a
          href={pin.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-300 hover:text-blue-200 text-xs mt-1"
        >
          View on Pinterest
        </a>
      </div>
    </div>
  );
}

function ImageCard({ pin, onClick }) {
  const [loaded, setLoaded] = useState(false);

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
  const [input, setInput] = useState('');
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lightboxPin, setLightboxPin] = useState(null);
  const [boardInfo, setBoardInfo] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setLoading(true);
      setError(null);
      setPins([]);
      try {
        // Resolve pin.it short URLs first
        let url = input;
        if (isShortUrl(input)) {
          url = await resolveShortUrl(input);
        }
        const parsed = parseBoardUrl(url);
        if (!parsed) {
          setError('Please enter a valid Pinterest board URL (e.g. pinterest.com/username/boardname or pin.it/...)');
          setLoading(false);
          return;
        }
        setBoardInfo(parsed);
        const results = await fetchBoard(parsed.username, parsed.board);
        if (results.length === 0) {
          setError('No images found. The board may be empty or private.');
        }
        setPins(results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [input]
  );

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
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
                <ImageCard key={i} pin={pin} onClick={setLightboxPin} />
              ))}
            </div>
          </>
        )}

        {lightboxPin && (
          <Lightbox pin={lightboxPin} onClose={() => setLightboxPin(null)} />
        )}
      </div>
    </div>
  );
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
