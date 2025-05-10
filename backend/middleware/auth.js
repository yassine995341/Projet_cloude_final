const jwt = require('jsonwebtoken');
const pool = require('../db');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [decoded.userId]);
    
    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.user = users[0];
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication failed' });
  }
};