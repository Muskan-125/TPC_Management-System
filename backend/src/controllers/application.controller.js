/**
 * Application Controller
 * FEATURE 6 — Shortlist Candidate
 * FEATURE 8 — Pagination for Applications
 */

const prisma = require('../config/db');
const logger = require('../utils/logger');

// ============================================
// Apply for a job
// POST /api/applications/jobs/:jobId/apply
// ============================================
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { resumeUrl, coverLetter } = req.body;

    // Check if user is a student
    if (req.user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'Only students can apply for jobs' });
    }

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if job is active
    if (!job.isActive) {
      return res.status(400).json({ error: 'Job is no longer accepting applications' });
    }

    // Check if deadline has passed
    if (job.deadline && new Date() > job.deadline) {
      return res.status(400).json({ error: 'Job application deadline has passed' });
    }

    // Check if user already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        studentId_jobId: {
          studentId: req.user.id,
          jobId: jobId
        }
      }
    });

    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create application
    const application = await prisma.application.create({
      data: {
        studentId: req.user.id,
        jobId: jobId,
        resumeUrl,
        coverLetter,
        status: 'APPLIED'
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            branch: true,
            batch: true
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });

    logger.info(`Application created: Application ID ${application.id} by Student ID ${req.user.id}`);
  } catch (error) {
    logger.error(`Apply for job error: ${error.message}`);
    next(error);
  }
};

// ============================================
// FEATURE 8 — Get Applications for a Job (with Pagination)
// GET /api/applications/jobs/:jobId
// ============================================
exports.getApplicationsForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Check if job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user is authorized to view applications (job poster or admin)
    if (job.companyId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to view these applications' });
    }

    const where = { jobId: jobId };
    
    // Filter by status
    if (status) {
      where.status = status.toUpperCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              branch: true,
              batch: true,
              resumePath: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { appliedAt: 'desc' }
      }),
      prisma.application.count({ where })
    ]);

    res.json({
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });

    logger.info(`Applications fetched for job ${jobId}: Page ${page}`);
  } catch (error) {
    logger.error(`Get applications for job error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Get current user's applications (with Pagination)
// GET /api/applications/my
// ============================================
exports.getMyApplications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const where = { studentId: req.user.id };
    
    // Filter by status
    if (status) {
      where.status = status.toUpperCase();
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
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
              salary: true,
              jobType: true
            }
          }
        },
        skip,
        take: parseInt(limit),
        orderBy: { appliedAt: 'desc' }
      }),
      prisma.application.count({ where })
    ]);

    res.json({
      applications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Get my applications error: ${error.message}`);
    next(error);
  }
};

// ============================================
// FEATURE 6 — Update Application Status (Shortlist/Reject)
// PATCH /api/applications/:id/status
// ============================================
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['APPLIED', 'SHORTLISTED', 'REJECTED'];
    if (!status || !validStatuses.includes(status.toUpperCase())) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be: APPLIED, SHORTLISTED, or REJECTED' 
      });
    }

    // Get the application
    const application = await prisma.application.findUnique({
      where: { id: id },
      include: {
        job: true
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user is authorized to update (job poster company or admin)
    if (application.job.companyId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this application' });
    }

    const updatedApplication = await prisma.application.update({
      where: { id: id },
      data: { status: status.toUpperCase() },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            company: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: `Application ${status.toLowerCase()} successfully`,
      application: updatedApplication
    });

    logger.info(`Application status updated: ID ${id} to ${status} by User ID ${req.user.id}`);
  } catch (error) {
    logger.error(`Update application status error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Withdraw application
// DELETE /api/applications/:id
// ============================================
exports.withdrawApplication = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id: id }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user owns the application
    if (application.studentId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to withdraw this application' });
    }

    await prisma.application.delete({
      where: { id: id }
    });

    res.json({ message: 'Application withdrawn successfully' });

    logger.info(`Application withdrawn: ID ${id} by Student ID ${req.user.id}`);
  } catch (error) {
    logger.error(`Withdraw application error: ${error.message}`);
    next(error);
  }
};

// ============================================
// Get application by ID
// GET /api/applications/:id
// ============================================
exports.getApplicationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const application = await prisma.application.findUnique({
      where: { id: id },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            branch: true,
            batch: true,
            resumePath: true
          }
        },
        job: {
          select: {
            id: true,
            title: true,
            description: true,
            company: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Check if user is authorized to view (student who applied, company that posted, or admin)
    const isStudent = application.studentId === req.user.id;
    const isCompany = application.job.companyId === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isStudent && !isCompany && !isAdmin) {
      return res.status(403).json({ error: 'Not authorized to view this application' });
    }

    res.json(application);
  } catch (error) {
    logger.error(`Get application by ID error: ${error.message}`);
    next(error);
  }
};

