import mongoose from 'mongoose';
import { CATEGORIES, STATUSES } from '../constants.js';

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true },
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    category: { type: String, enum: CATEGORIES, required: true },
    description: { type: String, trim: true, maxlength: 1000, default: '' },
    photo: {
      url: { type: String, required: true },
      thumbnailUrl: String,
      fileId: String,
    },
    location: {
      type: { type: String, enum: ['Point'], default: undefined },
      coordinates: { type: [Number], default: undefined }, // [lng, lat], omitted when GPS is unavailable
      address: { type: String, trim: true, maxlength: 300, default: '' },
    },
    status: { type: String, enum: STATUSES, default: 'submitted', index: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', default: null },
    history: [
      {
        status: { type: String, enum: STATUSES },
        note: String,
        at: { type: Date, default: Date.now },
        _id: false,
      },
    ],
    rating: {
      stars: { type: Number, min: 1, max: 5 },
      comment: { type: String, maxlength: 500 },
      at: Date,
    },
    resolvedAt: Date,
  },
  { timestamps: true }
);

complaintSchema.index({ 'location.coordinates': '2dsphere' });
complaintSchema.index({ createdAt: -1 });

complaintSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    if (ret.photo) delete ret.photo.fileId; // internal only
    return ret;
  },
});

export const Complaint = mongoose.model('Complaint', complaintSchema);
