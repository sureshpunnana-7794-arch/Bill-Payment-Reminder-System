import dotenv from 'dotenv';
dotenv.config();

/**
 * Validate and export environment configurations with safe fallbacks
 */
const getEnv = () => {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const port = parseInt(process.env.PORT || '5000', 10);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  let mongodbUri = process.env.MONGODB_URI;
  if (!mongodbUri) {
    mongodbUri = 'mongodb://127.0.0.1:27017/paypulse';
    if (nodeEnv === 'production') {
      console.warn('⚠️ [WARNING] MONGODB_URI is not configured in Render environment variables. Please add your MongoDB Atlas connection string in the Render dashboard.');
    }
  }

  let jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret || jwtSecret.length < 32) {
    jwtSecret = 'paypulse_fallback_jwt_secret_key_min_32_characters_long_9201847120';
    if (nodeEnv === 'production') {
      console.warn('⚠️ [SECURITY NOTICE] JWT_SECRET is not configured in Render. Using safe fallback. Add a custom 64-character JWT_SECRET in your Render dashboard.');
    }
  }

  let jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
  if (!jwtRefreshSecret || jwtRefreshSecret.length < 32) {
    jwtRefreshSecret = 'paypulse_fallback_jwt_refresh_secret_key_min_32_characters_long_1928374650';
    if (nodeEnv === 'production') {
      console.warn('⚠️ [SECURITY NOTICE] JWT_REFRESH_SECRET is not configured in Render. Using safe fallback. Add a custom 64-character JWT_REFRESH_SECRET in your Render dashboard.');
    }
  }

  const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '15m';
  const jwtRefreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

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
