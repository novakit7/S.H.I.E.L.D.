import { Router } from 'express';
import { createItem, listItems } from '../controllers/lostFound.controllers.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();
router.use(requireAuth);
router.get(
  '/',
  validate({
    query: {
      q: { type: 'string', max: 120, required: false },
      status: { type: 'string', enum: ['All', 'Lost', 'Found'], required: false },
      category: { type: 'string', max: 80, required: false },
      page: { type: 'number', integer: true, min: 1, max: 1_000_000, required: false },
      limit: { type: 'number', integer: true, min: 1, max: 100, required: false },
    },
  }),
  listItems,
);
router.post(
  '/',
  validate({
    body: {
      title: { type: 'string', required: true, min: 2, max: 120 },
      category: { type: 'string', required: true, min: 2, max: 80 },
      location: { type: 'string', required: true, min: 2, max: 160 },
      status: { type: 'string', required: true, enum: ['Lost', 'Found'] },
      description: { type: 'string', required: true, min: 2, max: 2000 },
    },
  }),
  createItem,
);

export default router;
