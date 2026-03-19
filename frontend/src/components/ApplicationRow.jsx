import React from 'react';

const ApplicationRow = ({ application, onStatusChange, showJob = true, showStudent = true }) => {
  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'SHORTLISTED':
        return 'bg-success';
      case 'REJECTED':
        return 'bg-danger';
      case 'APPLIED':
        return 'bg-primary';
      default:
        return 'bg-secondary';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card application-card mb-2">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-4">
            {showStudent && application.student && (
              <div>
                <h6 className="mb-1">{application.student.name}</h6>
                <p className="mb-0 text-muted small">{application.student.email}</p>
                {application.student.branch && (
                  <p className="mb-0 text-muted small">
                    {application.student.branch} - Batch {application.student.batch}
                  </p>
                )}
              </div>
            )}
            {showJob && application.job && (
              <div>
                <h6 className="mb-1">{application.job.title}</h6>
                {application.job.company && (
                  <p className="mb-0 text-muted small">{application.job.company.name}</p>
                )}
              </div>
            )}
          </div>
          <div className="col-md-3">
            <span className={`badge ${getStatusBadgeClass(application.status)}`}>
              {application.status || 'APPLIED'}
            </span>
            <p className="mb-0 mt-2 small text-muted">
              <i className="bi bi-calendar"></i> Applied: {formatDate(application.appliedAt)}
            </p>
            {application.resumeUrl && (
              <a 
                href={application.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary mt-2"
              >
                View Resume
              </a>
            )}
          </div>
          <div className="col-md-5 text-end">
            {onStatusChange && (
              <div className="btn-group" role="group">
                <button
                  className={`btn btn-sm ${application.status === 'SHORTLISTED' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => onStatusChange(application.id, 'SHORTLISTED')}
                  disabled={application.status === 'SHORTLISTED'}
                >
                  Shortlist
                </button>
                <button
                  className={`btn btn-sm ${application.status === 'REJECTED' ? 'btn-danger' : 'btn-outline-danger'}`}
                  onClick={() => onStatusChange(application.id, 'REJECTED')}
                  disabled={application.status === 'REJECTED'}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
      </div>
  );
};

export default ApplicationRow;
