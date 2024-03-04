// Firestore require and setup
const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
	projectId: 'pizza-store-data-manager',
	keyFilename: './service_account.json'
});

class ToppingModel {
	constructor() {
		// Model creates a collection variable to use
		this.collection = firestore.collection('toppings');
	}

	// Interacts with Firestore database to get toppings
	async getToppings() {
		// Grabs toppings
		const snapshot = await this.collection.get();

		// Returns toppings sorted by createTime
		return snapshot.docs.sort((a, b) => a._createTime - b._createTime).map(doc => doc.data());
	}

	// Interacts with Firestore database to add toppings
	async addToppingByName(name) {
		// Calls topping name, if not empty, return null (already taken)
		const snapshot = await this.collection.where('name', '==', name).get();
		if (!snapshot.empty) {
			return null;
		}

		// Creates topping object, Adds it to collection, returns it
		const topping = { name: name };
		await this.collection.add(topping);
		return topping;
	}

	// Interacts with Firestore database to update topping
	async updateToppingByName(prevName, newName) {
		// Calls previous topping name, if empty, then return null (verifies that it's there to update it)
		const prevNameSnapshot = await this.collection.where('name', '==', prevName).get();
		if (prevNameSnapshot.empty) {
			return null;
		}
		// Calls new topping name, if not empty, then return null (verifies that name isnt taken)
		const newNameSnapshot = await this.collection.where('name', '==', newName).get();
		if (!newNameSnapshot.empty) {
			return null;
		}

		// Creates topping object, Updates it in collection, returns it
		const topping = { name: newName };
		await this.collection.doc(prevNameSnapshot.docs[0].id).update(topping);
		return topping;
	}

	// Interacts with Firestore database to delete topping
	async deleteToppingByName(name) {
		// Calls topping name, if empty, return null (verifies that it's there to delete it)
		const snapshot = await this.collection.where('name', '==', name).get();
		if (snapshot.empty) {
			return null;
		}

		// Creates topping object, Deletes it from collection, returns it
		const topping = { name: name };
		await this.collection.doc(snapshot.docs[0].id).delete();
		return topping;
	}
}

// Export Recipe Model
module.exports = new ToppingModel();