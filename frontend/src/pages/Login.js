import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function AuthPage({ setIsAuthenticated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const { data } = await api.post(endpoint, form);

      if (isLogin && data.token) {
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        navigate('/');
      } else if (!isLogin) {
        // After successful registration, switch to login view
        setIsLogin(true);
        setError(''); // Clear any errors
        alert('Registration successful! Please login.');
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        (isLogin ? 'Login failed' : 'Registration failed')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">
                {isLogin ? 'Login' : 'Register'}
              </h2>

              {error && (
                <div className="alert alert-danger">
                  {typeof error === 'string' ? error : JSON.stringify(error)}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                    minLength={3}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </button>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
                >
                  {isLogin 
                    ? 'Need an account? Register' 
                    : 'Already have an account? Login'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;