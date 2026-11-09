import 'dotenv/config';

const mongoUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.mongoUri ||
  'mongodb://127.0.0.1:27017/shield';
const jwtSecret =
  process.env.JWT_SECRET ||
  process.env.JWT_KEY ||
  (process.env.NODE_ENV === 'production' ? '' : 'development-only-change-this-jwt-secret');

if (process.env.NODE_ENV === 'production') {
  const missing = [];
  if (!process.env.MONGODB_URI && !process.env.MONGO_URI) missing.push('MONGODB_URI');
  if (!jwtSecret || jwtSecret.length < 32 || /replace-with|your_jwt_secret/i.test(jwtSecret)) {
    missing.push('JWT_SECRET (a non-placeholder secret of at least 32 characters)');
  }
  if (!process.env.CLIENT_URL) missing.push('CLIENT_URL');
  if (!(process.env.SMTP_USER || process.env.EMAIL)) missing.push('SMTP_USER');
  if (!process.env.SMTP_PASS) missing.push('SMTP_PASS');
  if (!process.env.MAIL_FROM_EMAIL && !(process.env.SMTP_USER || process.env.EMAIL)) {
    missing.push('MAIL_FROM_EMAIL');
  }
  if (missing.length) {
    throw new Error(`Missing or invalid production environment variables: ${missing.join(', ')}`);
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 5000),
  mongoUri,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientOrigins: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .map((origin) => origin.replace(/\/+$/, ''))
    .filter(Boolean),
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpSecure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
  smtpUser: process.env.SMTP_USER || process.env.EMAIL || '',
  mailFromName: process.env.MAIL_FROM_NAME || 'S.H.I.E.L.D.',
  mailFromEmail: process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER || process.env.EMAIL || '',
  openRouterModel: process.env.OPEN_ROUTER_MODEL || process.env.OPENAI_MODEL || 'gpt-5.5',
  openRouterMaxOutputTokens: Number(
    process.env.OPEN_ROUTER_MAX_OUTPUT_TOKENS || process.env.OPENAI_MAX_OUTPUT_TOKENS || 600,
  ),
  openRouterTimeout: Number(
    process.env.OPEN_ROUTER_TIMEOUT || process.env.OPENAI_TIMEOUT || 30000,
  ),
  openRouterBaseUrl: process.env.OPEN_ROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  bootstrapAdminEmail: process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase() || '',
  bootstrapAdminPassword: process.env.BOOTSTRAP_ADMIN_PASSWORD || '',
  bootstrapAdminName: process.env.BOOTSTRAP_ADMIN_NAME || 'Campus Administrator',
  bootstrapAdminDepartment: process.env.BOOTSTRAP_ADMIN_DEPARTMENT || 'Student Affairs',
  bootstrapAdminStudentId: process.env.BOOTSTRAP_ADMIN_STUDENT_ID || 'administrator',
};
