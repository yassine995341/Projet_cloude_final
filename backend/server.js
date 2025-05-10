require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/books', bookRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Debug route registration
console.log('Properly registered routes:');
const printRoutes = (router, prefix = '') => {
  router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods)[0].toUpperCase()} ${prefix}${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      printRoutes(middleware.handle, prefix);
    }
  });
};
printRoutes(app._router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));