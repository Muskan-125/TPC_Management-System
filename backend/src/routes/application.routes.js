/**
 * Application Routes
 * FEATURE 6 — Shortlist Candidate
 * FEATURE 8 — Pagination for Applications
 */

const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/application.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// All routes require authentication
router.use(authenticate);

// ============================================
// Student Routes
// ============================================

// Apply for a job
router.post('/jobs/:jobId/apply', authorize('STUDENT'), applicationController.applyForJob);

// Get my applications (with pagination)
router.get('/my', applicationController.getMyApplications);

// Get application by ID
router.get('/:id', applicationController.getApplicationById);

// Withdraw application
router.delete('/:id', applicationController.withdrawApplication);

// ============================================
// FEATURE 6 — Company/Admin Routes
// PATCH /api/applications/:id/status
// ============================================

// Get applications for a specific job (with pagination)
router.get('/jobs/:jobId', applicationController.getApplicationsForJob);

// Update application status (shortlist/reject)
router.patch('/:id/status', applicationController.updateApplicationStatus);

module.exports = router;

