import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { HttpError, asyncHandler } from '../utils/http.js';

export const signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) throw new HttpError(401, 'Authentication required.');
  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw new HttpError(401, 'Invalid or expired token.');
  }
  const user = await User.findById(payload.sub);
  if (!user) throw new HttpError(401, 'User no longer exists.');
  req.user = user;
  next();
});

export const requireAdmin = (req, _res, next) =>
  req.user?.role === 'admin' ? next() : next(new HttpError(403, 'Admin access required.'));
