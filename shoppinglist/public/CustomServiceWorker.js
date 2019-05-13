console.log("Custom Service Worker");

// importScripts('serviceworker-cache-polyfill.js');

const CACHE_VERSION = 1
const CACHE_NAME = `PWA_CACHE_${CACHE_VERSION}`;
const filesToCache = [
    '/',
    '../src/app.scss',
    '../src/app.js',
    '../src/index.css',
    '../src/index.js',
    '../shoppingList.js',
    '../shoppingListForm.js',
    '../shoppingListFormUpdate.js',
    './index.html',
    './CustomServiceWorker.js',
    './manifest.json',
    './favicon.ico',
    '../static/js/bundle.js',
    '../static/js/0.chunk.js',
    '../static/js/1.chunk.js',
    '../static/js/main.chunk.js',
    '../main.6bdba2c05771f28f1976.hot-update.js',
]
self.addEventListener('install', event => {
    console.log('The service worker is being installed.');
    // When you call the "caches.open", it starts working in the background immediately. Unless we do somethig to prevent that.
    // This means that the install event would return before the cache is ready.
    // This is fixed by wrapping the event.waitUntil. This waits until the last promise is done, before returning the event.
    event.waitUntil(
        // Returns a promise that works in the background 
        caches.open(CACHE_NAME)
            // .then runs after the promise is done. This will recive the result of the privious function. 
            // Here we recive the cache from the previous funcion
            .then(cache => {
                // Here we are adding the files. This also happens in the background.
                return cache.addAll(filesToCache);
            })
    );
});

// In order to make the application work offline. A fetch for the cache is needed.
// Here we are using the "cach-first"-strategy
self.addEventListener('fetch', event => {
    // Here we find the cache we cached earlier, and then returns it.
    event.respondWith(caches.match(event.request)
        .then(cachedResponse => {
            // If the "cahedResponse" returns null
            // Fetch the data from the network.
            return cachedResponse || fetch(event.request);
        })
    );
});

// Installable
// let deferredPrompt;
// window.addEventListener('beforeinstallpromt', (e) =>{
//     // Prevent chrome 67 and earlier form automatically
//     // showing the promt
//     e.preventDefault();
//     // Stash the event so it can be triggered later
//     deferredPrompt = e;

//     // Update the ui nofity the user they can 
//     // add to home screen
//     btnAdd.style.display;
// })