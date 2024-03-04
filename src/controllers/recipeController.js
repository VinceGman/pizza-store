const recipeModel = require('../models/recipeModel');
const toppingModel = require('../models/toppingModel');

class RecipeController {
    async getRecipes(req, res) {
        const recipes = await recipeModel.getRecipes();
        const toppings = await toppingModel.getToppings();
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            res.status(200).json({ recipes: recipes, toppings: toppings });
        } else {
            res.render('pages/recipes', { recipes: recipes, toppings: Array.from(toppings).map(t => t.name) });
        }
    }

    async addRecipe(req, res) {
        const response = await recipeModel.addRecipe(req.body);
        if (!response) {
            return res.status(409).json({ message: 'Add: Failure' });
        } else {
            return res.status(201).json({ message: 'Add: Success', recipe: response });
        }
    }

    async updateRecipe(req, res) {
        const { prevName, newName } = req.params;
        const newRecipe = req.body;
        const response = await recipeModel.updateRecipeByName(prevName, newName, newRecipe);
        if (!response) {
            return res.status(404).json({ message: 'Update: Failure' });
        } else {
            return res.status(200).json({ message: 'Update: Success', recipe: response });
        }
    }

    async deleteRecipe(req, res) {
        const { name } = req.params;
        const response = await recipeModel.deleteRecipeByName(name);
        if (!response) {
            return res.status(404).json({ message: 'Delete: Failure' });
        } else {
            return res.status(200).json({ message: 'Delete: Success', recipe: response });
        }
    }
}

module.exports = new RecipeController();