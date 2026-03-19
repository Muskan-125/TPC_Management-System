import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { isAuthenticated, getUserRole } from './services/authService';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Components
import Navbar from './components/Navbar';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

// Page transition wrapper
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  const userRole = getUserRole();
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Animated Routes Component
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/jobs" element={<PageWrapper><Jobs /></PageWrapper>} />
        <Route path="/jobs/:id" element={<PageWrapper><JobDetails /></PageWrapper>} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard/student" 
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <PageWrapper><StudentDashboard /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/company" 
          element={
            <ProtectedRoute allowedRoles={['COMPANY']}>
              <PageWrapper><CompanyDashboard /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/admin" 
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </ProtectedRoute>
          } 
        />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container mt-5 pt-4">
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;

