# Authentication and authorization

## Server flow

1. `POST /api/auth/register` validates the request, checks duplicates, hashes the password, creates an expiring registration challenge, and sends an OTP through SMTP.
2. `POST /api/auth/verify-otp` verifies the challenge and activates the account.
3. `POST /api/auth/login` verifies the bcrypt password and issues a JWT in the `shield_token` HTTP-only cookie.
4. `requireAuth` verifies the JWT and checks revocation.
5. `requireRole('admin')` protects administrator routes.
6. `POST /api/auth/logout` revokes the token and clears the session cookie.

Registration state uses a separate `shield_registration` HTTP-only cookie. Cookies use `secure` in production, `sameSite: lax`, and scoped paths.

## Protections

- bcrypt password hashing.
- JWT expiration and token identifiers.
- Revoked-token persistence with TTL cleanup.
- OTP, login, and registration rate limits.
- Request validation and centralized errors.
- Helmet and CORS origin allow-listing.

## Frontend status

The current frontend `authService.js` uses embedded demo users and `localStorage`, and `AuthContext` treats that local session as authenticated. This is a mid-term evaluation bypass, not the final authentication implementation. It must be replaced with API login, registration, OTP, `/auth/me`, and logout calls before production.

## Operational requirements

Use a random JWT secret of at least 32 characters, HTTPS, secure cookies, a restricted client origin, strong admin credentials, and SMTP app passwords. Never expose provider keys or demo passwords in a deployed client bundle.
