var cacheName = 'weatherPWA-step-6-1';
var filesToCache = [
  '/first-pwa/',
  '/first-pwa/index.html',
  '/first-pwa/scripts/app.js',
  '/first-pwa/styles/inline.css',
  '/first-pwa/images/clear.png',
  '/first-pwa/images/cloudy-scattered-showers.png',
  '/first-pwa/images/cloudy.png',
  '/first-pwa/images/fog.png',
  '/first-pwa/images/ic_add_white_24px.svg',
  '/first-pwa/images/ic_refresh_white_24px.svg',
  '/first-pwa/images/partly-cloudy.png',
  '/first-pwa/images/rain.png',
  '/first-pwa/images/scattered-showers.png',
  '/first-pwa/images/sleet.png',
  '/first-pwa/images/snow.png',
  '/first-pwa/images/thunderstorm.png',
  '/first-pwa/images/wind.png'
];

var dataCacheName = 'weatherData-v1';

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName && key !== dataCacheName) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(e) {
  console.log('[ServiceWorker] Fetch', e.request.url);
  var dataUrl = 'https://publicdata-weather.firebaseio.com/';
  if (e.request.url.indexOf(dataUrl) === 0) {
    e.respondWith(
      fetch(e.request)
        .then(function(response) {
          return caches.open(dataCacheName).then(function(cache) {
            cache.put(e.request.url, response.clone());
            console.log('[ServiceWorker] Fetched&Cached Data');
            return response;
          });
        })
    );
  } else {
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
  }
});
