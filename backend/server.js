require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');


const app = express();

// Rate limiting configuration
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Apply rate limiting to API routes
app.use('/api/books', apiLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/api/books', bookRoutes); // Add the new books API routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message || 'Internal server error'
  });
});

// Debug route registration
console.log('Properly registered routes:');
const printRoutes = (router, prefix = '') => {
  router.stack.forEach((middleware) => {
    if (middleware.route) {
      console.log(`${Object.keys(middleware.route.methods)[0].toUpperCase()} ${prefix}${middleware.route.path}`);
    } else if (middleware.name === 'router') {
      const newPrefix = prefix + (middleware.regexp.source === '^\\/?$' ? '' : middleware.regexp.source.replace(/^\\\^?|\\\$?/g, ''));
      printRoutes(middleware.handle, newPrefix);
    }
  });
};
printRoutes(app._router);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));