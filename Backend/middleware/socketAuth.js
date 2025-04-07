// socketAuthMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketAuth = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) return next(new Error('Authentication token missing'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return next(new Error('User not found'));

    socket.user = user;
    socket.join(user._id.toString()); // Join personal room
    next();
  } catch (err) {
    console.error('Socket auth failed:', err.message);
    return next(new Error('Authentication failed'));
  }
};

module.exports = socketAuth;
