/**
 * FeastIQ API router — single source of truth for every endpoint.
 *
 * This module is deliberately transport-agnostic: it takes a normalised
 * request and returns `{ status, body }`. Two thin adapters sit on top:
 *
 *   1. `src/server/apiPlugin.js`  -> Vite dev server middleware (local dev)
 *   2. `api/` (Vercel functions)  -> serverless endpoints (production)
 *
 * Keeping one router means the SQLite routes behave identically in dev and
 * in production, and there is no duplicated business logic.
 *
 * Existing contract preserved verbatim:
 *   POST   /api/auth/student-login
 *   GET    /api/users/:sid
 *   GET    /api/orders
 *   POST   /api/orders
 *   PATCH  /api/orders/:id/status
 *   POST   /api/ai/demand-prediction
 */

import { getDatabase } from '../db/database.js';
import { resolveDbPath } from '../db/database.js';
import { isGeminiConfigured } from './env.js';
import { getDemandModel, parseDemandInput, runDemandPrediction } from './aiDemandAgent.js';
import { redactSecrets } from './env.js';

let cachedDb = null;

/** One DatabaseSync handle per process (Vercel reuses warm containers). */
function db() {
  if (!cachedDb) cachedDb = getDatabase();
  return cachedDb;
}

/** Thrown by handlers to signal an HTTP status + safe client message. */
export class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
  }
}

/* ------------------------------------------------------------------ */
/* 1. Student login / registration                                      */
/* ------------------------------------------------------------------ */
function handleStudentLogin(body) {
  let rawId = String(body.student_id || body.studentId || '').trim();
  const customName = String(body.name || '').trim();
  const customEmail = String(body.email || '').trim();

  if (!rawId) {
    throw new HttpError(400, 'Student ID or College Gmail is required', 'MISSING_STUDENT_ID');
  }

  let normalizedId = rawId;
  let email = customEmail;

  if (rawId.includes('@')) {
    email = rawId.toLowerCase();
    normalizedId = email.split('@')[0].toUpperCase();
  } else {
    normalizedId = rawId.toUpperCase();
    if (!email) {
      email = `${normalizedId.toLowerCase()}@college.edu`;
    }
  }

  const existing = db()
    .prepare('SELECT * FROM users WHERE student_id = ? OR email = ?')
    .get(normalizedId, email);

  if (existing) {
    return {
      success: true,
      user: {
        id: String(existing.id),
        student_id: existing.student_id,
        studentId: existing.student_id,
        name: existing.name,
        email: existing.email,
        role: existing.role,
        walletBalance: existing.wallet_balance || 850,
        createdAt: existing.created_at,
      },
      isNew: false,
    };
  }

  let derivedName = customName;
  if (!derivedName) {
    if (normalizedId === 'STU001') derivedName = 'Thanmai';
    else if (normalizedId === 'STU002') derivedName = 'Rahul';
    else if (normalizedId === 'STU003') derivedName = 'Priya';
    else if (normalizedId.startsWith('STU') && normalizedId.length > 3) {
      derivedName = `Student ${normalizedId.slice(3)}`;
    } else {
      derivedName = `Student ${normalizedId}`;
    }
  }

  const createdAt = new Date().toISOString();
  const result = db()
    .prepare(
      `INSERT INTO users (student_id, name, email, role, wallet_balance, created_at)
       VALUES (?, ?, ?, 'student', 850, ?)`
    )
    .run(normalizedId, derivedName, email, createdAt);

  return {
    success: true,
    user: {
      id: String(result.lastInsertRowid),
      student_id: normalizedId,
      studentId: normalizedId,
      name: derivedName,
      email,
      role: 'student',
      walletBalance: 850,
      createdAt,
    },
    isNew: true,
  };
}

/* ------------------------------------------------------------------ */
/* 2. User profile                                                      */
/* ------------------------------------------------------------------ */
function handleGetUser(sid) {
  const user = db().prepare('SELECT * FROM users WHERE student_id = ?').get(sid);
  if (!user) {
    throw new HttpError(404, 'User not found', 'USER_NOT_FOUND');
  }
  return {
    id: String(user.id),
    student_id: user.student_id,
    studentId: user.student_id,
    name: user.name,
    email: user.email,
    role: user.role,
    walletBalance: user.wallet_balance || 850,
    createdAt: user.created_at,
  };
}

/* ------------------------------------------------------------------ */
/* 3. Orders: list                                                      */
/* ------------------------------------------------------------------ */
function handleListOrders(query) {
  const studentIdFilter = query.student_id || query.studentId || '';
  const rows = studentIdFilter
    ? db()
        .prepare('SELECT * FROM orders WHERE student_id = ? ORDER BY rowid DESC')
        .all(String(studentIdFilter).toUpperCase())
    : db().prepare('SELECT * FROM orders ORDER BY rowid DESC').all();

  return rows.map((r) => ({
    id: r.id,
    student_id: r.student_id,
    studentId: r.student_id,
    studentName: r.student_name,
    token: r.token,
    items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items,
    total: r.total,
    status: r.status,
    eta: r.eta,
    counter: r.counter,
    paymentMethod: r.payment_method,
    time: r.created_at,
  }));
}

