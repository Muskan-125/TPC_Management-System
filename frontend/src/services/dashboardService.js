/**
 * Dashboard Service
 * Dashboard API calls
 */

import api from './api';

// Get student dashboard
export const getStudentDashboard = async () => {
  const response = await api.get('/dashboard/student');
  return response.data;
};

// Get company dashboard
export const getCompanyDashboard = async () => {
  const response = await api.get('/dashboard/company');
  return response.data;
};

// Get admin dashboard
export const getAdminDashboard = async () => {
  const response = await api.get('/dashboard/admin');
  return response.data;
};

export default {
  getStudentDashboard,
  getCompanyDashboard,
  getAdminDashboard
};

