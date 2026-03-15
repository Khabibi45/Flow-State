const CACHE_NAME = 'flowstate-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/landing.html',
  '/css/style.css',
  '/css/gamification.css',
  '/css/landing.css',
  '/js/app.js',
  '/js/modules/storage.js',
  '/js/modules/timer.js',
  '/js/modules/ambient.js',
  '/js/modules/gamification.js',
  '/js/modules/notifications.js',
];

// Install - cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => caches.match(e.request))
  );
});
