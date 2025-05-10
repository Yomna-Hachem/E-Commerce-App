const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate a JWT token for a given user ID or payload
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

// Verify a JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// Middleware to protect routes using the JWT in cookies
const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = verifyToken(token); // { userId, ... }
    req.user = decoded; // Attach user data to the request
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
  }
};

module.exports = {
  generateToken,
  verifyToken,
  authMiddleware
};
