const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
    '/',
    '/icons/72.svg',
    '/icons/96.svg',
    '/icons/128.svg',
    '/icons/144.svg',
    '/icons/152.svg',
    '/icons/192.svg',
    '/icons/385.svg',
    '/icons/512.svg'
  ];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});