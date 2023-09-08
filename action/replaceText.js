function observerCallback(mutationsList) {
    debug = false
    const censorSymbol = "*";
    chrome.storage.sync.get(["HAList"], function(items) {
        const wordsToCensor = items.HAList || [];
        for (const mutation of mutationsList) {

            // Static Content
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.COMMENT_NODE || node.nodeType === Node.ATTRIBUTE_NODE || node.nodeType === Node.CDATA_SECTION_NODE) {
                        let content = node.textContent;
                        wordsToCensor.forEach(word => {
                            if (content.toLowerCase().includes(word.toLowerCase())) {
                                const regex = new RegExp("\\b" + word + "\\b", "gi");
                                content = content.replace(regex, censorSymbol.repeat(word.length));
                                    node.textContent = content;
                                }
                            }
                            );
                        }
                    }
            } else if (mutation.type === 'attributes') {
                // Inner Text 2
                if (String(mutation.target).split(" ")[1].slice(0,-1) === "HTMLParagraphElement") {
                        let content = mutation.target.innerText;
                        wordsToCensor.forEach(word => {
                        if (content.toLowerCase().includes(word.toLowerCase())) {
                                const regex = new RegExp("\\b" + word + "\\b", "gi");
                                content = content.replace(regex, censorSymbol.repeat(word.length));
                                mutation.target.innerText = content;
                            }
                        }
                        );
                // Alt text
                } else if (String(mutation.target).split(" ")[1].slice(0,-1) === "HTMLImageElement") {
                    let content = mutation.target.alt;
                    wordsToCensor.forEach(word => {
                    if (content.toLowerCase().includes(word.toLowerCase())) {
                            const regex = new RegExp("\\b" + word + "\\b", "gi");
                            content = content.replace(regex, censorSymbol.repeat(word.length));
                            mutation.target.alt = content;
                        }
                    }
                );
                // innerText 2 ig
                } else if (String(mutation.target).split(" ")[1].slice(0,-1) === "HTMLBodyElement" || String(mutation.target).split(" ")[1].slice(0,-1) === "HTMLHtmlElement") {
                    // TODO | this stuff idk (react bullshit)
                    continue

                } else {
                    if (debug == true) {
                        console.log("FOUND " + String(mutation.target).split(" ")[1].slice(0,-1) + ", Content: " + mutation.target.innerText)
                    }
                }

                // TODO | HTMLDivElement


            } else if (mutation.type === 'characterData') {
                if (debug == true) {
                    console.log("HANDLE CHARDATA")
                    console.log(mutation)
                }

            } else {
                if (debug == true) {
                    console.log("NEW TYPE: " + mutation.type)
                }
        }
    }
}
)}

const observer = new MutationObserver(observerCallback);
observer.observe(document, { childList: true, subtree: true, characterData: true, attributes: true, });