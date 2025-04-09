
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
  type: {
    type: String,
    enum: ['Car', 'SUV', 'Bike', 'Van'],
    default: undefined
  },
  make: { type: String,
    enum: [
      "Maruti Suzuki",
      "Hyundai",
      "Tata Motors",
      "Mahindra",
      "Honda",
      "Toyota",
      "Renault",
      "Kia Motors",
      "Volkswagen",
      "Skoda",
      "Audi",
      "BMW",
      "Mercedes-Benz",
      "Jaguar Land Rover",
      "Volvo",
      "Nissan",
      "Ford",
      "Mitsubishi",
      "Datsun",
      "Chevrolet"
    ],
    default: undefined 
  },
  model: { type: String, default: '' },
  color: { type: String, default: '' },
  year: { type: String, default: '' },
  registration: { type: String, default: '' },
  seats: { type: String, default: '' },
  fuel: { type: String, default: '' },

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

  vehicle: {
    type: vehicleSchema,
    default: () => ({})
  },
  vehicleImage: { type: String, default: '' },
  rcDocument: { type: String, default: '' },
  idProof: { type: String, default: '' },
  license: { type: String, default: '' },

  ratings: [
  {
    rating: Number,
    comment: String,
    by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ride: { type: mongoose.Schema.Types.ObjectId, ref: "Ride" },
    date: { type: Date, default: Date.now },
  }
]
,

  averageRating: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
