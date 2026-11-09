import { Router } from 'express';
import { listLocations } from '../controllers/location.controllers.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();
router.get(
  '/',
  requireAuth,
  validate({
    query: {
      q: { type: 'string', max: 120, required: false },
      page: { type: 'number', integer: true, min: 1, max: 1_000_000, required: false },
      limit: { type: 'number', integer: true, min: 1, max: 100, required: false },
    },
  }),
  listLocations,
);

export default router;
