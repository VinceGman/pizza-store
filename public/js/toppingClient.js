function addToppingToPage(topping) {
    // Grab element for topping and clones it
    const template = document.getElementById('toppingTemplate');
    const newToppingDiv = document.importNode(template.content, true);

    // Set the topping name
    newToppingDiv.querySelector('.topping-name').textContent = topping.name;

    // Set onclick handlers for the buttons
    let editButton = newToppingDiv.querySelector('.edit-btn');
    editButton.onclick = () => editTopping(editButton, topping.name);
    let deleteButton = newToppingDiv.querySelector('.delete-btn');
    deleteButton.onclick = () => deleteTopping(deleteButton, topping.name);

    // Insert the newToppingDiv into the DOM
    document.getElementById('topping-list').appendChild(newToppingDiv);
}

function editTopping(button, toppingName) {
    // Create input field with data
    var span = button.closest('.topping').querySelector('.topping-name');
    var input = document.createElement('input');
    input.type = 'text';
    input.value = toppingName;
    input.className = 'topping-name-input';

    // Replace the <span> with the <input>
    span.parentNode.replaceChild(input, span);

    // Automatically focus the input and select its content
    input.focus();
    input.select();

    // Define the event listener as a named function
    const handleEnterPress = function (e) {
        if (e.key === 'Enter') {
            input.removeEventListener('keypress', handleEnterPress); // Remove the event listener, stop it from firing again
            // Call update topping with correct params on keypress
            updateTopping(button, toppingName, input.value);
        }
    };

    // Attach the event listener
    input.addEventListener('keypress', handleEnterPress);

    // Change the button to say "Update" and attach the new onclick event
    button.className = 'update-btn';
    button.textContent = 'Update';
    button.onclick = function () {
        input.removeEventListener('keypress', handleEnterPress); // Remove the event listener, stop it from firing again
        // Call update topping with correct params on button press
        updateTopping(button, toppingName, input.value);
    };
}

async function updateTopping(button, prevName, newName) {
    try {
        // Call PUT on toppings API to update topping
        const response = await fetch(`/owner/toppings/${encodeURIComponent(prevName)}/${encodeURIComponent(newName)}`, { method: 'PUT' });
        
        // If response fails or if the name didn't change at all, it will just set the elements back to old name
        if (!response.ok || (newName == prevName)) { newName = prevName; }
        
        if (!response.ok) { // Throw Error if response not ok
            const errorText = await response.text(); // Attempt to read response text
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Server message: ${errorText}`);
        }
        // Receives data of updated topping
        const updatedToppingRes = await response.json();
    } catch (error) {
        // Catches errors
        console.error('Error:', error);
    }

    // Creates span and assigns appropriate topping information
    var toppingElement = button.closest('.topping');
    var input = toppingElement.querySelector('.topping-name-input');
    var span = document.createElement('span');
    span.className = 'topping-name';
    span.textContent = newName;

    // Replace the <input> with the <span>
    input.parentNode.replaceChild(span, input);

    // Change the update button back to an edit button
    button.className = 'edit-btn';
    button.textContent = 'Edit';
    button.onclick = function () { editTopping(button, newName); };

    // Find the delete button and update its onclick function
    var deleteButton = toppingElement.querySelector('.delete-btn');
    if (deleteButton) {
        deleteButton.onclick = function () { deleteTopping(deleteButton, newName); };
    }
}

async function deleteTopping(element, toppingName) {
    try {
        // Call DELETE method on toppings API, to delete topping
        const response = await fetch('/owner/toppings/' + encodeURIComponent(toppingName), { method: 'DELETE' });
        if (!response.ok) { // Throw Error if response not ok
            throw new Error('Network response was not ok');
        }

        // Receives deleted topping data
        const deletedToppingRes = await response.json();

        // Removes element
        const toppingDiv = element.closest('.topping');
        if (toppingDiv) toppingDiv.remove();

    } catch (error) {
        // Catches errors
        console.error('Error:', error);
    }
}

document.getElementById('add-topping-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting

    var toppingName = document.getElementById('topping-input').value.trim();
    if (toppingName === "") {
        // Prevent attempting to add topping without a name
        document.getElementById('topping-input').placeholder = 'Needs topping name!';
        return;
    }

    const data = { name: toppingName }; // Prepares API body data
    this.reset(); // Resets UI element

    try {
        // Calls POST method on toppings API, to add topping
        const response = await fetch('/owner/toppings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) { // Throw error if response not ok
            throw new Error('Network response was not ok');
        }

        // Receives information of added topping
        const newToppingRes = await response.json();

        // Updates page elements to include new added topping
        addToppingToPage(newToppingRes.topping);

    } catch (error) {
        // Catches errors
        console.error('Error:', error);
    }
});