import React, { useState } from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Flame, 
  Sparkles, 
  Calendar, 
  Plus, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Users, 
  ShieldAlert, 
  ArrowRight, 
  Zap, 
  Layers, 
  ChevronRight,
  BarChart2,
  Sliders,
  Play
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export function EventManagementCenter() {
  const { 
    eventRushActive, 
    activeEvent, 
    metrics, 
    simulateEventRush, 
    endEventSimulation, 
    createManualEvent, 
    appliedRecommendations, 
    applyAIRecommendation,
    eventHistory
  } = useCanteen();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: 'College Cultural Fest 2026',
    type: 'Cultural Fest',
    crowd: 500,
    startTime: '10:30 AM',
    endTime: '4:00 PM',
    notes: 'Inter-college music, drama, and street dance battle crowds.'
  });

  // Predicted Items during rush
  const eventDemandData = [
    { name: 'Biryani', currentStock: 80, predictedDemand: 150, shortage: 70 },
    { name: 'Shawarma', currentStock: 40, predictedDemand: 140, shortage: 100 },
    { name: 'Puffs', currentStock: 60, predictedDemand: 110, shortage: 50 },
    { name: 'Cool Drinks', currentStock: 100, predictedDemand: 240, shortage: 140 },
    { name: 'Chicken Noodles', currentStock: 55, predictedDemand: 95, shortage: 40 },
    { name: 'Veg Noodles', currentStock: 70, predictedDemand: 85, shortage: 15 }
  ];

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createManualEvent({
      ...newEvent,
      crowd: Number(newEvent.crowd)
    });
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Banner with SIMULATE EVENT RUSH BUTTON */}
      <div className={`rounded-3xl p-6 sm:p-8 transition-all border ${
        eventRushActive 
          ? 'bg-gradient-to-r from-red-500/10 via-amber-500/10 to-purple-500/10 border-red-300 event-rush-glow'
          : 'bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-blue-500/10 border-indigo-200/80 shadow-xs'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                eventRushActive 
                  ? 'bg-red-600 text-white animate-pulse'
                  : 'bg-indigo-600 text-white'
              }`}>
                {eventRushActive ? '🚨 EVENT RUSH DETECTED (500+ STUDENTS)' : 'EVENT MANAGEMENT AGENT — PRIMARY USP'}
              </span>
              <span className="text-xs font-semibold text-slate-500">Autonomous Intelligence</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] tracking-tight">
              {eventRushActive ? 'Extreme Crowd Surge in Progress' : 'Dynamic Event Demand & Rush Controller'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
              {eventRushActive 
                ? 'Order volume increased by 320% in the last 15 minutes. FeastIQ has formulated an immediate kitchen action plan, shortage mitigation, and queue re-routing.'
                : 'The canteen should be able to adapt when the entire college suddenly gets hungry. Detect spontaneous fests, sports meets, or placement drives and auto-adjust kitchen preparation.'}
            </p>
          </div>

          {/* SIMULATION ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {!eventRushActive ? (
              <button
                onClick={simulateEventRush}
                className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-red-500/25 transition-all flex items-center gap-2.5 cursor-pointer transform hover:scale-102"
              >
                <Flame className="w-5 h-5 animate-pulse" />
                <span>SIMULATE EVENT RUSH (500+ CROWD)</span>
              </button>
            ) : (
              <button
                onClick={endEventSimulation}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Conclude Event & Generate Audit</span>
              </button>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm px-4 py-3 rounded-2xl border border-slate-200 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-600" />
              <span>Schedule Event Manually</span>
            </button>
          </div>
        </div>
      </div>

      {/* EVENT RUSH ACTION PLAN (Visible when surge is active) */}
      {eventRushActive && (
        <section className="bg-white rounded-3xl p-6 sm:p-7 border-2 border-red-200 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold shadow-md shadow-red-500/30">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block">
                  AI-Generated Operational Directives
                </span>
                <h2 className="text-xl font-black text-slate-900 font-['Outfit']">
                  EVENT RUSH ACTION PLAN
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="bg-red-50 text-red-700 font-bold px-3 py-1.5 rounded-xl border border-red-200">
                500+ Students Detected
              </span>
              <span className="bg-indigo-50 text-indigo-700 font-bold px-3 py-1.5 rounded-xl border border-indigo-200">
                Confidence: 89% (High)
              </span>
            </div>
          </div>

          {/* Action Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recommendation 1: Biryani */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 uppercase">Meals Counter</span>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">High Demand</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  Prepare +70 Portions Biryani
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Current stock (80) covers only 53% of the 150 projected lunch orders. Start second handi immediately.
                </p>
              </div>

              <button
                onClick={() => applyAIRecommendation('rec-biryani', 'PREPARE_BIRYANI', 'Added 70 Biryani portions to kitchen queue')}
                disabled={appliedRecommendations.includes('rec-biryani')}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  appliedRecommendations.includes('rec-biryani')
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                {appliedRecommendations.includes('rec-biryani') ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Prep Batch Active (+70)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Authorize Preparation Batch</span>
                  </>
                )}
              </button>
            </div>

            {/* Recommendation 2: Shawarma */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 uppercase">Snacks Counter</span>
                  <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">Critical Shortage</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  Prepare +100 Portions Shawarma
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Current stock (40) will exhaust in ~18 minutes at 34 orders/min. Load auxiliary rotisserie grill.
                </p>
              </div>

              <button
                onClick={() => applyAIRecommendation('rec-shawarma', 'PREPARE_SHAWARMA', 'Added 100 Shawarma portions to rotisserie')}
                disabled={appliedRecommendations.includes('rec-shawarma')}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  appliedRecommendations.includes('rec-shawarma')
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                }`}
              >
                {appliedRecommendations.includes('rec-shawarma') ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Aux Spit Loaded (+100)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Authorize Grill Rush (+100)</span>
                  </>
                )}
              </button>
            </div>

            {/* Recommendation 3: Beverages */}
            <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-700 uppercase">Beverage Chillers</span>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Fast Turnover</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  Restock 150 Chilled Drinks
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Sports event hydration demand peaks at 12:45 PM. Pre-box cans and bottles at Counter 3 for zero-wait pickup.
                </p>
              </div>

              <button
                onClick={() => applyAIRecommendation('rec-drinks', 'RESTOCK_BEVERAGES', 'Chillers replenished with 150 beverages')}
                disabled={appliedRecommendations.includes('rec-drinks')}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  appliedRecommendations.includes('rec-drinks')
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                }`}
              >
                {appliedRecommendations.includes('rec-drinks') ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chillers Restocked (+150)</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5" />
                    <span>Authorize Chiller Restock</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* AI Explainability Box */}
          <div className="bg-purple-50/60 border border-purple-200 rounded-2xl p-4 text-xs text-purple-950 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-purple-900 block mb-0.5">
                AI Explainability: Why did FeastIQ recommend these specific quantities?
              </span>
              <p className="leading-relaxed">
                "Historical telemetry from Annual Sports Day 2025 indicated an 84% conversion rate from the 500 attendees (approx 420–438 total orders). Current inventory covers only 38% of expected protein and beverage orders. Over-preparation risks are minimized by directing excess ingredients towards frozen batch holding."
              </p>
            </div>
          </div>
        </section>
      )}

      {/* DEMAND PREDICTION CHART & REAL-TIME TELEMETRY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Bar Chart of Predicted Demand vs Stock */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
                Event Demand Prediction vs Available Stock
              </h3>
              <p className="text-xs text-slate-500">
                Autonomous calculation comparing physical inventory to projected orders
              </p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-100">
              Confidence: 87%
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventDemandData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="currentStock" name="Current Stock" fill="#818cf8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="predictedDemand" name="Predicted Demand" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="shortage" name="Deficit / To Prepare" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Smart Rush Predictor Widget */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Smart Rush Predictor
              </span>
              <span className={`w-3 h-3 rounded-full ${
                eventRushActive ? 'bg-red-500 animate-ping' : 'bg-emerald-500'
              }`} />
            </div>

            <div className={`p-4 rounded-2xl border mb-4 text-center ${
              eventRushActive 
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}>
              <span className="text-xs font-bold uppercase block mb-1">Canteen State</span>
              <h4 className="text-2xl font-black font-['Outfit']">
                {eventRushActive ? '🔴 EXTREME RUSH' : '🟢 NORMAL OPERATION'}
              </h4>
              <p className="text-[11px] mt-1 opacity-90">
                {eventRushActive 
                  ? '500+ active demand signals detected on campus network.'
                  : 'Orders/min well within standard kitchen line thresholds.'}
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Orders / Minute</span>
                <span className="font-bold text-slate-900">{metrics.ordersPerMinute}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Active Campus Diners</span>
                <span className="font-bold text-slate-900">{metrics.activeUsers}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Current Queue Size</span>
                <span className="font-bold text-slate-900">{metrics.activeOrders} orders</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Avg Estimated Wait</span>
                <span className="font-bold text-indigo-700">{metrics.estimatedWaitTime} mins</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Next 30-min Demand</span>
                <span className="font-bold text-purple-700">{eventRushActive ? '~180 orders' : '~35 orders'}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 block text-center">
              Agent #1 Event Management Telemetry
            </span>
          </div>
        </div>
      </div>

      {/* PAST EVENT ARCHIVES & HISTORICAL AUDIT */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
              Past College Events & Historical Demand Logs
            </h3>
            <p className="text-xs text-slate-500">
              FeastIQ trains its machine learning prediction weights using verified past campus events
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {eventHistory.map((evt) => (
            <div key={evt.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4.5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{evt.name}</h4>
                  <span className="text-[11px] text-slate-500">{evt.date} • {evt.type}</span>
                </div>
                <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                  {evt.crowd} crowd
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Orders</span>
                  <strong className="text-slate-800">{evt.totalOrders}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Peak/min</span>
                  <strong className="text-slate-800">{evt.peakOrdersPerMin}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Avg Wait</span>
                  <strong className="text-slate-800">{evt.avgWaitTime}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Waste Prevented</span>
                  <strong className="text-emerald-700">{evt.wasteAmountInRs}</strong>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 italic bg-purple-50/50 p-2 rounded-lg border border-purple-100/60 leading-relaxed">
                "{evt.insights}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE MANUAL EVENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 font-['Outfit'] mb-1">
              Create College Event Manually
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              FeastIQ will automatically compute expected food demand and inventory requirements.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Event Type</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option>Sports Event</option>
                    <option>Hackathon</option>
                    <option>Cultural Fest</option>
                    <option>Technical Fest</option>
                    <option>Workshop / Seminar</option>
                    <option>Placement Drive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Crowd</label>
                  <input
                    type="number"
                    required
                    min={50}
                    max={2000}
                    value={newEvent.crowd}
                    onChange={(e) => setNewEvent({ ...newEvent, crowd: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newEvent.startTime}
                    onChange={(e) => setNewEvent({ ...newEvent, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">End Time</label>
                  <input
                    type="text"
                    value={newEvent.endTime}
                    onChange={(e) => setNewEvent({ ...newEvent, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Operational Notes</label>
                <textarea
                  rows={2}
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-all shadow-xs cursor-pointer"
                >
                  Schedule & Calculate Demand
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl text-sm cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
