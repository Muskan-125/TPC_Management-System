import React from 'react';

const StatsCard = ({ title, value, icon, color = 'primary' }) => {
  const getColorClass = () => {
    switch (color) {
      case 'success':
        return 'text-success';
      case 'danger':
        return 'text-danger';
      case 'warning':
        return 'text-warning';
      case 'info':
        return 'text-info';
      default:
        return 'text-primary';
    }
  };

  return (
    <div className="card stats-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <p className="text-muted mb-1">{title}</p>
            <h3 className="mb-0">{value}</h3>
          </div>
          <div className={`fs-1 ${getColorClass()}`}>
            {icon}
          </div>
      </div>
  );
};

export default StatsCard;
