import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError.js';

export const notFoundHandler = (req, _res, next) => {
  next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found.`, 'ROUTE_NOT_FOUND'));
};

export const errorHandler = (error, _req, res, _next) => {
  let normalized = error;
  if (error instanceof mongoose.Error.ValidationError) {
    normalized = new ApiError(
      400,
      'Request validation failed.',
      'VALIDATION_ERROR',
      Object.values(error.errors).map(({ path, message }) => ({ field: path, message })),
    );
  } else if (error instanceof mongoose.Error.CastError) {
    normalized = new ApiError(400, 'A supplied identifier or value is invalid.', 'INVALID_VALUE');
  } else if (error?.code === 11000) {
    normalized = new ApiError(409, 'A record with that value already exists.', 'DUPLICATE_RECORD');
  } else if (error?.type === 'entity.parse.failed') {
    normalized = new ApiError(400, 'Request body contains invalid JSON.', 'INVALID_JSON');
  } else if (error?.type === 'entity.too.large') {
    normalized = new ApiError(413, 'Request body is too large.', 'PAYLOAD_TOO_LARGE');
  } else if (error?.message === 'Origin is not allowed by CORS.') {
    normalized = new ApiError(403, 'Origin is not allowed.', 'CORS_ORIGIN_DENIED');
  }

  const statusCode = normalized.statusCode || 500;
  if (statusCode >= 500) console.error('Unhandled API error:', error);
  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 ? 'Internal server error.' : normalized.message,
    error: {
      code: normalized.code || 'INTERNAL_SERVER_ERROR',
      ...(normalized.details ? { details: normalized.details } : {}),
    },
  });
};
