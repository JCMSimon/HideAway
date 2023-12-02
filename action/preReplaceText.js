// Function to log and alter text in the DOM
function logAndAlterText(mutationsList, observer) {
  mutationsList.forEach((mutation) => {
    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        // Get words that should be censored from Chrome storage
        chrome.storage.sync.get(["HAList"], function (items) {
          const wordsToCensor = items.HAList || [];
          const censorSymbol = "*";

          // Check if the node is a text node and not empty
          if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
            // Switch based on the parent node type
            switch (node.parentNode.nodeName.toLowerCase()) {
              case 'script':
                // Censor text inside script tags
                wordsToCensor.forEach(word => {
                  if (node.nodeValue.toLowerCase().includes(word.toLowerCase())) {
                    const regex = new RegExp(word, "gi");
                    content = node.nodeValue.replace(regex, censorSymbol.repeat(word.length));
                    node.nodeValue = content;
                  }
                });
                break;
              case 'style':
                // Handle style tags if needed
                break;
              case 'noscript':
                // Handle noscript tags if needed
                break;
              default:
                // Censor text in other cases
                wordsToCensor.forEach(word => {
                  if (node.nodeValue.toLowerCase().includes(word.toLowerCase())) {
                    const regex = new RegExp(word, "gi");
                    content = node.nodeValue.replace(regex, censorSymbol.repeat(word.length));
                    node.nodeValue = content;
                  }
                });
            }
          }
        });
      });
    }
  });
}
  
  // Create a MutationObserver to observe changes in the DOM
  const observer = new MutationObserver(logAndAlterText);
  const observerConfig = {
    childList: true,
    subtree: true,
  };
  
  // Start observing the document
  observer.observe(document, observerConfig);
  