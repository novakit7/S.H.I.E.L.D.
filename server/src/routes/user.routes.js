import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user.controllers.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();
router.use(requireAuth);
router.get('/me', getProfile);
router.patch(
  '/me',
  validate({
    body: {
      name: { type: 'string', required: false, min: 2, max: 100 },
      department: { type: 'string', required: false, max: 100 },
      bio: { type: 'string', required: false, max: 250 },
      avatar: { type: 'string', required: false, max: 500 },
    },
  }),
  updateProfile,
);
export default router;
