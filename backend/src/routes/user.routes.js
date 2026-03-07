/**
 * User Routes
 * FEATURE 5 — Resume Upload
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');
const upload = require('../config/multer');

// Public routes
// None for now

// Protected routes - All authenticated users
router.use(authenticate);

// ============================================
// FEATURE 5 — Resume Upload
// POST /api/users/upload-resume
// ============================================
router.post('/upload-resume', upload.single('resume'), userController.uploadResume);

// Get current user profile
router.get('/me', userController.getCurrentUser);

// Update current user profile
router.put('/me', userController.updateCurrentUser);

// Admin only routes
router.use(authorize('ADMIN'));

// Get all users (admin)
router.get('/', userController.getAllUsers);

// Get user by ID (admin)
router.get('/:id', userController.getUserById);

// Update user role (admin)
router.patch('/:id/role', userController.updateUserRole);

// Delete user (admin)
router.delete('/:id', userController.deleteUser);

module.exports = router;

