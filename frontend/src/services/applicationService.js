/**
 * Application Service
 * Application management API calls
 */

import api from './api';

// Apply for a job
export const applyForJob = async (jobId, applicationData = {}) => {
  const response = await api.post(`/applications/jobs/${jobId}/apply`, applicationData);
  return response.data;
};

// Get my applications (student)
export const getMyApplications = async (params = {}) => {
  const response = await api.get('/applications/my', { params });
  return response.data;
};

// Get applications for a job (company)
export const getJobApplications = async (jobId, params = {}) => {
  const response = await api.get(`/applications/jobs/${jobId}`, { params });
  return response.data;
};

// Update application status (shortlist/reject)
export const updateApplicationStatus = async (applicationId, status) => {
  const response = await api.patch(`/applications/${applicationId}/status`, { status });
  return response.data;
};

// Get all applications (admin)
export const getAllApplications = async (params = {}) => {
  const response = await api.get('/applications', { params });
  return response.data;
};

export default {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getAllApplications
};

