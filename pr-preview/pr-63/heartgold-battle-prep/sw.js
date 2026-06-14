// Service worker for the HeartGold Battle Prep PWA.
// Network-first for the page itself (so content updates show up immediately),
// cache-first for static assets, with an offline fallback to the cached shell.
const CACHE = 'hg-battle-prep-v2';
const ROOT = '/heartgold-battle-prep/';
const ASSETS = [
  ROOT,
  ROOT + 'manifest.webmanifest',
  ROOT + 'icon.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function cacheSameOrigin(request, response) {
  if (response.ok && new URL(request.url).origin === self.location.origin) {
    const copy = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, copy));
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Navigations: network-first so an updated page is served as soon as we're
  // online, falling back to the cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => cacheSameOrigin(request, response))
        .catch(() => caches.match(request).then((cached) => cached || caches.match(ROOT)))
    );
    return;
  }

  // Everything else (manifest, icons, fonts): cache-first.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => cacheSameOrigin(request, response))
        .catch(() => cached);
    })
  );
});
