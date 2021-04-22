import { predictionType } from 'nsfwjs';

interface ImageItem {
    url: string;
    result: predictionType[];
}

export default class LocalDB {
    private dbRequest: IDBOpenDBRequest;
    private pendingTransactions: ((
        obj: IDBTransaction
    ) => IDBRequest<IDBValidKey>)[];
    private imageObjectStore: IDBObjectStore | null;
    private dbReady: boolean;

    constructor() {
        this.dbRequest = indexedDB.open('frep_db');
        this.pendingTransactions = [];
        this.dbReady = false;
        this.imageObjectStore = null;
        this.init();
    }

    private init() {
        this.dbRequest.onupgradeneeded = (e) => {
            const db = this.dbRequest.result;

            const objectStore = db.createObjectStore('image_results', {
                keyPath: 'url',
            });

            objectStore.createIndex('url', 'url', {
                unique: true,
            });

            objectStore.transaction.onerror = () => {
                console.log('errr');
            };
        };
    }

    public async addImage({ url, result }: ImageItem) {
        const addReq = () => {
            const transcation = this.dbRequest.result.transaction(
                'image_results',
                'readwrite'
            );
            const store = transcation.objectStore('image_results');

            return new Promise((resolve, reject) => {
                const add = store.add({
                    url,
                    result,
                });
                add.onsuccess = () => {
                    resolve(true);
                };
                add.onerror = (err) => {
                    reject(err);
                };
            });
        };

        if (this.dbRequest.readyState === 'done') {
            if (this.dbRequest.result) {
                addReq();
            }
        } else {
            return new Promise((resolve, reject) => {
                this.dbRequest.addEventListener('success', () => {
                    addReq();
                });
            });
        }
    }

    public async getImage(url: string): Promise<ImageItem> {
        const getReq = (): Promise<ImageItem> => {
            const transcation = this.dbRequest.result.transaction(
                'image_results',
                'readwrite'
            );
            const store = transcation.objectStore('image_results');

            return new Promise((resolve, reject) => {
                const get = store.get(url);
                get.onsuccess = () => {
                    resolve(get.result as ImageItem);
                };
                get.onerror = (err) => {
                    reject(err);
                };
            });
        };

        if (this.dbRequest.readyState === 'done') {
            return getReq();
        } else {
            return new Promise((resolve, reject) => {
                this.dbRequest.addEventListener('success', () => {
                    getReq()
                        .then((res) => {
                            resolve(res);
                        })
                        .catch(() => {
                            reject();
                        });
                });
            });
        }
    }

    private onObjectStoreReady(imageObject: IDBTransaction) {
        console.log('object ready');
        this.pendingTransactions.forEach((t) => {
            t(imageObject);
        });
    }
}
