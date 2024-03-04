// require utilized models
const recipeModel = require('../models/recipeModel');
const toppingModel = require('../models/toppingModel');

class RecipeController {
    // Handles API GET method to receive recipes and toppings
    async getRecipes(req, res) {
        // Grabs recipes and toppings from models
        const recipes = await recipeModel.getRecipes();
        const toppings = await toppingModel.getToppings();

        // If request accepts JSON, send data, otherwise load page
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            res.status(200).json({ recipes: recipes, toppings: toppings });
        } else {
            res.render('pages/recipes', { recipes: recipes, toppings: Array.from(toppings).map(t => t.name) });
        }
    }

    // Handles API POST method to ADD recipe
    async addRecipe(req, res) {
        // Calls corresponding model method with body data
        const response = await recipeModel.addRecipe(req.body);

        // If no response, assume failure, otherwise return response as JSON
        if (!response) {
            return res.status(409).json({ message: 'Add: Failure' });
        } else {
            return res.status(201).json({ message: 'Add: Success', recipe: response });
        }
    }

    // Handles API PUT method to UPDATE recipe
    async updateRecipe(req, res) {
        // Tokenizes request parameters and body data
        const { prevName, newName } = req.params;
        const newRecipe = req.body;

        // Calls corresponding model method with param and body data
        const response = await recipeModel.updateRecipeByName(prevName, newName, newRecipe);

        // If no response, assume failure, otherwise return response as JSON
        if (!response) {
            return res.status(404).json({ message: 'Update: Failure' });
        } else {
            return res.status(200).json({ message: 'Update: Success', recipe: response });
        }
    }

    // Handles API DELETE method to DELETE recipe    
    async deleteRecipe(req, res) {
        // Tokenize request parameter
        const { name } = req.params;

        // Calls corresponding model method with param
        const response = await recipeModel.deleteRecipeByName(name);

        // If no response, assume failure, otherwise return response as JSON
        if (!response) {
            return res.status(404).json({ message: 'Delete: Failure' });
        } else {
            return res.status(200).json({ message: 'Delete: Success', recipe: response });
        }
    }
}

// Export controller
module.exports = new RecipeController();