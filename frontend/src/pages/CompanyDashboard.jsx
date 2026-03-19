import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaUsers, FaCheckCircle, FaTimesCircle, FaPlus, FaBuilding, FaExclamationTriangle } from 'react-icons/fa';
import { getCompanyDashboard } from '../services/dashboardService';

const CompanyDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getCompanyDashboard();
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
          <p className="text-muted">Loading company dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Jobs Posted', value: data?.jobs?.total || 0, icon: FaBriefcase, color: 'primary', bg: 'primary' },
    { label: 'Total Applications', value: data?.applications?.total || 0, icon: FaUsers, color: 'info', bg: 'info' },
    { label: 'Shortlisted', value: data?.applications?.statuses?.shortlisted || 0, icon: FaCheckCircle, color: 'success', bg: 'success' },
    { label: 'Rejected', value: data?.applications?.statuses?.rejected || 0, icon: FaTimesCircle, color: 'danger', bg: 'danger' },
  ];

  return (
    <div className="company-dashboard py-4">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h2 className="fw-bold mb-1">Company Dashboard</h2>
            <p className="text-muted mb-0">Manage your job postings and applications</p>
          </div>
          <button className="btn btn-primary">
            <FaPlus className="me-2" /> Post New Job
          </button>
        </motion.div>

        {/* Verification Alert */}
        {!data?.profile?.isVerified && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="alert alert-warning d-flex align-items-center mb-4"
          >
            <FaExclamationTriangle className="me-2" />
            <div>
              <strong>Your company is not verified!</strong>
              <p className="mb-0 small">Please contact the administrator to verify your company profile.</p>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div 
          className="row g-4 mb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, index) => (
            <div className="col-sm-6 col-lg-3" key={index}>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="text-muted mb-1">{stat.label}</p>
                      <h2 className="fw-bold mb-0" style={{ fontSize: '2.5rem' }}>{stat.value}</h2>
                    </div>
                    <div 
                      className="rounded-3 d-flex align-items-center justify-content-center position-relative"
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

        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card border-0 shadow-sm"
        >
          <div className="card-header bg-white border-0 py-3">
            <h5 className="fw-bold mb-0">
              <FaUsers className="me-2" />
              Recent Applications
            </h5>
          </div>
          <div className="card-body p-0">
            {data?.recentApplications?.length === 0 ? (
              <div className="text-center py-5">
                <FaUsers className="text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }} />
                <p className="text-muted">No applications yet</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th className="px-4">Student</th>
                      <th>Email</th>
                      <th>Job</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentApplications?.map((app) => (
                      <tr key={app.id}>
                        <td className="px-4">
                          <div className="d-flex align-items-center">
                            <div 
                              className="rounded-circle me-2 d-flex align-items-center justify-content-center text-white fw-bold"
                              style={{ width: '35px', height: '35px', background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)' }}
                            >
                              {app.student.name.charAt(0)}
                            </div>
                            {app.student.name}
                          </div>
                        </td>
                        <td>{app.student.email}</td>
                        <td>{app.job.title}</td>
                        <td>
                          <span className={`status-badge status-${app.status.toLowerCase()}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">View</button>
                          {app.status === 'APPLIED' && (
                            <>
                              <button className="btn btn-sm btn-success me-1">Accept</button>
                              <button className="btn btn-sm btn-danger">Reject</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

