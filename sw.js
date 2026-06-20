/* eslint-disable no-restricted-globals */
/** Cache-safe service worker — network-first for app shell assets. */
const CACHE_VERSION = '1.6.3';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith('toca-groca-') && key !== `toca-groca-${CACHE_VERSION}`)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

function isMutableAsset(url) {
  return /\.(js|css|html|json)$/.test(url.pathname)
    || url.pathname.endsWith('/')
    || url.pathname.endsWith('/index.html')
    || url.pathname.includes('version.json');
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (!isMutableAsset(url)) return;

  if (url.pathname.includes('version.json') || event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});