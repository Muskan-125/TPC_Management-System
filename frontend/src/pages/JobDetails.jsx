import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaMapMarkerAlt, FaMoneyBillWave, FaBriefcase, FaBuilding, FaPaperPlane, FaCheck } from 'react-icons/fa';
import { getJobById } from '../services/jobService';
import api from '../services/api';
import { isAuthenticated, getUserRole } from '../services/authService';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);
        setJob(data);
      } catch (err) {
        setError('Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!isAuthenticated()) {
      alert('Please login to apply for this job');
      return;
    }
    setApplying(true);
    try {
      await api.post(`/applications/jobs/${id}/apply`);
      setApplied(true);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="text-muted">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div className="container py-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="alert alert-danger">{error}</div>
        <Link to="/jobs" className="btn btn-primary">Back to Jobs</Link>
      </motion.div>
    );
  }

  const userRole = getUserRole();
  const canApply = isAuthenticated() && userRole === 'STUDENT' && job?.isActive;

  return (
    <div className="py-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/jobs" className="btn btn-outline-primary mb-4 d-inline-flex align-items-center">
          <FaArrowLeft className="me-2" /> Back to Jobs
        </Link>
      </motion.div>

      <motion.div className="card border-0 shadow-lg mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="card-body p-4 p-lg-5">
          <div className="row">
            <div className="col-lg-8">
              <h1 className="fw-bold mb-2">{job.title}</h1>
              <h5 className="text-primary mb-3"><FaBuilding className="me-2" />{job.company?.name}</h5>
              <div className="d-flex flex-wrap gap-3 text-muted">
                <span><FaMapMarkerAlt className="me-1" />{job.location || 'N/A'}</span>
                <span><FaMoneyBillWave className="me-1" />{job.salary || 'Not specified'}</span>
                <span><FaBriefcase className="me-1" />{job.jobType || 'Full-time'}</span>
              </div>
            </div>
            <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
              <span className={`badge fs-6 mb-3 ${job.isActive ? 'bg-success' : 'bg-secondary'}`}>
                {job.isActive ? 'Active' : 'Closed'}
              </span>
              {canApply ? (
                applied ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="btn btn-success">
                    <FaCheck className="me-2" /> Applied
                  </motion.div>
                ) : (
                  <motion.button 
                    whileHover={{ scale: 1.05 }} 
                    whileTap={{ scale: 0.95 }} 
                    className="btn btn-success btn-lg" 
                    onClick={handleApply} 
                    disabled={applying}
                  >
                    <FaPaperPlane className="me-2" /> {applying ? 'Applying...' : 'Apply Now'}
                  </motion.button>
                )
              ) : !isAuthenticated() ? (
                <Link to="/login" className="btn btn-primary btn-lg">Login to Apply</Link>
              ) : (
                <button className="btn btn-secondary btn-lg" disabled>Not Eligible</button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div className="row" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h4 className="fw-bold mb-0">Description</h4>
            </div>
            <div className="card-body">
              <p>{job.description}</p>
            </div>
          </div>
          {job.requirements && (
            <div className="card border-0 shadow-sm mt-4">
              <div className="card-header bg-white border-0">
                <h4 className="fw-bold mb-0">Requirements</h4>
              </div>
              <div className="card-body">
                <p>{job.requirements}</p>
              </div>
            </div>
          )}
        </div>
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0">
              <h5 className="fw-bold mb-0">Company</h5>
            </div>
            <div className="card-body text-center">
              <div 
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                style={{ width: '60px', height: '60px', background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}
              >
                <FaBuilding className="text-primary" style={{ fontSize: '1.5rem' }} />
              </div>
              <h6>{job.company?.name}</h6>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JobDetails;
