const request = require('supertest');
const mongoose = require('mongoose'); ///requerimos para enganchar a la bd

const app = require('../../app');
const Products = require('../../models/product.model');

describe('Api de productos', () => {

    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online');
    })

    afterAll(async () => {
        await mongoose.disconnect();
    })

    describe('GET /api/products', () => {

        let response;   
        /// se ejecuta antes de todas las pruebas en conjunto
        beforeAll(async ()=>{
            response = await request(app).get('/api/products'). send();
            
        });     

        it('deveria responder con status 200', ()=>{
            expect(response.statusCode).toBe(200);
        });

        it('deveria responder un json', ()=>{
            expect(response.headers['content-type']).toContain('application/json');
        });

        it('deveria responder un Array', ()=>{
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /api/products/productId', () => {

        it('deveria devolver un JSON correcto', async () => {
            const response = await request(app).get('/api/products/633be6da0451135592e7eece').send();
            expect(response.statusCode).toBe(200);
            expect(response.header['content-type']).toContain('application/json');
        });

        it('deveria recuperar el producto croorecto', async () => {
            const response = await request(app).get('/api/products/633be6da0451135592e7eece').send();
            expect(response.body.name).toBeDefined(); //comprueba si contiene name
            expect(response.body.name).toBe('Picadora');
        });

        it('deveria devolver si el id no existe', async () => {
            const response = await request(app).get('/api/products/invalidoId').send();
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBeDefined();  // comprueba si comtiene error
        });

    });

    describe('POST /api/products', () => {

        let response;   /// la creamos fuera para poder usarla en las pruebas
        const newProduct = { name: 'Robot Roomba', description: 'Limpia y frega', price: '23', department: 'test', available: true, stock: 3};

        beforeEach(async () => {
            response = await request(app).post('/api/products').send(newProduct);
        });

        afterAll( async () => {
            await Products.deleteMany({department : 'test'});
        });

        it('deveria devolver un formato correcto', () => {
            expect(response.statusCode).toBe(201);
            expect(response.headers['content-type']).toContain('application/json');       
        });

        it('deveria obtener el objeto  bien creado', () => {
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(newProduct.name);
        });

    });

    describe('PUT /api/products/productId', () => {

        let response;
        let prod
        const newProduct = { name: 'Robot Roomba', description: 'Limpia y frega', price: 23, department: 'test', available: true, stock: 3};
        beforeEach(async () => {

             prod = await Products.create(newProduct);
             response = await request(app)
             .put(`/api/products/${prod._id}`)
             .send({price: 78, department: 'otro'});
        });
    
        afterEach(async () => {
            await Products.findByIdAndDelete(prod._id);
        });
    
        it('deveria devolver un JSON correcto', async () => {
            expect(response.statusCode).toBe(200);
            expect(response.header['content-type']).toContain('application/json');
        });

        it('deveria responder con los datos modificados', async () => {
            expect(response.body.price).toBe(78);
            expect(response.body.department).toBe('otro');
        });
    });

    describe('DELETE /api/products/productId', () => {

        let response;  
        let prod;

        const newProduct = { name: 'Robot Roomba', description: 'Limpia y frega', price: '23', department: 'test', available: true, stock: 3};

        beforeEach(async () => {
            prod = await Products.create(newProduct);
            console.log(prod)
            response = await request(app).delete(`/api/products/${prod._id}`).send();    
                    
        });

        afterAll( async () => {
            await Products.deleteMany({department : 'test'});
        });

        it('deveria devolver un JSON correcto', async () => {
            expect(response.statusCode).toBe(200);
            expect(response.header['content-type']).toContain('application/json');
        });

        it('deveria borrar el producto creado', async () => {
            const deleteProduct = await Products.findById(prod._id);
            expect(deleteProduct).toBeNull();
        });

    });        
});