import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, minlength: 2, maxlength: 180 },
    body: { type: String, default: '', trim: true, maxlength: 5000 },
    category: { type: String, required: true, trim: true, maxlength: 80, index: true },
    department: { type: String, required: true, trim: true, maxlength: 100, index: true },
    urgent: { type: Boolean, default: false },
    pinned: { type: Boolean, default: false },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published', index: true },
    publishAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

announcementSchema.index({ status: 1, publishAt: -1 });
announcementSchema.index({ title: 'text', body: 'text', department: 'text' });

export const Announcement =
  mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
