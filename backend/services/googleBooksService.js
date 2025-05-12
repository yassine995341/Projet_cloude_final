const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

const searchBooks = async (query, author = '') => {
  try {
    let searchQuery = `intitle:${encodeURIComponent(query)}`;
    if (author) {
      searchQuery += `+inauthor:${encodeURIComponent(author)}`;
    }

    const response = await axios.get(`${BASE_URL}?q=${searchQuery}&key=${API_KEY}`);
    
    if (response.data.items) {
      return response.data.items.map(item => ({
        id: item.id,
        title: item.volumeInfo.title,
        authors: item.volumeInfo.authors || ['Unknown'],
        description: item.volumeInfo.description || 'No description available',
        publishedDate: item.volumeInfo.publishedDate,
        imageLinks: item.volumeInfo.imageLinks || {
          thumbnail: 'https://via.placeholder.com/128x196?text=No+Cover'
        },
        previewLink: item.volumeInfo.previewLink,
        infoLink: item.volumeInfo.infoLink
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error('Failed to fetch books from Google Books API');
  }
};

module.exports = {
  searchBooks
};