import mongoose from 'mongoose';

const registrationChallengeSchema = new mongoose.Schema(
  {
    emailId: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    collegeId: { type: String, required: true, trim: true, maxlength: 64 },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    department: { type: String, required: true, trim: true, maxlength: 100 },
    passwordHash: { type: String, required: true, select: false },
    otpHash: { type: String, required: true, select: false },
    registrationTokenHash: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    lastOtpSentAt: { type: Date, required: true, default: Date.now },
    attempts: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true },
);

registrationChallengeSchema.index({ emailId: 1 }, { unique: true });
registrationChallengeSchema.index({ collegeId: 1 }, { unique: true });
registrationChallengeSchema.index({ otpHash: 1 }, { unique: true });
registrationChallengeSchema.index({ registrationTokenHash: 1 }, { unique: true });

export const RegistrationChallenge =
  mongoose.models.RegistrationChallenge ||
  mongoose.model('RegistrationChallenge', registrationChallengeSchema);
