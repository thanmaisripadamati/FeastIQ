/**
 * Shared entry helper for FeastIQ Vercel serverless functions.
 *
 * Files prefixed with `_` are ignored by Vercel's routing, so this is not
 * exposed as a route. Every `api/**` function re-exports the same Node
 * handler that powers local dev, guaranteeing identical behaviour.
 *
 * The Gemini API key is read from the Vercel server-side environment
 * variable GEMINI_API_KEY. It is never bundled into client code.
 */
import { feastIqNodeHandler } from '../src/server/nodeAdapter.js';

export default feastIqNodeHandler;
export { feastIqNodeHandler as handler };
