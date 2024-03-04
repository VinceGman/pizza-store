// routes/toppingRoutes.js
const express = require('express');
const router = express.Router();
const toppingController = require('../controllers/toppingController');

router.get('/', toppingController.getToppings);
router.post('/', toppingController.addTopping);
router.put('/:prevName/:newName', toppingController.updateTopping);
router.delete('/:name', toppingController.deleteTopping);

module.exports = router;