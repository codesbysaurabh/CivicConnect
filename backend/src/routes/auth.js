import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { signToken, requireAuth } from '../middleware/auth.js';
import { asyncHandler, HttpError } from '../utils/http.js';
import { hashPassword, verifyPassword } from '../utils/password.js';

const router = Router();
const credentials = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(128),
});
const authLimiter = rateLimit({
  windowMs: 15 * 60_000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication attempts. Try again later.' },
});

router.post(
  '/register',
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = credentials.parse(req.body);
    if (await User.exists({ email })) throw new HttpError(409, 'An account with this email already exists.');
    const role = env.adminEmails.includes(email) ? 'admin' : 'citizen';
    let user;
    try {
      user = await User.create({ email, passwordHash: await hashPassword(password), role });
    } catch (error) {
      if (error?.code === 11000) throw new HttpError(409, 'An account with this email already exists.');
      throw error;
    }
    res.status(201).json({ token: signToken(user), user });
  })
);

router.post(
  '/login',
  authLimiter,
  asyncHandler(async (req, res) => {
    const { email, password } = credentials.parse(req.body);
    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new HttpError(401, 'Email or password is incorrect.');
    }
    res.json({ token: signToken(user), user });
  })
);

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

router.patch(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { name } = z.object({ name: z.string().trim().min(1).max(80) }).parse(req.body);
    req.user.name = name;
    await req.user.save();
    res.json({ user: req.user });
  })
);

export default router;
