import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCheckCircle, FaClock, FaFileAlt, FaPlus, FaArrowRight } from 'react-icons/fa';
import { getStudentDashboard } from '../services/dashboardService';

const StudentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getStudentDashboard();
        setData(result);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Applications', value: data?.applications?.total || 0, icon: FaBriefcase, color: 'primary', bg: 'primary' },
    { label: 'Shortlisted', value: data?.applications?.statuses?.shortlisted || 0, icon: FaCheckCircle, color: 'success', bg: 'success' },
    { label: 'Pending', value: data?.applications?.statuses?.applied || 0, icon: FaClock, color: 'warning', bg: 'warning' },
  ];

  return (
    <div className="student-dashboard py-4">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h2 className="fw-bold mb-1">Student Dashboard</h2>
            <p className="text-muted mb-0">Track your applications and find new opportunities</p>
          </div>
          <Link to="/jobs" className="btn btn-primary">
            <FaPlus className="me-2" /> Browse Jobs
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="row g-4 mb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <div className="col-md-4" key={index}>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-1">{stat.label}</p>
                      <h2 className="fw-bold mb-0" style={{ fontSize: '2.5rem' }}>{stat.value}</h2>
                    </div>
                    <div 
                      className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        background: `var(--bs-${stat.bg})`,
                        opacity: 0.1
                      }}
                    >
                      <stat.icon className={`text-${stat.color}`} style={{ fontSize: '1.5rem', position: 'absolute' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Content Grid */}
        <div className="row g-4">
          {/* Recent Applications */}
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="card border-0 shadow-sm h-100"
            >
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Recent Applications</h5>
                  <Link to="/my-applications" className="btn btn-sm btn-outline-primary">
                    View All <FaArrowRight className="ms-1" />
                  </Link>
                </div>
              </div>
              <div className="card-body p-0">
                {data?.recentApplications?.length === 0 ? (
                  <div className="text-center py-5">
                    <FaFileAlt className="text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }} />
                    <p className="text-muted mb-3">No applications yet</p>
                    <Link to="/jobs" className="btn btn-primary btn-sm">
                      Browse Jobs
                    </Link>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {data?.recentApplications?.slice(0, 5).map((app) => (
                      <div key={app.id} className="list-group-item border-0 py-3 px-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="fw-bold mb-1">{app.job.title}</h6>
                            <p className="text-muted mb-0 small">{app.job.company.name}</p>
                          </div>
                          <span className={`status-badge status-${app.status.toLowerCase()}`}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Recommended Jobs */}
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card border-0 shadow-sm h-100"
            >
              <div className="card-header bg-white border-0 py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">Recommended Jobs</h5>
                  <Link to="/jobs" className="btn btn-sm btn-outline-primary">
                    View All <FaArrowRight className="ms-1" />
                  </Link>
                </div>
              </div>
              <div className="card-body p-0">
                {data?.recentJobs?.length === 0 ? (
                  <div className="text-center py-5">
                    <FaBriefcase className="text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }} />
                    <p className="text-muted mb-3">No new jobs available</p>
                  </div>
                ) : (
                  <div className="list-group list-group-flush">
                    {data?.recentJobs?.slice(0, 5).map((job) => (
                      <div key={job.id} className="list-group-item border-0 py-3 px-4">
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="fw-bold mb-1">{job.title}</h6>
                            <p className="text-muted mb-0 small">{job.company?.name}</p>
                          </div>
                          <Link to={`/jobs/${job.id}`} className="btn btn-sm btn-outline-primary">
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

