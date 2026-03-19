import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job, showCompany = true, onDelete, onEdit }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card job-card mb-3">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h5 className="job-title mb-1">{job.title}</h5>
            {showCompany && job.company && (
              <p className="company-name mb-1 text-muted">{job.company.name}</p>
            )}
            <div className="job-meta">
              <span className="me-3">
                <i className="bi bi-geo-alt"></i> {job.location || 'N/A'}
              </span>
              <span className="me-3">
                <i className="bi bi-currency-rupee"></i> {job.salary || 'Not specified'}
              </span>
              <span className="me-3">
                <i className="bi bi-briefcase"></i> {job.jobType || 'Full-time'}
              </span>
              {job._count?.applications && (
                <span className="me-3">
                  <i className="bi bi-people"></i> {job._count.applications} applications
                </span>
              )}
            </div>
            {job.deadline && (
              <p className="mb-0 mt-2">
                <small className="text-danger">
                  <i className="bi bi-clock"></i> Deadline: {formatDate(job.deadline)}
                </small>
              </p>
            )}
          </div>
          <div className="col-md-4 text-end">
            <div className="d-flex flex-column gap-2">
              <Link to={`/jobs/${job.id}`} className="btn btn-outline-primary btn-sm">
                View Details
              </Link>
              {onEdit && (
                <button className="btn btn-outline-secondary btn-sm" onClick={() => onEdit(job)}>
                  Edit
                </button>
              )}
              {onDelete && (
                <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(job.id)}>
                  Delete
                </button>
              )}
            </div>
        </div>
    </div>
  );
};

export default JobCard;
