import { User } from '../models/User.js';
import { Bill } from '../models/Bill.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken
} from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { env } from '../config/env.js';

// Cookie options for secure HttpOnly refresh token
const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Helper to seed starter bills for newly registered or demo users
export const seedUserStarterBills = async (userId, userPhone = '9876543210') => {
  const existingCount = await Bill.countDocuments({ user: userId });
  if (existingCount > 0) return;

  const now = new Date();
  const getOffsetDate = (days) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d;
  };

  const starterBills = [
    {
      user: userId,
      category: 'Electricity',
      providerName: 'BESCOM Electricity',
      consumerId: `CA-902${userPhone.slice(-6)}`,
      nickname: 'Home Primary Meter',
      amount: 2450,
      dueDate: getOffsetDate(1), // Tomorrow
      isPaid: false,
      autoRemind: true,
      reminderChannels: { whatsapp: true, sms: true, push: true },
      lateFee: 150,
      billingPeriod: 'Current Month',
      linkedPhone: userPhone
    },
    {
      user: userId,
      category: 'Broadband',
      providerName: 'Airtel Xstream Fiber',
      consumerId: `BB-${userPhone.slice(-6)}`,
      nickname: '300 Mbps High Speed Line',
      amount: 1179,
      dueDate: getOffsetDate(0), // Today
      isPaid: false,
      autoRemind: true,
      reminderChannels: { whatsapp: true, sms: false, push: true },
      lateFee: 100,
      billingPeriod: 'Current Month',
      linkedPhone: userPhone
    },
    {
      user: userId,
      category: 'Mobile',
      providerName: 'Jio Postpaid 5G',
      consumerId: userPhone,
      nickname: 'Primary Postpaid Connection',
      amount: 799,
      dueDate: getOffsetDate(5),
      isPaid: false,
      autoRemind: true,
      reminderChannels: { whatsapp: true, sms: true, push: true },
      lateFee: 50,
      billingPeriod: 'Current Cycle',
      linkedPhone: userPhone
    },
    {
      user: userId,
      category: 'Water',
      providerName: 'Bangalore BWSSB Water',
      consumerId: `BW-8902${userPhone.slice(-4)}`,
      nickname: 'Apartment Monthly Meter',
      amount: 420,
      dueDate: getOffsetDate(-4),
      isPaid: true,
      paidAt: getOffsetDate(-2),
      paymentRef: 'UPI-BBPS-BWSSB-920148',
      autoRemind: false,
      reminderChannels: { whatsapp: false, sms: false, push: false },
      lateFee: 0,
      billingPeriod: 'Previous Cycle',
      linkedPhone: userPhone
    }
  ];

  await Bill.insertMany(starterBills);
};

export const register = async (req, res, next) => {
  try {
    const { name, email, phone, password, planType, avatar } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'An account with this email address already exists.', 409);
    }

    const user = new User({
      name,
      email,
      phone,
      password,
      planType: planType || 'Standard Account',
      avatar: avatar || ''
    });

    // Create tokens
    const accessToken = signAccessToken({ id: user._id, email: user.email, phone: user.phone });
    const refreshToken = signRefreshToken({ id: user._id });

    // Store hashed refresh token
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({ tokenHash, expiresAt });

    await user.save();

    // Auto-seed starter bills for the user
    await seedUserStarterBills(user._id, user.phone);

    // Set refresh token cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions());

    return sendSuccess(res, 'Account registered successfully', {
      user: user.toSafeObject(),
      accessToken,
      refreshToken
    }, 201);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password credentials.', 401);
    }

    const accessToken = signAccessToken({ id: user._id, email: user.email, phone: user.phone });
    const refreshToken = signRefreshToken({ id: user._id });

    // Clean up expired tokens and add new hashed refresh token
    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens = user.refreshTokens.filter((t) => t.expiresAt > new Date());
    user.refreshTokens.push({ tokenHash, expiresAt });

    await user.save();

    res.cookie('refreshToken', refreshToken, getCookieOptions());

    return sendSuccess(res, 'Logged in successfully', {
      user: user.toSafeObject(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) {
      return sendError(res, 'Refresh token required.', 401);
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch {
      return sendError(res, 'Invalid or expired refresh token.', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return sendError(res, 'User session no longer valid.', 401);
    }

    // Verify token exists in user's refresh token list (rotation & revocation)
    const incomingHash = hashToken(refreshToken);
    const tokenIndex = user.refreshTokens.findIndex((t) => t.tokenHash === incomingHash);

    if (tokenIndex === -1) {
      // Possible reuse attack: revoke all refresh tokens for security
      user.refreshTokens = [];
      await user.save();
      res.clearCookie('refreshToken', getCookieOptions());
      return sendError(res, 'Refresh token reuse detected. Session terminated.', 403);
    }

    // Rotate: remove used token, issue new pair
    user.refreshTokens.splice(tokenIndex, 1);

    const newAccessToken = signAccessToken({ id: user._id, email: user.email, phone: user.phone });
    const newRefreshToken = signRefreshToken({ id: user._id });

    const newTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({ tokenHash: newTokenHash, expiresAt });

    await user.save();

    res.cookie('refreshToken', newRefreshToken, getCookieOptions());

    return sendSuccess(res, 'Session refreshed successfully', {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (refreshToken) {
      const incomingHash = hashToken(refreshToken);
      await User.updateOne(
        { 'refreshTokens.tokenHash': incomingHash },
        { $pull: { refreshTokens: { tokenHash: incomingHash } } }
      );
    }

    res.clearCookie('refreshToken', getCookieOptions());
    return sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }
    return sendSuccess(res, 'User profile fetched', user.toSafeObject());
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return sendSuccess(res, 'Profile updated successfully', user.toSafeObject());
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return sendError(res, 'Current password does not match.', 400);
    }

    user.password = newPassword;
    // Invalidate old refresh tokens upon password change
    user.refreshTokens = [];
    await user.save();

    res.clearCookie('refreshToken', getCookieOptions());

    return sendSuccess(res, 'Password changed successfully. Please log in again.');
  } catch (error) {
    next(error);
  }
};

// Preset demo profile login/switcher (e.g. Rahul Sharma, Priya Patel, Vikram Verma)
export const demoLogin = async (req, res, next) => {
  try {
    const { phone = '9876543210', name = 'Rahul Sharma', email = 'rahul.sharma@example.com' } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        name,
        email,
        phone,
        password: 'Password@123',
        planType: 'Premium Family Member',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
      await user.save();
      await seedUserStarterBills(user._id, phone);
    }

    const accessToken = signAccessToken({ id: user._id, email: user.email, phone: user.phone });
    const refreshToken = signRefreshToken({ id: user._id });

    const tokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({ tokenHash, expiresAt });
    await user.save();

    res.cookie('refreshToken', refreshToken, getCookieOptions());

    return sendSuccess(res, `Connected to ${user.name}`, {
      user: user.toSafeObject(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
  }
};
