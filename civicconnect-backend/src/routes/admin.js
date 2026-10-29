import { Router } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { CATEGORIES, STATUSES } from '../constants.js';
import { Complaint } from '../models/Complaint.js';
import { Worker } from '../models/Worker.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { HttpError, asyncHandler } from '../utils/http.js';

const router = Router();
router.use(requireAuth, requireAdmin);

const POPULATE = [{ path: 'assignee', select: 'name phone area' }, { path: 'reporter', select: 'phone name' }];

router.get('/complaints', asyncHandler(async (req, res) => {
  const q = z.object({
    status: z.enum(STATUSES).optional(),
    category: z.enum(CATEGORIES).optional(),
    assignee: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(200).default(50),
    page: z.coerce.number().int().min(1).default(1),
  }).parse(req.query);

  const filter = {};
  if (q.status) filter.status = q.status;
  if (q.category) filter.category = q.category;
  if (q.assignee) filter.assignee = q.assignee;

  const [complaints, total] = await Promise.all([
    Complaint.find(filter).sort({ createdAt: -1 }).skip((q.page - 1) * q.limit).limit(q.limit).populate(POPULATE),
    Complaint.countDocuments(filter),
  ]);
  res.json({ complaints, total, page: q.page });
}));

// Change status and/or assignee
router.patch('/complaints/:id', asyncHandler(async (req, res) => {
  const body = z.object({
    status: z.enum(STATUSES).optional(),
    assignee: z.string().nullable().optional(), // Worker id, or null to unassign
    note: z.string().trim().max(300).optional(),
  }).refine((b) => b.status !== undefined || b.assignee !== undefined, 'Provide status and/or assignee').parse(req.body);

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) throw new HttpError(404, 'Complaint not found.');

  if (body.assignee !== undefined) {
    if (body.assignee !== null) {
      if (!mongoose.isValidObjectId(body.assignee) || !(await Worker.exists({ _id: body.assignee, active: true })))
        throw new HttpError(400, 'Unknown or inactive field worker.');
      // Assigning a fresh complaint moves it to "assigned" unless admin chose a status too
      if (complaint.status === 'submitted' && body.status === undefined) body.status = 'assigned';
    }
    complaint.assignee = body.assignee;
  }

  if (body.status && body.status !== complaint.status) {
    complaint.status = body.status;
    complaint.resolvedAt = body.status === 'resolved' ? new Date() : undefined;
    complaint.history.push({ status: body.status, note: body.note });
  }

  await complaint.save();
  await complaint.populate(POPULATE);
  res.json({ complaint });
}));

router.get('/workers', asyncHandler(async (_req, res) => {
  res.json({ workers: await Worker.find({ active: true }).sort({ name: 1 }) });
}));

router.post('/workers', asyncHandler(async (req, res) => {
  const body = z.object({ name: z.string().trim().min(1), phone: z.string().trim().optional(), area: z.string().trim().optional() }).parse(req.body);
  res.status(201).json({ worker: await Worker.create(body) });
}));

export default router;
