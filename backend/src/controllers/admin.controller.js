/**
 * Admin Controller
 * FEATURE 7 — Company Verification
 */

const prisma = require('../config/db');
const logger = require('../utils/logger');

// ============================================
// FEATURE 7 — Verify Company
// PATCH /api/admin/verify-company/:id
// ============================================
exports.verifyCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Check if user exists
    const company = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Verify it's actually a company
    if (company.role !== 'COMPANY') {
      return res.status(400).json({ error: 'User is not a company' });
    }

    // Update verification status
    const updatedCompany = await prisma.user.update({
      where: { id: id },
      data: { isVerified: true },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        updatedAt: true
      }
    });

    logger.info(`Company verified: Company ID ${id} by Admin ID ${req.user.id}`);

    res.json({
      message: 'Company verified successfully',
      company: updatedCompany
    });
  } catch (error) {
    logger.error(`Verify company error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Unverify Company (Reverse verification)
// PATCH /api/admin/unverify-company/:id
// ============================================
exports.unverifyCompany = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Check if user exists
    const company = await prisma.user.findUnique({
      where: { id: id }
    });

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Update verification status
    const updatedCompany = await prisma.user.update({
      where: { id: id },
      data: { isVerified: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        updatedAt: true
      }
    });

    logger.info(`Company unverified: Company ID ${id} by Admin ID ${req.user.id}`);

    res.json({
      message: 'Company verification revoked successfully',
      company: updatedCompany
    });
  } catch (error) {
    logger.error(`Unverify company error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Get All Unverified Companies
// GET /api/admin/unverified-companies
// ============================================
exports.getUnverifiedCompanies = async (req, res, next) => {
  try {
    // Verify user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const companies = await prisma.user.findMany({
      where: {
        role: 'COMPANY',
        isVerified: false
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      companies,
      count: companies.length
    });
  } catch (error) {
    logger.error(`Get unverified companies error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Get All Verified Companies
// GET /api/admin/verified-companies
// ============================================
exports.getVerifiedCompanies = async (req, res, next) => {
  try {
    // Verify user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    const companies = await prisma.user.findMany({
      where: {
        role: 'COMPANY',
        isVerified: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      companies,
      count: companies.length
    });
  } catch (error) {
    logger.error(`Get verified companies error: ${error.message}`);
    next(error);
  }
};

