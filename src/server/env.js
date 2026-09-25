/**
 * FeastIQ server environment loader.
 *
 * Responsibilities:
 *  1. Load `.env` from a set of known locations (root first).
 *  2. Expose the Gemini API key ONLY to server-side code.
 *  3. Never log, print, or return the secret value in any error message.
 *
 * Why this module exists
 * ----------------------
 * The original bug: `src/server/.env` held the key, but `dotenv/config`
 * (bare import) resolves `.env` relative to `process.cwd()`. Running
 * `npm run dev` from the project root meant `GEMINI_API_KEY` was never
 * loaded, `new GoogleGenAI({ apiKey: undefined })` was constructed, and the
 * SDK silently fell back to Google Application Default Credentials — which
 * do not exist locally — producing:
 *   "Could not load the default credentials."
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Project root (…/FeastIQ) */
export const PROJECT_ROOT = path.resolve(__dirname, '..', '..');

/**
 * Search order matters: the project root is the canonical location.
 * `src/server/.env` is kept as a fallback for older checkouts so existing
 * local setups keep working without any manual migration.
 */
const ENV_CANDIDATES = [
  path.join(PROJECT_ROOT, '.env'),
  path.join(PROJECT_ROOT, '.env.local'),
  path.join(__dirname, '.env'),
];

let envLoaded = false;

/** Load `.env` files exactly once per process. Existing env vars always win. */
export function loadServerEnv() {
  if (envLoaded) return;
  envLoaded = true;

  for (const file of ENV_CANDIDATES) {
    try {
      if (fs.existsSync(file)) {
        // dotenv never overrides variables that are already defined, so real
        // environment variables (e.g. Vercel / CI) take precedence over files.
        dotenv.config({ path: file, quiet: true });
      }
    } catch {
      // A broken/unreadable .env must not crash the whole server.
    }
  }
}

/** @returns {string} the trimmed key, or '' when not configured. */
export function getGeminiApiKey() {
  loadServerEnv();
  const raw = process.env.GEMINI_API_KEY;
  return typeof raw === 'string' ? raw.trim() : '';
}

/** @returns {boolean} safe boolean check — safe to log. */
export function isGeminiConfigured() {
  return getGeminiApiKey().length > 0;
}

/**
 * Startup validation. Logs only booleans, never the key value.
 * @returns {boolean} whether the AI features are usable.
 */
export function assertGeminiConfigured() {
  loadServerEnv();
  if (isGeminiConfigured()) {
    console.log('[FeastIQ] GEMINI_API_KEY is configured (value hidden).');
    return true;
  }
  console.warn(
    '[FeastIQ] GEMINI_API_KEY is not configured. ' +
      'Copy .env.example to .env and set GEMINI_API_KEY. ' +
      'AI endpoints will return HTTP 503 until then.'
  );
  return false;
}

/**
 * Remove the secret from any string before it reaches a log or an HTTP
 * response. Defence in depth against SDK errors echoing credentials.
 */
export function redactSecrets(input) {
  if (typeof input !== 'string' || input.length === 0) return input;
  const secret = getGeminiApiKey();
  if (!secret) return input;
  return input.split(secret).join('[REDACTED]');
}
