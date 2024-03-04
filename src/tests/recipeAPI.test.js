const { Firestore } = require('@google-cloud/firestore');
const firestore = new Firestore({
    projectId: 'pizza-store-data-manager',
    keyFilename: './service_account.json'
});

const request = require('supertest');
const server = require('../../index.js'); // Path to your Express app

describe('Recipe API Test Suite', () => {
    it('Wipe Databases Before', async () => {
        let allDocumentsRecipes = await firestore.collection('recipes').get();
        for (let doc of allDocumentsRecipes.docs) {
            await firestore.collection('recipes').doc(doc.id).delete();
        }

        let remainingDocsRecipes = (await firestore.collection('recipes').get())._docs();

        expect(remainingDocsRecipes.length).toBe(0);

        let allDocumentsToppings = await firestore.collection('toppings').get();
        for (let doc of allDocumentsToppings.docs) {
            await firestore.collection('toppings').doc(doc.id).delete();
        }

        let remainingDocsToppings = (await firestore.collection('toppings').get())._docs();

        expect(remainingDocsToppings.length).toBe(0);
    });

    it('responds to /chef/recipes (pageload)', async () => {
        const response = await request(server)
            .get('/chef/recipes')
            .expect('Content-Type', /html/) // Check that Content-Type is HTML when loads page
            .expect(200);
    });

    it('responds to /chef/recipes (data)', async () => {
        const response = await request(server)
            .get('/chef/recipes')
            .accept('application/json') // Sets the Accept header to 'application/json'
            .expect('Content-Type', /json/)
            .expect(200);

        expect(JSON.parse(response.text)).toStrictEqual({ "recipes": [], "toppings": [] });
    });

    it('Add Sausage, Pepperoni, Pineapple to database', async () => {
        const data1 = { name: 'Sausage' };
        const response1 = await request(server)
            .post('/owner/toppings')
            .send(data1);

        expect(response1.statusCode).toBe(201);
        expect(JSON.parse(response1.text)).toStrictEqual({ "message": "Add: Success", "topping": { "name": "Sausage" } });

        const data2 = { name: 'Pepperoni' };
        const response2 = await request(server)
            .post('/owner/toppings')
            .send(data2);

        expect(response2.statusCode).toBe(201);
        expect(JSON.parse(response2.text)).toStrictEqual({ "message": "Add: Success", "topping": { "name": "Pepperoni" } });

        const data3 = { name: 'Pineapple' };
        const response3 = await request(server)
            .post('/owner/toppings')
            .send(data3);

        expect(response3.statusCode).toBe(201);
        expect(JSON.parse(response3.text)).toStrictEqual({ "message": "Add: Success", "topping": { "name": "Pineapple" } });

        const data4 = { name: 'Ham' };
        const response4 = await request(server)
            .post('/owner/toppings')
            .send(data4);

        expect(response4.statusCode).toBe(201);
        expect(JSON.parse(response4.text)).toStrictEqual({ "message": "Add: Success", "topping": { "name": "Ham" } });

        const data5 = { name: 'Red Peppers' };
        const response5 = await request(server)
            .post('/owner/toppings')
            .send(data5);

        expect(response5.statusCode).toBe(201);
        expect(JSON.parse(response5.text)).toStrictEqual({ "message": "Add: Success", "topping": { "name": "Red Peppers" } });

        const data6 = { name: 'Green Peppers' };
        const response6 = await request(server)
            .post('/owner/toppings')
            .send(data6);

        expect(response6.statusCode).toBe(201);
        expect(JSON.parse(response6.text)).toStrictEqual({ "message": "Add: Success", "topping": { "name": "Green Peppers" } });
    });

    it('POST /chef/recipes/Italian', async () => {
        const data = { name: 'Italian', toppings: ['Sausage'] };
        const response = await request(server)
            .post('/chef/recipes')
            .send(data);

        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Add: Success", "recipe": { name: 'Italian', toppings: ['Sausage'] } })
    });

    it('POST /chef/recipes/Cheese (no toppings)', async () => {
        const data = { name: 'Cheese', toppings: [] };
        const response = await request(server)
            .post('/chef/recipes')
            .send(data);

        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Add: Success", "recipe": { name: 'Cheese', toppings: [] } })
    });

    it('POST /chef/recipes/Meats', async () => {
        const data = { name: 'Meats', toppings: ['Sausage', 'Pepperoni'] };
        const response = await request(server)
            .post('/chef/recipes')
            .send(data);

        expect(response.statusCode).toBe(201);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Add: Success", "recipe": { name: 'Meats', toppings: ['Sausage', 'Pepperoni'] } })
    });

    it('PUT /chef/recipes/Meats/Regular', async () => {
        const data = { name: 'Regular', toppings: ['Sausage', 'Pepperoni'] };
        const response = await request(server)
            .put('/chef/recipes/Meats/Regular')
            .send(data);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Update: Success", "recipe": { name: 'Regular', toppings: ['Sausage', 'Pepperoni'] } })
    });

    it('PUT /chef/recipes/Hawaiian/Polynesian', async () => {
        const data = { name: 'Polynesian', toppings: ['Ham', 'Pineapple'] };
        const response = await request(server)
            .put('/chef/recipes/Hawaiian/Polynesian')
            .send(data);

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Update: Failure" })
    });

    it('PUT /chef/recipes/Italian/Spicy', async () => {
        const data = { name: 'Spicy', toppings: ['Green Peppers', 'Red Peppers'] };
        const response = await request(server)
            .put('/chef/recipes/Italian/Spicy')
            .send(data);

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Update: Success", "recipe": { name: 'Spicy', toppings: ['Green Peppers', 'Red Peppers'] } })
    });

    it('DELETE /chef/recipes/Cheese', async () => {
        const response = await request(server)
            .delete('/chef/recipes/Cheese')

        expect(response.statusCode).toBe(200);
        console.log(JSON.parse(response.text));
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Delete: Success", "recipe": { name: 'Cheese' } })
    });

    it('DELETE /chef/recipes/Regular', async () => {
        const response = await request(server)
            .delete('/chef/recipes/Regular')

        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Delete: Success", "recipe": { name: 'Regular' } })
    });

    it('DELETE /chef/recipes/Hawaiian', async () => {
        const response = await request(server)
            .delete('/chef/recipes/Hawaiian')

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response.text)).toStrictEqual({ "message": "Delete: Failure" })
    });

    it('Wipe Databases After', async () => {
        let allDocumentsRecipes = await firestore.collection('recipes').get();
        for (let doc of allDocumentsRecipes.docs) {
            await firestore.collection('recipes').doc(doc.id).delete();
        }

        let remainingDocsRecipes = (await firestore.collection('recipes').get())._docs();

        expect(remainingDocsRecipes.length).toBe(0);

        let allDocumentsToppings = await firestore.collection('toppings').get();
        for (let doc of allDocumentsToppings.docs) {
            await firestore.collection('toppings').doc(doc.id).delete();
        }

        let remainingDocsToppings = (await firestore.collection('toppings').get())._docs();

        expect(remainingDocsToppings.length).toBe(0);
    });
});