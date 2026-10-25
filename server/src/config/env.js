import dotenv from 'dotenv';
dotenv.config();

/**
 * Validate and export environment configurations
 */
const getEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = parseInt(process.env.PORT || '5000', 10);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  const mongodbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paypulse';
  
  // In development/test, provide fallback secrets if not specified
  const jwtSecret = process.env.JWT_SECRET || 'paypulse_dev_jwt_secret_key_at_least_32_chars_long_12345';
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'paypulse_dev_jwt_refresh_secret_key_at_least_32_chars_long_67890';
  const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

  if (nodeEnv === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
      throw new Error('FATAL: JWT_SECRET must be set to at least 32 characters in production.');
    }
    if (!process.env.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET.length < 32) {
      throw new Error('FATAL: JWT_REFRESH_SECRET must be set to at least 32 characters in production.');
    }
    if (!process.env.MONGODB_URI) {
      throw new Error('FATAL: MONGODB_URI must be set in production.');
    }
  }

  return {
    nodeEnv,
    port,
    clientUrl,
    mongodbUri,
    jwtSecret,
    jwtExpiresIn,
    jwtRefreshSecret,
    jwtRefreshExpiresIn,
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '200', 10)
  };
};

export const env = getEnv();
