// Placeholder auth middleware - replace with real JWT/session auth later

const authenticateToken = (req, res, next) => {
  // TODO: Implement real token authentication
  // For now, allow all requests through
  next();
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // TODO: Implement real role-based authorization
    // For now, allow all requests through
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
