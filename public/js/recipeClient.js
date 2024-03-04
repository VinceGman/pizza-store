function addRecipeToPage(recipe) {
    const template = document.getElementById('recipeTemplate');
    const newRecipeDiv = document.importNode(template.content, true);

    // Set the recipe name
    newRecipeDiv.querySelector('.recipe-name').textContent = recipe.name;

    // Optionally set onclick handlers for the buttons
    let editButton = newRecipeDiv.querySelector('.edit-btn');
    editButton.onclick = () => editRecipe(editButton, recipe.name);
    let deleteButton = newRecipeDiv.querySelector('.delete-btn');
    deleteButton.onclick = () => deleteRecipe(deleteButton, recipe.name);

    // Handle the toppings list
    const toppingsList = newRecipeDiv.querySelector('.recipe-toppings-list');
    toppingsList.innerHTML = ''; // Clear existing toppings if any
    recipe.toppings.forEach(topping => {
        const toppingItem = document.createElement('div');
        toppingItem.classList.add('recipe-topping-item');
        toppingItem.textContent = topping;
        toppingsList.appendChild(toppingItem);
    });

    // Insert the newRecipeDiv into the DOM
    document.getElementById('recipe-list').appendChild(newRecipeDiv);
}

// function editRecipe(button, recipeName) {
//     var span = button.closest('.recipe').querySelector('.recipe-name');
//     var input = document.createElement('input');
//     input.type = 'text';
//     input.value = recipeName;
//     input.className = 'recipe-name-input'; // You can style this class as needed

//     // Replace the <span> with the <input>
//     span.parentNode.replaceChild(input, span);

//     // Automatically focus the input and select its content
//     input.focus();
//     input.select();

//     // Define the event listener as a named function
//     const handleEnterPress = function (e) {
//         if (e.key === 'Enter') {
//             input.removeEventListener('keypress', handleEnterPress); // Remove the event listener
//             updateRecipe(button, recipeName, input.value);
//         }
//     };

//     // Attach the event listener
//     input.addEventListener('keypress', handleEnterPress);

//     // Change the button to say "Update" and attach the new onclick event
//     button.className = 'update-btn';
//     button.textContent = 'Update';
//     button.onclick = function () {
//         input.removeEventListener('keypress', handleEnterPress); // Also remove the listener here
//         updateRecipe(button, recipeName, input.value);
//     };
// }

// async function updateRecipe(button, prevName, newName) {
//     try {
//         const response = await fetch(`/chef/recipes/${encodeURIComponent(prevName)}/${encodeURIComponent(newName)}`, { method: 'PUT' });

//         if (!response.ok || (newName == prevName)) { newName = prevName; }

//         if (!response.ok) {
//             const errorText = await response.text(); // Attempt to read response text
//             throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Server message: ${errorText}`);
//         }
//         const deletedRecipeRes = await response.json();

//     } catch (error) {
//         console.error('Error:', error);
//     }

//     var recipeElement = button.closest('.recipe');
//     var input = recipeElement.querySelector('.recipe-name-input');
//     var span = document.createElement('span');
//     span.className = 'recipe-name';
//     span.textContent = newName;

//     // Replace the <input> with the <span>
//     input.parentNode.replaceChild(span, input);

//     // Change the update button back to an edit button
//     button.className = 'edit-btn';
//     button.textContent = 'Edit';
//     button.onclick = function () { editRecipe(button, newName); };

//     // Find the delete button and update its onclick function
//     var deleteButton = recipeElement.querySelector('.delete-btn');
//     if (deleteButton) {
//         deleteButton.onclick = function () { deleteRecipe(deleteButton, newName); };
//     }
// }

/////////////////////////////////// EXPERIMENTAL CODE ////////////////////////////////
function editRecipe(button, recipeName) {
    var span = button.closest('.recipe').querySelector('.recipe-name');
    var input = document.createElement('input');
    input.type = 'text';
    input.value = recipeName;
    input.className = 'recipe-name-input'; // You can style this class as needed

    // Replace the <span> with the <input>
    span.parentNode.replaceChild(input, span);

    // Automatically focus the input and select its content
    input.focus();
    input.select();

    // Define the event listener as a named function
    const handleEnterPress = function (e) {
        if (e.key === 'Enter') {
            input.removeEventListener('keypress', handleEnterPress); // Remove the event listener
            updateRecipe(button, recipeName, input.value);
        }
    };

    // Attach the event listener
    input.addEventListener('keypress', handleEnterPress);

    // Change the button to say "Update" and attach the new onclick event
    button.className = 'update-btn';
    button.textContent = 'Update';
    button.onclick = function () {
        input.removeEventListener('keypress', handleEnterPress); // Also remove the listener here
        updateRecipe(button, recipeName, input.value);
    };

    // Fetch toppings from the database and display them as checkboxes
    fetchToppingsAndDisplayAsCheckboxes(button.closest('.recipe').querySelector('.recipe-toppings-list'), recipeName);
}

async function fetchToppingsAndDisplayAsCheckboxes(toppingsListElement, recipeName) {
    try {
        const response = await fetch(`/chef/recipes/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        const recipe = data.recipes.find(r => r.name == recipeName);
        const availableToppings = data.toppings;

        // Clear existing toppings list
        toppingsListElement.innerHTML = '';
        // Create a checkbox for each topping
        availableToppings.forEach(topping => {
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
        console.error('Error fetching toppings:', error);
    }
}

async function updateRecipe(button, prevName, newName) {
    try {
        const toppings = Array.from(button.closest('.recipe').querySelectorAll('.recipe-toppings-list input[type=checkbox]:checked')).map(cb => cb.value);
        const payload = { name: newName, toppings: toppings };
        const response = await fetch(`/chef/recipes/${encodeURIComponent(prevName)}/${encodeURIComponent(newName)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text(); // Attempt to read response text
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}. Server message: ${errorText}`);
        }

        var updatedRecipe = await response.json();

    } catch (error) {
        console.error('Error:', error);
    }

    updatedRecipe = updatedRecipe ? updatedRecipe : await restoreRecipe(prevName);

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
        const toppingItem = document.createElement('div');
        toppingItem.className = 'recipe-topping-item';
        toppingItem.textContent = topping;
        toppingsListElement.appendChild(toppingItem);
    });

}

async function restoreRecipe(name) {
    try {
        const response = await fetch(`/chef/recipes/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return { recipe: { ...data.recipes.find(r => r.name == name) } }

    } catch (error) {
        console.error('Error fetching toppings:', error);
    }
}

/////////////////////////////////// EXPERIMENTAL CODE ////////////////////////////////

async function deleteRecipe(element, recipeName) {
    try {
        const response = await fetch('/chef/recipes/' + encodeURIComponent(recipeName), { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const deletedRecipeRes = await response.json();

        const recipeDiv = element.closest('.recipe');
        if (recipeDiv) recipeDiv.remove();

    } catch (error) {
        // console.error('Error:', error);
    }
}

document.getElementById('add-recipe-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    var recipeName = document.getElementById('recipe-input').value.trim();
    if (recipeName === "") {
        // Prevent the form from submitting
        document.getElementById('recipe-input').placeholder = 'Needs recipe name!';
        return;
    }

    var recipeToppings = Array.from(this.querySelectorAll('input[type="checkbox"]:checked')).map(chbx => chbx.value);

    const data = { name: recipeName, toppings: recipeToppings };
    this.reset();

    try {
        const response = await fetch('/chef/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const newRecipeRes = await response.json();

        addRecipeToPage(newRecipeRes.recipe); // Function to update the webpage

    } catch (error) {
        // console.error('Error:', error);
    }
});