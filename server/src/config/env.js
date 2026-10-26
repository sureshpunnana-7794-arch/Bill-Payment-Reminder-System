import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paypulse',
  jwtSecret: process.env.JWT_SECRET || 'e025bd10d87050eab0a0e2171c85a15f0edbea1f132a85b419cdc7560a79fb88',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || '7c35646921b2505ff5c5101f345dab87f88c26ded7d72fb5e8da9405db547b9e',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  rateLimitWindowMs: process.env.RATE_LIMIT_WINDOW_MS || 900000,
  rateLimitMax: process.env.RATE_LIMIT_MAX || 200,
};