const CACHE_NAME = 'offline-cache-v1';
const ASSETS = [
    '/',
    '/app.js',
    '/index.html',
    './assets/index-BHK8DZrL.css',
    './assets/index-tPPQlsHe.js',
    '/Soldier.glb',
    '/hall.env' // Add all required files
];

// 🔧 Install Service Worker
self.addEventListener('install', event => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[SW] Caching app shell');
                return cache.addAll(ASSETS);
            })
    );
    self.skipWaiting(); // Force waiting SW to become active
});

// ♻️ Activate Service Worker
self.addEventListener('activate', event => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim(); // Immediately control pages
});

// 🌐 Fetch handler with fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            });
        })
    );
});