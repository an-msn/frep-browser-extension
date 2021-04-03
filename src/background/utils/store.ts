import { NSFWJS, predictionType } from 'nsfwjs';

type Item = {
    url: string;
} & predictionType;

export default class Store {
    pendingItems: Record<string, { url: string }[]>;
    doneItems: Record<string, Item[]>;
    isProcessing: boolean;
    model: NSFWJS;

    constructor({ model }: { model: NSFWJS }) {
        this.pendingItems = {};
        this.doneItems = {};
        this.isProcessing = false;
        this.model = model;
    }

    addToQueue(url: string, tabId: string) {
        this.pendingItems[tabId].push({
            url,
        });

        if (!this.isProcessing) {
            this.isProcessing = true;
            this.process(tabId);
        }
    }

    process(tabId: string) {
        if (Object.keys(this.pendingItems).length > 0) {
            const url = this.pendingItems[tabId][0].url;
            this.loadImage(url).then((res) => {
                if (res) {
                    this.model.classify(res).then((clRes) => {
                        const max = clRes.reduce((prev, current) =>
                            prev.probability > current.probability
                                ? prev
                                : current
                        );

                        this.processResult(tabId, {
                            url,
                            ...max,
                        });

                        this.process(tabId);
                    });
                }
            });
        } else {
            this.isProcessing = false;
        }
    }

    private processResult(tabId: string, result: Item) {
        this.pendingItems[tabId].shift();
        this.doneItems[tabId].push(result);
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
