/**
 * User Service
 * User profile and resume management
 */

import api from './api';

// Get current user profile
export const getProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

// Update user profile
export const updateProfile = async (userData) => {
  const response = await api.put('/users/me', userData);
  return response.data;
};

// Upload resume
export const uploadResume = async (formData) => {
  const response = await api.post('/users/upload-resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

// Get all users (admin)
export const getAllUsers = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

// Delete user (admin)
export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export default {
  getProfile,
  updateProfile,
  uploadResume,
  getAllUsers,
  deleteUser
};

