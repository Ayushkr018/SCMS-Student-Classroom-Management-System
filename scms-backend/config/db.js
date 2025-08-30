/**
 * MongoDB Database Connection Configuration
 * Handles connection, reconnection, and error handling for the application.
 */
require('dotenv').config();
const mongoose = require('mongoose');

// --- Setup Event Listeners Before Connecting ---
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('connected', () => {
  console.log('📦 Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose connection lost');
});

/**
 * Connects to the MongoDB database using the URI from environment variables.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return; // Already connected

  try {
    console.log('⏳ Attempting to connect to MongoDB...');

    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      dbName: process.env.DB_NAME,
    };

    await mongoose.connect(process.env.MONGO_URI, options);

    console.log(`
      -------------------------------------------------------
      ✅ MongoDB Connected Successfully!
      🌐 Host: ${mongoose.connection.host}
      🗄️  Database: ${mongoose.connection.name}
      -------------------------------------------------------
    `);
  } catch (error) {
    console.error('❌ Initial MongoDB connection error:', error.message);
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

/**
 * Gracefully closes the MongoDB connection on application termination.
 */
const gracefulShutdown = async () => {
  await mongoose.connection.close();
  console.log('📦 MongoDB connection closed due to app termination');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown).on('SIGTERM', gracefulShutdown);

module.exports = { connectDB };
