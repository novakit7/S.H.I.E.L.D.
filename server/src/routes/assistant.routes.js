import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { chatWithAssistant } from '../controllers/assistant.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateAssistantRequest } from '../validators/assistant.validator.js';

const router = Router();
router.post(
  '/chat',
  requireAuth,
  rateLimit({
    windowMs: 60_000,
    limit: 20,
    keyGenerator: (req) => req.user?._id?.toString() || req.ip,
    standardHeaders: true,
    legacyHeaders: false,
  }),
  validateAssistantRequest,
  chatWithAssistant,
);

export default router;
