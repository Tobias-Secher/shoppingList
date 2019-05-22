import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import * as serviceWorker from './serviceWorkerInit';

ReactDOM.render(<App />, document.getElementById('root'));


// serviceWorker.register();

// Register the service worker
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./CustomServiceWorker.js')
//         .then(registration =>
//             console.log('ServiceWorker registration successful with scope: ', registration.scope)
//         ).catch(err => console.log('ServiceWorker registration failed: ', err));
// }
