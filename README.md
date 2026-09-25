# FeastIQ — AI-Powered Smart College Canteen Management System

FeastIQ predicts canteen demand, flags peak-hour rush risk, and recommends how much
food to prepare — including when a sudden campus event (Sports Day, Hackathon, Fest)
causes an unusual demand surge.

> Predictions are **AI-assisted recommendations** derived from a point-in-time canteen
> snapshot. They are not guarantees of real-world demand, and no real-world load
> testing has been performed.

---

## Architecture

```
Browser (React + Vite)
      │  fetch('/api/ai/demand-prediction')   ← no Google credential in the browser
      ▼
FeastIQ API  (src/server/router.js — one router, two transports)
      ├── dev:  src/server/apiPlugin.js  (Vite middleware, `npm run dev`)
      └── prod: api/**/*.js             (Vercel serverless functions)
      │
      ▼
Gemini API  (src/server/aiDemandAgent.js → gemini-3.8-flash)
      │
      ▼
Structured prediction → dashboard
```

### Why there are two API entry points

Vite's `configureServer()` hook **only runs in `vite dev`**. It is not a production
server, so it cannot serve the API on Vercel. Both transports therefore delegate to
the same router (`src/server/router.js`), so local and production behaviour match.

| Concern | File |
| --- | --- |
| `.env` loading + secret redaction | `src/server/env.js` |
| Lazy Gemini client (never falls back to ADC) | `src/server/geminiClient.js` |
| Prompt, structured output, retry/fallback | `src/server/aiDemandAgent.js` |
| All routes, transport-agnostic | `src/server/router.js` |
| Node req/res ↔ router adapter | `src/server/nodeAdapter.js` |
| Vite dev middleware | `src/server/apiPlugin.js` |
| Vercel functions | `api/` |
| Browser AI caller (no secrets) | `src/services/aiClient.js` |

---

## Setup

```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
# then put your real key in .env:
#   GEMINI_API_KEY=your_key_here
npm run dev
```

Open http://localhost:5173 → Admin → **Demand Prediction** → *Run AI Prediction*.

### Test the AI endpoint

```powershell
Invoke-RestMethod -Uri "http://localhost:5173/api/ai/demand-prediction" -Method POST `
  -ContentType "application/json" `
  -Body '{"orders":120,"previousOrders":95,"event":"Sports Day","studentsExpected":500}'
```

```bash
curl -X POST http://localhost:5173/api/ai/demand-prediction \
  -H "Content-Type: application/json" \
  -d '{"orders":120,"previousOrders":95,"event":"Sports Day","studentsExpected":500}'
```

Health check (confirms the key is detected without revealing it):

```bash
curl http://localhost:5173/api/health
# {"status":"ok","aiConfigured":true,"aiModel":"gemini-3.8-flash","database":"sqlite"}
```

### API surface

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Liveness + AI configuration status |
| `POST` | `/api/auth/student-login` | Student login / auto-registration |
| `GET` | `/api/users/:sid` | Student profile |
| `GET` | `/api/orders` | List orders (`?student_id=STU001`) |
| `POST` | `/api/orders` | Create order |
| `PATCH` | `/api/orders/:id/status` | Update order status |
| `POST` | `/api/ai/demand-prediction` | Gemini demand prediction (Event Management Agent) |

`POST /api/ai/demand-prediction` body:

```jsonc
{
  "orders": 120,              // required, number
  "previousOrders": 95,       // optional baseline
  "event": "Sports Day",      // optional; "none"/omitted = normal day
  "studentsExpected": 500,    // optional
  "menuFocus": "Biryani, Shawarma",  // optional
  "kitchenCapacityPerHour": 240      // optional
}
```

Response `prediction`:

```jsonc
{
  "demandLevel": "High",            // Low | Medium | High
  "recommendedQuantity": 450,       // portions to prepare
  "peakRisk": "Critical",           // Low | Medium | High | Critical
  "peakWindow": "12:15 PM – 1:30 PM",
  "eventDetected": true,
  "eventName": "Sports Day",
  "surgeRatio": 1.26,
  "reason": "…",
  "confidence": 92,
  "confidenceExplanation": "…",
  "preparationAdvice": "…",
  "staffingAdvice": "…",
  "stockAlerts": ["…"]
}
```

### Error handling

