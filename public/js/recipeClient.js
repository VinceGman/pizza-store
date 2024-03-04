function addRecipeToPage(recipe) {
    // Grab template for recipe and clone it
    const template = document.getElementById('recipeTemplate');
    const newRecipeDiv = document.importNode(template.content, true);

    // Set the recipe name
    newRecipeDiv.querySelector('.recipe-name').textContent = recipe.name;

    // Set onclick handlers for the buttons
    let editButton = newRecipeDiv.querySelector('.edit-btn');
    editButton.onclick = () => editRecipe(editButton, recipe.name);
    let deleteButton = newRecipeDiv.querySelector('.delete-btn');
    deleteButton.onclick = () => deleteRecipe(deleteButton, recipe.name);

    // Handle the toppings list
    const toppingsList = newRecipeDiv.querySelector('.recipe-toppings-list');
    toppingsList.innerHTML = ''; // Clear existing toppings if any
    recipe.toppings.forEach(topping => {
        // Make a new topping item for every topping
        const toppingItem = document.createElement('div');
        toppingItem.classList.add('recipe-topping-item');
        toppingItem.textContent = topping;
        toppingsList.appendChild(toppingItem);
    });

    // Insert the newRecipeDiv into the DOM
    document.getElementById('recipe-list').appendChild(newRecipeDiv);
}

function editRecipe(button, recipeName) {
    // Create input field with data
    var span = button.closest('.recipe').querySelector('.recipe-name');
    var input = document.createElement('input');
    input.type = 'text';
    input.value = recipeName;
    input.className = 'recipe-name-input';

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
            updateRecipe(button, recipeName, input.value);
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
        updateRecipe(button, recipeName, input.value);
    };

    // Fetch toppings from the database and display them as checkboxes
    fetchToppingsAndDisplayAsCheckboxes(button.closest('.recipe').querySelector('.recipe-toppings-list'), recipeName);
}

async function fetchToppingsAndDisplayAsCheckboxes(toppingsListElement, recipeName) {
    try {
        // Get recipes and toppings data from /chef/recipes
        const response = await fetch(`/chef/recipes/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!response.ok) { // Throw Error if response not ok
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        // Clean and tokenize recipes and toppings data
        const data = await response.json();
        const recipe = data.recipes.find(r => r.name == recipeName);
        const availableToppings = data.toppings;

        // Clear existing toppings list
        toppingsListElement.innerHTML = '';
        // Create a checkbox for each topping
        availableToppings.forEach(topping => {
            // Make checkboxes for all the available toppings in the recipe and restore recipe name label
            const label = document.createElement('label');
            label.className = 'toppings-checklist-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = topping.name;
            if (recipe.toppings.includes(topping.name)) checkbox.checked = true;
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(topping.name));
            toppingsListElement.appendChild(label);
        });
    } catch (error) {
        // Catches errors
        console.error('Error fetching toppings:', error);
    }
}

async function updateRecipe(button, prevName, newName) {
    try {
        // Gets data for updated recipe from checkboxes
        const toppings = Array.from(button.closest('.recipe').querySelectorAll('.recipe-toppings-list input[type=checkbox]:checked')).map(cb => cb.value);
        const payload = { name: newName, toppings: toppings };
        // Requests the recipe update from recipes API
        const response = await fetch(`/chef/recipes/${encodeURIComponent(prevName)}/${encodeURIComponent(newName)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) { // Throw Error if response not ok
            const errorText = await response.text(); // Attempt to read response text
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Server message: ${errorText}`);
        }

        var updatedRecipe = await response.json();

    } catch (error) {
        // Catches errors
        console.error('Error:', error);
    }

    // Verify the updated recipe came from API, otherwise restore old recipe
    updatedRecipe = updatedRecipe ? updatedRecipe : await restoreRecipe(prevName);

    // Set span to new information
    var recipeElement = button.closest('.recipe');
    var input = recipeElement.querySelector('.recipe-name-input');
    var span = document.createElement('span');
    span.className = 'recipe-name';
    span.textContent = updatedRecipe.recipe.name;

    // Replace the <input> with the <span>
    input.parentNode.replaceChild(span, input);

    // Change the update button back to an edit button
    button.className = 'edit-btn';
    button.textContent = 'Edit';
    button.onclick = function () { editRecipe(button, updatedRecipe.recipe.name); };

    // Find the delete button and update its onclick function
    var deleteButton = recipeElement.querySelector('.delete-btn');
    if (deleteButton) {
        deleteButton.onclick = function () { deleteRecipe(deleteButton, updatedRecipe.recipe.name); };
    }

    // Re-render the toppings list for the updated recipe
    const toppingsListElement = recipeElement.querySelector('.recipe-toppings-list');
    toppingsListElement.innerHTML = ''; // Clear existing toppings list
    updatedRecipe.recipe.toppings.forEach(topping => {
        // Create list of toppings from the new recipe data
        const toppingItem = document.createElement('div');
        toppingItem.className = 'recipe-topping-item';
        toppingItem.textContent = topping;
        toppingsListElement.appendChild(toppingItem);
    });

}

async function restoreRecipe(name) {
    try {
        // Gets all recipes and toppings
        const response = await fetch(`/chef/recipes/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!response.ok) { // Throw Error if response not ok
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        // Finds the old recipe and hands it back as if it were the API (only when the API fails to complete task)
        const data = await response.json();
        return { recipe: { ...data.recipes.find(r => r.name == name) } }

    } catch (error) {
        // Catches errors
        console.error('Error fetching toppings:', error);
    }
}

async function deleteRecipe(element, recipeName) {
    try {
        // Calls DELETE method in recipes API
        const response = await fetch('/chef/recipes/' + encodeURIComponent(recipeName), { method: 'DELETE' });
        if (!response.ok) { // Throw Error if response not ok
            throw new Error('Network response was not ok');
        }

        // Receives data of deleted recipe
        const deletedRecipeRes = await response.json();

        // Removes recipe screen element
        const recipeDiv = element.closest('.recipe');
        if (recipeDiv) recipeDiv.remove();

    } catch (error) {
        // Catches errors
        console.error('Error:', error);
    }
}

document.getElementById('add-recipe-form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent the form from submitting

    // Gets recipe name from screen element
    var recipeName = document.getElementById('recipe-input').value.trim();
    if (recipeName === "") {
        // Disallows submissions with blank input
        document.getElementById('recipe-input').placeholder = 'Needs recipe name!';
        return;
    }

    // Grabs recipe toppings from checkbox elements
    var recipeToppings = Array.from(this.querySelectorAll('input[type="checkbox"]:checked')).map(chbx => chbx.value);

    const data = { name: recipeName, toppings: recipeToppings }; // Prepares API body data
    this.reset(); // Resets UI element conditions

    try {
        // Calls POST in recipe API, Adding Recipe
        const response = await fetch('/chef/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) { // Throw Error if response not ok
            throw new Error('Network response was not ok');
        }

        // Receives data for new recipe added
        const newRecipeRes = await response.json();

        // Creates page element for new recipe
        addRecipeToPage(newRecipeRes.recipe);

    } catch (error) {
        // Catches errors
        console.error('Error:', error);
    }
});