import assert from 'node:assert/strict';
import test from 'node:test';
import { validate } from '../src/middlewares/validate.middleware.js';

const execute = (middleware, request) =>
  new Promise((resolve) => {
    middleware(request, {}, (error) => resolve(error || null));
  });

test('validation normalizes declared body fields and converts query numbers', async () => {
  const request = {
    body: { email: '  student@example.edu  ' },
    query: { page: '2' },
  };
  const error = await execute(validate({
    body: { email: { type: 'email', required: true } },
    query: { page: { type: 'number', integer: true, min: 1, required: true } },
  }), request);

  assert.equal(error, null);
  assert.deepEqual(request.body, { email: 'student@example.edu' });
  assert.deepEqual(request.query, { page: '2' });
  assert.deepEqual(request.validated.query, { page: 2 });
});

test('validation rejects unknown fields and malformed values', async () => {
  const request = { body: { code: 'abc', unexpected: true } };
  const error = await execute(validate({
    body: { code: { type: 'string', required: true, pattern: /^\d{6}$/ } },
  }), request);

  assert.equal(error.statusCode, 400);
  assert.equal(error.code, 'VALIDATION_ERROR');
  assert.equal(error.details.length, 2);
});
