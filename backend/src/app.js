/**
 * Main Express Application
 * TPC Management Backend
 * 
 * Features Implemented:
 * 1. Job Listing API with Filters
 * 2. Student Dashboard API
 * 3. Company Dashboard API
 * 4. Admin Dashboard
 * 5. Resume Upload
 * 6. Shortlist Candidate
 * 7. Company Verification
 * 8. Pagination for Jobs & Applications
 * 9. Logging System (Winston)
 * 10. Rate Limiting
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const adminRoutes = require('./routes/admin.routes');

// Import middleware
const errorMiddleware = require('./middleware/error.middleware');
const { errorHandler } = errorMiddleware;
const { generalLimiter } = require('./middleware/rateLimiter.middleware');
const logger = require('./utils/logger');

dotenv.config();

const app = express();

// ============================================
// Middleware
// ============================================

// CORS
app.use(cors());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploaded resumes
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ============================================
// FEATURE 10 — Rate Limiting
// Apply general rate limiter to all routes
// ============================================
app.use('/api', generalLimiter);

// ============================================
// FEATURE 9 — Logging System
// Log API requests
// ============================================
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  next();
});

// ============================================
// Routes
// ============================================

// Auth routes (with rate limiting)
app.use('/api/auth', authRoutes);

// User routes (with resume upload)
app.use('/api/users', userRoutes);

// Job routes (with filters & pagination)
app.use('/api/jobs', jobRoutes);

// Application routes (with pagination & status updates)
app.use('/api/applications', applicationRoutes);

// Dashboard routes (student, company, admin)
app.use('/api/dashboard', dashboardRoutes);

// Admin routes (company verification)
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'TPC Backend is running' });
});

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

module.exports = app;

