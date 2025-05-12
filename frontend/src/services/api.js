import axios from 'axios';

const API_URL = 'http://localhost:3001';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Authentication APIs
export const register = (username, password) => {
  return api.post('/auth/register', { username, password });
};

export const login = (username, password) => {
  return api.post('/auth/login', { username, password });
};

export const logout = () => {
  return api.post('/auth/logout');
};

// Books APIs
export const searchBooks = (title, author) => {
  const params = new URLSearchParams();
  params.append('title', title);
  if (author) {
    params.append('author', author);
  }
  return api.get(`/api/books/search?${params.toString()}`);
};
export const addBook = (bookData) => {
  return api.post('/api/books', bookData);
};
// Books APIs
export const getUserBooks = () => {
  return api.get('/api/books');
};

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});