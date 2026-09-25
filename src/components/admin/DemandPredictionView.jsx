import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Info,
  Flame,
  Loader2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { HOURLY_NORMAL_DEMAND } from '../../data/mockData';
import { fetchDemandPrediction, DEMAND_LEVEL_STYLES, PEAK_RISK_STYLES } from '../../services/aiClient';

/**
 * Live FeastIQ AI demand prediction card.
 *
 * Calls the FeastIQ backend (`POST /api/ai/demand-prediction`), which calls
 * Gemini server-side. The browser never sees a Google credential.
 */
function AIPredictionCard() {
  const { metrics, eventRushActive, activeEvent } = useCanteen();

  const [prediction, setPrediction] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const eventName = eventRushActive && activeEvent?.name ? activeEvent.name : 'none';
  const studentsExpected = eventRushActive
    ? activeEvent?.crowd ?? 500
    : metrics.activeUsers;

  const runPrediction = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDemandPrediction({
        orders: metrics.activeOrders,
        previousOrders: metrics.predictedOrders,
        event: eventName,
        studentsExpected,
        menuFocus: 'Biryani, Shawarma, Fried Rice, Cool Drinks',
        kitchenCapacityPerHour: 240,
      });
      setPrediction(data.prediction);
      setMeta({ model: data.model, generatedAt: data.generatedAt });
    } catch (err) {
      setError(err.message);
      setPrediction(null);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const snapshot = [
    { label: 'Orders in queue', value: metrics.activeOrders },
    { label: 'Previous baseline', value: metrics.predictedOrders },
    { label: 'Students expected', value: studentsExpected },
    { label: 'Event', value: eventName },
  ];

  return (
    <div className="bg-white rounded-3xl border border-indigo-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50/70 via-blue-50/60 to-cyan-50/60">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white grid place-items-center shadow-sm">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-['Outfit'] leading-tight">
              AI Demand Prediction
            </h3>
            <p className="text-[11px] text-slate-500">
              Gemini-powered Event Management Agent &bull; server-side inference
            </p>
          </div>
        </div>

        <button
          onClick={runPrediction}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-bold shadow-sm transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Analysing...
            </>
          ) : (
            <>
              <RefreshCw className="w-3.5 h-3.5" />
              {prediction ? 'Re-run Prediction' : 'Run AI Prediction'}
            </>
          )}
        </button>
      </div>

      {/* Snapshot that is sent to the model */}
      <div className="px-5 py-3 bg-slate-50/70 border-b border-slate-100">
        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-2">
          Snapshot sent to the agent
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {snapshot.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 px-3 py-2">
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{s.label}</p>
              <p className="text-sm font-extrabold text-slate-900 truncate">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5">
        {/* Error state */}
        {error && (
          <div className="flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-4">
            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-800">AI prediction unavailable</p>
              <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!prediction && !error && !loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 grid place-items-center mb-3">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-sm font-bold text-slate-800">No prediction yet</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
              Run the FeastIQ demand prediction agent to get an AI-assisted preparation
              recommendation for the current canteen snapshot.
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading && !prediction && (
          <div className="text-center py-10">
            <Loader2 className="w-6 h-6 mx-auto text-indigo-500 animate-spin mb-3" />
            <p className="text-xs font-semibold text-slate-600">
              Gemini is analysing demand, event impact and peak risk&hellip;
            </p>
          </div>
        )}

        {/* Result */}
        {prediction && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Demand Level</p>
                <span
                  className={`inline-block mt-1.5 px-3 py-1 rounded-xl border text-sm font-extrabold ${
                    DEMAND_LEVEL_STYLES[prediction.demandLevel] || DEMAND_LEVEL_STYLES.Medium
                  }`}
                >
                  {prediction.demandLevel}
                </span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Recommended Preparation</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1 leading-none">
                  {prediction.recommendedQuantity}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">portions to prepare</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Peak Risk</p>
                <span
                  className={`inline-block mt-1.5 px-3 py-1 rounded-xl border text-sm font-extrabold ${
                    PEAK_RISK_STYLES[prediction.peakRisk] || PEAK_RISK_STYLES.Medium
                  }`}
                >
                  {prediction.peakRisk}
                </span>
                <p className="text-[10px] text-slate-500 mt-1">{prediction.peakWindow}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Event Detected</p>
                <p
                  className={`text-sm font-extrabold mt-2 ${
                    prediction.eventDetected ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {prediction.eventDetected ? prediction.eventName : 'None'}
                </p>
                {prediction.eventDetected && (
                  <p className="text-[10px] text-slate-500 mt-1">
                    Surge ratio {prediction.surgeRatio}&times;
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">
              <p className="text-[10px] uppercase tracking-wider text-indigo-400 font-bold mb-1.5">
                Reason
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">{prediction.reason}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold mb-1.5">
                  Preparation Advice
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {prediction.preparationAdvice}
                </p>
              </div>
              <div className="rounded-2xl border border-sky-100 bg-sky-50/50 p-4">
                <p className="text-[10px] uppercase tracking-wider text-sky-600 font-bold mb-1.5">
                  Staffing Advice
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {prediction.staffingAdvice}
                </p>
              </div>
            </div>

            {Array.isArray(prediction.stockAlerts) && prediction.stockAlerts.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
                <p className="text-[10px] uppercase tracking-wider text-amber-600 font-bold mb-2">
                  Stock Alerts
                </p>
                <ul className="space-y-1">
                  {prediction.stockAlerts.map((alert, i) => (
                    <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 shrink-0" />
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>
                  Confidence{' '}
                  <strong className="text-slate-700">{prediction.confidence}%</strong>
                  {prediction.confidenceExplanation ? ` — ${prediction.confidenceExplanation}` : ''}
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                {meta?.model ? `model: ${meta.model}` : ''}
                {meta?.generatedAt ? ` • ${new Date(meta.generatedAt).toLocaleTimeString()}` : ''}
              </p>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              AI-assisted estimate generated from the current canteen snapshot. This is a
              recommendation, not a guarantee of real-world demand.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function DemandPredictionView() {
  const { metrics, eventRushActive } = useCanteen();

  const categoryHourly = [
    { hour: '8:30 AM', tiffins: 85, lunch: 0, snacks: 12, drinks: 20 },
    { hour: '10:00 AM', tiffins: 60, lunch: 0, snacks: 45, drinks: 40 },
    { hour: '11:30 AM', tiffins: 20, lunch: 40, snacks: 65, drinks: 60 },
    { hour: '12:30 PM', tiffins: 5, lunch: 195, snacks: 85, drinks: 140 },
    { hour: '1:30 PM', tiffins: 0, lunch: 140, snacks: 50, drinks: 90 },
    { hour: '3:00 PM', tiffins: 0, lunch: 15, snacks: 70, drinks: 65 },
    { hour: '4:30 PM', tiffins: 25, lunch: 5, snacks: 120, drinks: 95 }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Demand Prediction Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Powered by Agent #2 • Multi-factor predictive modeling of student dining patterns.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-200">
            Demand Confidence: {metrics.demandConfidence}% (High)
          </span>
        </div>
      </div>

      {/* Live Gemini-backed prediction (server-side AI call) */}
      <AIPredictionCard />

      {/* Main Hourly Demand Curve */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
              Hourly Predicted vs Actual Kitchen Load
            </h3>
            <p className="text-xs text-slate-500">
              Correlating timetable breaks, student footfall, and event surges
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Peak Expected: <strong>12:30 PM – 1:15 PM</strong>
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={HOURLY_NORMAL_DEMAND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="orders" stroke="#4f46e5" strokeWidth={2.5} name="Base Demand" dot={{ r: 3 }} />
              <Line type="monotone" dataKey="normalCapacity" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" name="Kitchen Line Capacity" />
              {eventRushActive && (
                <Line type="monotone" dataKey="eventDemand" stroke="#ef4444" strokeWidth={3} name="Event Surge Demand (500+)" dot={{ r: 4 }} />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category-Wise Meal Breakdown Across Day */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base font-['Outfit'] mb-1">
          Meal Category Consumption Trajectory
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Tiffins surge at 8:30 AM, Lunch peaks at 12:30 PM, Snacks take over at 4:30 PM.
        </p>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={categoryHourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="tiffins" stroke="#f59e0b" strokeWidth={2} name="Tiffins" />
              <Line type="monotone" dataKey="lunch" stroke="#4f46e5" strokeWidth={2.5} name="Lunch / Meals" />
              <Line type="monotone" dataKey="snacks" stroke="#ec4899" strokeWidth={2} name="Snacks & Fast Food" />
              <Line type="monotone" dataKey="drinks" stroke="#06b6d4" strokeWidth={2} name="Cool Drinks" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prediction Factors & Explainability */}
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border border-indigo-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-indigo-900">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-sm uppercase tracking-wider font-['Outfit']">
            Prediction Factors & Explainability
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
            <strong className="text-slate-900 block mb-1">📅 Academic Timetable Synchronizer</strong>
            <p className="text-slate-600 leading-relaxed">
              3rd Year CSE & ECE laboratory slots end at 12:15 PM, driving an anticipated spike of 90 orders across Counters 1 and 2 within a 12-minute window.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
            <strong className="text-slate-900 block mb-1">🌡️ Weather & Temperature Weighting</strong>
            <p className="text-slate-600 leading-relaxed">
              Afternoon temperature forecast is 32°C. Beverage consumption coefficient scaled by +28%, recommending 140 chilled Thums Up and Sprite portions.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-indigo-100 shadow-2xs">
            <strong className="text-slate-900 block mb-1">🍛 Weekend / Friday Flavor Affinity</strong>
            <p className="text-slate-600 leading-relaxed">
              Friday lunch shows 2.3× higher propensity for Hyderabadi Dum Biryani and Fry Piece Biryani compared to chapathi and rice varieties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
