function censorTextNode(textNode) {
    const censorSymbol = "*";
    chrome.storage.sync.get(["HAList"], function(items) {
        const wordsToCensor = items.HAList || [];
        let content = textNode.textContent;
        // TODO | test if word is in the content first
        wordsToCensor.forEach(word => {
            if (content.toLowerCase().includes(word.toLowerCase())) {
                // TODO | replace with regex that doesent only take full words
                const regex = new RegExp("\\b" + word + "\\b", "gi");
                content = content.replace(regex, censorSymbol.repeat(word.length));
                textNode.textContent = content;
            }
        });
    });
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
