import { Router } from 'express';
import {
  createAnnouncement,
  deleteAnnouncement,
  listManagedAnnouncements,
  listReports,
  reviewReport,
  updateAnnouncement,
  listUsers,
  updateUser,
} from '../controllers/admin.controllers.js';
import { adminSummary } from '../controllers/user.controllers.js';
import { requireAuth, requireRole } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

router.get('/summary', adminSummary);

router.get(
  '/announcements',
  validate({
    query: {
      q: { type: 'string', max: 120, required: false },
      category: { type: 'string', max: 80, required: false },
      department: { type: 'string', max: 100, required: false },
      status: { type: 'string', enum: ['draft', 'published', 'archived'], required: false },
      page: { type: 'number', integer: true, min: 1, max: 1_000_000, required: false },
      limit: { type: 'number', integer: true, min: 1, max: 100, required: false },
    },
  }),
  listManagedAnnouncements,
);
router.post(
  '/announcements',
  validate({
    body: {
      title: { type: 'string', required: true, min: 2, max: 180 },
      body: { type: 'string', required: false, max: 5000 },
      category: { type: 'string', required: true, min: 1, max: 80 },
      department: { type: 'string', required: true, min: 1, max: 100 },
      urgent: { type: 'boolean', required: false },
      pinned: { type: 'boolean', required: false },
      status: { type: 'string', required: false, enum: ['draft', 'published', 'archived'] },
      publishAt: { type: 'string', required: false, max: 40 },
    },
  }),
  createAnnouncement,
);
router.patch(
  '/announcements/:id',
  validate({
    params: { id: { type: 'objectId', required: true } },
    body: {
      title: { type: 'string', required: false, min: 2, max: 180 },
      body: { type: 'string', required: false, max: 5000 },
      category: { type: 'string', required: false, min: 1, max: 80 },
      department: { type: 'string', required: false, min: 1, max: 100 },
      urgent: { type: 'boolean', required: false },
      pinned: { type: 'boolean', required: false },
      status: { type: 'string', required: false, enum: ['draft', 'published', 'archived'] },
      publishAt: { type: 'string', required: false, max: 40 },
    },
  }),
  updateAnnouncement,
);
router.delete(
  '/announcements/:id',
  validate({ params: { id: { type: 'objectId', required: true } }, body: {} }),
  deleteAnnouncement,
);

router.get(
  '/reports',
  validate({
    query: {
      status: { type: 'string', enum: ['pending', 'reviewed', 'dismissed'], required: false },
      page: { type: 'number', integer: true, min: 1, max: 1_000_000, required: false },
      limit: { type: 'number', integer: true, min: 1, max: 100, required: false },
    },
  }),
  listReports,
);
router.patch(
  '/reports/:id',
  validate({
    params: { id: { type: 'objectId', required: true } },
    body: { status: { type: 'string', required: true, enum: ['reviewed', 'dismissed'] } },
  }),
  reviewReport,
);

router.get(
  '/users',
  validate({
    query: {
      q: { type: 'string', max: 120, required: false },
      role: { type: 'string', enum: ['student', 'faculty', 'publisher', 'moderator', 'admin'], required: false },
      status: { type: 'string', enum: ['active', 'inactive', 'suspended', 'banned'], required: false },
      department: { type: 'string', max: 100, required: false },
      page: { type: 'number', integer: true, min: 1, max: 1_000_000, required: false },
      limit: { type: 'number', integer: true, min: 1, max: 100, required: false },
    },
  }),
  listUsers,
);
router.patch(
  '/users/:id',
  validate({
    params: { id: { type: 'objectId', required: true } },
    body: {
      role: { type: 'string', enum: ['student', 'faculty', 'publisher', 'moderator', 'admin'], required: false },
      status: { type: 'string', enum: ['active', 'inactive', 'suspended', 'banned'], required: false },
    },
  }),
  updateUser,
);

export default router;
