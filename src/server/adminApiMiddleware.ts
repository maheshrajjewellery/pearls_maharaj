import type { IncomingMessage, ServerResponse } from 'node:http';
import {
  verifyAdminCredentials,
  generateSessionToken,
  verifySessionToken,
  revokeSessionToken,
} from './adminAuth';

function readJsonBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    // If express / connect body-parser already parsed req.body
    if ((req as any).body) {
      if (typeof (req as any).body === 'string') {
        try {
          return resolve(JSON.parse((req as any).body));
        } catch {
          return resolve({});
        }
      }
      return resolve((req as any).body);
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', () => resolve({}));
  });
}

function parseCookies(req: IncomingMessage): Record<string, string> {
  const list: Record<string, string> = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;

  cookieHeader.split(';').forEach((cookie) => {
    const parts = cookie.split('=');
    const name = parts.shift()?.trim();
    if (name) {
      list[name] = decodeURIComponent(parts.join('='));
    }
  });

  return list;
}

function extractToken(req: IncomingMessage): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  const cookies = parseCookies(req);
  if (cookies.MAHESHRAJ_admin_token) {
    return cookies.MAHESHRAJ_admin_token;
  }

  return null;
}

export async function handleAdminApiRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void
): Promise<void> {
  const url = req.url ? req.url.split('?')[0] : '';

  if (!url.startsWith('/api/admin')) {
    return next();
  }

  res.setHeader('Content-Type', 'application/json');

  // 1. POST /api/admin/login
  if (url === '/api/admin/login' && req.method === 'POST') {
    try {
      const body = await readJsonBody(req);
      const email = body.email || '';
      const password = body.password || '';

      const user = verifyAdminCredentials(email, password);

      if (!user) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            success: false,
            error: 'Invalid credentials.',
          })
        );
        return;
      }

      const token = generateSessionToken(user);

      // Set HTTP-Only Cookie for secure session retention
      res.setHeader(
        'Set-Cookie',
        `MAHESHRAJ_admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=28800`
      );

      res.statusCode = 200;
      res.end(
        JSON.stringify({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
        })
      );
      return;
    } catch {
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          success: false,
          error: 'Invalid credentials.',
        })
      );
      return;
    }
  }

  // 2. GET /api/admin/verify or POST /api/admin/verify
  if (url === '/api/admin/verify' && (req.method === 'GET' || req.method === 'POST')) {
    const token = extractToken(req);
    const user = token ? verifySessionToken(token) : null;

    if (!user) {
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          success: false,
          error: 'Unauthorized access.',
        })
      );
      return;
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
        },
      })
    );
    return;
  }

  // 3. POST /api/admin/logout
  if (url === '/api/admin/logout' && req.method === 'POST') {
    const token = extractToken(req);
    if (token) {
      revokeSessionToken(token);
    }

    // Clear HTTP-Only Cookie
    res.setHeader(
      'Set-Cookie',
      'MAHESHRAJ_admin_token=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
    );

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        success: true,
        message: 'Logged out successfully.',
      })
    );
    return;
  }

  // 4. GET /api/admin/protected-data
  if (url === '/api/admin/protected-data' && req.method === 'GET') {
    const token = extractToken(req);
    const user = token ? verifySessionToken(token) : null;

    if (!user) {
      res.statusCode = 401;
      res.end(
        JSON.stringify({
          success: false,
          error: 'Unauthorized access. Server-side authorization check failed.',
        })
      );
      return;
    }

    res.statusCode = 200;
    res.end(
      JSON.stringify({
        success: true,
        message: 'Protected admin API accessed successfully.',
        user,
        timestamp: new Date().toISOString(),
      })
    );
    return;
  }

  // Fallback for unknown /api/admin/* endpoints
  res.statusCode = 404;
  res.end(
    JSON.stringify({
      success: false,
      error: 'Admin endpoint not found.',
    })
  );
}
