/**
 * SCMS Backend Server
 * Main entry point for the Smart Campus Management System.
 * This file initializes the server and handles graceful shutdown.
 */
require('dotenv').config(); // Loads environment variables from .env file

const app = require('./app'); // The main Express application
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to the database before starting the server
    await connectDB();

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`
      -------------------------------------------------------
      🚀 SCMS Backend Server Started
      📡 Listening on Port: ${PORT}
      🌍 Environment: ${process.env.NODE_ENV || 'development'}
      ⏰ Time: ${new Date().toLocaleTimeString()}
      -------------------------------------------------------
      `);
    });

    // Graceful shutdown handling
    const shutdown = (signal) => {
      console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('✅ HTTP server closed.');
        // The mongoose connection is closed by its own SIGINT/SIGTERM listener in db.js
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions and unhandled rejections
    process.on('uncaughtException', (err) => {
      console.error('💥 UNCAUGHT EXCEPTION! Shutting down...', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (err) => {
      console.error('💥 UNHANDLED REJECTION! Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
