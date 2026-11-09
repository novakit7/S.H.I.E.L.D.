import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { User } from '../models/user.models.js';

export const bootstrapAdmin = async () => {
  if (!env.bootstrapAdminEmail && !env.bootstrapAdminPassword) return;
  if (!env.bootstrapAdminEmail || env.bootstrapAdminPassword.length < 12) {
    throw new Error('BOOTSTRAP_ADMIN_EMAIL and a BOOTSTRAP_ADMIN_PASSWORD of at least 12 characters are both required.');
  }

  const passwordHash = await bcrypt.hash(env.bootstrapAdminPassword, 12);
  await User.findOneAndUpdate(
    { emailId: env.bootstrapAdminEmail },
    {
      $set: {
        name: env.bootstrapAdminName,
        emailId: env.bootstrapAdminEmail,
        collegeId: env.bootstrapAdminStudentId,
        department: env.bootstrapAdminDepartment,
        passwordHash,
        role: 'admin',
        status: 'active',
        verified: true,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );
  console.log(`Bootstrap admin is ready for ${env.bootstrapAdminEmail}.`);
};
