import { verifyAccessToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';

export const authenticate = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header: Bearer <token>
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return sendError(res, 'Authentication required. Please log in.', 401);
    }

    try {
      const decoded = verifyAccessToken(token);
      req.user = {
        id: decoded.id,
        email: decoded.email,
        phone: decoded.phone
      };
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return sendError(res, 'Access token has expired. Please refresh your session.', 401, {
          code: 'TOKEN_EXPIRED'
        });
      }
      return sendError(res, 'Invalid or malformed access token.', 401);
    }
  } catch (error) {
    next(error);
  }
};
