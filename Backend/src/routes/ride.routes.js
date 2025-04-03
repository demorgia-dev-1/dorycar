const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');  // Add authorize here
const Ride = require('../models/ride.model');
const { AppError } = require('../middleware/errorHandler');

// Create a new ride
router.post('/create', protect, async (req, res, next) => {
  try {
    const {
      pickup,
      destination,
      paymentMethod,
      distance,
      duration
    } = req.body;

    const ride = await Ride.create({
      passenger: req.user.id,  // Changed from creator to passenger
      pickup,
      destination,
      paymentMethod,
      distance,
      duration,
      status: 'created'
    });

    res.status(201).json({
      status: 'success',
      data: { ride }
    });
  } catch (error) {
    next(error);
  }
});

// Accept a ride
router.patch('/:rideId/accept', protect, authorize('driver'), async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      throw new AppError(404, 'Ride not found');
    }

    if (ride.status !== 'created') {
      throw new AppError(400, 'Ride is no longer available');
    }

    if (ride.passenger.toString() === req.user.id) {  // Changed from creator to passenger
      throw new AppError(400, 'You cannot accept your own ride');
    }

    ride.driver = req.user.id;  // Changed from acceptor to driver
    ride.status = 'accepted';
    await ride.save();

    res.status(200).json({
      status: 'success',
      data: { ride }
    });
  } catch (error) {
    next(error);
  }
});

// Start ride
router.patch('/:rideId/start', protect, authorize('driver'), async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      throw new AppError(404, 'Ride not found');
    }

    if (ride.acceptor.toString() !== req.user.id) {
      throw new AppError(403, 'Not authorized to update this ride');
    }

    if (ride.status !== 'accepted') {
      throw new AppError(400, 'Ride must be accepted before starting');
    }

    ride.status = 'in-progress';
    ride.startTime = Date.now();
    await ride.save();

    res.status(200).json({
      status: 'success',
      data: { ride }
    });
  } catch (error) {
    next(error);
  }
});

// Complete ride
router.patch('/:rideId/complete', protect, authorize('driver'), async (req, res, next) => {
  try {
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      throw new AppError(404, 'Ride not found');
    }

    if (ride.acceptor.toString() !== req.user.id) {
      throw new AppError(403, 'Not authorized to update this ride');
    }

    if (ride.status !== 'in-progress') {
      throw new AppError(400, 'Ride must be in progress before completing');
    }

    ride.status = 'completed';
    ride.endTime = Date.now();
    await ride.save();

    res.status(200).json({
      status: 'success',
      data: { ride }
    });
  } catch (error) {
    next(error);
  }
});

// Add rating and feedback
router.patch('/:rideId/feedback', protect, async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      throw new AppError(404, 'Ride not found');
    }

    if (ride.status !== 'completed') {
      throw new AppError(400, 'Can only add feedback for completed rides');
    }

    // Determine if the user is the passenger or driver
    const isPassenger = ride.passenger.toString() === req.user.id;
    const isDriver = ride.driver.toString() === req.user.id;

    if (!isPassenger && !isDriver) {
      throw new AppError(403, 'Not authorized to add feedback for this ride');
    }

    if (isPassenger) {
      ride.rating.driver = rating;
      ride.feedback.driver = feedback;
    } else {
      ride.rating.passenger = rating;
      ride.feedback.passenger = feedback;
    }

    await ride.save();

    res.status(200).json({
      status: 'success',
      data: { ride }
    });
  } catch (error) {
    next(error);
  }
});

// Get user's ride history
router.get('/history', protect, async (req, res, next) => {
  try {
    const rides = await Ride.find({
      $or: [
        { passenger: req.user.id },
        { driver: req.user.id }
      ]
    }).sort('-createdAt');

    res.status(200).json({
      status: 'success',
      results: rides.length,
      data: { rides }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;