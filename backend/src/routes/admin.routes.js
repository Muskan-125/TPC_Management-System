/**
 * Admin Routes
 * FEATURE 7 — Company Verification
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('ADMIN'));

// ============================================
// FEATURE 7 — Company Verification
// PATCH /api/admin/verify-company/:id
// ============================================
router.patch('/verify-company/:id', adminController.verifyCompany);

// Unverify company
router.patch('/unverify-company/:id', adminController.unverifyCompany);

// Get unverified companies
router.get('/unverified-companies', adminController.getUnverifiedCompanies);

// Get verified companies
router.get('/verified-companies', adminController.getVerifiedCompanies);

module.exports = router;

