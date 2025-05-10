const pool = require('../db');

const getAllBooks = async (req, res) => {
  try {
    const [books] = await pool.query(
      'SELECT * FROM books WHERE user_id = ?',
      [req.user.id]
    );
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createBook = async (req, res) => {
  const { title, author, year } = req.body;
  
  if (!title || !author) {
    return res.status(400).json({ error: 'Title and author are required' });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO books (title, author, year, user_id) VALUES (?, ?, ?, ?)',
      [title, author, year || null, req.user.id]
    );
    
    const [book] = await pool.query(
      'SELECT * FROM books WHERE id = ?',
      [result.insertId]
    );
    
    res.status(201).json(book[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const [result] = await pool.query(
      'DELETE FROM books WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllBooks,
  createBook,
  deleteBook
};