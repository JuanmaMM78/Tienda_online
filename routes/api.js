const router = require('express').Router();
const { checkToken } = require('../helpers/middleware');
const apiProductsRouter = require('./api/products');
const apiUsersRouter = require('./api/users');


router.use('/products',checkToken,apiProductsRouter);

router.use('/users',apiUsersRouter);

module.exports = router