let messageSent = false;

if (!messageSent) {
    console.log('Sending message');
    chrome.runtime.sendMessage({
        action: 'ready-for-background-connection',
    });
    messageSent = true;
}

chrome.runtime.onConnect.addListener((port) => {
    if (port.name !== 'background-to-content-image-filtering') return;
    console.log('connected');

    chrome.runtime.sendMessage(
        { action: 'get-image-filtering-options' },
        (msg) => {
            console.log(msg);
            if (msg.options.enableFiltering) {
                prepImages(port);
            }
        }
    );

    port.onMessage.addListener((msg) => {
        if (msg.action === 'process-result') {
            if (msg.blurLevel !== 'max') {
                msg.imageId.forEach((imgId: string) => {
                    const images = document.querySelectorAll(
                        `img[data-frep-imageid='${imgId}']`
                    );

                    images.forEach((img) => {
                        img.setAttribute('data-frep-blurvalue', msg.blurLevel);
                    });
                });
            }
        }
    });
});

function prepImages(port: chrome.runtime.Port) {
    let imageId = 0;

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        const src = (() => {
            const imgSrc = img.getAttribute('src');
            if (imgSrc?.startsWith('/')) {
                return `${window.location.origin}${imgSrc}`;
            }
            return imgSrc;
        })();
        img.setAttribute('data-frep-imageid', `${imageId}`);
        port.postMessage({
            action: 'process-image',
            url: src,
            imageId: imageId,
        });
        imageId++;
    });

    const domChangeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        if (node.tagName === 'img') {
                            port.postMessage({
                                action: 'process-image',
                                url: node.getAttribute('src'),
                                imageId: imageId,
                            });
                            node.setAttribute(
                                'data-frep-imageid',
                                `${imageId}`
                            );
                            imageId++;
                        } else {
                            const images = node.querySelectorAll('img');
                            images.forEach((img) => {
                                port.postMessage({
                                    action: 'process-image',
                                    url: img.getAttribute('src'),
                                    imageId: imageId,
                                });
                                img.setAttribute(
                                    'data-frep-imageid',
                                    `${imageId}`
                                );
                                imageId++;
                            });
                        }
                    }
                });
            } else {
                if (mutation.type === 'attributes') {
                    if (
                        mutation.attributeName === 'src' &&
                        mutation.target instanceof HTMLElement
                    ) {
                        mutation.target.setAttribute(
                            'data-frep-imageid',
                            `${imageId}`
                        );
                        port.postMessage({
                            action: 'process-image',
                            url: mutation.target.getAttribute('src'),
                            imageId: imageId,
                        });
                        imageId++;
                    }
                }
            }
        });
    });

    domChangeObserver.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
    });
}

let clickedElement: null | Element = null;

document.addEventListener(
    'contextmenu',
    (e) => {
        clickedElement = e.target as Element;
    },
    true
);

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === 'context-menu-clicked') {
        if (clickedElement) {
            if (message.type === 'frep-unblur') {
                if (clickedElement.tagName === 'img') {
                    clickedElement.setAttribute(
                        'data-frep-blurvalue',
                        'unblur'
                    );
                } else {
                    const parent = clickedElement.parentElement as Element;
                    parent.querySelectorAll('img').forEach((img) => {
                        img.setAttribute('data-frep-blurvalue', 'unblur');
                    });
                }
            }
        }
    }
});
