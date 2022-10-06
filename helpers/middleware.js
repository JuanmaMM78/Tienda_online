const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const checkToken = async (req, res, next) => {
    // 1 - si el token viene incluido en la cabecera
   
    if(!req.headers['authorization']) {
        return res.json({error: 'No esta el Token'})
    }

    const {authorization: token } = req.headers;
// 2 Comprobamos si el token es correcto
    let obj;
    try{
        obj = jwt.verify(token,process.env.SECRET_KEY);

    } catch (err) {
        return res.json({error: 'El token no es correcto'});
    }
    console.log(obj)
    // recuperar el usuario que se a logado
    const user = await User
    .findById(obj.userId)
    .populate('products');
    req.user = user;

    next();
}

module.exports ={checkToken}