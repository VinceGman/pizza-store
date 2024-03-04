const toppingModel = require('../models/toppingModel');

class ToppingController {
    async getToppings(req, res) {
        const toppings = await toppingModel.getToppings();
        res.render('pages/toppings', { toppings: toppings });
    }

    async addTopping(req, res) {
        const name = req.body.name;
        const response = await toppingModel.addToppingByName(name);
        if (!response) {
            return res.status(409).json({ message: 'Add: Failure' });
        } else {
            return res.status(201).json({ message: 'Add: Success', topping: response });
        }
    }

    async updateTopping(req, res) {
        const { prevName, newName } = req.params;
        const response = await toppingModel.updateToppingByName(prevName, newName);
        if (!response) {
            return res.status(404).json({ message: 'Update: Failure' });
        } else {
            return res.status(200).json({ message: 'Update: Success', topping: response });
        }
    }

    async deleteTopping(req, res) {
        const { name } = req.params;
        const response = await toppingModel.deleteToppingByName(name);
        if (!response) {
            return res.status(404).json({ message: 'Delete: Failure' });
        } else {
            return res.status(200).json({ message: 'Delete: Success', topping: response });
        }
    }
}

module.exports = new ToppingController();