/**
 * FeastIQ Vite dev-server API middleware.
 *
 * This is a DEVELOPMENT adapter only. Vite's `configureServer` hook never
 * runs in a production build, so this file is NOT the production API — the
 * Vercel serverless functions under `api/` are (see `vercel.json`).
 *
 * Both adapters delegate to the exact same router
 * (`src/server/router.js`), so local and production behaviour match.
 *
 * The Gemini API key is loaded here via `loadServerEnv()` and is only ever
 * read inside server-side modules. It is never referenced by client code.
 */

import { loadServerEnv, assertGeminiConfigured } from './env.js';
import { dispatchNodeRequest } from './nodeAdapter.js';

loadServerEnv();

export function sqliteApiPlugin() {
  return {
    name: 'feastiq-sqlite-api',

    apply: 'serve',

    configureServer(server) {
      // Startup validation: logs booleans only, never the key value.
      assertGeminiConfigured();

      server.middlewares.use(async (req, res, next) => {
        let pathname = '/';
        try {
          pathname = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`)
            .pathname;
        } catch {
          return next();
        }

        if (!pathname.startsWith('/api/')) {
          return next();
        }

        try {
          const result = await dispatchNodeRequest(req, res);

          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          return res.end(JSON.stringify(result.body));
        } catch (err) {
          console.error('[FeastIQ API] middleware error:', err?.message);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json; charset=utf-8');
          return res.end(
            JSON.stringify({ error: 'Unexpected server error', code: 'INTERNAL_ERROR' })
          );
        }
      });
    },
  };
}
