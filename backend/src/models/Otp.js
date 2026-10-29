import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  phone: { type: String, required: true, index: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  // MongoDB deletes the document automatically once expiresAt passes
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export const Otp = mongoose.model('Otp', otpSchema);
