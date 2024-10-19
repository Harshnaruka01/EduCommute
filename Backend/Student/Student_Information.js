const mongoose = require('mongoose');

// Define the schema for institute details
const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  CollegeName: {
    type: String,
    required: true,
    trim: true
  },

  contactNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /\d{10}/.test(v); // Validate for a 10-digit phone number
      },
      message: props => `${props.value} is not a valid phone number!` // Fixed template literal
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
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v); // Validate email format
      },
      message: props => `${props.value} is not a valid email!` // Fixed template literal
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  }
});

// Export the model to be used in the controller
module.exports = mongoose.model('Student', StudentSchema);
