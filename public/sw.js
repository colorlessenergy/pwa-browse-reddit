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
  'main.js',
  'fetch-reddit-api.js',
  'https://www.reddit.com/r/leagueoflegends.json'
];

var staticCacheName = 'pages-cache-v3';

self.addEventListener('install', event => {
  console.log('attempting to install service worker and cache static assets');

  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        console.log('reached here')
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        console.log('Network request for ', event.request.url);
        return fetch(event.request)
          .then(response => {
            // TODO 5 - Respond with custom 404 page
            return caches.open(staticCacheName).then(cache => {
              cache.put(event.request.url, response.clone());
              return response;
            });
          });

      }).catch(error => {
        console.log(error);
        // TODO 6 - Respond with custom offline page

      })
  );
});

self.addEventListener('activate', event => {
  console.log('Activating new service worker...');

  const cacheWhitelist = [staticCacheName];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});