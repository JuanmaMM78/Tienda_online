const router = require('express').Router();

const Product = require('../../models/product.model');

router.get('/', (req, res)=>{
    Product.find()
        .then(products => res.json(products))
        .catch(err => res.json(err));
   
});

router.post('/', async (req, res) => {
    try{
        const product = await Product.create(req.body);
        res.status(201).json(product);

    } catch {
        res.json(err);
    }
});

router.get('/available', async (req, res) => {
    const listProducts = await Product.available();
    res.json(listProducts);
});

// recupera precios con iva
router.get('/taxes', async (req, res) => {
    const products = await Product.find();
    const result = [];
    for(let product of products) {
        const obj = {
            name: product.name,
            price_tax: product.price_taxes
        }
        result.push(obj);
    }
    res.json(result);
});

router.get('/add/:productId', async (req, res) => {
    const { productId } = req.params;
    req.user.products.push(productId);
    await req.user.save();

    res.json({success: 'Producto insertado'})
})

// Productos del usuario logado
router.get('/cart' , (req,res) => {
    res.json(req.user.products);
})

router.get('/:productId', async (req, res) =>{
    const {productId} = req.params;

    try {  /// ponemos el try catch por si hay un error en el resultado salte al catch
        
        const product = await Product.findById(productId);

        if (!product){
            return res.status(400).json({error: 'No existe el producto'})
        }
        res.json(product);

    } catch (error) {
       res.status(400).json({error: 'No existe el producto'}); 
    }
});

router.put('/:productId', async (req, res) => {
    const {productId} = req.params;
    const product = await Product.findByIdAndUpdate(productId, req.body, {new:true});
    res.json(product);
});

router.delete('/:productId', async (req, res) => {
    const {productId} = req.params;
    const product = await Product.findByIdAndDelete(productId);
    res.json(product);
});

/// agrupa por departamento , suma productos, suma los stock
router.get('/dpto/stats', async (req, res) => {
    const listProducts = await Product.aggregate([
        {$group : {_id: '$department', numProducts: {$sum:1}, stock : {$sum:'$stock'}}} 
        
    ]);
    res.json(listProducts);
});

router.get('/dpto/same', async (req, res) => {
    const prod = new Product();
    prod.department = 'cocina';

    const products = await prod.sameDepartment();
    res.json(products);
});

router.get('/dpto/:department', async (req, res) =>{
    const {department} = req.params;
    try{
        const products = await Product.find({department : department});
        res.json(products);

    } catch (err) {
        res.json({error: err.message});
    }
});

router.get('/pr/max/:price', async (req, res) => {
    const {price} = req.params;
    const listProducts = await Product.getByMaxPrice(price);
    res.json(listProducts);
     
});

router.get('/pr/:minPrice', async (req, res) => {
    const {minPrice} = req.params;
    try {
        const products = await Product.find({price : { $gt: minPrice }})
        res.json(products)
    } catch (err){
        res.json({error: err.message})
    }
});

/// Ordenamos por una condicion en la url
router.get('/list/:order', async (req, res) => {
    const { order } = req.params;
    let ord = order === 'asc' ? 1 : -1;
    
    const listProducts = await Product.aggregate([
        {$project : {_id: 0, name: 1, price: 1}},
        {$sort : {price: ord}} 
    ]);
    res.json(listProducts);
});



module.exports = router
