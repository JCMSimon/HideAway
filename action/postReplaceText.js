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
  
   // Create the overlay div
   const overlayDiv = document.createElement('div');
   overlayDiv.id = 'overlay';
 
   // Create the content div within the overlay
   const overlayContentDiv = document.createElement('div');
   overlayContentDiv.id = 'overlay-content';
 
   // Create and set the logo
   const logo = document.createElement('img');
   logo.id = 'logo';
   logo.src = 'https://i.imgur.com/QbK55z0.png'; // Set the path to your logo
   overlayContentDiv.appendChild(logo);
   
   // Create and set the text
   const textH2 = document.createElement("h2")  
   const textNode = document.createTextNode('Censoring Text...');
   textH2.appendChild(textNode) 
   textH2.style.color = "white"
   textH2.style.fontSize = "5vw"
   overlayContentDiv.appendChild(textH2);
   
   // Append the content div to the overlay div
   overlayDiv.appendChild(overlayContentDiv);
 
   // Append the overlay div to the body
   
   // Add styles via JavaScript
   overlayDiv.style.position = 'fixed';
   overlayDiv.style.top = '0';
   overlayDiv.style.left = '0';
   overlayDiv.style.width = '100%';
   overlayDiv.style.height = '100%';
   overlayDiv.style.background = 'rgba(0, 0, 0, 1)';
   overlayDiv.style.justifyContent = 'center';
   overlayDiv.style.alignItems = 'center';
   overlayDiv.style.zIndex = '12147483647';
   overlayDiv.style.display = 'flex';
   overlayDiv.style.flexDirection = "row"
   
   overlayContentDiv.style.display = 'flex';
   overlayContentDiv.style.flexDirection = "column"
   overlayContentDiv.style.justifyContent = 'center';
   overlayContentDiv.style.alignItems = 'center';
   
   logo.style.width = '100px'; // Set the width of your logo
   logo.style.height = '100px'; // Set the height of your logo
   
   document.body.appendChild(overlayDiv);
   
  // Censor text when the DOM is ready
  document.addEventListener('DOMContentLoaded', censorTextOnPage);
 setTimeout(() => {
	document.body.removeChild(overlayDiv)
 }, 1000); 