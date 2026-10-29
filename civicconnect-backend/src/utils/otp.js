import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { Otp } from '../models/Otp.js';
import { HttpError } from './http.js';

const hash = (phone, code) =>
  crypto.createHmac('sha256', env.jwtSecret).update(`${phone}:${code}`).digest('hex');

const MAX_ATTEMPTS = 5;

/** Swap this for a real SMS provider (MSG91, Twilio, Fast2SMS, ...) in production. */
async function deliver(phone, code) {
  if (env.otpMode === 'console') {
    console.log(`📲 OTP for ${phone}: ${code}`);
    return;
  }
  throw new Error(`OTP_MODE "${env.otpMode}" is not implemented. Edit src/utils/otp.js`);
}

export async function issueOtp(phone) {
  const code = String(crypto.randomInt(0, 10000)).padStart(4, '0');
  await Otp.deleteMany({ phone });
  await Otp.create({
    phone,
    codeHash: hash(phone, code),
    expiresAt: new Date(Date.now() + env.otpTtlMinutes * 60_000),
  });
  await deliver(phone, code);
}

export async function checkOtp(phone, code) {
  if (env.devFixedOtp && code === env.devFixedOtp) return;

  const record = await Otp.findOne({ phone });
  if (!record) throw new HttpError(400, 'Code expired or not requested. Request a new one.');
  if (record.attempts >= MAX_ATTEMPTS) {
    await record.deleteOne();
    throw new HttpError(429, 'Too many attempts. Request a new code.');
  }
  const a = Buffer.from(record.codeHash);
  const b = Buffer.from(hash(phone, code));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    record.attempts += 1;
    await record.save();
    throw new HttpError(400, 'Incorrect code.');
  }
  await record.deleteOne();
}
