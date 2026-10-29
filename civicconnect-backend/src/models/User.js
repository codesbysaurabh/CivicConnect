import mongoose from 'mongoose';
import { ROLES } from '../constants.js';

const userSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true, unique: true, match: /^\d{10}$/ },
    name: { type: String, trim: true, maxlength: 80, default: '' },
    role: { type: String, enum: ROLES, default: 'citizen' },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
