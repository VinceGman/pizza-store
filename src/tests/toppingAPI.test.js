const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
    projectId: 'pizza-store-data-manager',
    keyFilename: './service_account.json'
});

const request = require('supertest');
const server = require('../../index.js'); // Path to your Express app

describe('Topping API Test Suite', () => {
    it('Wipe Database Before', async () => {
        let allDocuments = await firestore.collection('toppings').get();
        for (let doc of allDocuments.docs) {
            await firestore.collection('toppings').doc(doc.id).delete();
        }

        let remainingDocs = (await firestore.collection('toppings').get())._docs();

        expect(remainingDocs.length).toBe(0);
    });

    it('responds to /owner/toppings (pageload)', async () => {
        const response = await request(server)
            .get('/owner/toppings')
            .expect('Content-Type', /html/) // Check that Content-Type is HTML when loads page
            .expect(200);
    });

    it('POST /owner/toppings/Cheese', async () => {
        const data = { name: 'Cheese' };
        const response = await request(server)
            .post('/owner/toppings')
            .send(data);

        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Add: Success", "topping": { "name": "Cheese" } });
    });

    it('POST /owner/toppings/Cheese (duplicate)', async () => {
        const data = { name: 'Cheese' };
        const response = await request(server)
            .post('/owner/toppings')
            .send(data);

        expect(response.statusCode).toBe(409);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Add: Failure" });
    });

    it('POST /owner/toppings/Sausage', async () => {
        const data = { name: 'Sausage' };
        const response = await request(server)
            .post('/owner/toppings')
            .send(data);

        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Add: Success", "topping": { "name": "Sausage" } });
    });

    it('DELETE /owner/toppings/Cheese', async () => {
        const response = await request(server)
            .delete('/owner/toppings/Cheese')

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Delete: Success", "topping": { "name": "Cheese" } });
    });

    it('DELETE /owner/toppings/Cheese (duplicate)', async () => {
        const response = await request(server)
            .delete('/owner/toppings/Cheese')

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Delete: Failure" });
    });

    it('DELETE /owner/toppings/Pepperoni', async () => {
        const response = await request(server)
            .delete('/owner/toppings/Pepperoni')

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Delete: Failure" });
    });

    it('PUT /owner/toppings/Sausage/Bacon', async () => {
        const response = await request(server)
            .put('/owner/toppings/Sausage/Bacon')

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Update: Success", "topping": { "name": "Bacon" } });
    });

    it('PUT /owner/toppings/Sausage/Bacon (duplicate)', async () => {
        const response = await request(server)
            .put('/owner/toppings/Sausage/Bacon')

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Update: Failure" });
    });

    it('POST /owner/toppings/Pineapple', async () => {
        const data = { name: 'Pineapple' };
        const response = await request(server)
            .post('/owner/toppings')
            .send(data);

        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Add: Success", "topping": { "name": "Pineapple" } });
    });

    it('PUT /owner/toppings/Bacon/Pineapple', async () => {
        const response = await request(server)
            .put('/owner/toppings/Bacon/Pineapple')

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Update: Failure" });
    });

    it('Wipe Database After', async () => {
        let allDocuments = await firestore.collection('toppings').get();
        for (let doc of allDocuments.docs) {
            await firestore.collection('toppings').doc(doc.id).delete();
        }

        let remainingDocs = (await firestore.collection('toppings').get())._docs();

        expect(remainingDocs.length).toBe(0);
    });
});