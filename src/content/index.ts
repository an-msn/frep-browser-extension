window.addEventListener('DOMContentLoaded', async (event) => {
    //const model = await nsfwjs.load('./assets/model/model.json');

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        chrome.runtime.sendMessage({
            action: 'process-image',
            url: img.getAttribute('src'),
        });
    });
});

const domChangeObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {});
        }
    });
});

domChangeObserver.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
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
                clickedElement.setAttribute('data-frep-unblur', 'true');
            } else {
                const parent = clickedElement.parentElement as Element;
                parent.querySelectorAll('img').forEach((img) => {
                    img.setAttribute('data-frep-unblur', 'true');
                });
            }
        }
        sendResponse({ value: 1 });
    }
});
