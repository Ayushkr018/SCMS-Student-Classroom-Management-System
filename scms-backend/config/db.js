/**
 * MongoDB Database Connection Configuration
 * Handles connection, reconnection, and error handling for the application.
 */
require('dotenv').config(); // Loads environment variables from .env file
const mongoose = require('mongoose');

// --- Setup Event Listeners Before Connecting ---

// Log an error if the connection fails after the initial connection
mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error after initial connect:', err);
});

// Log when the connection is re-established
mongoose.connection.on('connected', () => {
  console.log('📦 Mongoose reconnected to MongoDB');
});

// Log when the connection is lost
mongoose.connection.on('disconnected', () => {
  console.log(' Mongoose connection lost');
});

/**
 * Connects to the MongoDB database using the URI from environment variables.
 * Includes a retry mechanism for initial connection failures.
 */
const connectDB = async () => {
  // If we are already connected, don't try to connect again
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    // Modern Mongoose options are streamlined.
    // No need for useNewUrlParser or useUnifiedTopology.
    const options = {
      maxPoolSize: 10,              // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000,         // Close sockets after 45 seconds of inactivity
      dbName: process.env.DB_NAME,    // Specify the database name from .env
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    
    console.log(`
      -------------------------------------------------------
      📦 MongoDB Connected Successfully!
      🎯 Host: ${mongoose.connection.host}
      🏷️  Database: ${mongoose.connection.name}
      -------------------------------------------------------
    `);

  } catch (error) {
    console.error('❌ Initial MongoDB connection error:', error.message);
    console.log('🔄 Retrying connection in 5 seconds...');
    
    // Retry connection after 5 seconds
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

// Listen for app termination signals
process.on('SIGINT', gracefulShutdown).on('SIGTERM', gracefulShutdown);

module.exports = { connectDB };
