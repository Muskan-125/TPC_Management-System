const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (userId, role) => {
  const token = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'default_secret_key',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
  return token;
};

// Verify JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'default_secret_key');
};

module.exports = {
  generateToken,
  verifyToken
};

