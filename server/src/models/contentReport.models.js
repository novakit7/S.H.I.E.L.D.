import mongoose from 'mongoose';

const contentReportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'CommunityPost', required: true, index: true },
    reason: { type: String, required: true, trim: true, maxlength: 500 },
    status: { type: String, enum: ['pending', 'reviewed', 'dismissed'], default: 'pending', index: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

contentReportSchema.index({ reporter: 1, post: 1 }, { unique: true });
contentReportSchema.index({ createdAt: -1 });

export const ContentReport =
  mongoose.models.ContentReport || mongoose.model('ContentReport', contentReportSchema);
