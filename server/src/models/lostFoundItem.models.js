import mongoose from 'mongoose';

const lostFoundItemSchema = new mongoose.Schema(
  {
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    category: { type: String, required: true, trim: true, minlength: 2, maxlength: 80, index: true },
    location: { type: String, required: true, trim: true, minlength: 2, maxlength: 160, index: true },
    description: { type: String, required: true, trim: true, minlength: 2, maxlength: 2000 },
    status: { type: String, enum: ['Lost', 'Found'], required: true, index: true },
  },
  { timestamps: true },
);

lostFoundItemSchema.index({ createdAt: -1 });
lostFoundItemSchema.index({ title: 'text', location: 'text', description: 'text' });

export const LostFoundItem =
  mongoose.models.LostFoundItem || mongoose.model('LostFoundItem', lostFoundItemSchema);
