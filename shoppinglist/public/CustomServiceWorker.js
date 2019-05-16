console.log("Custom Service Worker");
// Imports the workbox CDN and creates a global var called workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

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
    // event.waitUntil(
    //     // Returns a promise that works in the background 
    //     caches.open(CACHE_NAME)
    //         // .then runs after the promise is done. This will recive the result of the privious function. 
    //         // Here we recive the cache from the previous funcion
    //         .then(cache => {
    //             // Here we are adding the files. This also happens in the background.
    //             return cache.addAll(filesToCache);
    //         })
    // );
});



if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);
}
else {
    console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
    `http://localhost:8080/api/shoppingLists/`,
    workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
    /\.(?:js|css|html|png|ico)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'STATIC_FILES',
        plugins:[
            new workbox.expiration.Plugin({
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            })
        ]
    }),
);
workbox.routing.registerRoute(
    `http://localhost:3000/`,
    workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
    `http://localhost:3000/shoppingList/update/:id`,
    workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
    `http://localhost:3000/create`,
    workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
    `https://shoppinglistpwa.herokuapp.com/`,
    workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
    `https://shoppinglistpwa.herokuapp.com/manifest.json`,
    workbox.strategies.cacheFirst()
);
workbox.routing.registerRoute(
    `https://shoppinglistpwa.herokuapp.com/shoppingList/update/:id`,
    workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
    `https://shoppinglistpwa.herokuapp.com/create`,
    workbox.strategies.networkFirst()
);

const queue = new workbox.backgroundSync.Queue('shoppingListQueue');
self.addEventListener('fetch', (event) => {
    // Clone the request to ensure it's save to read when
    // adding to the Queue.
    const promiseChain = fetch(event.request.clone())
    .catch((err) => {
        return queue.pushRequest({request: event.request});
    });
  
    event.waitUntil(promiseChain);
  });




// const bgSyncPlugin = new workbox.backgroundSync.Plugin('shoppingListQueue', {
//     maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
// });
// workbox.routing.registerRoute(
//     `http://localhost:8080/shoppingLists`,
//     workbox.strategies.networkFirst({
//       plugins: [bgSyncPlugin]
//     }),
//     'POST'
//   )




// In order to make the application work offline. A fetch for the cache is needed.
// Here we are using the "cach-first"-strategy
// self.addEventListener('fetch', event => {
//     // Here we find the cache we cached earlier, and then returns it.
//     event.respondWith(caches.match(event.request)
//         .then(cachedResponse => {
//             // If the "cahedResponse" returns null
//             // Fetch the data from the network.
//             return cachedResponse || fetch(event.request);
//         })
//     );
// });
