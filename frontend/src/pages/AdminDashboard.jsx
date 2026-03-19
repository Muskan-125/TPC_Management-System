import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaBuilding, FaBriefcase, FaFileAlt, FaCheckCircle, FaTimesCircle, FaCog } from 'react-icons/fa';
import { getAdminDashboard } from '../services/dashboardService';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const result = await getAdminDashboard();
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
          <p className="text-muted">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Students', value: data?.statistics?.totalStudents || 0, icon: FaUsers, color: 'primary', bg: 'primary' },
    { label: 'Total Companies', value: data?.statistics?.totalCompanies || 0, icon: FaBuilding, color: 'success', bg: 'success' },
    { label: 'Total Jobs', value: data?.statistics?.totalJobs || 0, icon: FaBriefcase, color: 'warning', bg: 'warning' },
    { label: 'Applications', value: data?.statistics?.totalApplications || 0, icon: FaFileAlt, color: 'info', bg: 'info' },
  ];

  return (
    <div className="admin-dashboard py-4">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h2 className="fw-bold mb-1">
              <FaCog className="me-2" style={{ color: '#2563eb' }} />
              Admin Dashboard
            </h2>
            <p className="text-muted mb-0">Manage students, companies, and placements</p>
          </div>
        </motion.div>

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

        {/* Verification Status */}
        <motion.div 
          className="row g-4 mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="fw-bold mb-0">
                  <FaCheckCircle className="me-2 text-success" />
                  Verified Companies
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {data?.recentCompanies?.filter(c => c.isVerified).slice(0, 5).map((company) => (
                    <div key={company.id} className="list-group-item border-0 py-3 px-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1">{company.name}</h6>
                          <p className="text-muted mb-0 small">{company.email}</p>
                        </div>
                        <span className="badge bg-success">Verified</span>
                      </div>
                    </div>
                  ))}
                  {(!data?.recentCompanies || data.recentCompanies.filter(c => c.isVerified).length === 0) && (
                    <div className="text-center py-4 text-muted">No verified companies</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="fw-bold mb-0">
                  <FaTimesCircle className="me-2 text-warning" />
                  Pending Verification
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="list-group list-group-flush">
                  {data?.recentCompanies?.filter(c => !c.isVerified).slice(0, 5).map((company) => (
                    <div key={company.id} className="list-group-item border-0 py-3 px-4">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="fw-bold mb-1">{company.name}</h6>
                          <p className="text-muted mb-0 small">{company.email}</p>
                        </div>
                        <button className="btn btn-sm btn-success">Verify</button>
                      </div>
                    </div>
                  ))}
                  {(!data?.recentCompanies || data.recentCompanies.filter(c => !c.isVerified).length === 0) && (
                    <div className="text-center py-4 text-muted">No pending verifications</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card border-0 shadow-sm"
        >
          <div className="card-header bg-white border-0 py-3">
            <h5 className="fw-bold mb-0">
              <FaBriefcase className="me-2" />
              Recent Jobs
            </h5>
          </div>
          <div className="card-body p-0">
            {data?.recentJobs?.length === 0 ? (
              <div className="text-center py-5">
                <FaBriefcase className="text-muted mb-3" style={{ fontSize: '3rem', opacity: 0.3 }} />
                <p className="text-muted">No jobs posted yet</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead>
                    <tr>
                      <th className="px-4">Job Title</th>
                      <th>Company</th>
                      <th>Applications</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.recentJobs?.map((job) => (
                      <tr key={job.id}>
                        <td className="px-4 fw-semibold">{job.title}</td>
                        <td>{job.company?.name}</td>
                        <td>
                          <span className="badge bg-primary">{job._count?.applications || 0}</span>
                        </td>
                        <td>
                          <span className={`badge ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                            {job.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">View</button>
                          <button className="btn btn-sm btn-outline-danger">Delete</button>
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

export default AdminDashboard;

