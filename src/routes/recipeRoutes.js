// require express, router and recipe controller
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

// /chef/recipe API routes handled by recipe controller
router.get('/', recipeController.getRecipes);
router.post('/', recipeController.addRecipe);
router.put('/:prevName/:newName', recipeController.updateRecipe);
router.delete('/:name', recipeController.deleteRecipe);

// Exports router
module.exports = router;