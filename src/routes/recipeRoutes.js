// routes/recipeRoutes.js
const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

router.get('/', recipeController.getRecipes);
router.post('/', recipeController.addRecipe);
router.put('/:prevName/:newName', recipeController.updateRecipe);
router.delete('/:name', recipeController.deleteRecipe);

module.exports = router;