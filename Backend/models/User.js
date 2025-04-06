
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ridePreferenceSchema = new Schema({
  gender: { type: String, default: '' },
  music: { type: String, default: '' },
  chat: { type: String, default: '' },
  ac: { type: String, default: '' },
}, { _id: false });

const vehicleSchema = new Schema({
  type: {
    type: String,
    enum: ['Car', 'SUV', 'Bike', 'Van'],
    default: undefined
  },
  make: { type: String, default: '' },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  year: { type: String, default: '' },
  registration: { type: String, default: '' },
  seats: { type: String, default: '' },
  ac: { type: String, default: '' },
  fuel: { type: String, default: '' },
  luggage: { type: String, default: '' },
  vin: {
  type: String,
  default: '',
  validate: {
    validator: function (v) {
      // Allow empty or valid VIN
      return !v || /^[A-HJ-NPR-Z0-9]{11,17}$/.test(v);
    },
    message: props => `${props.value} is not a valid VIN`
  }
}

}, { _id: false });

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
  profileImage: { type: String, default: '' },
  phone: { type: String, default: '' },
  dob: { type: String, default: '' },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    default: undefined
  },
  emergencyContact: { type: String, default: '' },
  preferredCommunication: {
    type: String,
    enum: ['Chat', 'Call', 'Both'],
    default: undefined
  },
  ridePreference: {
    type: ridePreferenceSchema,
    default: () => ({})
  },
  vehicle: {
    type: vehicleSchema,
    default: () => ({})
  },
  vehicleImage: { type: String, default: '' },
  rcDocument: { type: String, default: '' },

  ratings: [{
    fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
