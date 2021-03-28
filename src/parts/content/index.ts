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
