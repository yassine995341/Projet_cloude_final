const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const { 
  getAllBooks, 
  createBook, 
  deleteBook 
} = require('../controllers/bookController');

router.get('/', authenticate, getAllBooks);
router.post('/', authenticate, createBook);
router.delete('/:id', authenticate, deleteBook);

module.exports = router;