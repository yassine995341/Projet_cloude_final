const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username and password are required' 
    });
  }

  try {
    // Check if username exists
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE username = ?', 
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ 
        error: 'Username already exists' 
      });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ 
      success: true,
      message: 'Registration successful' 
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      error: 'Registration failed. Please try again.' 
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0 || !(await bcrypt.compare(password, users[0].password))) {
      return res.status(401).json({ 
        error: { message: 'Invalid credentials' } 
      });
    }
    
    const token = jwt.sign({ userId: users[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ 
      error: { message: 'Login failed' } 
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const [result] = await pool.query(
      'UPDATE users SET token = NULL WHERE id = ?',
      [req.user.id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Logout failed' });
  }
};