const express = require('express');
const userRouter = require('./controllers/users/index');
const router = express.Router();

router.use('/users', userRouter);


module.exports = router;
