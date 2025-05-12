import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchBooks } from '../services/api';
import axios from 'axios';

const SearchBooks = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await searchBooks(title, author);
      setBooks(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Error searching books');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (book) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/books', {
          title: book.title,
          author: book.authors ? book.authors[0] : 'Unknown Author',
          year: book.publishedDate ? parseInt(book.publishedDate.substring(0, 4)) : 2024
      }, {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      alert('Book added to your collection!');
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error adding book:', error);
      setError('Failed to add book');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Search Books</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="row g-3">
          <div className="col-sm-5">
            <input
              type="text"
              className="form-control"
              placeholder="Book title (required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-sm-5">
            <input
              type="text"
              className="form-control"
              placeholder="Author (optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="col-sm-2">
            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {books.map((book) => (
          <div key={book.id} className="col">
            <div className="card h-100">
              {book.imageLinks?.thumbnail && (
                <img 
                  src={book.imageLinks.thumbnail} 
                  className="card-img-top" 
                  alt={book.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text">By: {book.authors?.join(', ') || 'Unknown Author'}</p>
                {book.description && (
                  <p className="card-text text-muted">
                    {book.description.substring(0, 150)}...
                  </p>
                )}
                <button 
                  className="btn btn-success w-100"
                  onClick={() => handleAddBook(book)}
                >
                  Add to Collection
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBooks;