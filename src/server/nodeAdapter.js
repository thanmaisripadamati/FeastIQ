/**
 * Node/Connect <-> FeastIQ router adapter.
 *
 * Handles the differences between:
 *   - Vite's Connect middleware (raw, unparsed request stream)
 *   - Vercel's Node serverless functions (body already parsed, `req.query` set)
 *
 * Keeping this in one place means both runtimes return byte-identical JSON.
 */

import { handleApiRequest } from './router.js';

const MAX_BODY_BYTES = 1_000_000; // 1 MB is plenty for a canteen order payload

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Request body too large'));
        req.destroy();
        return;
      }
      body += chunk;
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

function parseMaybeJson(raw) {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return null; // signals malformed JSON to the caller
  }
}

/**
 * @returns {Promise<{ status: number, body: any }>}
 */
export async function dispatchNodeRequest(req) {
  const method = String(req.method || 'GET').toUpperCase();
  const host = req.headers?.host || 'localhost';
  let url;
  try {
    url = new URL(req.url || '/', `http://${host}`);
  } catch {
    return { status: 400, body: { error: 'Malformed request URL', code: 'BAD_URL' } };
  }

  const query = {};
  if (req.query && typeof req.query === 'object') {
    Object.assign(query, req.query);
  } else {
    for (const [k, v] of url.searchParams.entries()) query[k] = v;
  }

  let body = {};
  if (method !== 'GET' && method !== 'HEAD') {
    if (req.body !== undefined && req.body !== null) {
      // Vercel pre-parsed the body for us.
      if (typeof req.body === 'string') {
        const parsed = parseMaybeJson(req.body);
        if (parsed === null) {
          return { status: 400, body: { error: 'Request body is not valid JSON', code: 'INVALID_JSON' } };
        }
        body = parsed;
      } else if (typeof req.body === 'object') {
        body = req.body;
      } else {
        body = {};
      }
    } else {
      const raw = await readRawBody(req);
      const parsed = parseMaybeJson(raw);
      if (parsed === null) {
        return { status: 400, body: { error: 'Request body is not valid JSON', code: 'INVALID_JSON' } };
      }
      body = parsed;
    }
  }

  return handleApiRequest({
    method,
    pathname: url.pathname,
    query,
    body,
  });
}

/**
 * Full Node-style handler: dispatches, then writes the JSON response.
 * Signature is compatible with Vercel serverless functions.
 */
export async function feastIqNodeHandler(req, res) {
  let result;
  try {
    result = await dispatchNodeRequest(req, res);
  } catch (err) {
    result = {
      status: 500,
      body: { error: 'Unexpected server error', code: 'INTERNAL_ERROR' },
    };
    console.error('[FeastIQ API] unhandled:', err?.message);
  }

  res.statusCode = result.status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  return res.end(JSON.stringify(result.body));
}
