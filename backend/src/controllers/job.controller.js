/**
 * Job Controller
 * FEATURE 1 — Job Listing API with Filters
 * FEATURE 8 — Pagination for Jobs
 */

const prisma = require('../config/db');
const logger = require('../utils/logger');

// ============================================
// FEATURE 1 & 8 — Get All Jobs with Filters & Pagination
// GET /api/jobs
// Query Params: page, limit, location, salary, search, company
// ============================================
exports.getAllJobs = async (req, res, next) => {
  try {
    // Parse query parameters
    const { 
      page = 1, 
      limit = 10, 
      location, 
      salary, 
      search,
      companyId,
      jobType,
      isActive = 'true'
    } = req.query;

    // Build where clause
    const where = {};

    // Filter by active status (default: true)
    if (isActive !== undefined) {
      where.isActive = isActive === 'true';
    }

    // Filter by location (case-insensitive)
    if (location) {
      where.location = {
        contains: location,
        mode: 'insensitive'
      };
    }

    // Filter by job type
    if (jobType) {
      where.jobType = jobType;
    }

    // Filter by company ID
    if (companyId) {
      where.companyId = companyId;
    }

    // Search by job title (case-insensitive)
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive'
      };
    }

    // Filter by salary (greater than or equal to)
    if (salary) {
      where.salary = {
        gte: parseInt(salary)
      };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Execute queries in parallel
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              isVerified: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        },
        skip,
        take,
orderBy: { id: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    // Calculate total pages
    const totalPages = Math.ceil(total / take);

    res.json({
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        pages: totalPages,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      },
      filters: {
        location,
        salary,
        search,
        companyId,
        jobType
      }
    });

    logger.info(`Jobs fetched: Page ${page}, Filters: ${JSON.stringify(req.query)}`);
  } catch (error) {
    logger.error(`Get all jobs error: ${error.message}`);
    next(error);
  }
};

// Get job by ID
exports.getJobById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id: id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            isVerified: true
          }
        },
        applications: {
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
            }
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    logger.error(`Get job by ID error: ${error.message}`);
    next(error);
  }
};

// Create a new job (Company only - verified companies)
exports.createJob = async (req, res, next) => {
  try {
    const { title, description, requirements, location, salary, jobType, deadline } = req.body;

    // Check if user is a company
    if (req.user.role !== 'COMPANY') {
      return res.status(403).json({ error: 'Only companies can post jobs' });
    }

    // Check if company is verified
    const company = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!company.isVerified) {
      return res.status(403).json({ error: 'Your company must be verified to post jobs' });
    }

    const job = await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        location,
        salary,
        jobType,
        companyId: req.user.id,
        deadline: deadline ? new Date(deadline) : null,
        isActive: true
      },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });

    logger.info(`Job created: Job ID ${job.id} by Company ID ${req.user.id}`);
  } catch (error) {
    logger.error(`Create job error: ${error.message}`);
    next(error);
  }
};

// Update job
exports.updateJob = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, requirements, location, salary, jobType, deadline, isActive } = req.body;

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: id }
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user is the company that posted the job or admin
    if (existingJob.companyId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const job = await prisma.job.update({
      where: { id: id },
      data: {
        title,
        description,
        requirements,
        location,
        salary,
        jobType,
        deadline: deadline ? new Date(deadline) : undefined,
        isActive
      },
      include: {
        company: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json({
      message: 'Job updated successfully',
      job
    });

    logger.info(`Job updated: Job ID ${id}`);
  } catch (error) {
    logger.error(`Update job error: ${error.message}`);
    next(error);
  }
};

// Delete job
exports.deleteJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if job exists
    const existingJob = await prisma.job.findUnique({
      where: { id: id }
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user is the company that posted the job or admin
    if (existingJob.companyId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Not authorized to delete this job' });
    }

    await prisma.job.delete({
      where: { id: id }
    });

    res.json({ message: 'Job deleted successfully' });

    logger.info(`Job deleted: Job ID ${id}`);
  } catch (error) {
    logger.error(`Delete job error: ${error.message}`);
    next(error);
  }
};

// Get jobs posted by current company
exports.getMyPostedJobs = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    // Only companies can view their posted jobs
    if (req.user.role !== 'COMPANY') {
      return res.status(403).json({ error: 'Only companies can view their posted jobs' });
    }

    const where = { companyId: req.user.id };

    // Filter by active status
    if (status === 'active') {
      where.isActive = true;
    } else if (status === 'inactive') {
      where.isActive = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          _count: {
            select: {
              applications: true
            }
          }
        },
        take: parseInt(limit),
        orderBy: { id: 'desc' }
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error(`Get my posted jobs error: ${error.message}`);
    next(error);
  }
};

