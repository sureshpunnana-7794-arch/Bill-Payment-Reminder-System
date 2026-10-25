import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let isConnected = false;

// Mask credentials in Mongo URI for safe logging
const getMaskedUri = (uri) => {
  if (!uri) return 'undefined';
  return uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)[^@]+(@)/, '$1****$2');
};

export const connectDatabase = async (overrideUri = null) => {
  const uri = overrideUri || env.mongodbUri;

  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    mongoose.connection.on('connected', () => {
      isConnected = true;
      logger.info('MongoDB connection established successfully.');
    });

    mongoose.connection.on('error', (err) => {
      isConnected = false;
      logger.error('MongoDB connection error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      logger.warn('MongoDB connection disconnected.');
    });

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 7000,
      connectTimeoutMS: 10000,
      autoIndex: true
    });

    isConnected = true;
    logger.info(`MongoDB connected to target: ${getMaskedUri(uri)}`);
    return conn;
  } catch (error) {
    isConnected = false;
    logger.error(`Failed to connect to MongoDB (${getMaskedUri(uri)}): ${error.message}`);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB disconnected cleanly.');
  }
};

export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};
