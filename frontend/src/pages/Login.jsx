import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGraduationCap } from 'react-icons/fa';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(formData);
      // Redirect based on role
      if (data.user.role === 'ADMIN') {
        navigate('/dashboard/admin');
      } else if (data.user.role === 'COMPANY') {
        navigate('/dashboard/company');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center py-5" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
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
              <h2 className="fw-bold mb-2">Welcome Back!</h2>
              <p className="text-muted">Sign in to continue to your dashboard</p>
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
                    <motion.div variants={itemVariants} className="mb-4">
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

                    <motion.div variants={itemVariants} className="mb-4">
                      <label className="form-label fw-semibold">Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <FaLock className="text-muted" />
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          className="form-control border-start-0"
                          placeholder="Enter your password"
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

                    <motion.div variants={itemVariants} className="mb-4">
                      <div className="form-check">
                        <input type="checkbox" className="form-check-input" id="remember" />
                        <label className="form-check-label text-muted" htmlFor="remember">
                          Remember me
                        </label>
                      </div>
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 py-3 fw-semibold"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing in...
                          </>
                        ) : (
                          'Sign In'
                        )}
                      </button>
                    </motion.div>
                  </motion.div>
                </form>

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

export default Login;

