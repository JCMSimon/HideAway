const wordsToCensor = ["pastebin","test"];
const censorSymbol = "[CENSORED BY HIDEAWAY]";

function censorTextNode(textNode) {
    let content = textNode.textContent;
    wordsToCensor.forEach(word => {
        const regex = new RegExp("\\b" + word + "\\b", "gi");
        content = content.replace(regex, censorSymbol);
    });
    textNode.textContent = content;
}

function observerCallback(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            for (const addedNode of mutation.addedNodes) {
                if (addedNode.nodeType === Node.TEXT_NODE) {
                    censorTextNode(addedNode);
                }
            }
        }
    }
}

const observer = new MutationObserver(observerCallback);
observer.observe(document, { childList: true, subtree: true });

// Censor the initial content
const textNodes = document.querySelectorAll('body, body *');
textNodes.forEach(node => {
    if (node.nodeType === Node.TEXT_NODE) {
        censorTextNode(node);
    }
});

