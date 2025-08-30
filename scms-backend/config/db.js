/**
 * MongoDB Database Connection Configuration
 * Handles connection, reconnection, and error handling
 */

const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');

let isConnected = false;

const connectDB = async () => {
  // Prevent multiple connections
  if (isConnected) {
    console.log('📦 MongoDB already connected');
    return;
  }

  try {
    // MongoDB connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    };

    const conn = await mongoose.connect(MONGO_URI, options);
    
    isConnected = true;
    
    console.log(`
    📦 MongoDB Connected Successfully!
    🎯 Host: ${conn.connection.host}
    🏷️  Database: ${conn.connection.name}
    📊 Ready State: ${conn.connection.readyState}
    `);

    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('📦 Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📦 Mongoose disconnected');
      isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📦 MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.error('🔄 Retrying connection in 5 seconds...');
    
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Export connection status checker
const getConnectionStatus = () => {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    name: mongoose.connection.name
  };
};

module.exports = { connectDB, getConnectionStatus };
