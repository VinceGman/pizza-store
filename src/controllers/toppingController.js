// require utilized models
const toppingModel = require('../models/toppingModel');

class ToppingController {
    // Handles API GET method to receive topping data
    async getToppings(req, res) {
        // Grabs toppings data from topping model
        const toppings = await toppingModel.getToppings();

        // Renders page with topping data
        res.render('pages/toppings', { toppings: toppings });
    }

    // Handles API POST method to ADD topping
    async addTopping(req, res) {
        // Tokenizes request body data
        const name = req.body.name;

        // Calls corresponding model method with data
        const response = await toppingModel.addToppingByName(name);

        // If no response, assume failure, otherwise return response as JSON
        if (!response) {
            return res.status(409).json({ message: 'Add: Failure' });
        } else {
            return res.status(201).json({ message: 'Add: Success', topping: response });
        }
    }

    // Handles API PUT method to UPDATE topping
    async updateTopping(req, res) {
        // Tokenize request parameter data
        const { prevName, newName } = req.params;

        // Calls corresponding model method with data
        const response = await toppingModel.updateToppingByName(prevName, newName);

        // If no response, assume failure, otherwise return response as JSON
        if (!response) {
            return res.status(404).json({ message: 'Update: Failure' });
        } else {
            return res.status(200).json({ message: 'Update: Success', topping: response });
        }
    }

    // Handles API DELETE method to DELETE topping
    async deleteTopping(req, res) {
        // Tokenize request parameter data
        const { name } = req.params;

        // Calls corresponding model method with data
        const response = await toppingModel.deleteToppingByName(name);

        // If no response, assume failure, otherwise return response as JSON
        if (!response) {
            return res.status(404).json({ message: 'Delete: Failure' });
        } else {
            return res.status(200).json({ message: 'Delete: Success', topping: response });
        }
    }
}

// Export controller
module.exports = new ToppingController();