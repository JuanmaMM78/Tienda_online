const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { checkToken } = require('../../helpers/middleware');
const { createToken } = require('../../helpers/utils');

const User = require('../../models/user.model');


// Para acceder a la funcion necesita pasar el checkToken
router.get('/profile', checkToken, (req, res) =>{
    const user = { ...req.user._doc};
    delete user.password;
    res.json(user)
});

router.post('/register', async (req, res) => {
        
    req.body.password = bcrypt.hashSync(req.body.password, 9)
    try{
        const user = await User.create(req.body);
        res.json(user);

    } catch (err) {
        res.json(err);
    }
});

router.post('/login', async (req,res) => {
    const {email, password} = req.body;

    // Miro si el ,mail esta en al DB
    const user = await User.findOne({email});
    if (!user) {
        res.json({ error: 'Error email y/o password'});
    }

    // Comprobamos la password si coincide
    const equals = bcrypt.compareSync(password, user.password);
    if(!equals) {
        res.json({ error: 'Error email y/o password'});
    }
    res.json({success: 'Login correcto', token: createToken(user)});
})

module.exports = router;