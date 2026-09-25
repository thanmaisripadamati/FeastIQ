/**
 * GET /api/users/:sid
 *
 * Vercel strips dynamic segments out of `req.url` in some runtimes, so the
 * pathname is reconstructed from `req.query` before dispatch.
 */
import { feastIqNodeHandler } from '../../src/server/nodeAdapter.js';

export default async function handler(req, res) {
  const sid = req.query?.sid;
  if (sid) {
    req.url = `/api/users/${encodeURIComponent(String(sid))}`;
  }
  return feastIqNodeHandler(req, res);
}
