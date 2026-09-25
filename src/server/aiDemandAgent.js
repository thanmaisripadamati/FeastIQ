/**
 * FeastIQ AI Demand Prediction Agent (Event Management Agent).
 *
 * Server-side only. This module is the ONLY place that talks to Gemini.
 * The browser never sees a Google credential — it calls
 * `POST /api/ai/demand-prediction` on the FeastIQ API and receives the
 * already-parsed result below.
 *
 * The output shape is a stable, typed contract so the dashboard can render
 * it without knowing anything about Gemini.
 */

import { getGeminiClient, GeminiConfigError } from './geminiClient.js';
import { redactSecrets } from './env.js';

/**
 * Default model.
 *
 * `gemini-2.5-flash` is retired for new API keys and now returns
 * HTTP 404 NOT_FOUND, so it is no longer usable here.
 *
 * Resolved lazily (not at module-eval time) because ES module imports are
 * hoisted: this file's body would otherwise run before `loadServerEnv()` has
 * populated `process.env` from `.env`.
 */
export const DEFAULT_DEMAND_MODEL = 'gemini-3.8-flash';

export function getDemandModel() {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_DEMAND_MODEL;
}

/**
 * Tried in order.
 *
 * `gemini-2.5-flash` and `gemini-2.0-*` are retired for new API keys (404).
 * `gemini-3.8-flash` is the primary. `gemini-3.5-flash` and
 * `gemini-flash-latest` are safety nets: on the free tier each model can hit
 * its own quota bucket or a capacity spike independently, so a second and
 * third option materially improves availability.
 */
function getModelFallbacks() {
  const primary = getDemandModel();
  return [primary, ...['gemini-3.5-flash-lite'].filter((m) => m !== primary)];
}

const REQUEST_TIMEOUT_MS = 35_000;

/**
 * Hard ceiling for one whole prediction (all models, all retries).
 * A dashboard caller should never wait minutes; when this is hit we surface
 * the last upstream error so the UI can show a clear message.
 */
const TOTAL_BUDGET_MS = 45_000;

/** Gemini free-tier capacity is bursty; retry transient failures. */
const MAX_ATTEMPTS = 4;
const RETRY_BASE_DELAY_MS = 1_200;
const RETRY_MAX_DELAY_MS = 8_000;

/** Errors worth retrying: capacity spikes, transient rate limits, network. */
const RETRYABLE_PATTERNS = [
  '503',
  'unavailable',
  'high demand',
  'overloaded',
  'deadline_exceeded',
  'econnreset',
  'etimedout',
  'fetch failed',
  'socket hang up',
  'rate limit',
];

/**
 * Daily/quota exhaustion is NOT transient: retrying inside the same request
 * only makes the client wait longer. Fail fast with a 429 instead.
 * Capacity spikes (503 "high demand") remain retryable.
 */
const NON_RETRYABLE_PATTERNS = [
  'exceeded your current quota',
  'quota exceeded',
  'billing details',
  'per day',
  'daily',
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function isRetryable(message) {
  const lower = String(message || '').toLowerCase();
  if (NON_RETRYABLE_PATTERNS.some((p) => lower.includes(p))) return false;
  return RETRYABLE_PATTERNS.some((p) => lower.includes(p));
}

const DEMAND_LEVELS = ['Low', 'Medium', 'High'];
const PEAK_RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

/** JSON Schema handed to Gemini for structured output. */
const DEMAND_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    demandLevel: { type: 'string', enum: DEMAND_LEVELS },
    recommendedQuantity: { type: 'integer' },
    peakRisk: { type: 'string', enum: PEAK_RISK_LEVELS },
    peakWindow: { type: 'string' },
    eventDetected: { type: 'boolean' },
    eventName: { type: 'string' },
    surgeRatio: { type: 'number' },
    reason: { type: 'string' },
    confidence: { type: 'number' },
    confidenceExplanation: { type: 'string' },
    preparationAdvice: { type: 'string' },
    staffingAdvice: { type: 'string' },
    stockAlerts: { type: 'array', items: { type: 'string' } },
  },
  required: [
    'demandLevel',
    'recommendedQuantity',
    'peakRisk',
    'eventDetected',
    'reason',
    'confidence',
    'preparationAdvice',
  ],
  propertyOrdering: [
    'demandLevel',
    'recommendedQuantity',
    'peakRisk',
    'peakWindow',
    'eventDetected',
    'eventName',
    'surgeRatio',
    'reason',
    'confidence',
    'confidenceExplanation',
    'preparationAdvice',
    'staffingAdvice',
    'stockAlerts',
  ],
};

