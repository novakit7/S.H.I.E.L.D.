import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { RevokedToken } from '../models/revokedToken.models.js';
import { User } from '../models/user.models.js';
import { ApiError } from '../utils/apiError.js';

const extractToken = (req) => {
  const authorization = req.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    return { token: authorization.slice(7).trim(), cookieAuthenticated: false };
  }
  return { token: req.cookies?.shield_token, cookieAuthenticated: true };
};

export const requireAuth = async (req, _res, next) => {
  const { token, cookieAuthenticated } = extractToken(req);
  if (!token) return next(new ApiError(401, 'Authentication is required.', 'AUTHENTICATION_REQUIRED'));
  if (
    cookieAuthenticated &&
    !['GET', 'HEAD', 'OPTIONS'].includes(req.method) &&
    !env.clientOrigins.includes(req.get('origin'))
  ) {
    return next(new ApiError(403, 'The request origin is not allowed.', 'CSRF_ORIGIN_DENIED'));
  }
  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    return next(new ApiError(401, 'Authentication token is invalid or expired.', 'INVALID_TOKEN'));
  }
  if (!payload.sub || !payload.jti || !payload.exp) {
    return next(new ApiError(401, 'Authentication token is invalid.', 'INVALID_TOKEN'));
  }
  const revoked = await RevokedToken.exists({ jti: payload.jti });
  if (revoked) return next(new ApiError(401, 'Authentication token has been revoked.', 'TOKEN_REVOKED'));
  const user = await User.findById(payload.sub).select('_id name emailId collegeId department role status verified avatar bio createdAt');
  if (!user || !user.verified || user.status !== 'active') {
    return next(new ApiError(401, 'This account cannot be used.', 'ACCOUNT_UNAVAILABLE'));
  }
  req.user = user;
  req.auth = { token, tokenId: payload.jti, expiresAt: new Date(payload.exp * 1000) };
  return next();
};

export const requireRole = (...roles) => (req, _res, next) => {
  if (!req.user) return next(new ApiError(401, 'Authentication is required.', 'AUTHENTICATION_REQUIRED'));
  if (!roles.includes(req.user.role)) return next(new ApiError(403, 'You do not have permission to perform this action.', 'FORBIDDEN'));
  return next();
};
