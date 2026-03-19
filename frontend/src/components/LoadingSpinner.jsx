import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'spinner-border-sm';
      case 'lg':
        return 'spinner-border';
      default:
        return 'spinner-border';
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div className={`spinner-border text-primary ${getSizeClass()}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <p className="mt-3 text-muted">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
