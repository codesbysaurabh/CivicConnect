import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { issueOtp, checkOtp } from '../utils/otp.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/http.js';

const router = Router();
const phone = z.string().regex(/^\d{10}$/, 'Phone must be 10 digits');

const otpLimiter = rateLimit({ windowMs: 10 * 60_000, limit: 5, standardHeaders: true, legacyHeaders: false,
  message: { error: 'Too many OTP requests. Try again later.' } });

router.post('/request-otp', otpLimiter, asyncHandler(async (req, res) => {
  const { phone: p } = z.object({ phone }).parse(req.body);
  await issueOtp(p);
  res.json({ ok: true, message: 'OTP sent.' });
}));

router.post('/verify-otp', asyncHandler(async (req, res) => {
  const { phone: p, code } = z.object({ phone, code: z.string().regex(/^\d{4}$/, 'Code must be 4 digits') }).parse(req.body);
  await checkOtp(p, code);

  let user = await User.findOne({ phone: p });
  if (!user) user = await User.create({ phone: p });
  if (env.adminPhones.includes(p) && user.role !== 'admin') { user.role = 'admin'; await user.save(); }

  res.json({ token: signToken(user), user });
}));

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

router.patch('/me', requireAuth, asyncHandler(async (req, res) => {
  const { name } = z.object({ name: z.string().trim().min(1).max(80) }).parse(req.body);
  req.user.name = name;
  await req.user.save();
  res.json({ user: req.user });
}));

export default router;
