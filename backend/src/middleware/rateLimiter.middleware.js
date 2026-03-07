/**
 * Rate Limiting Middleware
 * FEATURE 10 — Rate Limiting
 * 
 * Uses express-rate-limit to prevent API abuse
 */

const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// ============================================
// General API Rate Limiter
// Applied to all routes
// ============================================
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded: IP ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  }
});

// ============================================
// Login Rate Limiter
// FEATURE 10 — Applied to login API
// ============================================
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: {
    error: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Login rate limit exceeded: IP ${req.ip}, Email: ${req.body.email}`);
    res.status(options.statusCode).json(options.message);
  }
});

// ============================================
// Registration Rate Limiter
// FEATURE 10 — Applied to register API
// ============================================
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registration attempts per hour
  message: {
    error: 'Too many registration attempts from this IP, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Registration rate limit exceeded: IP ${req.ip}`);
    res.status(options.statusCode).json(options.message);
  }
});

// ============================================
// Job Application Rate Limiter
// Prevent spam applying to jobs
// ============================================
const applyJobLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 job applications per hour
  message: {
    error: 'Too many job applications, please try again after an hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Job application rate limit exceeded: IP ${req.ip}, User ID ${req.user?.id}`);
    res.status(options.statusCode).json(options.message);
  }
});

// ============================================
// Job Posting Rate Limiter
// Companies can only post a limited number of jobs
// ============================================
const postJobLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // Limit each company to 10 job posts per day
  message: {
    error: 'Too many job postings, please try again tomorrow'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Job posting rate limit exceeded: IP ${req.ip}, User ID ${req.user?.id}`);
    res.status(options.statusCode).json(options.message);
  }
});

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  applyJobLimiter,
  postJobLimiter
};

