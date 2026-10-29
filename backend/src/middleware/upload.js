import multer from 'multer';
import { HttpError } from '../utils/http.js';

export const uploadPhoto = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }, // 5 MB; front-end already compresses
  fileFilter: (_req, file, cb) =>
    /^image\/(jpeg|png|webp|heic)$/.test(file.mimetype)
      ? cb(null, true)
      : cb(new HttpError(400, 'Only JPEG, PNG, WebP or HEIC images are allowed.')),
}).single('photo');