/** Upstream failure that we can describe safely to the client. */
export class GeminiUpstreamError extends Error {
  constructor(message, { status = 502, code = 'GEMINI_UPSTREAM_ERROR' } = {}) {
    super(message);
    this.name = 'GeminiUpstreamError';
    this.status = status;
    this.code = code;
  }
}

const SYSTEM_INSTRUCTION = `You are the FeastIQ Demand Prediction Agent, part of the Event Management Agent suite for an AI-assisted smart college canteen management system.

Your job is to forecast near-term canteen demand and recommend how much food the kitchen should prepare.

Rules you must always follow:
- Base "orders" on the current order count, the previous comparable count, the number of students expected, and any named campus event.
- When an event is named (for example Sports Day, Hackathon, Fest, Convocation) and/or the student count far exceeds the normal baseline, treat it as an event-driven demand surge. Set eventDetected to true and name the event.
- recommendedQuantity must be an integer number of portions to prepare. It must cover expected demand with a sensible safety margin, and must never be lower than the current order count.
- peakRisk must reflect the risk of a rush overwhelming the serving line.
- Keep "reason" to at most 3 short sentences, written for a canteen manager.
- confidence is a number between 0 and 100.
- Be honest: you are producing an AI-assisted estimate from the supplied snapshot, not a guarantee. Never claim real-world load testing or perfect prediction.
- Reply with JSON only, matching the provided schema exactly.`;

function buildPrompt(input) {
  const event = input.event && input.event.toLowerCase() !== 'none' ? input.event : 'none';

  return `You are FeastIQ's Demand Prediction Agent, part of the Event Management Agent suite for an AI-assisted smart college canteen management system.

Your job is to forecast near-term canteen demand and recommend how much food the kitchen should prepare.
Pay special attention to FeastIQ's Event Management Agent concept:
- Base predictions on current orders, previous comparable orders, expected students, and campus events.
- Campus events include: Sports Day, Hackathon, College Fest, Cultural Events, Workshops, and large campus gatherings.
- When an event is detected (such as Sports Day or Hackathon) or expected students significantly exceed normal baseline, identify the event-driven rush and recommend preparation adjustments.
- State clearly that this is an AI-assisted operational estimate based on current snapshot data, not a guarantee.
- recommendedQuantity must be an integer number of portions to prepare covering expected demand with a sensible safety margin, and must never be lower than the current order count.
- peakRisk must reflect the risk of a rush overwhelming the serving line (Low, Medium, High, or Critical).
- Provide a clear, actionable recommendedAction for kitchen and counter staff.

Current canteen snapshot:
- Current orders in the queue: ${input.orders}
- Previous comparable order count: ${input.previousOrders}
- Students expected on campus: ${input.studentsExpected}
- Event: ${event}
- Day of week: ${input.dayOfWeek}
- Time of day: ${input.timeOfDay}
- Kitchen line capacity per hour: ${input.kitchenCapacityPerHour}
- Menu focus today: ${input.menuFocus}

Respond with ONLY a valid JSON object matching this structure (no markdown, no prose):
{
  "demandLevel": "High",
  "recommendedQuantity": 450,
  "peakRisk": "High",
  "peakWindow": "Next 60-90 minutes",
  "eventDetected": true,
  "eventName": "${event !== 'none' ? event : 'None'}",
  "surgeRatio": 1.25,
  "reason": "Short reason explaining the prediction",
  "recommendedAction": "Actionable preparation and counter adjustment recommendations",
  "preparationAdvice": "Detailed kitchen preparation advice",
  "staffingAdvice": "Staffing recommendation for counters",
  "stockAlerts": ["Alert 1"],
  "confidence": 85,
  "confidenceExplanation": "Explanation of confidence score"
}`;
}

