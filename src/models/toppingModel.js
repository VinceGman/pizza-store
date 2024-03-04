const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
	projectId: 'pizza-store-data-manager',
	keyFilename: './service_account.json'
});

class ToppingModel {
	constructor() {
		this.collection = firestore.collection('toppings');
	}

	async getToppings() {
		const snapshot = await this.collection.get();
		return snapshot.docs.sort((a, b) => a._createTime - b._createTime).map(doc => doc.data());
	}

	async addToppingByName(name) {
		const snapshot = await this.collection.where('name', '==', name).get();
		if (!snapshot.empty) {
			return null;
		}

		const topping = { name: name };
		await this.collection.add(topping);
		return topping;
	}

	async updateToppingByName(prevName, newName) {
		const prevNameSnapshot = await this.collection.where('name', '==', prevName).get();
		if (prevNameSnapshot.empty) {
			return null;
		}
		const newNameSnapshot = await this.collection.where('name', '==', newName).get();
		if (!newNameSnapshot.empty) {
			return null;
		}

		const topping = { name: newName };
		await this.collection.doc(prevNameSnapshot.docs[0].id).update(topping);
		return topping;
	}

	async deleteToppingByName(name) {
		const snapshot = await this.collection.where('name', '==', name).get();
		if (snapshot.empty) {
			return null;
		}

		const topping = { name: name };
		await this.collection.doc(snapshot.docs[0].id).delete();
		return topping;
	}
}

module.exports = new ToppingModel();