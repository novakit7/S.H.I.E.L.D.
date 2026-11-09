import { transporter } from '../config/mail.config.js';

const mailFromName = process.env.MAIL_FROM_NAME || 'S.H.I.E.L.D.';
const mailFromEmail = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER || process.env.EMAIL;

const getSender = () => {
  if (!mailFromEmail) throw new Error('MAIL_FROM_EMAIL is not configured.');
  return `"${mailFromName}" <${mailFromEmail}>`;
};

export const sendMail = async ({ to, subject, text, html }) => {
  if (!to || !subject || (!text && !html)) {
    throw new Error('Email recipient, subject, and content are required.');
  }

  try {
    const result = await transporter.sendMail({
      from: getSender(),
      to,
      subject,
      text,
      html,
    });
    return { sent: true, messageId: result.messageId };
  } catch {
    throw new Error('Unable to send email.');
  }
};

export const sendOtp = async (to, otp) => {
  if (!to || !otp) throw new Error('OTP recipient and value are required.');

  const text = [
    'S.H.I.E.L.D. - Verify Your Email',
    '',
    `Your verification code is: ${otp}`,
    'This code expires in 5 minutes.',
    '',
    'For your security, do not share this code with anyone.',
  ].join('\n');
  const html = `
    <div style="margin:0;padding:32px 16px;background:#09090b;color:#fafafa;font-family:Arial,sans-serif;">
      <div style="max-width:560px;margin:0 auto;padding:32px;background:#18181b;border:1px solid #303036;border-radius:12px;">
        <div style="color:#f97316;font-size:22px;font-weight:700;letter-spacing:1px;">S.H.I.E.L.D.</div>
        <div style="margin-top:4px;color:#a1a1aa;font-size:12px;">Smart Hub for Interaction, Engagement, Learning &amp; Discovery</div>
        <h1 style="margin:32px 0 12px;color:#fafafa;font-size:26px;">Verify Your Email</h1>
        <p style="color:#a1a1aa;font-size:15px;line-height:1.6;">Use the verification code below to activate your S.H.I.E.L.D. account.</p>
        <div style="margin:28px 0;padding:20px;text-align:center;background:#202024;border:1px solid #f97316;border-radius:10px;color:#fb923c;font-size:36px;font-weight:700;letter-spacing:10px;">${otp}</div>
        <p style="color:#fbbf24;font-size:14px;font-weight:700;">This code expires in 5 minutes.</p>
        <p style="color:#71717a;font-size:13px;line-height:1.6;">For your security, never share this OTP with anyone. If you did not request this code, you can safely ignore this email.</p>
      </div>
    </div>
  `;

  return sendMail({
    to,
    subject: 'S.H.I.E.L.D. - Email Verification OTP',
    text,
    html,
  });
};
