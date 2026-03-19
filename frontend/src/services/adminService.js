/**
 * Admin Service
 * Admin-specific API calls
 */

import api from './api';

// Get unverified companies
export const getUnverifiedCompanies = async (params = {}) => {
  const response = await api.get('/admin/unverified-companies', { params });
  return response.data;
};

// Get verified companies
export const getVerifiedCompanies = async (params = {}) => {
  const response = await api.get('/admin/verified-companies', { params });
  return response.data;
};

// Verify a company
export const verifyCompany = async (companyId) => {
  const response = await api.patch(`/admin/verify-company/${companyId}`);
  return response.data;
};

// Unverify a company
export const unverifyCompany = async (companyId) => {
  const response = await api.patch(`/admin/unverify-company/${companyId}`);
  return response.data;
};

// Get all students
export const getAllStudents = async (params = {}) => {
  const response = await api.get('/admin/students', { params });
  return response.data;
};

// Get all companies (admin)
export const getAllCompanies = async (params = {}) => {
  const response = await api.get('/admin/companies', { params });
  return response.data;
};

// Get application statistics
export const getApplicationStats = async () => {
  const response = await api.get('/admin/application-stats');
  return response.data;
};

export default {
  getUnverifiedCompanies,
  getVerifiedCompanies,
  verifyCompany,
  unverifyCompany,
  getAllStudents,
  getAllCompanies,
  getApplicationStats
};

