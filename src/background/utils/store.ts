import { NSFWJS, predictionType } from 'nsfwjs';

type ResultData = {
    url: string;
    result: predictionType[];
};

export default class Store {
    private pendingItems: { url: string }[];
    private doneItems: ResultData[];
    private isProcessing: boolean;
    private model: NSFWJS;
    private messengerPort: chrome.runtime.Port | null;
    tabId: number;

    constructor({ model, tabId }: { model: NSFWJS; tabId: number }) {
        this.pendingItems = [];
        this.doneItems = [];
        this.isProcessing = false;
        this.model = model;
        this.messengerPort = null;
        this.tabId = tabId;
    }

    addToQueue(url: string) {
        const foundInDoneItems = this.doneItems.find(
            (item) => item.url === url
        );
        const shouldAddToQueue = (() => {
            return !(
                this.pendingItems.find((item) => item.url === url) ||
                foundInDoneItems
            );
        })();

        if (shouldAddToQueue) {
            this.pendingItems.push({
                url,
            });

            if (!this.isProcessing) {
                this.process();
            }
        } else {
            if (foundInDoneItems) {
                this.processResult(foundInDoneItems);
            }
        }
    }

    setMessengerPort(port: chrome.runtime.Port) {
        this.messengerPort = port;

        this.messengerPort.onMessage.addListener((data) => {
            if (data.action === 'process-image' && data.url) {
                this.addToQueue(data.url);
            }
        });
    }

    private process() {
        if (this.pendingItems.length > 0 && !this.isProcessing) {
            this.isProcessing = true;
            const url = this.pendingItems[0].url;
            this.loadImage(url).then((res) => {
                if (res) {
                    this.model.classify(res).then((clRes) => {
                        this.processResult({
                            url,
                            result: clRes,
                        });

                        this.isProcessing = false;

                        this.process();
                    });
                }
            });
        }
    }

    private processResult(result: ResultData) {
        this.pendingItems.shift();
        this.doneItems.push(result);

        const sorted = result.result.sort((a, b) =>
            a.probability < b.probability
                ? 1
                : b.probability < a.probability
                ? -1
                : 0
        );

        const max = sorted[0];

        const blurLevel = (() => {
            if (!['Drawing', 'Neutral'].includes(max.className)) {
                if (max.probability <= 0.5) {
                    if (max.probability >= 0.4) {
                        return 'medium';
                    }
                    return 'tiny';
                }
                return 'max';
            }
            if (max.probability <= 0.6) {
                if (sorted[1].className === 'Porn') {
                    return 'medium';
                }
                if (
                    sorted[1].className === 'Drawing' ||
                    sorted[1].className === 'Neutral'
                ) {
                    return 'extra-light';
                }
                return 'tiny';
            }
            return 'unblur';
        })();

        if (this.messengerPort) {
            this.messengerPort.postMessage({
                action: 'process-result',
                blurLevel: blurLevel,
                ...result,
            });
        }
    }

    private async loadImage(url: string): Promise<HTMLImageElement> {
        const image = new Image(224, 224);

        return await new Promise((resolve, reject) => {
            image.src = url;
            image.onload = () => resolve(image);
            image.onerror = () => reject(false);
        });
    }
}
