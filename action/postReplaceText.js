// Function to censor text based on banned words
function censorText(text) {
	// Get words that should be censored from Chrome storage
	chrome.storage.sync.get(["HAList"], function (items) {
	  const wordsToCensor = items.HAList || [];
	  const censorSymbol = "*";
  
	  // Iterate through banned words and replace them with censor symbols
	  wordsToCensor.forEach(word => {
		if (text.toLowerCase().includes(word.toLowerCase())) {
		  const regex = new RegExp(word, "gi");
		  text = text.replace(regex, censorSymbol.repeat(word.length));
		  console.log(`Replaced Text: ${text}`);
		}
	  });
	});
  
	return text;
  }
  
  // Function to censor text content in a DOM node
  function censorTextInNode(node) {
	if (node.nodeType === Node.TEXT_NODE) {
	  // Censor text content of the node
	  node.nodeValue = censorText(node.nodeValue);
	} else if (node.hasChildNodes()) {
	  // Recursively censor text in child nodes
	  node.childNodes.forEach(censorTextInNode);
	}
  }
  
  // Function to censor text on the entire page
  function censorTextOnPage() {
	// Get all text nodes in the document body
	const textNodes = document.createTreeWalker(
	  document.body,
	  NodeFilter.SHOW_TEXT,
	  null,
	  false
	);
  
	// Censor text in each text node
	let currentNode;
	while ((currentNode = textNodes.nextNode())) {
	  censorTextInNode(currentNode);
	}
  }
  
  // Censor text when the DOM is ready
  document.addEventListener('DOMContentLoaded', censorTextOnPage);
  