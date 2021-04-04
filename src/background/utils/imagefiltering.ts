import * as nsfwjs from 'nsfwjs';
import Store from './store';

export default class ImageFiltering {
    private stores: Record<number, Store>;

    constructor() {
        this.initFiltering();
        this.initContextMenu();

        this.stores = {};
    }

    private initFiltering() {
        nsfwjs
            .load('./assets/model/', {
                // @ts-ignore
                type: 'graph',
            })
            .then((model) => {
                chrome.tabs.onCreated.addListener((tab) => {
                    if (tab.id) {
                        this.createStore(tab.id, model);
                    }
                });

                chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
                    if (!this.stores[tabId]) {
                        this.createStore(tabId, model);
                    }
                });

                chrome.tabs.onActivated.addListener((info) => {
                    if (!this.stores[info.tabId]) {
                        this.createStore(info.tabId, model);
                    }
                });

                chrome.runtime.onMessage.addListener((msg, sender) => {
                    if (
                        msg.action === 'ready-for-background-connection' &&
                        sender.tab?.id
                    ) {
                        const tabId = sender.tab?.id as number;
                        if (!this.stores[tabId]) {
                            this.createStore(tabId, model);
                        }
                        this.attachPortMessenger(this.stores[tabId]);
                    }
                });
            });
    }

    private createStore(tabId: number, model: nsfwjs.NSFWJS) {
        this.stores[tabId] = new Store({ tabId, model });
    }

    private attachPortMessenger(store: Store) {
        const messengerPort = chrome.tabs.connect(store.tabId, {
            name: 'background-to-content-image-filtering',
        });
        store.setMessengerPort(messengerPort);
    }

    private initContextMenu() {
        chrome.contextMenus.removeAll(() => {
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
                        //console.log(data);
                    }
                );
            }
        });
    }
}
