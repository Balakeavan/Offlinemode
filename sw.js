const CACHE_NAME = 'offline-cache-v1';
const ASSETS = [
    '/',
    '/index.html',
    './assets/index-tPPQlsHe.css',
    './assets/index-BHK8DZrL.js',
    '/Soldier.glb',
    '/hall.env' // Add all required files
];

// 🔧 Install Event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
    self.skipWaiting();
});

// ♻️ Activate Event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(c => c !== CACHE_NAME).map(c => caches.delete(c))
            );
        })
    );
    self.clients.claim();
});

// 🌐 Fetch Event
self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url); // Add this line
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }
                console.log('Fetching from network:', event.request.url);
                return fetch(event.request);
            })
            .catch(() => {
                console.log('Fetch failed. Possibly offline.');
            })
    );
});

