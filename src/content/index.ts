chrome.runtime.onConnect.addListener((port) => {
    console.log('Window ready');
    if (port.name !== 'background-to-content-image-filtering') return;

    port.onMessage.addListener((msg) => {
        if (msg.action === 'process-result') {
            if (msg.blurLevel !== 'max') {
                const images = document.querySelectorAll(
                    `img[src='${msg.url}']`
                );

                images.forEach((img) => {
                    img.setAttribute('data-frep-blurvalue', msg.blurLevel);
                });
            }
        }
    });

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        port.postMessage({
            action: 'process-image',
            url: img.getAttribute('src'),
        });
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
                            });
                        } else {
                            const images = node.querySelectorAll('img');
                            images.forEach((img) => {
                                port.postMessage({
                                    action: 'process-image',
                                    url: img.getAttribute('src'),
                                });
                            });
                        }
                    }
                });
            }
        });
    });

    domChangeObserver.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
    });
});

let clickedElement: null | Element = null;

document.addEventListener(
    'contextmenu',
    (e) => {
        clickedElement = e.target as Element;
    },
    true
);

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    console.log(clickedElement);
    if (message === 'getContextMenuElement') {
        if (clickedElement) {
            if (clickedElement.tagName === 'img') {
                clickedElement.setAttribute('data-frep-blurvalue', 'unblur');
            } else {
                const parent = clickedElement.parentElement as Element;
                parent.querySelectorAll('img').forEach((img) => {
                    img.setAttribute('data-frep-blurvalue', 'unblur');
                });
            }
        }
        sendResponse({ value: 1 });
    }
});
