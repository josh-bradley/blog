var cacheName = 'blog-1-0-16';

var filesToCache = [
    // We add this as well as index.html as the user may hit '/' or '/index.html'
    '/',
    '/index.html',
    '/scripts/app.js',

    // External resources
    'https://fonts.googleapis.com/css?family=Arimo',
    '/lib/moment.min.js'
];

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', function(e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            if (response) {
                return response;
            }

            return fetch(e.request);
        })
    );
});

self.addEventListener("push", function(){
   console.log("got a push notification");
});