


const mongoose = require('mongoose');
require('dotenv').config();

const mongoURL = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURL);
    console.log("DB connected");
  } catch (err) {
    console.error('Connection error:', err);
  }
};


connectDB();

module.exports = mongoose.connection;