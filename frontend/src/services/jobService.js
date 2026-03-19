/**
 * Job Service
 * Job API calls
 */

import api from './api';

// Get all jobs with filters and pagination
export const getJobs = async (params = {}) => {
  const response = await api.get('/jobs', { params });
  return response.data;
};

// Get job by ID
export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

// Create new job (Admin only)
export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

// Update job
export const updateJob = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

// Delete job
export const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

// Get company's posted jobs
export const getMyJobs = async () => {
  const response = await api.get('/jobs/my/jobs');
  return response.data;
};

export default {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs
};

