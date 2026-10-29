import mongoose from 'mongoose';
import { ROLES } from '../constants.js';

const userSchema = new mongoose.Schema(
  {
    // Phone is optional for legacy accounts; email is the sign-in identifier.
    phone: { type: String, default: undefined, unique: true, sparse: true, match: /^\d{10}$/ },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, trim: true, maxlength: 80, default: '' },
    role: { type: String, enum: ROLES, default: 'citizen' },
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform(_doc, ret) {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export const User = mongoose.model('User', userSchema);
