/**
 * User Controller
 * FEATURE 5 — Resume Upload
 */

const prisma = require('../config/db');
const logger = require('../utils/logger');
const path = require('path');

// ============================================
// FEATURE 5 — Upload Resume
// POST /api/users/upload-resume
// ============================================
exports.uploadResume = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx'];
    const fileExt = path.extname(req.file.originalname).toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      return res.status(400).json({ 
        error: 'Invalid file type. Only PDF, DOC, and DOCX files are allowed' 
      });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ 
        error: 'File too large. Maximum size is 5MB' 
      });
    }

    // Get the file path to store in database
    const resumePath = `/uploads/resumes/${req.file.filename}`;

    // Update user's resume path
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { resumePath },
      select: {
        id: true,
        name: true,
        email: true,
        resumePath: true,
        updatedAt: true
      }
    });

    logger.info(`Resume uploaded: User ID ${req.user.id}, File: ${req.file.filename}`);

    res.json({
      message: 'Resume uploaded successfully',
      user: updatedUser,
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        path: resumePath
      }
    });
  } catch (error) {
    logger.error(`Upload resume error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Get current user's profile
// GET /api/users/me
// ============================================
exports.getCurrentUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        branch: true,
        batch: true,
        resumePath: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(user);
  } catch (error) {
    logger.error(`Get current user error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Update current user's profile
// PUT /api/users/me
// ============================================
exports.updateCurrentUser = async (req, res, next) => {
  try {
    const { name, phone, branch, batch } = req.body;

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        phone,
        branch,
        batch
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        branch: true,
        batch: true,
        resumePath: true,
        updatedAt: true
      }
    });

    logger.info(`Profile updated: User ID ${req.user.id}`);

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    logger.error(`Update profile error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Get all users (admin only)
// GET /api/users
// ============================================
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, branch, batch, page = 1, limit = 10 } = req.query;

    const where = {};
    if (role) where.role = role;
    if (branch) where.branch = branch;
    if (batch) where.batch = parseInt(batch);

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          branch: true,
          batch: true,
          isVerified: true,
          createdAt: true
        },
        skip,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Get all users error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Get user by ID
// GET /api/users/:id
// ============================================
exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        branch: true,
        batch: true,
        resumePath: true,
        isVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error(`Get user by ID error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Delete user (admin only)
// DELETE /api/users/:id
// ============================================
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    logger.info(`User deleted: User ID ${id} by Admin ID ${req.user.id}`);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error(`Delete user error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Update user role (admin only)
// PATCH /api/users/:id/role
// ============================================
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    const validRoles = ['STUDENT', 'COMPANY', 'ADMIN'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be: STUDENT, COMPANY, or ADMIN' 
      });
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });

    logger.info(`User role updated: User ID ${id} to ${role} by Admin ID ${req.user.id}`);

    res.json({
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    logger.error(`Update user role error: ${error.message}`);
    next(error);
  }
};

