const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  acceptor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pickup: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  destination: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  status: {
    type: String,
    enum: ['created', 'accepted', 'in-progress', 'completed', 'cancelled'],
    default: 'created'
  },
  price: {
    type: Number,
    required: true
  },
  distance: {
    type: Number, // in kilometers
    required: true
  },
  duration: {
    type: Number, // estimated time in minutes
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'wallet'],
    required: true
  },
  rating: {
    creator: {
      type: Number,
      min: 1,
      max: 5
    },
    acceptor: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  feedback: {
    creator: String,
    acceptor: String
  },
  startTime: Date,
  endTime: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for geospatial queries
rideSchema.index({ 'pickup.coordinates': '2dsphere' });
rideSchema.index({ 'destination.coordinates': '2dsphere' });

// Calculate price based on distance and duration
rideSchema.pre('save', function(next) {
  if (this.isModified('distance') || this.isModified('duration')) {
    // Basic price calculation formula
    const basePrice = 5; // Base fare
    const pricePerKm = 2; // Price per kilometer
    const pricePerMinute = 0.5; // Price per minute
    
    this.price = basePrice + (this.distance * pricePerKm) + (this.duration * pricePerMinute);
  }
  next();
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;