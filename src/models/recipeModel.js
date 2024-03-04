// Firestore require and setup
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
    projectId: 'pizza-store-data-manager',
    keyFilename: './service_account.json'
});

class RecipeModel {
    constructor() {
        // Model creates a collection variable to use
        this.collection = firestore.collection('recipes');
    }

    // Interacts with Firestore database to get all recipes
    async getRecipes() {
        // Grabs recipes
        const snapshot = await this.collection.get();

        // Returns recipes sorted by createTime
        return snapshot.docs.sort((a, b) => a._createTime - b._createTime).map(doc => doc.data());
    }

    // Interacts with Firestore database to add recipe
    async addRecipe(recipe) {
        // Calls recipe name, if not empty returns null (already taken)
        const recipeNameCheckSnapshot = await this.collection.where('name', '==', recipe.name).get();
        if (!recipeNameCheckSnapshot.empty) {
            return null;
        }

        // Sets filter operator and value to query database (handles recipes with no toppings)
        var filterOperator = recipe.toppings.length != 0 ? 'array-contains-any' : '==';
        var value = recipe.toppings.length != 0 ? recipe.toppings : [];

        // Calls database for any recipe that might match new recipe, if one matches returns null
        const recipeToppingsCheckSnapshot = await this.collection.where('toppings', filterOperator, value).get();
        if (!recipeToppingsCheckSnapshot.empty) {
            for (let doc of recipeToppingsCheckSnapshot._docs()) {
                let docToppings = doc.data().toppings;
                // Must include every topping and be equal sizes to match
                if (recipe.toppings.every(topping => docToppings.includes(topping)) && recipe.toppings.length == docToppings.length) {
                    return null;
                }
            }
        }

        // Adds recipe to collection and returns it
        await this.collection.add(recipe);
        return recipe;
    }

    // Interacts with Firestore database to update recipe
    async updateRecipeByName(prevName, newName, newRecipe) {
        // Calls previous recipe name, if empty returns null (verifies that it's there to update it)
        const prevNameSnapshot = await this.collection.where('name', '==', prevName).get();
        if (prevNameSnapshot.empty) {
            return null;
        }

        // If recipe name changes, then calls new name, if there's one there, name is taken so returns null
        if (prevName != newName) {
            const newNameSnapshot = await this.collection.where('name', '==', newName).get();
            if (!newNameSnapshot.empty) {
                return null;
            }
        }

        // Sets filter operator and value to query database (handles recipes with no toppings)
        var filterOperator = newRecipe.toppings.length != 0 ? 'array-contains-any' : '==';
        var value = newRecipe.toppings.length != 0 ? newRecipe.toppings : [];

        // Calls database for any recipe that might match new recipe by toppings or name, if one matches returns null
        const recipeToppingsCheckSnapshot = await this.collection.where('toppings', filterOperator, value).get();
        if (!recipeToppingsCheckSnapshot.empty) {
            for (let doc of recipeToppingsCheckSnapshot._docs()) {
                let docData = doc.data();
                let docName = docData.name;
                let docToppings = docData.toppings;
                // Can't match itself && Must include every topping && Must be the same size
                if (docName != prevName && newRecipe.toppings.every(topping => docToppings.includes(topping)) && newRecipe.toppings.length == docToppings.length) {
                    return null;
                }
            }
        }

        // Update topping in collection and returns it
        await this.collection.doc(prevNameSnapshot.docs[0].id).update(newRecipe);
        return newRecipe;
    }

    // Interacts with Firestore database to delete recipe
    async deleteRecipeByName(name) {
        // Calls previous recipe name, if empty returns null (verifies that it's there to delete it)
        const snapshot = await this.collection.where('name', '==', name).get();
        if (snapshot.empty) {
            return null;
        }

        // Makes recipe with just name to return it, Delete topping in collection
        const recipe = { name: name };
        await this.collection.doc(snapshot.docs[0].id).delete();
        return recipe;
    }
}

// Export Recipe Model
module.exports = new RecipeModel();