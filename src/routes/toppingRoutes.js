// require express, router and topping controller
const express = require('express');
const router = express.Router();
const toppingController = require('../controllers/toppingController');

// /owner/toppings API routes handled by topping controller
router.get('/', toppingController.getToppings);
router.post('/', toppingController.addTopping);
router.put('/:prevName/:newName', toppingController.updateTopping);
router.delete('/:name', toppingController.deleteTopping);

// Export router
module.exports = router;