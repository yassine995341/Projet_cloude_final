import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserBooks } from '../services/api';

function Dashboard() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await getUserBooks();
        setBooks(response.data);
      } catch (err) {
        setError('Failed to fetch books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleSearchClick = () => {
    navigate('/search');
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Dashboard</h1>
        <div>
          <button className="btn btn-primary me-2" onClick={handleSearchClick}>Search Books</button>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </div>
      
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h2 className="mb-0">My Books</h2>
            </div>
            <div className="card-body">
              {books.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                  {books.map(book => (
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
                          <p className="card-text">
                            By {book.authors?.join(', ') || 'Unknown Author'}
                          </p>
                          {book.description && (
                            <p className="card-text text-muted">
                              {book.description.substring(0, 150)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-3">No books found. Start by searching and adding some books!</p>
                  <button className="btn btn-primary" onClick={handleSearchClick}>
                    Search Books
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;