| Status | Code | Meaning |
| --- | --- | --- |
| `400` | `INVALID_JSON` / `INVALID_REQUEST_BODY` | Malformed or missing body |
| `404` | `USER_NOT_FOUND` / `ENDPOINT_NOT_FOUND` | Unknown user or route |
| `429` | `GEMINI_QUOTA_EXCEEDED` | Gemini quota/rate limit (auto-retried first) |
| `502` | `GEMINI_INVALID_API_KEY`, `GEMINI_PERMISSION_DENIED`, `GEMINI_MODEL_UNAVAILABLE`, `GEMINI_MALFORMED_RESPONSE` | Gemini rejected the request |
| `503` | `GEMINI_NOT_CONFIGURED` | `GEMINI_API_KEY` missing — **the value is never included** |
| `504` | `GEMINI_NETWORK_ERROR` | Gemini unreachable |

Secrets are additionally scrubbed from every message via `redactSecrets()`.

---

## Security

- `.env`, `.env.local`, `.env.*.local` and `.env.*` are git-ignored; only
  `.env.example` (containing `GEMINI_API_KEY=` and nothing else) is committed.
- The key is read **only** in `src/server/*`. The client bundle contains no
  Google credential — verify with a build + `grep` for the key in `dist/`.
- Never rename the variable to `VITE_*`; Vite would inline it into the browser
  bundle.
- Startup logs only booleans (`GEMINI_API_KEY is configured (value hidden)`).

---

## Deploying to Vercel

1. Push the repo and import it in Vercel (framework preset: **Vite**).
   `vercel.json` already sets `buildCommand`, `outputDirectory`, the
   `nodejs24.x` function runtime and the SPA rewrite.
2. **Project Settings → Environment Variables → add `GEMINI_API_KEY`** for
   Production (and Preview if you want AI in previews). Do **not** add a `VITE_`
   prefix.
3. Deploy. `GET /api/health` should report `"aiConfigured": true`.

### ⚠️ SQLite is NOT persistent on Vercel — read this

FeastIQ stores data in a local SQLite file (`src/feastiq.db` by default). On Vercel:

- the deployment filesystem is **read-only for the deployed bundle** and
  **ephemeral** — each cold start gets a fresh filesystem and concurrent
  instances do not share state;
- therefore orders/users written by one function invocation may be **lost** on
  the next cold start or invisible to other instances.

The AI endpoints (`/api/ai/*`) are unaffected — they are stateless. But the
**order/user routes will not be reliably persistent in production**.

For the hackathon demo, local SQLite is perfectly fine. For a real production
deployment, swap `src/db/database.js` for a hosted database (Turso/libSQL,
Neovon, Postgres, Supabase). The seam is already in place: set
`FEASTIQ_DB_PATH` to point at a persistent mounted volume if your host provides
one, otherwise replace the `DatabaseSync` calls. No route or frontend code needs
to change.

---

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Vite dev server + FeastIQ API middleware |
| `npm run build` | Production client build to `dist/` |
| `npm run preview` | Preview the built client |
| `npm run lint` | Oxlint |

## Model note

`gemini-2.5-flash` and `gemini-2.0-*` are **retired for new API keys** — the API
returns `404 NOT_FOUND` ("no longer available to new users"). FeastIQ therefore
defaults to **`gemini-3.8-flash`**. Override with the server-side `GEMINI_MODEL`
environment variable if needed.

### Resilience

Gemini's free tier is bursty, so `runDemandPrediction()` is defensive:

- **Capacity spikes** (`503 high demand`) → retried up to 4× per model with
  exponential backoff + jitter.
- **Quota exhaustion** (`exceeded your current quota`) → *not* retried, because
  retrying cannot help and only makes the caller wait. FeastIQ fails over to the
  next model instead.
- **Model fallback chain**: `gemini-3.8-flash` → `gemini-3.5-flash` →
  `gemini-flash-latest`. Each has an independent quota/capacity state.
- **Hard 45s budget** for the whole prediction, so a dashboard never hangs.

> ⚠️ If you are on the Gemini free tier, watch your daily request quota. Once it
> is exhausted the endpoint correctly returns `429 GEMINI_QUOTA_EXCEEDED` with
> `"aiConfigured": true` (the key is fine — the quota is spent). It recovers when
> the quota window resets.

