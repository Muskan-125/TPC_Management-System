/**
 * Auth Service
 * Authentication API calls
 */

import api from './api';

// Register new user
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get stored user
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Check user role
export const getUserRole = () => {
  const user = getStoredUser();
  return user?.role || null;
};

export default {
  register,
  login,
  getCurrentUser,
  logout,
  getStoredUser,
  isAuthenticated,
  getUserRole
};

