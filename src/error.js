const { Error } = require("mongoose");
const { logEvents } = require("../middleware/logEvents");

const notFoundError = (_req, _res, next) => {
  const error = new Error("Resource not found!");
  error.status = 404;

  next(error);
};

const globalError = (error, _req, res, _next) => {
  // Log the error
  logEvents(`${error.name}: ${error.message}`, "errorLogs.txt");

  // If error is explicitly set with a status, return it
  if (error.status) {
    return res.status(error.status).json({ message: error.message });
  }

  // Mongoose validation error handler
  if (error && error.errors) {
    // Ensure error.errors exists and is an object
    const errorsArray = Object.values(error.errors).map((el) => el.message);
    
    if (errorsArray.length > 1) {
      return res.status(400).json({ message: errorsArray.join(", ") });
    }
    
    return res.status(400).json({ message: errorsArray[0] });
  }

  // Mongoose duplicate key error handler
  if (error.code && error.code === 11000) {
    const field = Object.keys(error.keyValue || {})[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  // Default to Internal Server Error
  res.status(500).json({ message: `(Internal server error): ${error.message || 'An unexpected error occurred'}` });
};

module.exports = { notFoundError, globalError };
