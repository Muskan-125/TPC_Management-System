/**
 * Job Routes
 * FEATURE 1 — Job Listing API with Filters
 * FEATURE 8 — Pagination for Jobs
 */

const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// ============================================
// FEATURE 1 & 8 — Public Routes (with filters & pagination)
// GET /api/jobs
// Query Params: page, limit, location, salary, search, companyId, jobType
// ============================================
router.get('/', jobController.getAllJobs);

// Get job by ID
router.get('/:id', jobController.getJobById);

// ============================================
// Protected Routes - Company only (verified)
// ============================================

// Create job - Company role only (must be verified)
router.post('/', authenticate, authorize('COMPANY'), jobController.createJob);

// Update job - Company that posted or Admin
router.put('/:id', authenticate, jobController.updateJob);

// Delete job - Company that posted or Admin
router.delete('/:id', authenticate, jobController.deleteJob);

// Get my posted jobs - Company only
router.get('/my/jobs', authenticate, authorize('COMPANY'), jobController.getMyPostedJobs);

module.exports = router;

