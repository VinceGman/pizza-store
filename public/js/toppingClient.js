function addToppingToPage(topping) {
    const template = document.getElementById('toppingTemplate');
    const newToppingDiv = document.importNode(template.content, true);

    // Set the topping name
    newToppingDiv.querySelector('.topping-name').textContent = topping.name;

    // Optionally set onclick handlers for the buttons
    let editButton = newToppingDiv.querySelector('.edit-btn');
    editButton.onclick = () => editTopping(editButton, topping.name);
    let deleteButton = newToppingDiv.querySelector('.delete-btn');
    deleteButton.onclick = () => deleteTopping(deleteButton, topping.name);

    // Insert the newToppingDiv into the DOM
    document.getElementById('topping-list').appendChild(newToppingDiv);
}

function editTopping(button, toppingName) {
    var span = button.closest('.topping').querySelector('.topping-name');
    var input = document.createElement('input');
    input.type = 'text';
    input.value = toppingName;
    input.className = 'topping-name-input'; // You can style this class as needed

    // Replace the <span> with the <input>
    span.parentNode.replaceChild(input, span);

    // Automatically focus the input and select its content
    input.focus();
    input.select();

    // Define the event listener as a named function
    const handleEnterPress = function (e) {
        if (e.key === 'Enter') {
            input.removeEventListener('keypress', handleEnterPress); // Remove the event listener
            updateTopping(button, toppingName, input.value);
        }
    };

    // Attach the event listener
    input.addEventListener('keypress', handleEnterPress);

    // Change the button to say "Update" and attach the new onclick event
    button.className = 'update-btn';
    button.textContent = 'Update';
    button.onclick = function () {
        input.removeEventListener('keypress', handleEnterPress); // Also remove the listener here
        updateTopping(button, toppingName, input.value);
    };
}

async function updateTopping(button, prevName, newName) {
    try {
        const response = await fetch(`/owner/toppings/${encodeURIComponent(prevName)}/${encodeURIComponent(newName)}`, { method: 'PUT' });
        
        if (!response.ok || (newName == prevName)) { newName = prevName; }
        
        if (!response.ok) {
            const errorText = await response.text(); // Attempt to read response text
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Server message: ${errorText}`);
        }
        const deletedToppingRes = await response.json();

    } catch (error) {
        console.error('Error:', error);
    }

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
        const response = await fetch('/owner/toppings/' + encodeURIComponent(toppingName), { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const deletedToppingRes = await response.json();

        const toppingDiv = element.closest('.topping');
        if (toppingDiv) toppingDiv.remove();

    } catch (error) {
        // console.error('Error:', error);
    }
}

document.getElementById('add-topping-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    var toppingName = document.getElementById('topping-input').value.trim();
    if (toppingName === "") {
        // Prevent the form from submitting
        document.getElementById('topping-input').placeholder = 'Needs topping name!';
        return;
    }

    const data = { name: toppingName };
    this.reset();

    try {
        const response = await fetch('/owner/toppings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const newToppingRes = await response.json();

        addToppingToPage(newToppingRes.topping); // Function to update the webpage

    } catch (error) {
        // console.error('Error:', error);
    }
});