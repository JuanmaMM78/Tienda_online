const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PRODUCT = 'product';

const productSchema = new Schema({
    name: String,
    description: String,
    department: String,
    price: Number,
    available: Boolean,
    stock: Number
});

// Propiedades virtuales
productSchema.virtual('price_taxes').get(function () {
    return (this.price * 1.21).toFixed(2);
});

// Metodo de instancia
productSchema.methods.sameDepartment = function () {
    return this.model(PRODUCT).find({department: this.department});
}

productSchema.statics.getByMaxPrice = function (price) {

    return this.model(PRODUCT).aggregate([
        {$match : {available: true, price : { $gt: parseInt(price) }}},
        {$project : {_id: 0, name: 1, price: 1}},
        {$sort : {price: 1}} 
    ]);
}

productSchema.statics.available = function () {
    return this.model(PRODUCT).aggregate([
        {$group : {_id: '$available', count: {$sum:1}, stock : {$sum:'$stock'}}},
        {$sort : {price: 1}} 
    ]);
    
}


module.exports = mongoose.model(PRODUCT, productSchema);