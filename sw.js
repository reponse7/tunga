const CACHE_NAME = 'tunga-cache-v4';
const urlsToCache = [
    './',
    './index.html',
    './css/styles.css',
    './js/app.js',
    './js/store.js',
    './js/router.js',
    './js/components.js',
    './js/screens/Splash.js',
    './js/screens/Auth.js',
    './js/screens/ScriptureLoading.js',
    './js/screens/Onboarding.js',
    './js/screens/Dashboard.js',
    './js/screens/POS.js',
    './js/screens/Stock.js',
    './js/screens/Expenses.js',
    './js/screens/Finance.js',
    './js/screens/Settings.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
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
