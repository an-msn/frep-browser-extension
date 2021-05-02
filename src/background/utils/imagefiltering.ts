import * as nsfwjs from 'nsfwjs';
import LocalDB from './localdb';
import Store from './store';

export default class ImageFiltering {
    private stores: Record<number, Store>;
    private localDB: LocalDB;
    constructor() {
        this.localDB = new LocalDB();

        this.initFiltering();
        this.initContextMenu();
        this.initOptions();

        this.stores = {};
    }

    private initOptions() {
        const defaultOptions = {
            enableFiltering: true,
        };

        chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
            if (msg.action === 'get-image-filtering-options') {
                chrome.storage.local.get(['imageFilteringOptions'], (res) => {
                    if (res) {
                        const options = {
                            ...defaultOptions,
                            ...res.imageFilteringOptions,
                        };

                        sendResponse({
                            options,
                        });
                    } else {
                        sendResponse({
                            options: defaultOptions,
                        });
                    }
                });
                return true;
            } else if (msg.action === 'update-image-filtering-options') {
                console.log('Updating options', msg);
                chrome.storage.local.get(['imageFilteringOptions'], (res) => {
                    const options = {
                        ...defaultOptions,
                        ...res.imageFilteringOptions,
                        ...msg.options,
                    };

                    chrome.storage.local.set(
                        { imageFilteringOptions: options },
                        () => {
                            sendResponse(true);
                        }
                    );
                });
                return true;
            }
        });
    }

    private initFiltering() {
        nsfwjs
            .load('./assets/model/', {
                // @ts-ignore
                type: 'graph',
            })
            .then((model) => {
                chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
                    if (!this.stores[tabId]) {
                        if (
                            changeInfo.title ||
                            changeInfo.url ||
                            changeInfo.favIconUrl
                        ) {
                            console.log('Flushing store');
                            this.flushStore(tabId);
                        }
                    }
                });

                chrome.tabs.onActivated.addListener((info) => {
                    this.pauseAllStores();
                    if (!this.stores[info.tabId]) {
                        this.resumeStore(info.tabId);
                    }
                });

                console.log('Ready');
                chrome.runtime.onMessage.addListener((msg, sender) => {
                    if (
                        msg.action === 'ready-for-background-connection' &&
                        sender.tab &&
                        sender.tab.id &&
                        sender.tab.id > 0
                    ) {
                        const tabId = sender.tab.id as number;
                        if (!this.stores[tabId]) {
                            this.createStore(tabId, model);
                        } else {
                            this.attachPortMessenger(this.stores[tabId]);
                        }
                    }
                    return true;
                });

                chrome.tabs.onRemoved.addListener((tabId) => {
                    this.removeStore(tabId);
                });

                chrome.tabs.onReplaced.addListener((newTab, oldTab) => {
                    if (this.stores[oldTab]) {
                        this.stores[newTab] = this.stores[oldTab];
                        this.removeStore(oldTab);
                    }
                });
            });
    }

    private createStore(tabId: number, model: nsfwjs.NSFWJS) {
        this.stores[tabId] = new Store({ tabId, model, localDB: this.localDB });
        this.attachPortMessenger(this.stores[tabId]);
    }

    private pauseAllStores() {
        for (const store in this.stores) {
            this.stores[store].pause();
        }
    }

    private resumeStore(tabId: number) {
        if (this.stores[tabId]) {
            this.stores[tabId].resume();
        }
    }

    private flushStore(tabId: number) {
        if (this.stores[tabId]) this.stores[tabId].flushQueue();
    }

    private attachPortMessenger(store: Store) {
        if (store.portActive) {
            return;
        }
        const messengerPort = chrome.tabs.connect(store.tabId, {
            name: 'background-to-content-image-filtering',
        });
        store.setMessengerPort(messengerPort);
    }

    private removeStore(tabId: number) {
        if (this.stores[tabId]) {
            if (this.stores[tabId].messengerPort) {
                this.stores[tabId].messengerPort?.disconnect();
            }
            delete this.stores[tabId];
        }
    }

    private initContextMenu() {
        chrome.contextMenus.removeAll(() => {
            chrome.contextMenus.create({
                id: 'frep',
                title: 'Frep',
                contexts: ['page', 'image', 'link'],
            });

            chrome.contextMenus.create({
                id: 'frep-unblur',
                title: 'Unblur images',
                parentId: 'frep',
                contexts: ['page', 'image', 'link'],
            });

            chrome.contextMenus.create({
                id: 'frep-mark-safe',
                title: 'Mark images as safe',
                parentId: 'frep',
                contexts: ['page', 'image', 'link'],
            });

            chrome.contextMenus.create({
                id: 'frep-mark-unsafe',
                title: 'Mark images as unsafe',
                parentId: 'frep',
                contexts: ['page', 'image', 'link'],
            });
        });

        chrome.contextMenus.onClicked.addListener((info, tab) => {
            if (tab && tab.id && info.frameId !== undefined) {
                chrome.tabs.sendMessage(
                    tab.id,
                    { action: 'context-menu-clicked', type: info.menuItemId },
                    {
                        frameId: info.frameId,
                    },
                    (data) => {
                        if (data.type === 'marked-unsafe') {
                            const images = data.data as { src: string }[];

                            images.forEach((image) => {
                                this.localDB.putImage({
                                    url: image.src,
                                    result: [
                                        {
                                            className: 'Porn',
                                            probability: 1,
                                        },
                                    ],
                                });
                            });
                        } else if (data.type === 'marked-safe') {
                            const images = data.data as { src: string }[];

                            images.forEach((image) => {
                                this.localDB.putImage({
                                    url: image.src,
                                    result: [
                                        {
                                            className: 'Neutral',
                                            probability: 1,
                                        },
                                    ],
                                });
                            });
                        }
                    }
                );
            }
        });
    }
}
