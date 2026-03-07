const prisma = require('../config/db');

class JobService {
  // Create a new job
  async createJob(jobData, postedBy) {
    const { title, company, description, requirements, location, salary, jobType, deadline } = jobData;

    const job = await prisma.job.create({
      data: {
        title,
        company,
        description,
        requirements: requirements || [],
        location,
        salary,
        jobType,
        postedBy,
        deadline: deadline ? new Date(deadline) : null
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return job;
  }

  // Get all jobs with filtering and pagination
  async getAllJobs(filters = {}, pagination = {}) {
    const { company, jobType, isActive } = filters;
    const { page = 1, limit = 10 } = pagination;

    const where = {};
    if (company) where.company = { contains: company, mode: 'insensitive' };
    if (jobType) where.jobType = jobType;
    if (isActive !== undefined) where.isActive = isActive;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: {
            applications: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.job.count({ where });

    return {
      jobs,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get job by ID
  async getJobById(id) {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        applications: {
          include: {
            user: {
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

    return job;
  }

  // Update job
  async updateJob(id, jobData) {
    const { title, company, description, requirements, location, salary, jobType, deadline, isActive } = jobData;

    const job = await prisma.job.update({
      where: { id },
      data: {
        title,
        company,
        description,
        requirements,
        location,
        salary,
        jobType,
        deadline: deadline ? new Date(deadline) : undefined,
        isActive
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return job;
  }

  // Delete job
  async deleteJob(id) {
    await prisma.job.delete({
      where: { id }
    });
  }

  // Get jobs posted by a specific user
  async getJobsByUser(userId) {
    const jobs = await prisma.job.findMany({
      where: { postedBy: userId },
      include: {
        _count: {
          select: {
            applications: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return jobs;
  }

  // Get active jobs
  async getActiveJobs() {
    const jobs = await prisma.job.findMany({
      where: { isActive: true },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return jobs;
  }

  // Get jobs by company
  async getJobsByCompany(company) {
    const jobs = await prisma.job.findMany({
      where: {
        company: { contains: company, mode: 'insensitive' }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return jobs;
  }
}

module.exports = new JobService();

