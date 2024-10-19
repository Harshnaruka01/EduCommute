const mongoose = require('mongoose');

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

const DriverSchema = new mongoose.Schema({
  VehicleName: {
    type: String,
    required: true,
    trim: true
  },
  VehicleNumber: {
    type: String,
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    enum: ['bus', 'van'], 
    required: true
  },
  DriverName: {
    type: String,
    required: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); //10 digit number
      },
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
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  routes:{
    
    type: [RouteSchema],
    required: true

  }
});

module.exports = {
  Driver: mongoose.model('Driver', DriverSchema),
  Route: mongoose.model('Route', RouteSchema)
};





