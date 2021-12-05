const express = require('express');
const bookController = require('./books');
const router = express.Router();
const { authenticate, authorize } = require('../../../middlewares/auth');

router.get('/',/* authenticate, authorize('admin'),*/ bookController.getBook);

module.exports = router;