const errorText = document.getElementsByClassName("errorText")[0];

// Build UI
function update() {
	chrome.storage.sync.get(["HAList"], function(items) {
		// Get list of "to be censored words"
		const censorList = items.HAList || [];
		// Add list structure and help text
		const HTMLList = document.getElementsByClassName("censorList")[0];
		HTMLList.innerHTML = "";
		placeholderItem = document.createElement("li");
		placeholderItem.classList.add("instructions")
		if (censorList.length == 0) {
			placeholderItem.textContent = "Enter any text (Case insensitive) below and click add."
		} else {
			placeholderItem.textContent = "Click to reveal"
			placeholderItem.classList.add("bigger")
		}
		HTMLList.appendChild(placeholderItem)
		// Add list entries
		censorList.forEach((item,index) => {
			// Generate list of censored words as ui elements
			const li = document.createElement("li");
			li.classList.add("censorItem")
			const readOnlyInput = document.createElement("input");
			readOnlyInput.type = "text";
			readOnlyInput.className = "read-only-input ctm-input";
			readOnlyInput.value = item.toUpperCase();
			readOnlyInput.readOnly = true;
			const deleteButton = document.createElement("button");
			deleteButton.classList.add("ctm-button")
			deleteButton.textContent = "Remove";
			deleteButton.addEventListener("click", () => {
				censorList.splice(index, 1);
					chrome.storage.sync.set({"HAList":censorList})
					update();
				});
				li.appendChild(readOnlyInput);
				li.appendChild(deleteButton);
				HTMLList.appendChild(li);
		});
	}
)};

// Handle adding words
function handleButtonClick() {
    const inputElement = document.getElementsByClassName("censorInput")[0];
    const inputValue = inputElement.value;

	// Get "to be censored words"
    chrome.storage.sync.get(["HAList"], function(result) {
        const censorList = result.HAList || [];
        if (inputValue.toLowerCase().trim() !== "") {
            if (!censorList.includes(inputValue.toLowerCase().trim())) {
                censorList.push(inputValue.toLowerCase().trim());
                // Add word to censor list
				chrome.storage.sync.set({ "HAList": censorList }, function() {
                    // Callback function after data is successfully set
                    // Clear the input field
					inputElement.value = "";
                    errorText.innerHTML = '<mark class="greenMark">Changes will take effect on reload</mark>';
                    update();
                });
            } else {
                errorText.textContent = `${inputValue.toLowerCase().trim()} is already in the list.`;
            }
        } else {
            errorText.textContent = "";
        }
    });
}

const saveButton = document.getElementsByClassName("saveButton")[0];
saveButton.addEventListener("click", handleButtonClick);

const inputField = document.getElementsByClassName("censorInput")[0];
inputField.addEventListener("keypress", function(event) {
	if (event.key === "Enter") {
	  event.preventDefault();
	  handleButtonClick();
	}
});

update()