function toFiniteNumber(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Normalise + validate the incoming request body.
 * @returns {{ ok: true, input: object } | { ok: false, status: number, error: string }}
 */
export function parseDemandInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, status: 400, error: 'Request body must be a JSON object.' };
  }

  const rawOrders = body.orders ?? body.currentOrders;
  if (rawOrders === undefined || rawOrders === null || rawOrders === '') {
    return { ok: false, status: 400, error: 'Field "orders" is required and must be a number.' };
  }

  const orders = Number(rawOrders);
  if (!Number.isFinite(orders) || orders < 0) {
    return { ok: false, status: 400, error: 'Field "orders" must be a non-negative number.' };
  }

  const previousOrders = toFiniteNumber(body.previousOrders ?? body.previous, orders);
  const studentsExpected = toFiniteNumber(body.studentsExpected ?? body.students, orders);

  if (studentsExpected < 0) {
    return { ok: false, status: 400, error: 'Field "studentsExpected" must be a non-negative number.' };
  }

  const rawEvent = typeof body.event === 'string' ? body.event.trim() : '';
  const event = !rawEvent || rawEvent.toLowerCase() === 'none' ? 'none' : rawEvent;

  const now = new Date();

  return {
    ok: true,
    input: {
      orders: Math.round(orders),
      previousOrders: Math.round(Math.max(0, previousOrders)),
      studentsExpected: Math.round(Math.max(0, studentsExpected)),
      event,
      dayOfWeek:
        typeof body.dayOfWeek === 'string' && body.dayOfWeek.trim()
          ? body.dayOfWeek.trim()
          : now.toLocaleDateString('en-US', { weekday: 'long' }),
      timeOfDay:
        typeof body.timeOfDay === 'string' && body.timeOfDay.trim()
          ? body.timeOfDay.trim()
          : now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      kitchenCapacityPerHour: Math.round(
        toFiniteNumber(body.kitchenCapacityPerHour, 240)
      ),
      menuFocus:
        typeof body.menuFocus === 'string' && body.menuFocus.trim()
          ? body.menuFocus.trim()
          : 'Biryani, Shawarma, Fried Rice, Cool Drinks',
    },
  };
}

/** Strip markdown fences / prose and return the first JSON object. */
export function extractJson(rawText) {
  if (typeof rawText !== 'string' || !rawText.trim()) return null;

  const text = rawText.trim();
  const candidates = [];

  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) candidates.push(fenced[1].trim());

  candidates.push(text);

  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    candidates.push(text.slice(firstBrace, lastBrace + 1));
  }

  for (const candidate of candidates) {
    try {
      const parsed = JSON.parse(candidate);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {
      // try next candidate
    }
  }

  return null;
}

