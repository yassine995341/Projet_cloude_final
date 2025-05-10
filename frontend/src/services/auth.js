import api from './api';

export const login = async (username, password) => {
  try {
    const response = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (err) {
    console.error('Login error:', err.response?.data || err.message);
    throw err;
  }
};

export const logout = async () => {
  try {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    return true;
  } catch (err) {
    console.error('Logout error:', err.response?.data || err.message);
    localStorage.removeItem('token'); // Force clear token
    throw err;
  }
};

export const getCurrentUser = () => {
  return localStorage.getItem('token');
};