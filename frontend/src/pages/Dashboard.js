import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';
import api from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard({ setIsAuthenticated }) {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/books');
        setBooks(data);
      } catch (err) {
        setError('Failed to load books');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/books', { title, author, year });
      setBooks([...books, data]);
      setTitle('');
      setAuthor('');
      setYear('');
    } catch (err) {
      setError('Failed to add book');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter(book => book.id !== id));
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      navigate('/login');
    } catch (err) {
      setError('Logout failed');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Book Collection</h1>
        <button 
          onClick={handleLogout} 
          className="btn btn-danger"
        >
          Logout
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAddBook} className="mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Book'}
            </button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-center">Loading books...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.year || '-'}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;