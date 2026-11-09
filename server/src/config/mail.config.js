import 'dotenv/config';
import nodemailer from 'nodemailer';

const getMailConfig = () => {
  const user = process.env.SMTP_USER || process.env.EMAIL || process.env.MAIL_FROM_EMAIL;
  const password = process.env.SMTP_PASS;

  if (!user || !password) {
    throw new Error('SMTP configuration is incomplete. Set SMTP_USER and SMTP_PASS.');
  }

  const port = Number(process.env.SMTP_PORT || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('SMTP_PORT must be a valid port number.');
  }

  return {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true',
    auth: { user, pass: password },
  };
};

export const transporter = nodemailer.createTransport(getMailConfig());

export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    return { verified: true };
  } catch {
    throw new Error('SMTP transporter verification failed.');
  }
};
