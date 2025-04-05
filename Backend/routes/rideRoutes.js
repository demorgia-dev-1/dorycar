const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const auth = require('../middleware/auth');

// Create a new ride
router.post('/create', auth, async (req, res) => {
  console.log('Received request data:', req.body, 'User:', req.userId); 
  try {
    const { origin, destination, date, seats, price } = req.body;
    const ride = new Ride({
      creator: req.userId,  // Changed from req.user.userId to req.userId
      origin,
      destination,
      date,
      seats,
      price
    });
    await ride.save();
    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ride', error: error.message });
  }
});

// Get all rides with filters
router.get('/', auth, async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (origin) {
      filter.origin = { $regex: new RegExp(origin, 'i') }; // Case-insensitive search
    }
    
    if (destination) {
      filter.destination = { $regex: new RegExp(destination, 'i') }; // Case-insensitive search
    }
    
    if (date) {
      // Convert date string to Date object and create range for the entire day
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filter.date = {
        $gte: searchDate,
        $lt: nextDay
      };
    }

    // Add status filter to show only pending and accepted rides
    filter.status = { $in: ['pending', 'accepted'] };

    const rides = await Ride.find(filter)
      .populate('creator', 'name')
      .populate('acceptor', 'name')
      .populate('interestedUsers.user', 'name')
      .sort({ createdAt: -1 });

    res.json(rides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rides', error: error.message });
  }
});

// Express interest in a ride
router.post('/:rideId/interest', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.creator.toString() === req.userId) { // Changed from req.user.userId
      return res.status(400).json({ message: 'Cannot express interest in your own ride' });
    }

    const alreadyInterested = ride.interestedUsers.find(
      interest => interest.user.toString() === req.userId // Changed from req.user.userId
    );

    if (alreadyInterested) {
      return res.status(400).json({ message: 'Already expressed interest in this ride' });
    }

    ride.interestedUsers.push({
      user: req.userId, // Changed from req.user.userId
      status: 'interested'
    });

    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Error expressing interest', error: error.message });
  }
});

// Accept a ride (for ride creator to accept an interested user)
router.post('/:rideId/accept/:userId', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.creator.toString() !== req.userId) { // Changed from req.user.userId
      return res.status(403).json({ message: 'Only ride creator can accept users' });
    }

    const interest = ride.interestedUsers.find(
      interest => interest.user.toString() === req.params.userId
    );

    if (!interest) {
      return res.status(404).json({ message: 'User has not expressed interest in this ride' });
    }

    interest.status = 'accepted';
    ride.status = 'accepted';
    ride.acceptor = req.params.userId;

    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Error accepting ride', error: error.message });
  }
});

// Send a message in a ride chat
router.post('/:rideId/messages', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const ride = await Ride.findById(req.params.rideId);

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is either creator, acceptor, or interested user
    const isParticipant = 
      ride.creator.toString() === req.userId ||
      (ride.acceptor && ride.acceptor.toString() === req.user.userId) ||
      ride.interestedUsers.some(interest => interest.user.toString() === req.user.userId);

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to send messages in this ride chat' });
    }

    ride.messages.push({
      sender: req.user.userId,
      content
    });

    await ride.save();
    
    // Populate sender information for the new message
    const populatedRide = await Ride.findById(ride._id)
      .populate('messages.sender', 'name')
      .populate('creator', 'name')
      .populate('acceptor', 'name')
      .populate('interestedUsers.user', 'name');

    res.json(populatedRide);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
});

// Get messages for a ride
router.get('/:rideId/messages', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId)
      .populate('messages.sender', 'name')
      .populate('creator', 'name')
      .populate('acceptor', 'name');

    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Check if user is either creator, acceptor, or interested user
    const isParticipant = 
      ride.creator.toString() === req.userId ||
      (ride.acceptor && ride.acceptor.toString() === req.user.userId) ||
      ride.interestedUsers.some(interest => interest.user.toString() === req.user.userId);

    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view messages' });
    }

    res.json(ride.messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

// Search rides by criteria
// Add this route to your existing rideRoutes.js
router.get('/search', async (req, res) => {
  const {
    origin,
    destination,
    date,
    seats,
    maxPrice,
    sortBy,
    filterBy
  } = req.query;
  
  // Advanced search logic with filters and sorting
});

// Get user's rides (created, accepted, and interested)
router.get('/my-rides', auth, async (req, res) => {
  try {
    const createdRides = await Ride.find({ creator: req.user.userId })
      .populate('acceptor', 'name')
      .populate('interestedUsers.user', 'name');
    
    const acceptedRides = await Ride.find({ acceptor: req.user.userId })
      .populate('creator', 'name');
    
    const interestedRides = await Ride.find({
      'interestedUsers.user': req.user.userId
    }).populate('creator', 'name');

    res.json({
      created: createdRides,
      accepted: acceptedRides,
      interested: interestedRides
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user rides', error: error.message });
  }
});

// Complete a ride
router.put('/:rideId/complete', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.creator.toString() !== req.userId) {
      return res.status(403).json({ message: 'Only ride creator can complete the ride' });
    }

    if (ride.status !== 'accepted') {
      return res.status(400).json({ message: 'Only accepted rides can be completed' });
    }

    ride.status = 'completed';
    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Error completing ride', error: error.message });
  }
});

// Cancel a ride
router.put('/:rideId/cancel', auth, async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.creator.toString() !== req.userId && 
        ride.acceptor?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Only ride creator or acceptor can cancel the ride' });
    }

    if (ride.status === 'completed' || ride.status === 'cancelled') {
      return res.status(400).json({ message: 'Cannot cancel completed or already cancelled rides' });
    }

    ride.status = 'cancelled';
    await ride.save();
    res.json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling ride', error: error.message });
  }
});

module.exports = router;