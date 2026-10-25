import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

// Route imports
import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import billRoutes from './routes/billRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../dist');

export const createApp = () => {
  const app = express();

  // HTTP Security Headers
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  }));

  // CORS Configuration
  const allowedOrigins = [
    env.clientUrl,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, tests, same-origin)
      if (!origin) {
        return callback(null, true);
      }

      // Check explicit allowed origins or Render domains
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.onrender.com') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }

      // Default safe allow with reflecting origin for credentials
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }));

  // Request Parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));
  app.use(cookieParser());

  // Logging (suppressed during automated tests)
  if (env.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }

  // Rate Limiting on API endpoints
  if (env.nodeEnv !== 'test') {
    app.use('/api', apiLimiter);
  }

  // API Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/bills', billRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/reminders', reminderRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Serve static assets from dist if available (production full-stack mode)
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));

    app.use((req, res, next) => {
      if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(distPath, 'index.html'));
      }
      next();
    });
  }

  // 404 Route Handler for unmatched endpoints
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: `The requested endpoint ${req.method} ${req.originalUrl} does not exist.`
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
};

export const app = createApp();
