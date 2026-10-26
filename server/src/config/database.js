import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let mongoMemoryServer = null;

export const connectDatabase = async () => {
  try {
    let connectionUri = env.mongoUri;

    // Fallback to Mongo Memory Server if URI is missing or invalid
    if (!connectionUri || connectionUri.includes('<') || connectionUri.includes('replace_with')) {
      logger.info('No valid MONGODB_URI found. Starting MongoDB Memory Server...');
      mongoMemoryServer = await MongoMemoryServer.create();
      connectionUri = mongoMemoryServer.getUri();
    }

    const conn = await mongoose.connect(connectionUri);
    logger.info(`MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    logger.warn(`Primary database connection failed (${error.message}). Starting Mongo Memory Server fallback...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const fallbackUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(fallbackUri);
      logger.info(`MongoDB Connected via Memory Server: ${conn.connection.host}`);
    } catch (fallbackError) {
      logger.error('Failed to start fallback database:', fallbackError.message);
      throw fallbackError;
    }
  }
};

export const disconnectDatabase = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};

// Required by healthRoutes.js to check DB status
export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};