self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('v1').then(cache => {
            return cache.addAll([
                '/hellow_pwa/',
                '/hellow_pwa/index.html',
                '/hellow_pwa/styles.css',
                '/hellow_pwa/main.js',
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(caches.match(event.request)
                      .then(response => response || fetch(event.request)));
});
