const express = require('express');
const bookController = require('./books');
const router = express.Router();
const { authenticate, authorize } = require('../../../middlewares/auth');

router.get('/',authenticate,  bookController.getBook);
router.get('/detail-book/:id', authenticate, bookController.getBookById);
router.get('/author/:id', authenticate, bookController.getBookByAuthor);

router.post('/',  authenticate, authorize('author'), bookController.createBook)

router.put('/:id', authenticate, authorize('admin author'), bookController.updateBookById);

router.delete('/:id', authenticate, authorize('admin author'), bookController.deleteBookById);

module.exports = router;