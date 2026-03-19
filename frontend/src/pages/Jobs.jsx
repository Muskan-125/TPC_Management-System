import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase, FaFilter, FaTimes, FaBuilding } from 'react-icons/fa';
import { getJobs } from '../services/jobService';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', location: '', salary: '', page: 1 });
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const data = await getJobs(filters);
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters.page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({ search: '', location: '', salary: '', page: 1 });
  };

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

  return (
    <div className="jobs-page py-4">
      <div className="container">
        {/* Header */}
        <motion.div 
          className="text-center mb-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="fw-bold display-5 mb-3">
            <span className="gradient-text">Find Your Dream Job</span>
          </h1>
          <p className="text-muted fs-5">Browse through hundreds of opportunities from top companies</p>
        </motion.div>

        {/* Search & Filter Bar */}
        <motion.div 
          className="card border-0 shadow-lg mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-body p-4">
            <form onSubmit={handleSearch} className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label fw-semibold">
                  <FaSearch className="me-2" />Search
                </label>
                <input 
                  type="text" 
                  name="search" 
                  className="form-control" 
                  placeholder="Job title, keywords..." 
                  value={filters.search} 
                  onChange={handleFilterChange} 
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <FaMapMarkerAlt className="me-2" />Location
                </label>
                <input 
                  type="text" 
                  name="location" 
                  className="form-control" 
                  placeholder="City, state..." 
                  value={filters.location} 
                  onChange={handleFilterChange} 
                />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">
                  <FaMoneyBillWave className="me-2" />Min Salary
                </label>
                <input 
                  type="number" 
                  name="salary" 
                  className="form-control" 
                  placeholder="Minimum salary" 
                  value={filters.salary} 
                  onChange={handleFilterChange} 
                />
              </div>
              <div className="col-md-2 d-flex gap-2">
                <button type="submit" className="btn btn-primary flex-grow-1">
                  <FaFilter className="me-1" /> Search
                </button>
                {(filters.search || filters.location || filters.salary) && (
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={clearFilters}
                    title="Clear filters"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Results Info */}
        <motion.div 
          className="d-flex justify-content-between align-items-center mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-muted mb-0">
            Showing <strong>{jobs.length}</strong> of <strong>{pagination.total}</strong> jobs
          </p>
        </motion.div>

        {/* Jobs List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              className="text-center py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading jobs...</p>
            </motion.div>
          ) : jobs.length === 0 ? (
            <motion.div 
              className="text-center py-5"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="mb-4">
                <FaBriefcase style={{ fontSize: '4rem', opacity: 0.3 }} />
              </div>
              <h4 className="fw-bold mb-2">No Jobs Found</h4>
              <p className="text-muted mb-4">Try adjusting your search criteria</p>
              <button className="btn btn-primary" onClick={clearFilters}>
                Clear Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              className="row g-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {jobs.map((job, index) => (
                <div className="col-12" key={job.id}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                    className="card job-card border-0 shadow-sm"
                  >
                    <div className="card-body p-4">
                      <div className="row align-items-center">
                        <div className="col-lg-8">
                          <div className="d-flex align-items-start gap-3">
                            <div 
                              className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                              style={{ 
                                width: '60px', 
                                height: '60px', 
                                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                                color: '#2563eb'
                              }}
                            >
                              <FaBuilding style={{ fontSize: '1.5rem' }} />
                            </div>
                            <div>
                              <h4 className="job-title mb-1">{job.title}</h4>
                              <p className="company-name mb-2">
                                <FaBuilding className="me-1" />
                                {job.company?.name || 'Company'}
                              </p>
                              <div className="job-meta d-flex flex-wrap gap-3">
                                <span>
                                  <FaMapMarkerAlt className="text-muted me-1" />
                                  {job.location || 'N/A'}
                                </span>
                                <span>
                                  <FaMoneyBillWave className="text-muted me-1" />
                                  {job.salary ? `₹${job.salary.toLocaleString()}` : 'Not specified'}
                                </span>
                                <span>
                                  <FaBriefcase className="text-muted me-1" />
                                  {job.jobType || 'Full-time'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link 
                              to={`/jobs/${job.id}`} 
                              className="btn btn-primary px-4 py-2"
                            >
                              View Details
                            </Link>
                          </motion.div>
                          {job._count?.applications > 0 && (
                            <p className="text-muted small mt-2 mb-0">
                              <strong>{job._count.applications}</strong> applicants
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.nav 
            className="mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <ul className="pagination justify-content-center gap-2">
              <li className={`page-item ${filters.page === 1 ? 'disabled' : ''}`}>
                <button 
                  className="page-link rounded-3 px-4" 
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  disabled={filters.page === 1}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <li key={pageNum} className={`page-item ${filters.page === pageNum ? 'active' : ''}`}>
                    <button 
                      className="page-link rounded-3" 
                      onClick={() => setFilters({ ...filters, page: pageNum })}
                    >
                      {pageNum}
                    </button>
                  </li>
                );
              })}
              <li className={`page-item ${filters.page === pagination.pages ? 'disabled' : ''}`}>
                <button 
                  className="page-link rounded-3 px-4" 
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  disabled={filters.page === pagination.pages}
                >
                  Next
                </button>
              </li>
            </ul>
          </motion.nav>
        )}
      </div>
    </div>
  );
};

export default Jobs;

