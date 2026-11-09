import { Router } from 'express';
import {
  createPost,
  listPosts,
  reportPost,
  toggleLike,
} from '../controllers/community.controllers.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = Router();
router.use(requireAuth);
router.get(
  '/posts',
  validate({
    query: {
      q: { type: 'string', max: 100, required: false },
      category: { type: 'string', enum: ['All', 'Academics', 'Campus life'], required: false },
      page: { type: 'number', integer: true, min: 1, max: 1_000_000, required: false },
      limit: { type: 'number', integer: true, min: 1, max: 100, required: false },
      sort: { type: 'string', enum: ['newest', 'oldest'], required: false },
    },
  }),
  listPosts,
);
router.post(
  '/posts',
  validate({
    body: {
      body: { type: 'string', required: true, min: 1, max: 2000 },
      title: { type: 'string', required: false, min: 1, max: 120 },
      category: { type: 'string', required: false, enum: ['Academics', 'Campus life'] },
    },
  }),
  createPost,
);
router.post('/posts/:id/likes', validate({ params: { id: { type: 'objectId', required: true } }, body: {} }), toggleLike);
router.post(
  '/posts/:id/reports',
  validate({
    params: { id: { type: 'objectId', required: true } },
    body: { reason: { type: 'string', required: false, max: 500 } },
  }),
  reportPost,
);

export default router;
