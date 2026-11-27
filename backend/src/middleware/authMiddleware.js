const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured in environment variables");
    return res.status(500).json({ message: "Authentication configuration error" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to perform this action",
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};
