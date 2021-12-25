if ('serviceWorker' in navigator) {
    navigator.serviceWorker
            .register('swCachedSite.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log(err));
}
else console.log("Browser doesn't support offline mode");
