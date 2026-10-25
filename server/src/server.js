import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

let server;

const startServer = async () => {
  try {
    logger.info('Initializing PayPulse Backend Server...');

    // Connect to database before accepting incoming HTTP requests
    try {
      await connectDatabase();
    } catch {
      logger.error('Database connection failed on startup. Server will start in degraded mode with health status 503.');
    }

    server = app.listen(env.port, () => {
      logger.info(`⚡ PayPulse Server running at http://localhost:${env.port} [${env.nodeEnv}]`);
      logger.info(`Health check available at http://localhost:${env.port}/api/health`);
    });
  } catch (error) {
    logger.error('Fatal server startup error:', error.message);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Shutting down PayPulse gracefully...`);

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed.');
      await disconnectDatabase();
      logger.info('Process termination complete.');
      process.exit(0);
    });

    // Force close after 10s timeout
    setTimeout(() => {
      logger.error('Forcefully terminating process due to timeout.');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception thrown:', err.message);
  gracefulShutdown('uncaughtException');
});

startServer();
