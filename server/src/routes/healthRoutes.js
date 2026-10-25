import { Router } from 'express';
import { isDatabaseConnected } from '../config/database.js';

const router = Router();

router.get('/', (req, res) => {
  const dbConnected = isDatabaseConnected();
  const statusCode = dbConnected ? 200 : 503;

  return res.status(statusCode).json({
    success: dbConnected,
    api: 'running',
    database: dbConnected ? 'connected' : 'disconnected',
    status: dbConnected ? 'healthy' : 'degraded',
    message: dbConnected
      ? 'PayPulse API and database are fully operational.'
      : 'Database connectivity issue.',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
