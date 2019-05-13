// give an array of files that needs to be
// cached initially

// don't need to add public because the
// the sw file is in the same directory
const filesToCache = [
  '/',
  'index.html',
  'css/main.css',
  'css/module.css',
  'css/reset.css',
  'fetch.js',
  'main.js',
  'fetch-reddit-api.js',
  'https://www.reddit.com/r/all.json',
];

var staticCacheName = 'pages-cache-v7';

self.addEventListener('install', event => {
  console.log('attempting to install service worker and cache static assets');

  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
      })
  );
});

// for JSON files retrieve network first then cache.

// all other files retrieve from cache first then network

self.addEventListener('fetch', function (evt) {
  console.log('Fetch event for ', evt.request.url);
  if (evt.request.url.includes('json')) {
    console.log('[Service Worker] Fetch (data)', evt.request.url);
    evt.respondWith(
        caches.open(staticCacheName).then((cache) => {
          return fetch(evt.request)
              .then((response) => {
                cache.put(evt.request.url, response.clone());
                return response;
              }).catch((err) => {
                // Network request failed, try to get it from the cache.
                return cache.match(evt.request);
              });
        }));
    return;
  }

  evt.respondWith(
      caches.open(staticCacheName).then((cache) => {
        return cache.match(evt.request)
            .then((response) => {
              return response || fetch(evt.request);
            });
      })
  );
});

self.addEventListener('activate', function (evt) {
  console.log('Activating new service worker...');

  evt.waitUntil(
    self.clients.claim(),
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== staticCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
});