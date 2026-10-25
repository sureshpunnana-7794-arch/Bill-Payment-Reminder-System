import { Router } from 'express';
import {
  register,
  login,
  refresh,
  logout,
  getMe,
  updateMe,
  changePassword,
  demoLogin
} from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { authLimiter } from '../middleware/rateLimiter.js';
import {
  registerSchema,
  loginSchema,
  updateMeSchema,
  changePasswordSchema
} from '../utils/validators.js';

const router = Router();

// Public routes with brute-force rate limiter
router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/demo-login', demoLogin);

// Protected routes
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, validate(updateMeSchema), updateMe);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);

export default router;
