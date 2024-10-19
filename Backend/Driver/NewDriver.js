//NewDriver.js
const express = require('express');
const router = express.Router();
const { Driver } = require('./Driver_Information.js'); // Import Driver model
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

router.post('/register/Driver', [
  body('email', 'Enter a valid Email Id').isEmail(),
  body('DriverName', 'Driver Name must be at least 2 characters long').isLength({ min: 2 }),
  body('VehicleName', 'Vehicle name is required').not().isEmpty(),
  body('VehicleNumber', 'Vehicle number is required').not().isEmpty(), 
  body('vehicleType', 'Vehicle type must be either "bus" or "van"').isIn(['bus', 'van']), 
  body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
  body('confirmPassword', 'Confirm password is required').exists(),
  body('contactNumber', 'Enter a valid 10-digit contact number').isLength({ min: 10, max: 10 }).isNumeric(),
  body('routes.*.stops.*.lat', 'Latitude is required for each stop').not().isEmpty(),
  body('routes.*.stops.*.lon', 'Longitude is required for each stop').not().isEmpty(),
  body('routes.*.stops.*.display_name', 'Display name is required for each stop').not().isEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { DriverName, email, password, confirmPassword, contactNumber, VehicleName, VehicleNumber, vehicleType, routes } = req.body;

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: "Passwords do not match!" });
  }

  try {
    // Check if the email is already registered
    let existingDriver = await Driver.findOne({ email });
    if (existingDriver) {
      return res.status(400).json({ success: false, message: 'Email id already exists' });
    }

    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    let securePassword = await bcrypt.hash(password, salt);

    // Create a new Driver entry with the route information
    const newDriver = new Driver({
      DriverName,
      email,
      password: securePassword,
      contactNumber,
      VehicleName,
      VehicleNumber,
      vehicleType,
      routes
    });

    // Save the Driver to the database
    await newDriver.save();

    res.status(201).json({ success: true, message: 'Driver registered successfully!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});








// Login Driver Route
router.post('/login/Driver', [
  body('email', 'Enter a valid Email Id').isEmail(),
  body('password', 'Enter a valid password').isLength({ min: 6 }),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if the email exists in the Driver database
    let DriverData = await Driver.findOne({ email });
    if (!DriverData) {
      return res.status(400).json({ errors: 'Email not found' });
    }

    // Compare the input password with the hashed password stored in the database
    const passwordCompare = await bcrypt.compare(password, DriverData.password);
    if (!passwordCompare) {
      return res.status(400).json({ errors: 'Incorrect password' });
    }

    const data = {
      Driver: {
        id: DriverData.id,
      },
    };

    const authToken = jwt.sign(data, jwtSecret);
    
    // Return success response with the auth token
    return res.json({ success: true, authToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
