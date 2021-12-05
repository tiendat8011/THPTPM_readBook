const express = require('express');
const bookController = require('./books');
const router = express.Router();
const { authenticate, authorize } = require('../../../middlewares/auth');

router.get('/',/* authenticate, authorize('admin'),*/ bookController.getBook);
router.get('/detail-book/:id',/* authenticate, authorize('admin'),*/ bookController.getBookById);

router.post('/',  authenticate, authorize('author'), bookController.createBook)

router.put('/:id',/* authenticate, authorize('admin'),*/ bookController.updateBookById);

router.delete('/:id', authenticate, authorize('admin author'), bookController.deleteBookById);

module.exports = router;