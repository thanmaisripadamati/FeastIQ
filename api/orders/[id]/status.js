/**
 * PATCH /api/orders/:id/status
 *
 * The pathname is reconstructed from `req.query.id` so the shared router
 * always sees the canonical route.
 */
import { feastIqNodeHandler } from '../../../src/server/nodeAdapter.js';

export default async function handler(req, res) {
  const id = req.query?.id;
  if (id) {
    req.url = `/api/orders/${encodeURIComponent(String(id))}/status`;
  }
  return feastIqNodeHandler(req, res);
}
