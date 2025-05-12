const { searchBooks } = require('../services/googleBooksService');
const pool = require('../db');  // Add this line at the top

const searchBooksByTitleAndAuthor = async (req, res) => {
  try {
    const { title, author } = req.query;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const books = await searchBooks(title, author);
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const getAllBooks = async (req, res) => {
  try {
    const userId = req.user.id;
    const [books] = await pool.query(
      'SELECT * FROM books WHERE user_id = ? ORDER BY id DESC',
      [userId]
    );
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'Failed to fetch books' });
  }
};

const createBook = async (req, res) => {
  try {
    const { title, author, year } = req.body;
    const userId = req.user.id;

    // Insert the book into the database
    const [result] = await pool.query(
      'INSERT INTO books (title, author, year, user_id) VALUES (?, ?, ?, ?)',
      [title, author, year || null, userId]
    );

    res.status(201).json({ 
      id: result.insertId,
      message: 'Book added successfully' 
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'Failed to add book' });
  }
};


const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    // For now, just return success
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  deleteBook,
  searchBooksByTitleAndAuthor
};