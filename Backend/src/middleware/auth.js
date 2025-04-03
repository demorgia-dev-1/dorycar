const jwt = require('jsonwebtoken');
const { AppError } = require('./errorHandler');

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError(401, 'Not authorized to access this route');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user info to request
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError(401, 'Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError(401, 'Token expired'));
    } else {
      next(error);
    }
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError(403, 'Not authorized to perform this action'));
    }
    next();
  };
};

module.exports = {
  protect,
  authorize
};