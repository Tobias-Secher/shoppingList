console.log("Custom Service Worker");
// Imports the workbox CDN and creates a global var called workbox
importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

// self.addEventListener('install', event => {
//     console.log('The service worker is being installed.');
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
// });


self.addEventListener('push', function (event) {
    const data = event.data.json();
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.msg,
            vibrate: [500, 100, 500]
        })
    );
});

workbox.routing.registerRoute(
    /\.(?:js|css|html|png|ico)$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'STATIC_FILES',
        plugins: [
            new workbox.expiration.Plugin({
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            })
        ]
    }),
);

workbox.routing.registerRoute(
    'http://localhost:8080/',
    new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
    'http://localhost:8080/shoppingList/update/:id/',
    new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
    'http://localhost:8080/create',
    new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
    'http://localhost:3000/',
    new workbox.strategies.CacheFirst()
);
workbox.routing.registerRoute(
    'http://localhost:3000/shoppingList/update/:id/',
    new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
    'http://localhost:3000/create/',
    new workbox.strategies.CacheFirst()
);

// // Heroku
// workbox.routing.registerRoute(
//     'https://shoppinglistpwa.herokuapp.com/',
//     new workbox.strategies.CacheFirst()
// );
// workbox.routing.registerRoute(
//     'https://shoppinglistpwa.herokuapp.com/shoppingList/update/:id/',
//     new workbox.strategies.CacheFirst()
// );
// workbox.routing.registerRoute(
//     'https://shoppinglistpwa.herokuapp.com/create',
//     new workbox.strategies.CacheFirst()
// );

const queue = new workbox.backgroundSync.Queue('bgReqQueue');

self.addEventListener('fetch', (event) => {
    // Clone the request to ensure it's save to read when
    // adding to the Queue.
    const promiseChain = fetch(event.request.clone())
        .catch((err) => {
            return queue.pushRequest({request: event.request});
        });
    event.waitUntil(promiseChain);
});


// push message fetch
// let data = {
//     "text": "Din nye liste er blevet synkroniseret med skyen!",
//     "title": "Synkroniseret!"
// };
// fetch('http://localhost:8080/api/push_message/', {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: {
//         'Accept': 'application/json',
//         "Content-type": "application/json; charset=UTF-8"
//     }
// });


// workbox.routing.registerRoute(
//     'http://localhost:8080/api/shoppingLists/',
//     new workbox.strategies.NetworkOnly({
//         plugins: [bgSyncPlugin]
//     }),
//     'POST'
// );
// workbox.routing.registerRoute(
//     'http://localhost:8080/api/shoppingLists/:id/',
//     new workbox.strategies.NetworkOnly({
//         plugins: [bgSyncPlugin]
//     }),
//     'DELETE'
// );



// const queue = new workbox.backgroundSync.Queue('shoppingListQueue');
// self.addEventListener('fetch', (event) => {
//     // Clone the request to ensure it's save to read when
//     // adding to the Queue.
//     const promiseChain = fetch(event.request.clone())
//     .catch((err) => {
//         return queue.pushRequest({request: event.request});
//     });

//     event.waitUntil(promiseChain);
//   });




// const bgSyncPlugin = new workbox.backgroundSync.Plugin('shoppingListQueue', {
//     maxRetentionTime: 24 * 60 // Retry for max of 24 Hours
// });
// workbox.routing.registerRoute(
//     'http://localhost:8080/shoppingLists',
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
