/* Zee 的下班接送站 — offline service worker
   Cache-first for the app shell, refreshed quietly in the background
   so a newer version shows up on the next launch. */
const VERSION = 'zee-pickup-v1.3.0';
const ASSETS = [
  './',
  './index.html',
  './link.js',
  './extras.js',
  './alex.html',
  './alex.webmanifest',
  './manifest.webmanifest',
  './favicon.svg',
  './apple-touch-icon.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(VERSION)
      .then((cache) => cache.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function refresh(request, key) {
  return fetch(request).then((res) => {
    if (res && res.ok && res.type === 'basic') {
      const copy = res.clone();
      caches.open(VERSION).then((c) => c.put(key || request, copy));
    }
    return res;
  });
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // the app never calls other sites

  if (req.mode === 'navigate') {
    // Only the two pages are served from the cache; any other navigation goes to the network untouched.
    const isAlex = /\/alex\.html$/.test(url.pathname);
    const isApp = /\/(index\.html)?$/.test(url.pathname);
    if (!isAlex && !isApp) return;
    const page = isAlex ? './alex.html' : './index.html';
    event.respondWith(
      caches.match(page).then((cached) => {
        const net = refresh(req, page).catch(() => null);
        if (cached) { event.waitUntil(net); return cached; }
        return net.then((r) => r || caches.match(page));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cached) => {
      const net = refresh(req).catch(() => null);
      if (cached) { event.waitUntil(net); return cached; }
      return net.then((r) => r || new Response('', { status: 504, statusText: 'offline' }));
    })
  );
});
