import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const errorHandler = (err, req, res, _next) => {
  logger.error(`${req.method} ${req.originalUrl} - ${err.message}`, err.stack);

  // 1. Invalid MongoDB ObjectId (CastError)
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).json({
      success: false,
      message: 'Invalid resource identifier format.'
    });
  }

  // 2. Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Database validation failed.',
      errors
    });
  }

  // 3. Duplicate Key Error (MongoDB E11000)
  if (err.code === 11000) {
    const duplicateFields = Object.keys(err.keyPattern || {});
    const fieldName = duplicateFields.length > 0 ? duplicateFields[0] : 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${fieldName} already exists.`
    });
  }

  // 4. JSON body parse error
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON payload received.'
    });
  }

  // 5. Default internal server error
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    message: statusCode === 500 ? 'An unexpected server error occurred.' : err.message
  };

  if (env.nodeEnv === 'development') {
    response.debug = {
      name: err.name,
      message: err.message,
      stack: err.stack
    };
  }

  res.status(statusCode).json(response);
};
