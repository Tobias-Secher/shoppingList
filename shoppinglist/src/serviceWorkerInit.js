const vapidPublicKey = 'BMswosYc0RwZTlP6FjfLCAUASMfW2cUrMOCvl4LtQr2r5Q0KbRqti0QwV9QS5hqR367w8eXax31In07OGxi5etI';

export function register() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./CustomServiceWorker.js')
        .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
                subscribeToPush();
            }
        )
        .catch(error => console.log('ServiceWorker registration failed: ', error));
    }
}

function subscribeToPush() {
    navigator.serviceWorker.ready.then(
        function (serviceWorkerRegistration) {
            // Register to push events here
            const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey);
            const options = {
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey
            };
            serviceWorkerRegistration.pushManager.subscribe(options).then(
                function (pushSubscription) {
                    fetch('http://localhost:8080/api/subscribe', {
                        method: 'post',
                        headers: {
                            'Content-type': 'application/json'
                        },
                        body: JSON.stringify(pushSubscription),
                    }).catch(error => console.error(error));
                }, function (error) {
                    console.log(error);
                }
            );
        });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}