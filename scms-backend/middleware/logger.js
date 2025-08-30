/**
 * [DEBUG] Simplified Request Logging Middleware
 * A minimal logger to isolate startup issues. This is a temporary file.
 */

const simplifiedLogger = (req, res, next) => {
  // A simple log to the console for every request to confirm it's working.
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// Export just the single, simple middleware function.
// If the app starts with this, the problem is in the original complex logger's setup.
// If it still crashes, the problem is elsewhere.
module.exports = simplifiedLogger;

