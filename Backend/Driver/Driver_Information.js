const mongoose = require('mongoose');

// Define the Stop schema
const StopSchema = new mongoose.Schema({
  lat: {
    type: String, 
    required: true
  },
  lon: {
    type: String, 
    required: true
  },
  display_name: {
    type: String,
    required: true,
    trim: true
  }
});

// Define the Route schema
const RouteSchema = new mongoose.Schema({
  stops: {
    type: [StopSchema], 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Define the Driver schema
const DriverSchema = new mongoose.Schema({
  vehicleName: {  // Changed to camelCase for consistency
    type: String,
    required: true,
    trim: true
  },
  vehicleNumber: {  // Changed to camelCase for consistency
    type: String,
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: false
  },
  driverName: {  // Changed to camelCase for consistency
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /\d{10}/.test(v), // 10-digit number
      message: props => `${props.value} is not a valid phone number!`
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  routes: {
    type: [RouteSchema],
    required: true
  }
});

// Export the Driver model
module.exports = mongoose.model('Driver', DriverSchema);
