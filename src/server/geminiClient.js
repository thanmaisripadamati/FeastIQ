/**
 * Lazy, explicit Gemini client factory.
 *
 * The single most important rule in this file:
 *   `new GoogleGenAI(...)` is NEVER called without a valid `apiKey`.
 *
 * `@google/genai` v2 falls back to Google Application Default Credentials
 * when `apiKey` is undefined/empty. Locally that fallback always fails with
 * "Could not load the default credentials." — the exact error this module
 * exists to prevent. We therefore fail fast with a clear configuration
 * error instead of letting the SDK wander into ADC.
 */

import { GoogleGenAI } from '@google/genai';
import { getGeminiApiKey } from './env.js';

export class GeminiConfigError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeminiConfigError';
    this.status = 503;
    this.code = 'GEMINI_NOT_CONFIGURED';
  }
}

let cachedClient = null;

/**
 * @returns {import('@google/genai').GoogleGenAI}
 * @throws {GeminiConfigError} when GEMINI_API_KEY is missing or blank.
 */
export function getGeminiClient() {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new GeminiConfigError(
      'Gemini API key is not configured. Set the GEMINI_API_KEY environment ' +
        'variable (copy .env.example to .env locally, or add GEMINI_API_KEY in ' +
        'Vercel Project Settings -> Environment Variables).'
    );
  }

  if (!cachedClient) {
    // Explicit apiKey => the SDK authenticates with the API key and never
    // attempts Application Default Credentials.
    cachedClient = new GoogleGenAI({ apiKey });
  }

  return cachedClient;
}

/** Test seam: drop the memoised client. */
export function resetGeminiClient() {
  cachedClient = null;
}
