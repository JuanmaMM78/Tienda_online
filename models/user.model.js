const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username :{ 
        type: String, 
        required:[true, 'El campo username es obligatorio'],
        minLength: [3,'El username debe tener 3 caracteres como minimo'],
        maxLength: [10,'El username debe tener 10 caracteres como maximo'],
    },
    email: {
        type: String,
        match: /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },
    password: String,
    active: Boolean,
    role: { 
        type: String, 
        default: 'regular',
        enum: {
            values: ['regular', 'admin'],
            message: 'El rol no es valido'
        }
    },
    // Relacionamos entre colecciones
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'product'
    }]
},{ timestamps: true }); /// Añade dos valores de tiempo automaticamnete

module.exports = mongoose.model('user', userSchema);