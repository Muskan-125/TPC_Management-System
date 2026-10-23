import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaGraduationCap, FaEye, FaEyeSlash } from 'react-icons/fa';
import { register } from '../services/authService';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', 
    email: '', 
    password: '', 
    role: 'STUDENT', 
    phone: '', 
    branch: '', 
    batch: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const safeRole = formData.role === 'COMPANY' ? 'COMPANY' : 'STUDENT';
    const payload = { ...formData, role: safeRole };

    if (payload.role !== 'STUDENT' && payload.role !== 'COMPANY') {
      setError('Only student and company accounts can be created from this page.');
      return;
    }

    setLoading(true);

    try {
      const data = await register(payload);
      // Redirect based on role
      if (data.user.role === 'COMPANY') {
        navigate('/dashboard/company');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="register-page min-vh-100 d-flex align-items-center py-5" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-4"
            >
              <Link to="/" className="navbar-brand mb-3 d-inline-block">
                <FaGraduationCap className="me-2" style={{ fontSize: '2rem', color: '#2563eb' }} />
                <span className="gradient-text" style={{ fontSize: '1.75rem' }}>TPC</span>
              </Link>
              <h2 className="fw-bold mb-2">Create Account</h2>
              <p className="text-muted">Join our placement network and kickstart your career</p>
            </motion.div>

            <motion.div
              className="card border-0 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="card-body p-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="alert alert-danger mb-4"
                  >
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit}>
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {/* Role Selection */}
                    <motion.div variants={itemVariants} className="mb-4">
                      <label className="form-label fw-semibold">I want to register as</label>
                      <div className="row g-3">
                        <div className="col-6">
                          <label className={`card cursor-pointer h-100 ${formData.role === 'STUDENT' ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }}>
                            <div className={`card-body text-center p-3 ${formData.role === 'STUDENT' ? 'bg-primary bg-opacity-10' : ''}`}>
                              <FaUser className={`fs-3 mb-2 ${formData.role === 'STUDENT' ? 'text-primary' : 'text-muted'}`} />
                              <div className="fw-semibold">Student</div>
                              <small className="text-muted">Looking for jobs</small>
                              <input
                                type="radio"
                                name="role"
                                value="STUDENT"
                                checked={formData.role === 'STUDENT'}
                                onChange={handleChange}
                                className="d-none"
                              />
                            </div>
                          </label>
                        </div>
                        <div className="col-6">
                          <label className={`card cursor-pointer h-100 ${formData.role === 'COMPANY' ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }}>
                            <div className={`card-body text-center p-3 ${formData.role === 'COMPANY' ? 'bg-primary bg-opacity-10' : ''}`}>
                              <FaBuilding className={`fs-3 mb-2 ${formData.role === 'COMPANY' ? 'text-primary' : 'text-muted'}`} />
                              <div className="fw-semibold">Company</div>
                              <small className="text-muted">Hiring talent</small>
                              <input
                                type="radio"
                                name="role"
                                value="COMPANY"
                                checked={formData.role === 'COMPANY'}
                                onChange={handleChange}
                                className="d-none"
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                    </motion.div>

                    {/* Name & Email */}
                    <div className="row">
                      <motion.div variants={itemVariants} className="col-md-6 mb-4">
                        <label className="form-label fw-semibold">Full Name</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaUser className="text-muted" />
                          </span>
                          <input
                            type="text"
                            name="name"
                            className="form-control border-start-0"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="col-md-6 mb-4">
                        <label className="form-label fw-semibold">Email Address</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaEnvelope className="text-muted" />
                          </span>
                          <input
                            type="email"
                            name="email"
                            className="form-control border-start-0"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Password & Role */}
                    <div className="row">
                      <motion.div variants={itemVariants} className="col-md-6 mb-4">
                        <label className="form-label fw-semibold">Password</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaLock className="text-muted" />
                          </span>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            className="form-control border-start-0"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                          />
                          <button
                            type="button"
                            className="btn btn-outline-secondary border-start-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </motion.div>

                      <motion.div variants={itemVariants} className="col-md-6 mb-4">
                        <label className="form-label fw-semibold">Phone Number</label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <FaPhone className="text-muted" />
                          </span>
                          <input
                            type="text"
                            name="phone"
                            className="form-control border-start-0"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                        </div>
                      </motion.div>
                    </div>

                    {/* Student-specific fields */}
                    {formData.role === 'STUDENT' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="row"
                      >
                        <motion.div variants={itemVariants} className="col-md-6 mb-4">
                          <label className="form-label fw-semibold">Branch/Department</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <FaGraduationCap className="text-muted" />
                            </span>
                            <input
                              type="text"
                              name="branch"
                              className="form-control border-start-0"
                              placeholder="e.g., Computer Science"
                              value={formData.branch}
                              onChange={handleChange}
                            />
                          </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="col-md-6 mb-4">
                          <label className="form-label fw-semibold">Batch Year</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <FaBuilding className="text-muted" />
                            </span>
                            <input
                              type="number"
                              name="batch"
                              className="form-control border-start-0"
                              placeholder="e.g., 2024"
                              value={formData.batch}
                              onChange={handleChange}
                            />
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} className="mt-2">
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-3 fw-semibold"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Account...
                          </>
                        ) : (
                          'Create Account'
                        )}
                      </button>
                    </motion.div>
                  </motion.div>
                </form>

                <motion.p
                  className="text-center mt-4 mb-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Already have an account?{' '}
                  <Link to="/login" className="fw-semibold text-decoration-none">
                    Sign In
                  </Link>
                </motion.p>
              </div>
            </motion.div>

            <motion.p
              className="text-center mt-4 text-muted"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link to="/" className="text-muted text-decoration-none">
                ← Back to Home
              </Link>
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

