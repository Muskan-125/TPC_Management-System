/**
 * Auth Routes
 * FEATURE 10 — Rate Limiting
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter.middleware');

// Public routes - with rate limiting
// FEATURE 10 — Rate limiting applied to login and register
router.post('/register', registerLimiter, authController.register);
router.post('/login', loginLimiter, authController.login);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

module.exports = router;

