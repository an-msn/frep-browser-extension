// import * as nsfwjs from 'nsfwjs';
// import Store from './utils/store';

import ImageFiltering from './utils/imagefiltering';

new ImageFiltering();

// nsfwjs
//     .load('./assets/model/', {
//         // @ts-ignore
//         type: 'graph',
//     })
//     .then((model) => {
//         const store = new Store({ model });

//         chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
//             console.log('OnUpdated', tabId, changeInfo);
//         });

//         chrome.tabs.onActivated.addListener((activeInfo) => {
//             console.log('OnActivated', activeInfo);
//         });

//         // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         //     console.log(tabs);
//         //     const [tab] = tabs;
//         //     if (tab.id) {
//         //         const port = chrome.tabs.connect(tab.id, {
//         //             name: 'background-connection',
//         //         });

//         //         store.setMessengerPort(port);

//         //         port.onMessage.addListener((msg) => {
//         //             if (msg.action === 'process-image') {
//         //                 store.addToQueue(msg.url, tab.id as number);
//         //             }
//         //         });
//         //     }
//         // });
//     });

// try {
//     chrome.contextMenus.remove('unblur-image', () => {
//         chrome.contextMenus.create({
//             id: 'unblur-image',
//             title: 'Unblur image',
//             contexts: ['page', 'selection', 'image', 'link'],
//         });
//     });
// } catch (err) {
//     console.log(err);
// }
