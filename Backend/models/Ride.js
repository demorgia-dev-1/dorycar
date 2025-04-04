// Change this line
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const rideSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  seats: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  interestedUsers: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['interested', 'accepted', 'rejected'],
      default: 'interested'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  acceptor: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [messageSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  vehicleDetails: {
    type: String,
    required: false
  },
  additionalNotes: {
    type: String,
    required: false
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  cancellationReason: {
    type: String
  }
});

const Ride = mongoose.model('Ride', rideSchema);
module.exports = Ride;