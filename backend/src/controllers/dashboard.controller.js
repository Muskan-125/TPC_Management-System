/**
 * Dashboard Controller
 * FEATURES 2, 3, 4 — Student, Company, and Admin Dashboard APIs
 */

const prisma = require('../config/db');
const logger = require('../utils/logger');

// ============================================
// FEATURE 2 — Student Dashboard API
// GET /api/dashboard/student
// ============================================
exports.getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get student profile
    const student = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        branch: true,
        batch: true,
        resumePath: true,
        createdAt: true
      }
    });

    // Get total jobs applied
    const totalApplications = await prisma.application.count({
      where: { studentId: userId }
    });

    // Get application statuses breakdown
    const applicationStatuses = await prisma.application.groupBy({
      by: ['status'],
      where: { studentId: userId },
      _count: {
        status: true
      }
    });

    // Format statuses for response
    const statuses = {
      applied: 0,
      shortlisted: 0,
      rejected: 0
    };

    applicationStatuses.forEach(item => {
      if (item.status === 'APPLIED') statuses.applied = item._count.status;
      if (item.status === 'SHORTLISTED') statuses.shortlisted = item._count.status;
      if (item.status === 'REJECTED') statuses.rejected = item._count.status;
    });

    // Get recent applications with job details
    const recentApplications = await prisma.application.findMany({
      where: { studentId: userId },
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true
              }
            },
            location: true,
            salary: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      take: 5
    });

    // Get recent active jobs (not applied yet)
    const recentJobs = await prisma.job.findMany({
      where: {
        isActive: true,
        deadline: {
          gte: new Date() // Jobs with future deadline
        },
        NOT: {
          applications: {
            some: { studentId: userId }
          }
        }
      },
      include: {
        company: {
          select: {
            name: true
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      profile: student,
      applications: {
        total: totalApplications,
        statuses
      },
      recentApplications,
      recentJobs,
      message: 'Student dashboard data retrieved successfully'
    });

    logger.info(`Student dashboard accessed: User ID ${userId}`);
  } catch (error) {
    logger.error(`Student dashboard error: ${error.message}`);
    next(error);
  }
};

// ============================================
// FEATURE 3 — Company Dashboard API
// GET /api/dashboard/company
// ============================================
exports.getCompanyDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Verify user is a company
    if (req.user.role !== 'COMPANY') {
      return res.status(403).json({ error: 'Access denied. Company role required.' });
    }

    // Get company profile
    const company = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        isVerified: true,
        createdAt: true
      }
    });

    // Get total jobs posted by this company
    const totalJobs = await prisma.job.count({
      where: { companyId: userId }
    });

    // Get all applications for company's jobs
    const companyJobIds = await prisma.job.findMany({
      where: { companyId: userId },
      select: { id: true }
    });

    const jobIds = companyJobIds.map(job => job.id);

    // Total applications received
    const totalApplications = await prisma.application.count({
      where: { jobId: { in: jobIds } }
    });

    // Application status breakdown
    const applicationStatuses = await prisma.application.groupBy({
      by: ['status'],
      where: { jobId: { in: jobIds } },
      _count: {
        status: true
      }
    });

    const statuses = {
      applied: 0,
      shortlisted: 0,
      rejected: 0
    };

    applicationStatuses.forEach(item => {
      if (item.status === 'APPLIED') statuses.applied = item._count.status;
      if (item.status === 'SHORTLISTED') statuses.shortlisted = item._count.status;
      if (item.status === 'REJECTED') statuses.rejected = item._count.status;
    });

    // Get jobs posted with application counts
    const jobsWithApplications = await prisma.job.findMany({
      where: { companyId: userId },
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Get recent applications
    const recentApplications = await prisma.application.findMany({
      where: { jobId: { in: jobIds } },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            branch: true,
            batch: true
          }
        },
        job: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' },
      take: 10
    });

    res.json({
      profile: company,
      jobs: {
        total: totalJobs,
        details: jobsWithApplications
      },
      applications: {
        total: totalApplications,
        statuses
      },
      recentApplications,
      message: 'Company dashboard data retrieved successfully'
    });

    logger.info(`Company dashboard accessed: User ID ${userId}`);
  } catch (error) {
    logger.error(`Company dashboard error: ${error.message}`);
    next(error);
  }
};

// ============================================
// FEATURE 4 — Admin Dashboard API
// GET /api/dashboard/admin
// ============================================
exports.getAdminDashboard = async (req, res, next) => {
  try {
    // Verify user is admin
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin role required.' });
    }

    // Get total counts
    const [totalStudents, totalCompanies, totalJobs, totalApplications] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'COMPANY' } }),
      prisma.job.count(),
      prisma.application.count()
    ]);

    // Get verified vs unverified companies
    const verifiedCompanies = await prisma.user.count({
      where: { role: 'COMPANY', isVerified: true }
    });

    const unverifiedCompanies = await prisma.user.count({
      where: { role: 'COMPANY', isVerified: false }
    });

    // Get recent registrations
    const recentStudents = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const recentCompanies = await prisma.user.findMany({
      where: { role: 'COMPANY' },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get recent jobs
    const recentJobs = await prisma.job.findMany({
      include: {
        company: {
          select: {
            name: true
          }
        },
        _count: {
          select: { applications: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Get application status distribution
    const applicationStatuses = await prisma.application.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    const statusBreakdown = {
      applied: 0,
      shortlisted: 0,
      rejected: 0
    };

    applicationStatuses.forEach(item => {
      if (item.status === 'APPLIED') statusBreakdown.applied = item._count.status;
      if (item.status === 'SHORTLISTED') statusBreakdown.shortlisted = item._count.status;
      if (item.status === 'REJECTED') statusBreakdown.rejected = item._count.status;
    });

    res.json({
      statistics: {
        totalStudents,
        totalCompanies,
        totalJobs,
        totalApplications,
        verifiedCompanies,
        unverifiedCompanies
      },
      applicationStatuses: statusBreakdown,
      recentStudents,
      recentCompanies,
      recentJobs,
      message: 'Admin dashboard data retrieved successfully'
    });

    logger.info(`Admin dashboard accessed: User ID ${req.user.id}`);
  } catch (error) {
    logger.error(`Admin dashboard error: ${error.message}`);
    next(error);
  }
};

