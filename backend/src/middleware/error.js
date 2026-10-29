import { ZodError } from 'zod';
import multer from 'multer';
import { env } from '../config/env.js';

export const notFound = (req, res) =>
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: 'Validation failed.',
      details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  if (err instanceof multer.MulterError) {
    const msg = err.code === 'LIMIT_FILE_SIZE' ? 'Photo is too large (max 5 MB).' : err.message;
    return res.status(400).json({ error: msg });
  }
  if (err.name === 'CastError') return res.status(400).json({ error: 'Invalid id.' });

  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status >= 500 && env.isProd ? 'Internal server error.' : err.message,
    ...(err.details && { details: err.details }),
  });
}
