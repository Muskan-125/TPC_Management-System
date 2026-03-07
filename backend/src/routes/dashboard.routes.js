/**
 * Dashboard Routes
 * FEATURES 2, 3, 4 — Student, Company, and Admin Dashboard
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// All dashboard routes require authentication
router.use(authenticate);

// ============================================
// FEATURE 2 — Student Dashboard
// GET /api/dashboard/student
// ============================================
router.get('/student', authorize('STUDENT'), dashboardController.getStudentDashboard);

// ============================================
// FEATURE 3 — Company Dashboard
// GET /api/dashboard/company
// ============================================
router.get('/company', authorize('COMPANY'), dashboardController.getCompanyDashboard);

// ============================================
// FEATURE 4 — Admin Dashboard
// GET /api/dashboard/admin
// ============================================
router.get('/admin', authorize('ADMIN'), dashboardController.getAdminDashboard);

module.exports = router;

