const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { 
  getAllBooks, 
  createBook, 
  deleteBook,
  searchBooksByTitleAndAuthor 
} = require('../controllers/bookController');

// Local book operations (CRUD)
router.get('/', authenticate, getAllBooks);
router.post('/', authenticate, createBook);
router.delete('/:id', authenticate, deleteBook);

// Google Books API operations
router.get('/search', authenticate, searchBooksByTitleAndAuthor);

module.exports = router;