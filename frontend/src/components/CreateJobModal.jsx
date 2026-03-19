import React, { useState } from 'react';
import { createJob } from '../services/jobService';

const CreateJobModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary: '',
    jobType: 'Full-time',
    isActive: true,
    deadline: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createJob(formData);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Post New Job</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Software Engineer"
                  />
                </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Remote, Delhi"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Salary (per annum)</label>
                  <input
                    type="text"
                    name="salary"
                    className="form-control"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g., 50000 - 80000"
                  />
                </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Job Type</label>
                  <select
                    name="jobType"
                    className="form-select"
                    value={formData.jobType}
                    onChange={handleChange}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    className="form-control"
                    value={formData.deadline}
                    onChange={handleChange}
                  />
                </div>

              <div className="mb-3">
                <label className="form-label">Job Description *</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describe the job role and responsibilities..."
                ></textarea>
              </div>

              <div className="mb-3">
                <label className="form-label">Requirements</label>
                <textarea
                  name="requirements"
                  className="form-control"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="3"
                  placeholder="List the required skills and qualifications..."
                ></textarea>
              </div>

              <div className="form-check">
                <input
                  type="checkbox"
                  name="isActive"
                  className="form-check-input"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="isActive">
                  Active (Visible to students)
                </label>
              </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>
          </form>
        </div>
    </div>
  );
};

export default CreateJobModal;
