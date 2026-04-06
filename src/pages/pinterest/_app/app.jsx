import React, { useState, useCallback, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './app.css';

const CORS_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
];

async function fetchViaProxy(url) {
  let lastError;
  for (const makeProxy of CORS_PROXIES) {
    const proxyUrl = makeProxy(url);
    try {
      const response = await fetch(proxyUrl);
      if (response.ok) {
        return await response.text();
      }
      lastError = new Error(`Proxy returned ${response.status}`);
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('All proxies failed');
}

function isShortUrl(input) {
  return /^https?:\/\/pin\.it\//i.test(input.trim());
}

async function resolveShortUrl(shortUrl) {
  // Try the JSON endpoint first (returns { contents, status: { url } })
  for (const makeProxy of CORS_PROXIES) {
    try {
      // Use the allorigins JSON endpoint to get redirect info
      const jsonUrl = makeProxy(shortUrl).replace('/raw?', '/get?');
      const response = await fetch(jsonUrl);
      if (!response.ok) continue;
      const data = await response.json();
      const finalUrl = data.status?.url || '';
      if (/pinterest\.[a-z.]+/.test(finalUrl)) return finalUrl;
      // Search the HTML content for Pinterest URLs
      const found = extractPinterestUrl(data.contents || '');
      if (found) return found;
    } catch { /* try next proxy */ }
  }
  // Fallback: fetch the HTML directly and search for pinterest URLs
  try {
    const html = await fetchViaProxy(shortUrl);
    const found = extractPinterestUrl(html);
    if (found) return found;
  } catch { /* fall through */ }
  throw new Error('Could not resolve short URL. Try pasting the full Pinterest board URL instead.');
}

function extractPinterestUrl(html) {
  // Look for og:url, canonical, or any pinterest board URL in the HTML
  const patterns = [
    /property="og:url"\s+content="([^"]*pinterest\.[^"]+)"/,
    /content="([^"]*pinterest\.[^"]+)"\s+property="og:url"/,
    /rel="canonical"\s+href="([^"]*pinterest\.[^"]+)"/,
    /href="([^"]*pinterest\.[^"]+)"\s+rel="canonical"/,
    /"board":\{[^}]*"url":"(\/[^"]+)"/,
    /https?:\/\/(?:www\.)?pinterest\.[a-z.]+\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/?/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const url = match[1] || match[0];
      // Make sure it looks like a board URL (user/board), not a pin URL
      if (/\/pin\//.test(url)) continue;
      return url.startsWith('http') ? url : `https://www.pinterest.com${url}`;
    }
  }
  return null;
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
    const imgMatch = description.match(/src="([^"]+)"/);
    const image = imgMatch ? imgMatch[1] : null;
    const largeImage = image?.replace('/236x/', '/736x/') || null;
    const origImage = image?.replace('/236x/', '/originals/') || null;
    if (image) {
      pins.push({ title, link, image: largeImage, origImage, thumbnail: image });
    }
  }
  return pins;
}

function parseBoardHtml(html) {
  const pins = [];
  // Pinterest embeds pin data as JSON in script tags
  // Look for __PWS_DATA__ or initial Redux state or Next.js data
  const dataPatterns = [
    /window\.__PWS_DATA__\s*=\s*(\{.+?\});\s*<\/script/s,
    /<script[^>]*id="__PWS_DATA__"[^>]*>(\{.+?\})<\/script/s,
    /<script[^>]*>window\.__NEXT_DATA__\s*=\s*(\{.+?\})<\/script/s,
  ];

  for (const pattern of dataPatterns) {
    const match = html.match(pattern);
    if (match) {
      try {
        const data = JSON.parse(match[1]);
        const extracted = extractPinsFromData(data);
        if (extracted.length > 0) return extracted;
      } catch { /* try next pattern */ }
    }
  }

  // Fallback: extract image URLs directly from the HTML
  const imgRegex = /https:\/\/i\.pinimg\.com\/[^\s"']+/g;
  const seen = new Set();
  let imgMatch;
  while ((imgMatch = imgRegex.exec(html)) !== null) {
    let url = imgMatch[0];
    // Normalize to 736x size and deduplicate
    const normalized = url.replace(/\/\d+x\d*\//, '/736x/').replace(/\/originals\//, '/736x/');
    if (seen.has(normalized)) continue;
    seen.add(normalized);
    // Skip tiny thumbnails and non-pin images (avatars, etc.)
    if (/\/30x30\/|\/50x50\/|\/75x75\/|user_|avatar/i.test(url)) continue;
    const origUrl = normalized.replace('/736x/', '/originals/');
    pins.push({
      title: '',
      link: '',
      image: normalized,
      origImage: origUrl,
      thumbnail: normalized.replace('/736x/', '/236x/'),
    });
  }
  return pins;
}

function extractPinsFromData(data, depth = 0) {
  if (depth > 10) return [];
  const pins = [];

  if (Array.isArray(data)) {
    for (const item of data) {
      pins.push(...extractPinsFromData(item, depth + 1));
    }
    return pins;
  }
  if (data && typeof data === 'object') {
    // Look for pin-like objects with images
    if (data.images && data.images.orig) {
      pins.push({
        title: data.description || data.title || data.grid_title || '',
        link: data.link || (data.id ? `https://www.pinterest.com/pin/${data.id}/` : ''),
        image: data.images['736x']?.url || data.images.orig.url,
        origImage: data.images.orig.url,
        thumbnail: data.images['236x']?.url || data.images.orig.url,
      });
      return pins;
    }
    // Recurse into object values
    for (const value of Object.values(data)) {
      if (value && typeof value === 'object') {
        pins.push(...extractPinsFromData(value, depth + 1));
      }
    }
  }
  return pins;
}

async function fetchBoard(username, board) {
  const errors = [];

  // Strategy 1: Try RSS feed
  const rssUrl = `https://www.pinterest.com/${username}/${board}.rss`;
  try {
    const text = await fetchViaProxy(rssUrl);
    if (text.includes('<rss') || text.includes('<channel')) {
      const pins = parseRssXml(text);
      if (pins.length > 0) return pins;
    }
  } catch (err) {
    errors.push(`RSS: ${err.message}`);
  }

  // Strategy 2: Scrape the board HTML page
  const boardUrl = `https://www.pinterest.com/${username}/${board}/`;
  try {
    const html = await fetchViaProxy(boardUrl);
    const pins = parseBoardHtml(html);
    if (pins.length > 0) return pins;
    errors.push('HTML: No images found in page');
  } catch (err) {
    errors.push(`HTML: ${err.message}`);
  }

  throw new Error(
    `Could not load board. Make sure it's public and the URL is correct.\n(${errors.join('; ')})`
  );
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
        let url = input;
        if (isShortUrl(input)) {
          url = await resolveShortUrl(input);
        }
        const parsed = parseBoardUrl(url);
        if (!parsed) {
          setError(
            'Could not find a board in that URL. Please enter a Pinterest board URL like pinterest.com/username/boardname'
          );
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
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm whitespace-pre-line">
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
