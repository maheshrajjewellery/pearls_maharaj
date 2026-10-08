import crypto from 'node:crypto';

// ====================================================================
// SERVER-SIDE ADMIN AUTHENTICATION & SECURITY MODULE
// ====================================================================
// This module executes strictly in the Node.js server context.
// Admin credentials & password hashes are NEVER exposed to browser client code.

// Server salt for PBKDF2 hashing
const SERVER_SALT = process.env.ADMIN_AUTH_SALT || 'MAHESHRAJ_jewellery_admin_salt_2026_secure';
const ALLOWED_ADMIN_EMAILS = new Set([
  (process.env.ADMIN_EMAIL || 'maheshtadakalle@gmail.com').toLowerCase(),
  'maheshtadakalle@gmail.com',
]);

// Default secure admin password (configurable via env ADMIN_PASSWORD)
const RAW_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'MAHESHRAJAdmin#2026!';

/**
 * Hashes a password using PBKDF2 with SHA-512 and 100,000 iterations.
 */
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

// Compute and store hashed passwords at server startup
const STORED_ADMIN_PASSWORD_HASH = hashPassword(RAW_ADMIN_PASSWORD, SERVER_SALT);
const STORED_LEGACY_PASSWORD_HASH = hashPassword('MAHESHRAJ123', SERVER_SALT);

// Random secret key generated per server session for signing HMAC session tokens
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || crypto.randomBytes(32).toString('hex');

// In-memory token revocation list
const revokedTokens = new Set<string>();

export interface ServerAdminUser {
  id: string;
  email: string;
  role: 'admin';
  name: string;
}

/**
 * Validates admin credentials on the server side using timing-safe comparison.
 * Returns ServerAdminUser if valid, or null if invalid.
 */
export function verifyAdminCredentials(email: string, pass: string): ServerAdminUser | null {
  if (!email || !pass || typeof email !== 'string' || typeof pass !== 'string') {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();
  
  // Verify email matches authorized admin emails
  if (!ALLOWED_ADMIN_EMAILS.has(normalizedEmail)) {
    return null;
  }

  // Hash input password with server salt
  const inputHash = hashPassword(pass.trim(), SERVER_SALT);
  const hashBuffer = Buffer.from(inputHash, 'hex');
  const storedBuffer = Buffer.from(STORED_ADMIN_PASSWORD_HASH, 'hex');
  const legacyBuffer = Buffer.from(STORED_LEGACY_PASSWORD_HASH, 'hex');

  const matchesMain =
    hashBuffer.length === storedBuffer.length &&
    crypto.timingSafeEqual(hashBuffer, storedBuffer);

  const matchesLegacy =
    hashBuffer.length === legacyBuffer.length &&
    crypto.timingSafeEqual(hashBuffer, legacyBuffer);

  // Timing-safe comparison to prevent timing attacks
  if (!matchesMain && !matchesLegacy) {
    return null;
  }

  return {
    id: 'admin-executive-1',
    email: normalizedEmail,
    role: 'admin',
    name: 'MAHESHRAJ Executive',
  };
}

/**
 * Creates a cryptographically signed HMAC session token.
 */
export function generateSessionToken(user: ServerAdminUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    iat: Date.now(),
    exp: Date.now() + 8 * 60 * 60 * 1000, // 8 Hours Expiry
    jti: crypto.randomBytes(16).toString('hex'),
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies the authenticity and expiration of a session token on the server side.
 * Ensures that the payload role is strictly 'admin'.
 */
export function verifySessionToken(token: string): ServerAdminUser | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadBase64, signature] = parts;

  // Check if token has been explicitly revoked via logout
  if (revokedTokens.has(token)) {
    return null;
  }

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));

    // Check expiration
    if (Date.now() > payload.exp) {
      return null;
    }

    // Explicit Role Authorization Check: User MUST have 'admin' role
    if (payload.role !== 'admin') {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

/**
 * Revokes a session token upon logout.
 */
export function revokeSessionToken(token: string): void {
  if (token) {
    revokedTokens.add(token);
  }
}
