console.log("Custom Service Worker");

self.addEventListener('install', event => {
    console.log('The service worker is being installed.');
});

self.addEventListener('fetch', event => {
    console.log(`fetch request ${event.request.url}`);
    return fetch(event.request);
});