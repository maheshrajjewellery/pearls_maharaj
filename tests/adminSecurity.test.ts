import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  verifyAdminCredentials,
  generateSessionToken,
  verifySessionToken,
  revokeSessionToken,
} from '../src/server/adminAuth';
import { handleAdminApiRequest } from '../src/server/adminApiMiddleware';
import { EventEmitter } from 'node:events';

// Helper mock HTTP request & response objects for endpoint testing
function createMockReq(url: string, method = 'GET', headers: Record<string, string> = {}, body?: any) {
  const req = new EventEmitter() as any;
  req.url = url;
  req.method = method;
  req.headers = headers;

  setImmediate(() => {
    if (body) {
      req.emit('data', Buffer.from(JSON.stringify(body)));
    }
    req.emit('end');
  });

  return req;
}

function createMockRes() {
  const res = new EventEmitter() as any;
  res.statusCode = 200;
  res.headers = {};
  res.body = '';

  res.setHeader = (name: string, value: string) => {
    res.headers[name.toLowerCase()] = value;
  };

  res.end = (chunk?: string) => {
    if (chunk) res.body += chunk;
    res.emit('finish');
  };

  return res;
}

describe('COMPREHENSIVE LOGIN & AUTHENTICATION SYSTEM SUITE', () => {

  // Test 1: Open /admin/login - Route structure & availability
  it('1. Open /admin/login: Should respond to admin API endpoints correctly', async () => {
    const req = createMockReq('/api/admin/verify', 'GET');
    const res = createMockRes();

    await handleAdminApiRequest(req, res, () => {});
    assert.equal(res.statusCode, 401);
    const json = JSON.parse(res.body);
    assert.equal(json.success, false);
    assert.equal(json.error, 'Unauthorized access.');
  });

  // Test 2: Enter incorrect password -> access denied ("Invalid credentials.")
  it('2. Incorrect credentials: Should deny access with generic "Invalid credentials." error', async () => {
    // Check direct auth function
    const invalidUser = verifyAdminCredentials('maheshtadakalle@gmail.com', 'wrongpassword123');
    assert.equal(invalidUser, null);

    // Check API endpoint
    const req = createMockReq('/api/admin/login', 'POST', {}, {
      email: 'maheshtadakalle@gmail.com',
      password: 'wrongpassword123'
    });
    const res = createMockRes();

    await new Promise<void>((resolve) => {
      res.on('finish', resolve);
      handleAdminApiRequest(req, res, () => {});
    });

    assert.equal(res.statusCode, 401);
    const json = JSON.parse(res.body);
    assert.equal(json.success, false);
    assert.equal(json.error, 'Invalid credentials.');
  });

  // Test 3a: Primary admin email maheshtadakalle@gmail.com + MAHESHRAJAdmin#2026!
  it('3a. Primary Admin maheshtadakalle@gmail.com: Authenticates successfully with admin role', async () => {
    const validUser = verifyAdminCredentials('maheshtadakalle@gmail.com', 'MAHESHRAJAdmin#2026!');
    assert.notEqual(validUser, null);
    assert.equal(validUser?.role, 'admin');
    assert.equal(validUser?.email, 'maheshtadakalle@gmail.com');

    // Test API endpoint
    const req = createMockReq('/api/admin/login', 'POST', {}, {
      email: 'maheshtadakalle@gmail.com',
      password: 'MAHESHRAJAdmin#2026!'
    });
    const res = createMockRes();

    await new Promise<void>((resolve) => {
      res.on('finish', resolve);
      handleAdminApiRequest(req, res, () => {});
    });

    assert.equal(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.equal(json.success, true);
    assert.notEqual(json.token, undefined);
    assert.equal(json.user.role, 'admin');
  });

  // Test 3b: Legacy password support maheshtadakalle@gmail.com + MAHESHRAJ123
  it('3b. Legacy password support: Authenticates successfully with MAHESHRAJ123', async () => {
    const validUser = verifyAdminCredentials('maheshtadakalle@gmail.com', 'MAHESHRAJ123');
    assert.notEqual(validUser, null);
    assert.equal(validUser?.role, 'admin');

    const req = createMockReq('/api/admin/login', 'POST', {}, {
      email: 'maheshtadakalle@gmail.com',
      password: 'MAHESHRAJ123'
    });
    const res = createMockRes();

    await new Promise<void>((resolve) => {
      res.on('finish', resolve);
      handleAdminApiRequest(req, res, () => {});
    });

    assert.equal(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.equal(json.success, true);
  });

  // Test 4 & 10: Refresh/Verify admin dashboard session
  it('4 & 10. Admin session verification: Valid session token remains authorized securely on server', async () => {
    const validUser = verifyAdminCredentials('maheshtadakalle@gmail.com', 'MAHESHRAJAdmin#2026!');
    const token = generateSessionToken(validUser!);

    const req = createMockReq('/api/admin/verify', 'GET', {
      authorization: `Bearer ${token}`
    });
    const res = createMockRes();

    await new Promise<void>((resolve) => {
      res.on('finish', resolve);
      handleAdminApiRequest(req, res, () => {});
    });

    assert.equal(res.statusCode, 200);
    const json = JSON.parse(res.body);
    assert.equal(json.success, true);
    assert.equal(json.user.role, 'admin');
  });

  // Test 5 & 6: Logout and URL protection
  it('5 & 6. Logout and URL protection: Revoked token prevents returning to admin pages', async () => {
    const validUser = verifyAdminCredentials('maheshtadakalle@gmail.com', 'MAHESHRAJAdmin#2026!');
    const token = generateSessionToken(validUser!);

    // Logout request
    const logoutReq = createMockReq('/api/admin/logout', 'POST', {
      authorization: `Bearer ${token}`
    });
    const logoutRes = createMockRes();

    await new Promise<void>((resolve) => {
      logoutRes.on('finish', resolve);
      handleAdminApiRequest(logoutReq, logoutRes, () => {});
    });

    assert.equal(logoutRes.statusCode, 200);

    // Attempting to access admin page with revoked token
    const verifyReq = createMockReq('/api/admin/verify', 'GET', {
      authorization: `Bearer ${token}`
    });
    const verifyRes = createMockRes();

    await new Promise<void>((resolve) => {
      verifyRes.on('finish', resolve);
      handleAdminApiRequest(verifyReq, verifyRes, () => {});
    });

    assert.equal(verifyRes.statusCode, 401);
    const json = JSON.parse(verifyRes.body);
    assert.equal(json.success, false);
  });

  // Test 7: Customer login attempt on admin portal
  it('7. Customer credentials on admin login: Rejected with "Invalid credentials."', async () => {
    const customerLogin = verifyAdminCredentials('customer@gmail.com', 'customerPassword123');
    assert.equal(customerLogin, null);

    const req = createMockReq('/api/admin/login', 'POST', {}, {
      email: 'customer@gmail.com',
      password: 'customerPassword123'
    });
    const res = createMockRes();

    await new Promise<void>((resolve) => {
      res.on('finish', resolve);
      handleAdminApiRequest(req, res, () => {});
    });

    assert.equal(res.statusCode, 401);
    const json = JSON.parse(res.body);
    assert.equal(json.error, 'Invalid credentials.');
  });

  // Test 8: Protected admin API access without token
  it('8. Unauthenticated API request: Protected admin endpoint returns 401', async () => {
    const req = createMockReq('/api/admin/protected-data', 'GET');
    const res = createMockRes();

    await new Promise<void>((resolve) => {
      res.on('finish', resolve);
      handleAdminApiRequest(req, res, () => {});
    });

    assert.equal(res.statusCode, 401);
    const json = JSON.parse(res.body);
    assert.equal(json.success, false);
  });

  // Test 9: Client-side role manipulation / fake token
  it('9. Manipulated / forged token: Server rejects forged token signature', async () => {
    const forgedPayload = Buffer.from(JSON.stringify({
      id: 'fake-admin',
      email: 'hacker@attacker.com',
      role: 'admin',
      exp: Date.now() + 100000
    })).toString('base64url');
    
    const fakeToken = `${forgedPayload}.fake_signature_abc123`;

    const verifiedUser = verifySessionToken(fakeToken);
    assert.equal(verifiedUser, null);

    const req = createMockReq('/api/admin/protected-data', 'GET', {
      authorization: `Bearer ${fakeToken}`
    });
    const res = createMockRes();

    await new Promise<void>((resolve) => {
      res.on('finish', resolve);
      handleAdminApiRequest(req, res, () => {});
    });

    assert.equal(res.statusCode, 401);
    const json = JSON.parse(res.body);
    assert.equal(json.success, false);
  });

});