/* ------------------------------------------------------------------ */
/* 4. Orders: create                                                    */
/* ------------------------------------------------------------------ */
function handleCreateOrder(body) {
  const {
    id,
    student_id,
    studentId,
    studentName,
    token,
    items,
    total,
    status,
    eta,
    counter,
    paymentMethod,
  } = body;

  const sid = String(student_id || studentId || '').toUpperCase();
  const orderId = id || 'ord-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
  const orderToken = token || '#F' + Math.floor(100 + Math.random() * 900);
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  db()
    .prepare(
      `INSERT INTO orders (id, student_id, student_name, token, items, total, status, eta, counter, payment_method, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      orderId,
      sid,
      studentName || `Student ${sid}`,
      orderToken,
      JSON.stringify(items || []),
      Number(total) || 0,
      status || 'Order Placed',
      eta || '8 mins',
      counter || 'Counter 1 (Meals)',
      paymentMethod || 'UPI',
      timeStr
    );

  return { success: true, id: orderId, token: orderToken };
}

/* ------------------------------------------------------------------ */
/* 5. Orders: status update                                             */
/* ------------------------------------------------------------------ */
function handleUpdateOrderStatus(orderId, body) {
  const { status, eta } = body;
  if (!status) {
    throw new HttpError(400, 'Field "status" is required', 'MISSING_STATUS');
  }
  db().prepare('UPDATE orders SET status = ?, eta = ? WHERE id = ?').run(status, eta || '', orderId);
  return { success: true, orderId, status };
}

/* ------------------------------------------------------------------ */
/* 6. Health                                                            */
/* ------------------------------------------------------------------ */
function handleHealth() {
  return {
    status: 'ok',
    service: 'feastiq-api',
    aiConfigured: isGeminiConfigured(),
    aiModel: getDemandModel(),
    database: 'sqlite',
  };
}

/* ------------------------------------------------------------------ */
/* Router                                                               */
/* ------------------------------------------------------------------ */

/**
 * @param {{ method: string, pathname: string, query?: object, body?: object }} req
 * @returns {Promise<{ status: number, body: any }>}
 */
export async function handleApiRequest(req) {
  const method = String(req.method || 'GET').toUpperCase();
  const pathname = req.pathname || '/';
  const query = req.query || {};
  const body = req.body && typeof req.body === 'object' ? req.body : {};

  try {
    /* --- health --- */
    if ((pathname === '/api/health' || pathname === '/api') && method === 'GET') {
      return { status: 200, body: handleHealth() };
    }

    /* --- 1. auth --- */
    if (pathname === '/api/auth/student-login' && method === 'POST') {
      return { status: 200, body: handleStudentLogin(body) };
    }

    /* --- 2. user profile --- */
    if (pathname.startsWith('/api/users/') && method === 'GET') {
      const sid = decodeURIComponent(pathname.slice('/api/users/'.length)).toUpperCase();
      return { status: 200, body: handleGetUser(sid) };
    }

    /* --- 3. list orders --- */
    if (pathname === '/api/orders' && method === 'GET') {
      return { status: 200, body: handleListOrders(query) };
    }

    /* --- 4. create order --- */
    if (pathname === '/api/orders' && method === 'POST') {
      return { status: 200, body: handleCreateOrder(body) };
    }

    /* --- 5. update status --- */
    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
      const orderId = decodeURIComponent(pathname.split('/')[3] || '');
      return { status: 200, body: handleUpdateOrderStatus(orderId, body) };
    }

    /* --- 6. AI demand prediction (Gemini, server-side only) --- */
    if (pathname === '/api/ai/demand-prediction' && method === 'POST') {
      const parsed = parseDemandInput(body);
      if (!parsed.ok) {
        throw new HttpError(parsed.status, parsed.error, 'INVALID_REQUEST_BODY');
      }

      const { prediction, model, input } = await runDemandPrediction(parsed.input);

      return {
        status: 200,
        body: {
          success: true,
          source: 'gemini',
          model,
          generatedAt: new Date().toISOString(),
          input,
          prediction,
        },
      };
    }

    return {
      status: 404,
      body: { error: 'Endpoint not found', path: pathname, method },
    };
  } catch (err) {
    // HttpError and the AI agent's typed errors already carry a safe message.
    const status = Number(err?.status) || 500;
    const code = err?.code || 'INTERNAL_ERROR';

    // Never leak credentials, and only surface detail for 5xx in logs.
    const safeMessage = redactSecrets(err?.message || 'Unexpected server error');

    if (status >= 500) {
      console.error('[FeastIQ API]', method, pathname, '->', status, code, safeMessage);
    } else {
      console.warn('[FeastIQ API]', method, pathname, '->', status, code, safeMessage);
    }

    return {
      status,
      body: {
        error: safeMessage,
        code,
      },
    };
  }
}

export { resolveDbPath };
