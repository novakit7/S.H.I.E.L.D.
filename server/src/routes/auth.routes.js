import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getCurrentUser,
  login,
  logout,
  register,
  resendOtp,
  verifySignup,
} from '../controllers/userAuth.controllers.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Try again later.', error: { code: 'RATE_LIMITED' } },
});
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many registration attempts. Try again later.', error: { code: 'RATE_LIMITED' } },
});
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 12,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many verification attempts. Try again later.', error: { code: 'RATE_LIMITED' } },
});

router.post(
  '/register',
  registrationLimiter,
  validate({
    body: {
      name: { type: 'string', required: true, min: 2, max: 100 },
      email: { type: 'email', required: true },
      department: {
        type: 'string',
        required: true,
        enum: ['Computer Science', 'Business', 'Design', 'Engineering', 'Liberal Arts', 'Sciences'],
      },
      studentId: { type: 'string', required: true, min: 1, max: 64 },
      password: { type: 'string', required: true, min: 8, max: 128 },
    },
  }),
  register,
);
router.post(
  '/verify-otp',
  otpLimiter,
  validate({
    body: {
      code: { type: 'string', required: true, pattern: /^\d{6}$/, patternMessage: 'code must contain exactly six digits.' },
      registrationToken: { type: 'string', max: 100, required: false },
    },
  }),
  verifySignup,
);
router.post(
  '/resend-otp',
  otpLimiter,
  validate({ body: { registrationToken: { type: 'string', max: 100, required: false } } }),
  resendOtp,
);
router.post(
  '/login',
  loginLimiter,
  validate({
    body: {
      email: { type: 'email', required: true },
      password: { type: 'string', required: true, min: 1, max: 128 },
    },
  }),
  login,
);
router.get('/me', requireAuth, getCurrentUser);
router.post('/logout', requireAuth, logout);

export default router;
