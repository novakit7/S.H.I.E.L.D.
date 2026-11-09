import { ApiError } from '../utils/apiError.js';

export const validateAssistantRequest = (req, _res, next) => {
  const body = req.body || {};
  const allowedFields = new Set(['message', 'conversationHistory']);
  const unknownField = Object.keys(body).find((field) => !allowedFields.has(field));
  if (unknownField) return next(new ApiError(400, `${unknownField} is not allowed.`, 'VALIDATION_ERROR'));
  if (typeof body.message !== 'string' || !body.message.trim()) {
    return next(new ApiError(400, 'message is required.', 'VALIDATION_ERROR'));
  }
  if (body.message.trim().length > 2000) {
    return next(new ApiError(400, 'message must be at most 2000 characters.', 'VALIDATION_ERROR'));
  }
  if (body.conversationHistory !== undefined && !Array.isArray(body.conversationHistory)) {
    return next(new ApiError(400, 'conversationHistory must be an array.', 'VALIDATION_ERROR'));
  }
  return next();
};
