/**
 * Example Prisma Queries for TPC Job Portal
 * These queries demonstrate how to use the Prisma schema with proper relations
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============================================
// USER QUERIES
// ============================================

// Create a new user (student, company, or admin)
async function createUser(userData) {
  return await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password, // Should be hashed
      role: userData.role || 'STUDENT',
    },
  });
}

// Get user by email
async function getUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

// Get user by ID
async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

// Get all students
async function getAllStudents() {
  return await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });
}

// ============================================
// JOB QUERIES
// ============================================

// Create a new job (by a company)
async function createJob(companyId, jobData) {
  return await prisma.job.create({
    data: {
      title: jobData.title,
      description: jobData.description,
      salary: jobData.salary,
      location: jobData.location,
      companyId: companyId,
    },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

// Get all jobs (with company info)
async function getAllJobs() {
  return await prisma.job.findMany({
    include: {
      company: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Get job by ID (with applications)
async function getJobById(id) {
  return await prisma.job.findUnique({
    where: { id },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      applications: {
        include: {
          student: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
}

// Get all jobs posted by a company
async function getJobsByCompany(companyId) {
  return await prisma.job.findMany({
    where: { companyId },
    include: {
      _count: {
        select: { applications: true },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Update job
async function updateJob(id, jobData) {
  return await prisma.job.update({
    where: { id },
    data: jobData,
  });
}

// Delete job
async function deleteJob(id) {
  return await prisma.job.delete({
    where: { id },
  });
}

// ============================================
// APPLICATION QUERIES
// ============================================

// Apply for a job (student applies)
async function applyForJob(studentId, jobId) {
  return await prisma.application.create({
    data: {
      studentId,
      jobId,
      status: 'APPLIED',
    },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
  });
}

// Get all applications for a job (for company)
async function getApplicationsForJob(jobId) {
  return await prisma.application.findMany({
    where: { jobId },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Get all applications by a student
async function getApplicationsByStudent(studentId) {
  return await prisma.application.findMany({
    where: { studentId },
    include: {
      job: {
        include: {
          company: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// Update application status (shortlist/reject)
async function updateApplicationStatus(applicationId, status) {
  return await prisma.application.update({
    where: { id: applicationId },
    data: { status },
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });
}

// Get application by ID
async function getApplicationById(id) {
  return await prisma.application.findUnique({
    where: { id },
    include: {
      student: true,
      job: true,
    },
  });
}

// Check if student already applied to a job
async function hasApplied(studentId, jobId) {
  const application = await prisma.application.findUnique({
    where: {
      studentId_jobId: {
        studentId,
        jobId,
      },
    },
  });
  return application !== null;
}

// ============================================
// RELATIONSHIP QUERIES
// ============================================

// Get company with all their jobs
async function getCompanyWithJobs(companyId) {
  return await prisma.user.findUnique({
    where: { id: companyId },
    include: {
      jobs: {
        include: {
          _count: {
            select: { applications: true },
          },
        },
      },
    },
  });
}

// Get student with all their applications
async function getStudentWithApplications(studentId) {
  return await prisma.user.findUnique({
    where: { id: studentId },
    include: {
      applications: {
        include: {
          job: true,
        },
      },
    },
  });
}

// Get job with all applicants
async function getJobWithApplicants(jobId) {
  return await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      applications: {
        include: {
          student: true,
        },
      },
    },
  });
}

// Get all applications with student and job details
async function getAllApplications() {
  return await prisma.application.findMany({
    include: {
      student: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

// ============================================
// AGGREGATION QUERIES
// ============================================

// Count jobs by company
async function countJobsByCompany(companyId) {
  return await prisma.job.count({
    where: { companyId },
  });
}

// Count applications for a job
async function countApplicationsForJob(jobId) {
  return await prisma.application.count({
    where: { jobId },
  });
}

// Count applications by student
async function countApplicationsByStudent(studentId) {
  return await prisma.application.count({
    where: { studentId },
  });
}

// Get application statistics for a job
async function getJobApplicationStats(jobId) {
  const total = await prisma.application.count({ where: { jobId } });
  const shortlisted = await prisma.application.count({
    where: { jobId, status: 'SHORTLISTED' },
  });
  const rejected = await prisma.application.count({
    where: { jobId, status: 'REJECTED' },
  });
  const pending = await prisma.application.count({
    where: { jobId, status: 'APPLIED' },
  });

  return { total, shortlisted, rejected, pending };
}

module.exports = {
  // User queries
  createUser,
  getUserByEmail,
  getUserById,
  getAllStudents,
  // Job queries
  createJob,
  getAllJobs,
  getJobById,
  getJobsByCompany,
  updateJob,
  deleteJob,
  // Application queries
  applyForJob,
  getApplicationsForJob,
  getApplicationsByStudent,
  updateApplicationStatus,
  getApplicationById,
  hasApplied,
  // Relationship queries
  getCompanyWithJobs,
  getStudentWithApplications,
  getJobWithApplicants,
  getAllApplications,
  // Aggregation queries
  countJobsByCompany,
  countApplicationsForJob,
  countApplicationsByStudent,
  getJobApplicationStats,
};
