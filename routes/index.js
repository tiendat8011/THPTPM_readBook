const express = require('express');
const userRouter = require('./controllers/users/index');
const bookRouter = require('./controllers/books/index')
const categoryRouter = require('./controllers/category/index')
const router = express.Router();

router.use('/users', userRouter);
router.use('/books', bookRouter);
router.use('/category', categoryRouter);



module.exports = router;
