import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import adminRoutes from './routes/admin.js';
import { notFound, errorHandler } from './middleware/error.js';

export const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: env.clientOrigins, credentials: true }));
app.use(express.json({ limit: '100kb' }));
if (!env.isProd) app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 60_000, limit: 200, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'up' : 'down', uptime: process.uptime() }));

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);
