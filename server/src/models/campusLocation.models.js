import mongoose from 'mongoose';

const campusLocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120, unique: true },
    description: { type: String, default: 'Campus location', trim: true, maxlength: 500 },
    latitude: { type: Number, min: -90, max: 90 },
    longitude: { type: Number, min: -180, max: 180 },
    address: { type: String, default: '', trim: true, maxlength: 240 },
    active: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

campusLocationSchema.index({ name: 'text', description: 'text', address: 'text' });

export const CampusLocation =
  mongoose.models.CampusLocation || mongoose.model('CampusLocation', campusLocationSchema);
