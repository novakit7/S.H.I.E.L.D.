import mongoose from 'mongoose';

const communityPostSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    alias: { type: String, required: true, trim: true, maxlength: 40 },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, required: true, trim: true, maxlength: 2000 },
    category: { type: String, enum: ['Academics', 'Campus life'], default: 'Campus life', index: true },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['active', 'removed'], default: 'active', index: true },
  },
  { timestamps: true },
);

communityPostSchema.index({ createdAt: -1 });
communityPostSchema.index({ title: 'text', body: 'text' });

export const CommunityPost =
  mongoose.models.CommunityPost || mongoose.model('CommunityPost', communityPostSchema);
