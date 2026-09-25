/**
 * FeastIQ AI service (browser side).
 *
 * SECURITY: this module talks only to the FeastIQ API. The Gemini API key
 * lives exclusively on the server (local `.env` or the Vercel server-side
 * GEMINI_API_KEY environment variable). No Google credential, no
 * `import.meta.env` secret and no `VITE_*` key is referenced here or
 * anywhere else in the client bundle.
 */

const DEMAND_ENDPOINT = '/api/ai/demand-prediction';

/**
 * @param {object} snapshot
 * @param {number} snapshot.orders            orders currently in the queue
 * @param {number} [snapshot.previousOrders]   previous comparable order count
 * @param {string} [snapshot.event]            event name, or 'none'
 * @param {number} [snapshot.studentsExpected] students expected on campus
 * @param {string} [snapshot.menuFocus]
 * @returns {Promise<{ prediction: object, model: string, generatedAt: string }>}
 */
export async function fetchDemandPrediction(snapshot) {
  const payload = {
    orders: Number(snapshot.orders) || 0,
    previousOrders: Number(snapshot.previousOrders ?? snapshot.orders) || 0,
    event: snapshot.event && snapshot.event.trim() ? snapshot.event.trim() : 'none',
    studentsExpected: Number(snapshot.studentsExpected) || 0,
  };

  if (snapshot.menuFocus) payload.menuFocus = snapshot.menuFocus;
  if (snapshot.kitchenCapacityPerHour) {
    payload.kitchenCapacityPerHour = Number(snapshot.kitchenCapacityPerHour);
  }

  let res;
  try {
    res = await fetch(DEMAND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error('Could not reach the FeastIQ AI service. Is the dev server running?');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    throw new Error(`FeastIQ AI service returned a non-JSON response (HTTP ${res.status}).`);
  }

  if (!res.ok || !data?.prediction) {
    throw new Error(data?.error || `FeastIQ AI request failed (HTTP ${res.status}).`);
  }

  return data;
}

/** Human-readable colour helpers for the demand level badge. */
export const DEMAND_LEVEL_STYLES = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-rose-50 text-rose-700 border-rose-200',
};

export const PEAK_RISK_STYLES = {
  Low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-50 text-amber-700 border-amber-200',
  High: 'bg-orange-50 text-orange-700 border-orange-200',
  Critical: 'bg-rose-50 text-rose-700 border-rose-200',
};
