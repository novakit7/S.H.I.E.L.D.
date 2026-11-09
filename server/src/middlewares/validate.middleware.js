import mongoose from 'mongoose';
import { ApiError } from '../utils/apiError.js';

const isEmpty = (value) =>
  value === undefined || value === null || (typeof value === 'string' && !value.trim());

const validateValue = (value, field, rule, source) => {
  if (isEmpty(value)) {
    if (rule.required) return { message: `${field} is required.` };
    return null;
  }

  if (rule.type === 'string') {
    if (typeof value !== 'string') return { message: `${field} must be a string.` };
    const normalized = value.trim();
    if (rule.min !== undefined && normalized.length < rule.min) {
      return { message: `${field} must be at least ${rule.min} characters.` };
    }
    if (rule.max !== undefined && normalized.length > rule.max) {
      return { message: `${field} must be at most ${rule.max} characters.` };
    }
    if (rule.pattern && !rule.pattern.test(normalized)) return { message: rule.patternMessage || `${field} is invalid.` };
    if (rule.enum && !rule.enum.includes(normalized)) {
      return { message: `${field} must be one of: ${rule.enum.join(', ')}.` };
    }
    return { value: normalized };
  }

  if (rule.type === 'email') {
    if (typeof value !== 'string' || value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      return { message: `${field} must be a valid email address.` };
    }
    return { value: value.trim().toLowerCase() };
  }

  if (rule.type === 'number') {
    const normalized = source === 'query' && typeof value === 'string' ? Number(value) : value;
    if (typeof normalized !== 'number' || !Number.isFinite(normalized)) {
      return { message: `${field} must be a number.` };
    }
    if (rule.integer && !Number.isInteger(normalized)) return { message: `${field} must be an integer.` };
    if (rule.min !== undefined && normalized < rule.min) return { message: `${field} must be at least ${rule.min}.` };
    if (rule.max !== undefined && normalized > rule.max) return { message: `${field} must be at most ${rule.max}.` };
    return { value: normalized };
  }

  if (rule.type === 'boolean') {
    if (typeof value !== 'boolean') return { message: `${field} must be a boolean.` };
    return { value };
  }

  if (rule.type === 'objectId') {
    if (typeof value !== 'string' || !mongoose.isObjectIdOrHexString(value)) {
      return { message: `${field} must be a valid identifier.` };
    }
    return { value };
  }

  return { message: `Validation rule for ${field} is invalid.` };
};

export const validate = (schema) => (req, _res, next) => {
  const errors = [];
  for (const [source, rules] of Object.entries(schema)) {
    const input = req[source] || {};
    const normalized = {};
    for (const [field, rule] of Object.entries(rules)) {
      const result = validateValue(input[field], field, rule, source);
      if (result?.message) errors.push({ field, message: result.message });
      else if (result && Object.hasOwn(input, field)) normalized[field] = result.value;
    }
    const allowed = new Set(Object.keys(rules));
    for (const field of Object.keys(input)) {
      if (!allowed.has(field)) errors.push({ field, message: `${field} is not allowed.` });
    }
    req.validated = req.validated || {};
    req.validated[source] = normalized;
    if (source !== 'query') req[source] = normalized;
  }
  if (errors.length) return next(new ApiError(400, 'Request validation failed.', 'VALIDATION_ERROR', errors));
  return next();
};
