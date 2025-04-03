const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/user.model');
const { AppError } = require('../middleware/errorHandler');

// Get all users (admin only)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: { users }
    });
  } catch (error) {
    next(error);
  }
});

// Update user role (admin only)
router.patch('/:userId/role', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['user', 'driver', 'admin'].includes(role)) {
      throw new AppError(400, 'Invalid role');
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { role },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Update driver information
router.patch('/driver-info', protect, authorize('driver'), async (req, res, next) => {
  try {
    const { driverLicense, vehicleInfo } = req.body;

    if (!driverLicense || !vehicleInfo) {
      throw new AppError(400, 'Please provide all required driver information');
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { driverLicense, vehicleInfo },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
});

// Get nearby drivers
router.get('/nearby-drivers', protect, async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query; // radius in kilometers

    const drivers = await User.find({
      role: 'driver',
      isVerified: true,
      // Add location-based query when implementing real-time location tracking
    }).select('-password');

    res.status(200).json({
      status: 'success',
      results: drivers.length,
      data: { drivers }
    });
  } catch (error) {
    next(error);
  }
});

// Get driver statistics
router.get('/driver-stats', protect, authorize('driver'), async (req, res, next) => {
  try {
    const stats = await Ride.aggregate([
      {
        $match: {
          driver: req.user._id,
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalRides: { $sum: 1 },
          totalEarnings: { $sum: '$price' },
          averageRating: { $avg: '$rating.driver' }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: { stats: stats[0] || {} }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;