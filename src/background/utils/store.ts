import { NSFWJS, predictionType } from 'nsfwjs';

type ResultData = {
    url: string;
    imageId: string[];
    result: predictionType[];
};

interface Process {
    url: string;
    imageId: string[];
    tryCount: number;
}

export default class Store {
    private pendingItems: Process[];
    private doneItems: ResultData[];
    private isProcessing: boolean;
    private model: NSFWJS;
    public messengerPort: chrome.runtime.Port | null;
    public portActive: boolean;
    private paused: boolean;
    tabId: number;

    constructor({ model, tabId }: { model: NSFWJS; tabId: number }) {
        this.pendingItems = [];
        this.doneItems = [];
        this.isProcessing = false;
        this.model = model;
        this.messengerPort = null;
        this.tabId = tabId;
        this.paused = false;
        this.portActive = false;
    }

    addToQueue(url: string, imageId: string) {
        const foundInDoneItems = this.doneItems.find(
            (item) => item.url === url
        );
        const isInPending = this.pendingItems.find((item) => item.url === url);

        if (!foundInDoneItems) {
            if (isInPending) {
                isInPending.imageId.push(imageId);
            } else {
                this.pendingItems.push({
                    url,
                    imageId: [imageId],
                    tryCount: 0,
                });
            }

            if (!this.isProcessing && !this.paused) {
                this.process();
            }
        } else {
            if (foundInDoneItems) {
                this.processResult({ ...foundInDoneItems, imageId: [imageId] });
            }
        }
    }

    setMessengerPort(port: chrome.runtime.Port) {
        this.messengerPort = port;
        this.portActive = true;

        this.messengerPort.onMessage.addListener((data) => {
            if (data.action === 'process-image' && data.url) {
                this.addToQueue(data.url, data.imageId);
            }
        });

        this.messengerPort.onDisconnect.addListener(() => {
            this.portActive = false;
            this.messengerPort = null;
        });
    }

    private process() {
        if (
            this.pendingItems.length > 0 &&
            !this.isProcessing &&
            !this.paused
        ) {
            this.isProcessing = true;
            const currentProcessing = this.pendingItems[0];
            const { url, imageId } = currentProcessing;
            this.loadImage(url)
                .then((res) => {
                    if (res) {
                        this.model
                            .classify(res)
                            .then((clRes) => {
                                this.processResult({
                                    url,
                                    imageId,
                                    result: clRes,
                                });

                                this.isProcessing = false;

                                this.process();
                            })
                            .catch((err) => {
                                this.isProcessing = false;
                                this.retryProcess(currentProcessing);
                                this.process();
                                console.log('Error', err);
                            });
                    }
                })
                .catch((err) => {
                    this.isProcessing = false;
                    this.retryProcess(currentProcessing);
                    this.process();
                    console.log('Error creating image', err);
                });
        }
    }

    public flushQueue() {
        this.pendingItems = [];
        this.isProcessing = false;
    }

    public pause() {
        this.paused = true;
    }

    public resume() {
        this.paused = false;
    }

    private retryProcess(process: Process) {
        if (process.tryCount > 2) {
            this.pendingItems.shift();
            this.doneItems.push({
                imageId: process.imageId,
                url: process.url,
                result: [
                    {
                        className: 'Porn',
                        probability: 0.45,
                    },
                ],
            });
        } else {
            process.tryCount++;
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