function pickEnum(value, allowed, fallback) {
  if (typeof value !== 'string') return fallback;
  const match = allowed.find((a) => a.toLowerCase() === value.trim().toLowerCase());
  return match ?? fallback;
}

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function clampNumber(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

/**
 * Models often answer `confidence` on a 0-1 scale (e.g. 0.92) even when the
 * schema says 0-100. Normalise to a 0-100 percentage.
 */
function normaliseConfidence(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 70;
  const scaled = n > 0 && n <= 1 ? n * 100 : n;
  return Math.round(Math.min(100, Math.max(0, scaled)) * 10) / 10;
}

function asString(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

/**
 * Validate + coerce Gemini's JSON into FeastIQ's stable contract.
 * Throws when the response is unusable ("malformed Gemini response").
 */
export function normalisePrediction(raw, input) {
  const parsed = extractJson(typeof raw === 'string' ? raw : JSON.stringify(raw ?? null));
  if (!parsed) {
    throw new GeminiUpstreamError(
      'Gemini returned a response that could not be parsed as JSON.',
      { code: 'GEMINI_MALFORMED_RESPONSE' }
    );
  }

  const recommendedQuantity = clampInt(
    parsed.recommendedQuantity,
    input.orders,
    100_000,
    Math.max(input.orders, Math.round(input.studentsExpected * 0.6))
  );

  const eventDetected =
    typeof parsed.eventDetected === 'boolean'
      ? parsed.eventDetected
      : input.event !== 'none';

  const stockAlerts = Array.isArray(parsed.stockAlerts)
    ? parsed.stockAlerts.filter((s) => typeof s === 'string' && s.trim()).map((s) => s.trim())
    : [];

  return {
    demandLevel: pickEnum(parsed.demandLevel, DEMAND_LEVELS, 'Medium'),
    recommendedQuantity,
    peakRisk: pickEnum(parsed.peakRisk, PEAK_RISK_LEVELS, 'Medium'),
    peakWindow: asString(parsed.peakWindow, 'Next 60-90 minutes'),
    eventDetected,
    eventName: asString(parsed.eventName, eventDetected ? input.event : 'None'),
    surgeRatio: clampNumber(
      parsed.surgeRatio,
      0,
      1000,
      input.previousOrders > 0
        ? Number((input.orders / input.previousOrders).toFixed(2))
        : 1
    ),
    reason: asString(
      parsed.reason,
      'AI-assisted estimate based on the current canteen snapshot.'
    ),
    confidence: normaliseConfidence(parsed.confidence),
    confidenceExplanation: asString(
      parsed.confidenceExplanation,
      'Derived from the order delta, expected footfall and event context.'
    ),
    recommendedAction: asString(
      parsed.recommendedAction || parsed.preparationAdvice,
      'Prepare the recommended quantity and monitor the serving line.'
    ),
    preparationAdvice: asString(
      parsed.preparationAdvice || parsed.recommendedAction,
      'Prepare the recommended quantity and monitor the serving line.'
    ),
    staffingAdvice: asString(parsed.staffingAdvice, 'Keep one extra runner on the serving line.'),
    stockAlerts,
    // Aliases for varied consumer naming conventions
    'Demand Level': pickEnum(parsed.demandLevel, DEMAND_LEVELS, 'Medium'),
    'Recommended Quantity': recommendedQuantity,
    'Peak Risk': pickEnum(parsed.peakRisk, PEAK_RISK_LEVELS, 'Medium'),
    'Event Detected': eventDetected ? asString(parsed.eventName, input.event) : 'None',
    'Reason': asString(parsed.reason, 'AI-assisted estimate based on the current canteen snapshot.'),
    'Recommended Action': asString(
      parsed.recommendedAction || parsed.preparationAdvice,
      'Prepare the recommended quantity and monitor the serving line.'
    ),
  };
}

function classifyGeminiError(err) {
  const raw = redactSecrets(err?.message || 'Unknown Gemini error');
  const lower = raw.toLowerCase();

  if (err instanceof GeminiConfigError) return err;

  if (lower.includes('api key') && (lower.includes('not found') || lower.includes('no longer available'))) {
    // e.g. "models/gemini-2.5-flash is no longer available to new users"
    return new GeminiUpstreamError(
      `The configured Gemini model is unavailable: ${extractModelName(raw) || 'unknown model'}. ` +
        'Set the server-side GEMINI_MODEL environment variable to a currently supported model.',
      { status: 502, code: 'GEMINI_MODEL_UNAVAILABLE' }
    );
  }

  if (
    lower.includes('api key') &&
    (lower.includes('invalid') || lower.includes('not valid') || lower.includes('expired'))
  ) {
    return new GeminiUpstreamError(
      'Gemini rejected the configured API key. Verify GEMINI_API_KEY in your environment.',
      { status: 502, code: 'GEMINI_INVALID_API_KEY' }
    );
  }

  if (lower.includes('permission_denied') || lower.includes('permission denied')) {
    return new GeminiUpstreamError(
      'Gemini denied access for the configured API key. Check that the Generative Language API is enabled.',
      { status: 502, code: 'GEMINI_PERMISSION_DENIED' }
    );
  }

  if (lower.includes('quota') || lower.includes('rate limit') || lower.includes('resource_exhausted')) {
    return new GeminiUpstreamError(
      'Gemini rate limit or quota reached. Please retry in a moment.',
      { status: 429, code: 'GEMINI_QUOTA_EXCEEDED' }
    );
  }

  if (
    err?.name === 'AbortError' ||
    lower.includes('timeout') ||
    lower.includes('timed out') ||
    lower.includes('fetch failed') ||
    lower.includes('econnreset') ||
    lower.includes('enotfound') ||
    lower.includes('network')
  ) {
    return new GeminiUpstreamError(
      'Could not reach the Gemini API. Check network connectivity and retry.',
      { status: 504, code: 'GEMINI_NETWORK_ERROR' }
    );
  }

  return new GeminiUpstreamError(
    `Gemini API request failed: ${raw}`,
    { status: 502, code: 'GEMINI_UPSTREAM_ERROR' }
  );
}

/** Pull `models/<id>` out of a Gemini error string, if present. */
function extractModelName(message) {
  const match = String(message || '').match(/models\/([A-Za-z0-9._-]+)/);
  return match ? match[1] : '';
}

/**
 * Call Gemini and return FeastIQ's structured demand prediction.
 *
 * @param {ReturnType<typeof parseDemandInput>} input
 * @returns {Promise<{ prediction: object, model: string, input: object }>}
 */
export async function runDemandPrediction(input) {
  const ai = getGeminiClient(); // throws GeminiConfigError (503) when unconfigured
  const modelFallbacks = getModelFallbacks();
  const prompt = buildPrompt(input);

  const buildRequest = async (model) => {
    // Prefer the Interactions API as specified for modern Gemini SDK:
    // const interaction = await ai.interactions.create({ model, input: prompt });
    if (ai.interactions && typeof ai.interactions.create === 'function') {
      const interaction = await ai.interactions.create({
        model,
        input: prompt,
      });
      return interaction?.output_text || '';
    }

    // Direct fallback if interactions is not exposed on client
    const res = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseJsonSchema: DEMAND_RESPONSE_SCHEMA,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });
    return (typeof res?.text === 'function' ? res.text() : res?.text) || '';
  };

  let rawText = '';
  let usedModel = null;
  let lastError = null;
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  // Outer loop: model fallback. Gemini free-tier capacity is bursty, so if the
  // preferred model is saturated we transparently try the next one.
  for (let m = 0; m < modelFallbacks.length; m++) {
    const model = modelFallbacks[m];
    const isLastModel = m === modelFallbacks.length - 1;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      // Out of overall time budget: surface the last upstream error.
      if (Date.now() >= deadline) {
        throw lastError
          ? classifyGeminiError(lastError)
          : new GeminiUpstreamError(
              'Gemini did not respond within the time budget. Please retry.',
              { status: 504, code: 'GEMINI_TIMEOUT' }
            );
      }

      const timeout = new Promise((_, reject) => {
        const timer = setTimeout(() => {
          const abortError = new Error('Gemini request timed out');
          abortError.name = 'AbortError';
          reject(abortError);
        }, REQUEST_TIMEOUT_MS);
        if (typeof timer.unref === 'function') timer.unref();
      });

      try {
        rawText = await Promise.race([buildRequest(model), timeout]);
        usedModel = model;
        lastError = null;
        if (rawText && rawText.trim()) break;
      } catch (err) {
        lastError = err;
        const classified = classifyGeminiError(err);

        // These will never succeed on another attempt or another model.
        const fatal =
          classified instanceof GeminiConfigError ||
          classified.code === 'GEMINI_INVALID_API_KEY' ||
          classified.code === 'GEMINI_PERMISSION_DENIED';

        const exhausted = attempt === MAX_ATTEMPTS;

        // Fatal for every model in the chain: stop immediately.
        if (fatal) throw classified;

        if (exhausted || !isRetryable(err?.message)) {
          if (isLastModel) throw classified;
          console.warn(
            `[FeastIQ AI] ${model} unavailable (${classified.code}); ` +
              `failing over to ${modelFallbacks[m + 1]}`
          );
          break;
        }

        // Transient (capacity spike / brief rate limit): retry same model.
        const backoff = Math.min(RETRY_MAX_DELAY_MS, RETRY_BASE_DELAY_MS * 2 ** (attempt - 1));
        const delay = backoff / 2 + Math.random() * (backoff / 2);
        console.warn(
          `[FeastIQ AI] Gemini attempt ${attempt}/${MAX_ATTEMPTS} on ${model} failed ` +
            `(${classified.code}); retrying in ${Math.round(delay)}ms`
        );
        await sleep(Math.min(delay, Math.max(0, deadline - Date.now())));
      }
    }

    if (rawText && rawText.trim()) break;
  }

  if (!rawText || !rawText.trim()) {
    if (lastError) throw classifyGeminiError(lastError);
    throw new GeminiUpstreamError('Gemini returned an empty response.', {
      code: 'GEMINI_EMPTY_RESPONSE',
    });
  }

  const prediction = normalisePrediction(rawText, input);

  return {
    prediction,
    model: usedModel || getDemandModel(),
    input,
  };
}
