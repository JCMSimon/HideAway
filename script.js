const errorText = document.getElementsByClassName("errorText")[0];

console.log(localStorage)

function update() {
	const censorList = JSON.parse(localStorage.getItem("HAList")) || [];
	const list = document.getElementsByClassName("censorList")[0];
	list.innerHTML = "";
	placeholderItem = document.createElement("li");
	placeholderItem.classList.add("instructions")
	if (censorList.length == 0) {
		placeholderItem.textContent = "Enter any text below and click add."
	} else {
		placeholderItem.textContent = "Click to reveal"
		placeholderItem.classList.add("bigger")
	}
	list.appendChild(placeholderItem)

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
			localStorage.setItem("HAList", JSON.stringify(censorList));
			update();
		});

            li.appendChild(readOnlyInput);
            li.appendChild(deleteButton);

            list.appendChild(li);
	});
}

function handleButtonClick() {
    const inputElement = document.getElementsByClassName("censorInput")[0];
    const inputValue = inputElement.value;
	const censorList = JSON.parse(localStorage.getItem("HAList")) || [];
    if (inputValue.trim() !== "") {
		if (!censorList.includes(inputValue.trim())) {
			censorList.push(inputValue.trim());
			localStorage.setItem("HAList", JSON.stringify(censorList));
			inputElement.value = ""; // Clear the input field
			errorText.textContent = ""
			errorText.innerHTML = '<mark class="greenMark">Changes will take effect on reload<mark>'
			update();
		} else {
			errorText.textContent = `${inputValue.trim()} is already in the list.`
		}
    } else {
		errorText.textContent = ""
	}
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