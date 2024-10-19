const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Driver = require('./Driver_Information'); // Assuming Driver schema is defined
require('dotenv').config();

const router = express.Router();
const jwtSecret = process.env.JWT_SECRET; // Ensure this is in your .env file

// POST route for registering a driver
router.post('/register/Driver', [
  // Validation checks
  body('email', 'Enter a valid Email Id').isEmail(),
  body('driverName', 'Driver Name must be at least 2 characters long').isLength({ min: 2 }),
  body('vehicleName', 'Vehicle name is required').not().isEmpty(),
  body('vehicleNumber', 'Vehicle number is required').not().isEmpty(),
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  body('confirmPassword', 'Confirm password is required').exists(),
  body('contactNumber', 'Enter a valid 10-digit contact number').isLength({ min: 10, max: 10 }).isNumeric(),
  body('routes.*.stops.*.lat', 'Latitude is required for each stop').not().isEmpty(),
  body('routes.*.stops.*.lon', 'Longitude is required for each stop').not().isEmpty(),
  body('routes.*.stops.*.display_name', 'Display name is required for each stop').not().isEmpty(),
], async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors:", errors.array());  // Log validation errors
    return res.status(400).json({ errors: errors.array() });
  }

  const { driverName, email, password, confirmPassword, contactNumber, vehicleName, vehicleNumber, vehicleType, routes } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    // Check if the email is already registered
    let existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new driver entry
    const driver = new Driver({
      driverName,
      email,
      password: hashedPassword, // Store the hashed password
      contactNumber,
      vehicleName,
      vehicleNumber,
      vehicleType,
      routes // Route details passed from the frontend
    });

    // Save the driver to the database
    await driver.save();

    // Send success response
    return res.status(200).json({ message: "Driver registered successfully!" });
  } catch (error) {
    // Improved error logging
    console.error("Error in registration:", error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error occurred', details: error.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
});

// POST route for driver login
router.post('/login/Driver', [
  body('email', 'Enter a valid Email Id').isEmail(),
  body('password', 'Password is required').exists(),
], async (req, res) => {
  // Handle validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if the driver exists with the provided email
    const driver = await Driver.findOne({ email });
    if (!driver) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, driver.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Create a JWT payload
    const payload = {
      driver: {
        id: driver.id
      }
    };

    // Sign the JWT and return the token
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' });

    return res.json({ success:true});
  } catch (error) {
    console.error("Error in login:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
