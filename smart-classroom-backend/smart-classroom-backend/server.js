/**
 * SCMS Backend Server
 * Main entry point for the Smart Campus Management System
 */

const app = require('./app');
const { PORT } = require('./config/env');

const PORT_NUMBER = PORT || 5000;

// Start server
const server = app.listen(PORT_NUMBER, () => {
  console.log(`
  🚀 SCMS Backend Server Started
  📡 Port: ${PORT_NUMBER}
  🌍 Environment: ${process.env.NODE_ENV || 'development'}
  ⏰ Started at: ${new Date().toISOString()}
  `);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = server;
s