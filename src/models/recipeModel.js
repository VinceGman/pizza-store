const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
    projectId: 'pizza-store-data-manager',
    keyFilename: './service_account.json'
});

class RecipeModel {
    constructor() {
        this.collection = firestore.collection('recipes');
    }

    async getRecipes() {
        const snapshot = await this.collection.get();
        return snapshot.docs.sort((a, b) => a._createTime - b._createTime).map(doc => doc.data());
    }

    async addRecipe(recipe) {
        const recipeNameCheckSnapshot = await this.collection.where('name', '==', recipe.name).get();
        if (!recipeNameCheckSnapshot.empty) {
            return null;
        }

        var filterOperator = recipe.toppings.length != 0 ? 'array-contains-any' : '==';
        var value = recipe.toppings.length != 0 ? recipe.toppings : [];

        const recipeToppingsCheckSnapshot = await this.collection.where('toppings', filterOperator, value).get();
        if (!recipeToppingsCheckSnapshot.empty) {
            for (let doc of recipeToppingsCheckSnapshot._docs()) {
                let docToppings = doc.data().toppings;
                if (recipe.toppings.every(topping => docToppings.includes(topping)) && recipe.toppings.length == docToppings.length) {
                    return null;
                }
            }
        }

        await this.collection.add(recipe);
        return recipe;
    }

    async updateRecipeByName(prevName, newName, newRecipe) {
        const prevNameSnapshot = await this.collection.where('name', '==', prevName).get();
        if (prevNameSnapshot.empty) {
            return null;
        }

        if (prevName != newName) {
            const newNameSnapshot = await this.collection.where('name', '==', newName).get();
            if (!newNameSnapshot.empty) {
                return null;
            }
        }

        var filterOperator = newRecipe.toppings.length != 0 ? 'array-contains-any' : '==';
        var value = newRecipe.toppings.length != 0 ? newRecipe.toppings : [];

        const recipeToppingsCheckSnapshot = await this.collection.where('toppings', filterOperator, value).get();
        if (!recipeToppingsCheckSnapshot.empty) {
            for (let doc of recipeToppingsCheckSnapshot._docs()) {
                let docData = doc.data();
                let docName = docData.name;
                let docToppings = docData.toppings;
                if (docName != prevName && newRecipe.toppings.every(topping => docToppings.includes(topping)) && newRecipe.toppings.length == docToppings.length) {
                    return null;
                }
            }
        }

        await this.collection.doc(prevNameSnapshot.docs[0].id).update(newRecipe);
        return newRecipe;
    }

    async deleteRecipeByName(name) {
        const snapshot = await this.collection.where('name', '==', name).get();
        if (snapshot.empty) {
            return null;
        }

        const recipe = { name: name };
        await this.collection.doc(snapshot.docs[0].id).delete();
        return recipe;
    }
}

module.exports = new RecipeModel();