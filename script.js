const errorText = document.getElementsByClassName("errorText")[0];

function update() {
	chrome.storage.sync.get(["HAList"], function(items) {
        const censorList = items.HAList || [];
		// Add list structure and help text
		const HTMLList = document.getElementsByClassName("censorList")[0];
		HTMLList.innerHTML = "";
		placeholderItem = document.createElement("li");
		placeholderItem.classList.add("instructions")
		if (censorList.length == 0) {
			placeholderItem.textContent = "Enter any text below and click add."
		} else {
			placeholderItem.textContent = "Click to reveal"
			placeholderItem.classList.add("bigger")
		}
		HTMLList.appendChild(placeholderItem)
		// Add list entries
		censorList.forEach((item,index) => {
			const li = document.createElement("li");
			li.classList.add("censorItem")
			const readOnlyInput = document.createElement("input");
			readOnlyInput.type = "text";
			readOnlyInput.className = "read-only-input ctm-input";
			readOnlyInput.value = item;
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


function handleButtonClick() {
    const inputElement = document.getElementsByClassName("censorInput")[0];
    const inputValue = inputElement.value;

    console.log("Adding new word to list");

    console.log("Getting current list");
    chrome.storage.sync.get(["HAList"], function(result) {
        const censorList = result.HAList || []; // Retrieve the list from the result object

        if (inputValue.trim() !== "") {
            if (!censorList.includes(inputValue.trim())) {
                censorList.push(inputValue.trim());
                chrome.storage.sync.set({ "HAList": censorList }, function() {
                    // Callback function after data is successfully set
                    inputElement.value = ""; // Clear the input field
                    errorText.innerHTML = '<mark class="greenMark">Changes will take effect on reload</mark>';
                    update(); // Make sure the update() function is defined and implemented
                });
            } else {
                errorText.textContent = `${inputValue.trim()} is already in the list.`;
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