const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  profilePicture: String,
  phoneNumber: {
    type: String,
    required: true
  },
  driverLicense: {
    number: String,
    verified: Boolean
  },
  ratings: [{
    fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  vehicleInfo: [{
    model: String,
    year: Number,
    licensePlate: String,
    color: String,
    verified: Boolean
  }]
});

const User = mongoose.model('User', userSchema);
module.exports = User;