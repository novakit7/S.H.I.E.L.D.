import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { RegistrationChallenge } from '../models/registrationChallenge.models.js';
import { RevokedToken } from '../models/revokedToken.models.js';
import { User } from '../models/user.models.js';
import { sendOtp } from '../services/mail.service.js';
import { ApiError } from '../utils/apiError.js';
import { getPublicUser, sendSuccess } from '../utils/apiResponse.js';

const otpExpiresInMs = 5 * 60 * 1000;
const registrationCookieName = 'shield_registration';
const sessionCookieName = 'shield_token';

const digest = (value, purpose) =>
  createHmac('sha256', env.jwtSecret).update(`${purpose}:${value}`).digest('hex');

const registrationCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: otpExpiresInMs,
});

const sessionCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  path: '/',
});

const setSession = (res, user) => {
  const tokenId = randomBytes(16).toString('hex');
  const token = jwt.sign({ sub: user._id.toString(), jti: tokenId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
  const expiresAt = new Date(jwt.decode(token).exp * 1000);
  res.cookie(sessionCookieName, token, {
    ...sessionCookieOptions(),
    maxAge: Math.max(0, expiresAt.getTime() - Date.now()),
  });
  return token;
};

const clearRegistrationCookie = (res) => res.clearCookie(registrationCookieName, {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  path: '/api/auth',
});

const getChallenge = async (req, res) => {
  const rawToken = req.cookies?.[registrationCookieName] || req.body?.registrationToken;
  if (!rawToken) throw new ApiError(400, 'No registration is waiting for verification.', 'REGISTRATION_NOT_FOUND');
  const challenge = await RegistrationChallenge.findOne({
    registrationTokenHash: digest(rawToken, 'registration'),
  }).select('+passwordHash +otpHash +registrationTokenHash');
  if (!challenge || challenge.expiresAt <= new Date()) {
    if (challenge) await challenge.deleteOne();
    clearRegistrationCookie(res);
    throw new ApiError(400, 'The verification session has expired. Please register again.', 'REGISTRATION_EXPIRED');
  }
  return challenge;
};

const createOtp = async () => {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    const otpHash = digest(code, 'otp');
    if (!(await RegistrationChallenge.exists({ otpHash, expiresAt: { $gt: new Date() } }))) {
      return { code, otpHash };
    }
  }
  throw new ApiError(503, 'Unable to start verification. Please try again.', 'OTP_GENERATION_FAILED');
};

export const register = async (req, res) => {
  const { name, email, studentId, department, password } = req.body;
  const emailId = email.toLowerCase();
  const collegeId = studentId.trim();

  if (await User.exists({ $or: [{ emailId }, { collegeId }] })) {
    throw new ApiError(409, 'An account with this email or student ID already exists.', 'ACCOUNT_EXISTS');
  }

  const conflictingChallenge = await RegistrationChallenge.findOne({
    $or: [{ emailId }, { collegeId }],
  });
  if (conflictingChallenge && conflictingChallenge.emailId !== emailId) {
    throw new ApiError(409, 'A registration is already using this student ID.', 'STUDENT_ID_PENDING');
  }

  const { code, otpHash } = await createOtp();
  const registrationToken = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + otpExpiresInMs);
  const passwordHash = await bcrypt.hash(password, 12);

  const challenge = await RegistrationChallenge.findOneAndUpdate(
    { emailId },
    {
      $set: {
        emailId,
        collegeId,
        name: name.trim(),
        department: department.trim(),
        passwordHash,
        otpHash,
        registrationTokenHash: digest(registrationToken, 'registration'),
        expiresAt,
        lastOtpSentAt: new Date(),
        attempts: 0,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );

  try {
    await sendOtp(emailId, code);
  } catch (error) {
    await challenge.deleteOne();
    throw new ApiError(502, 'Unable to send the verification email. Please try again.', 'OTP_DELIVERY_FAILED');
  }

  res.cookie(registrationCookieName, registrationToken, registrationCookieOptions());
  const data = { email: emailId, expiresAt, registrationToken };
  return sendSuccess(res, 202, 'Registration started. Verify your email to activate the account.', data);
};

export const verifySignup = async (req, res) => {
  const challenge = await getChallenge(req, res);
  const suppliedHash = Buffer.from(digest(req.body.code, 'otp'), 'hex');
  const expectedHash = Buffer.from(challenge.otpHash, 'hex');
  const validCode =
    suppliedHash.length === expectedHash.length && timingSafeEqual(suppliedHash, expectedHash);

  if (!validCode) {
    challenge.attempts += 1;
    if (challenge.attempts >= 5) {
      await challenge.deleteOne();
      clearRegistrationCookie(res);
      throw new ApiError(429, 'Too many invalid verification attempts. Please register again.', 'OTP_ATTEMPTS_EXCEEDED');
    }
    await challenge.save();
    throw new ApiError(400, 'That verification code is not valid.', 'INVALID_OTP');
  }

  const user = await User.create({
    name: challenge.name,
    emailId: challenge.emailId,
    collegeId: challenge.collegeId,
    department: challenge.department,
    passwordHash: challenge.passwordHash,
    role: 'student',
    status: 'active',
    verified: true,
    lastLoginAt: new Date(),
  });
  await challenge.deleteOne();
  clearRegistrationCookie(res);
  const token = setSession(res, user);
  return sendSuccess(res, 200, 'Email verified successfully.', {
    user: getPublicUser(user),
    token,
  });
};

export const resendOtp = async (req, res) => {
  const challenge = await getChallenge(req, res);
  const waitMs = 30_000 - (Date.now() - challenge.lastOtpSentAt.getTime());
  if (waitMs > 0) {
    throw new ApiError(429, 'Please wait before requesting another verification code.', 'OTP_RESEND_TOO_SOON', {
      retryAfterSeconds: Math.ceil(waitMs / 1000),
    });
  }

  const { code, otpHash } = await createOtp();
  challenge.otpHash = otpHash;
  challenge.lastOtpSentAt = new Date();
  challenge.attempts = 0;
  await challenge.save();
  try {
    await sendOtp(challenge.emailId, code);
  } catch (error) {
    await challenge.deleteOne();
    clearRegistrationCookie(res);
    throw new ApiError(502, 'Unable to send the verification email. Please try again.', 'OTP_DELIVERY_FAILED');
  }
  const data = { email: challenge.emailId, expiresAt: challenge.expiresAt };
  return sendSuccess(res, 200, 'A new verification code was sent.', data);
};

export const login = async (req, res) => {
  const emailId = req.body.email.toLowerCase();
  const user = await User.findOne({ emailId }).select('+passwordHash');
  const passwordMatches = user
    ? await bcrypt.compare(req.body.password, user.passwordHash)
    : false;
  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password.', 'INVALID_CREDENTIALS');
  }
  if (!user.verified || user.status !== 'active') {
    throw new ApiError(403, 'This account cannot sign in.', 'ACCOUNT_UNAVAILABLE');
  }

  user.lastLoginAt = new Date();
  await user.save();
  const token = setSession(res, user);
  return sendSuccess(res, 200, 'Signed in successfully.', { user: getPublicUser(user), token });
};

export const logout = async (req, res) => {
  await RevokedToken.create({ jti: req.auth.tokenId, expiresAt: req.auth.expiresAt });
  res.clearCookie(sessionCookieName, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return sendSuccess(res, 200, 'Signed out successfully.', null);
};

export const getCurrentUser = async (req, res) =>
  sendSuccess(res, 200, 'Current user loaded.', { user: getPublicUser(req.user) });
