import * as nsfwjs from 'nsfwjs';
nsfwjs.load('./assets/model/').then((modal) => {});

chrome.contextMenus.remove('unblur-image', () => {
    chrome.contextMenus.create({
        id: 'unblur-image',
        title: 'Unblur image',
        contexts: ['page', 'selection', 'image', 'link'],
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (tab && tab.id && info.frameId !== undefined) {
        chrome.tabs.sendMessage(
            tab.id,
            'getContextMenuElement',
            {
                frameId: info.frameId,
            },
            (data) => {
                console.log(data);
            }
        );
    }
});
