import crypto from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { CATEGORIES } from '../constants.js';
import { Complaint } from '../models/Complaint.js';
import { requireAuth } from '../middleware/auth.js';
import { uploadPhoto } from '../middleware/upload.js';
import { uploadImage, deleteImage } from '../config/imagekit.js';
import { HttpError, asyncHandler } from '../utils/http.js';

const router = Router();
router.use(requireAuth);

const createSchema = z.object({
  category: z.enum(CATEGORIES),
  description: z.string().trim().max(1000).optional().default(''),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  address: z.string().trim().max(300).optional().default(''),
});

const newTicketId = () => `CC-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
const POPULATE = { path: 'assignee', select: 'name phone area' };

// Create a complaint (multipart/form-data, photo field = "photo")
router.post(
  '/',
  uploadPhoto,
  asyncHandler(async (req, res) => {
    if (!req.file) throw new HttpError(400, 'A photo is required.');
    const body = createSchema.parse(req.body);

    const ticketId = newTicketId();
    const photo = await uploadImage({
      buffer: req.file.buffer,
      fileName: `${ticketId}.jpg`,
      tags: [body.category],
    });

    try {
      const complaint = await Complaint.create({
        ticketId,
        reporter: req.user.id,
        category: body.category,
        description: body.description,
        photo,
        location: { type: 'Point', coordinates: [body.lng, body.lat], address: body.address },
        history: [{ status: 'submitted', note: 'Complaint submitted' }],
      });
      res.status(201).json({ complaint });
    } catch (err) {
      await deleteImage(photo.fileId); // don't leave orphaned uploads
      throw err;
    }
  })
);

// My complaints
router.get(
  '/mine',
  asyncHandler(async (req, res) => {
    const complaints = await Complaint.find({ reporter: req.user.id })
      .sort({ createdAt: -1 })
      .populate(POPULATE);
    res.json({ complaints });
  })
);

// Feed for the Home screen
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const q = z
      .object({
        category: z.enum(CATEGORIES).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(30),
        page: z.coerce.number().int().min(1).default(1),
      })
      .parse(req.query);
    const filter = q.category ? { category: q.category } : {};
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((q.page - 1) * q.limit)
      .limit(q.limit)
      .populate(POPULATE);
    res.json({ complaints, page: q.page });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id).populate(POPULATE);
    if (!complaint) throw new HttpError(404, 'Complaint not found.');
    res.json({ complaint });
  })
);

// Rate a resolved complaint (reporter only, once)
router.post(
  '/:id/rating',
  asyncHandler(async (req, res) => {
    const { stars, comment } = z
      .object({
        stars: z.coerce.number().int().min(1).max(5),
        comment: z.string().trim().max(500).optional(),
      })
      .parse(req.body);

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) throw new HttpError(404, 'Complaint not found.');
    if (String(complaint.reporter) !== req.user.id)
      throw new HttpError(403, 'Only the reporter can rate this complaint.');
    if (complaint.status !== 'resolved')
      throw new HttpError(409, 'You can rate only after it is resolved.');
    if (complaint.rating?.stars) throw new HttpError(409, 'Already rated.');

    complaint.rating = { stars, comment, at: new Date() };
    await complaint.save();
    res.json({ complaint });
  })
);

export default router;
