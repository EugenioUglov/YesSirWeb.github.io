const cacheName = 'site-store';

self.addEventListener('install', function(e) {

});

self.addEventListener('activate', function(e) {
    // console.log('Service worker is activated');

    // Remove unwanted caches.
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        // console.log('Service working clearing old cache ' + cache);
                        return caches.delete(cache);
                    }
                })
            )
        })
    );
});

// Call fetch event
self.addEventListener('fetch', e => {
    // console.log('Service Worker: Fetching');
    e.respondWith(
        fetch(e.request).then(res => {
            // Make copy / clone of responce.
            const resClone = res.clone();
            // Open cache.
            caches.open(cacheName)
            .then(cache => {
                // Add responce to the cache.
                cache.put(e.request, resClone);  
            });
            return res;
        })
        .catch(err => caches.match(e.request).then(res => res))
    )
})