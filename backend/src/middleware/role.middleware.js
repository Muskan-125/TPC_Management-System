// Role-based authorization middleware
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Check if user is the owner of the resource
exports.isOwner = (userIdField = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const resourceUserId = req.params[userIdField] || req.body[userIdField];
    
    // Allow if user is the owner or is an admin
    if (req.user.id !== parseInt(resourceUserId) && req.user.role !== 'ADMIN') {
      return res.status(403).json({ 
        error: 'Access denied. You can only modify your own resources.' 
      });
    }

    next();
  };
};

