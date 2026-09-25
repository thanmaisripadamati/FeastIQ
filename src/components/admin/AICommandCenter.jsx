import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  Flame, 
  Sparkles, 
  BrainCircuit, 
  Trash2, 
  Clock, 
  Zap, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Cpu
} from 'lucide-react';

export function AICommandCenter() {
  const { 
    eventRushActive, 
    activeEvent, 
    metrics, 
    setAdminTab,
    simulateEventRush 
  } = useCanteen();

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-700 mb-2">
            <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
            <span>Autonomous Multi-Agent Neural Mesh</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            AI Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Coordinated intelligence layer overseeing event surges, kitchen queues, demand forecasting, and food waste prevention.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>6 / 6 Agents Operational</span>
          </span>
        </div>
      </div>

      {/* MASTER SYNTHESIS: AGENT #6 CANTEEN MANAGER AGENT */}
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-700/60 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-300">
                <Cpu className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300 block">
                  Agent #6 • Master Intelligence Orchestrator
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-['Outfit']">
                  Canteen Manager Agent — Live Situation Synthesis
                </h2>
              </div>
            </div>

            <span className="bg-white/10 text-indigo-200 border border-white/15 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto">
              Status: Coordinating All Agents
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 mb-5 space-y-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div>
                <strong className="text-sm font-bold text-white block mb-1">
                  Executive Operations Directive:
                </strong>
                {eventRushActive ? (
                  <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                    "🚨 <strong>Extreme demand detected due to {activeEvent?.name || 'College Sports Day'}.</strong> 438 orders predicted (87% confidence). Shawarma demand is 35% above normal capacity; current stock covers only 28%. Recommended action: Authorized 70 additional Biryani portions and routed fast-prep beverages through Counter 3 to avert bottleneck."
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
                    "🟢 <strong>Canteen operations are nominal.</strong> Active queue has 18 tokens with a 7.2-minute average turnaround. Demand Prediction Agent expects 85 lunch orders between 12:00 PM and 1:30 PM. Food Waste Agent reports optimal batch sizing for paneer and noodles."
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-black/20 p-3 rounded-xl border border-white/10">
              <span className="text-indigo-300 block text-[10px] uppercase">Telemetry Sync</span>
              <strong className="text-sm text-white font-mono">1.2s Real-Time</strong>
            </div>
            <div className="bg-black/20 p-3 rounded-xl border border-white/10">
              <span className="text-indigo-300 block text-[10px] uppercase">Decision Latency</span>
              <strong className="text-sm text-white font-mono">140ms</strong>
            </div>
            <div className="bg-black/20 p-3 rounded-xl border border-white/10">
              <span className="text-indigo-300 block text-[10px] uppercase">Active Queue Load</span>
              <strong className="text-sm text-amber-300 font-bold">{metrics.activeOrders} Orders</strong>
            </div>
            <div className="bg-black/20 p-3 rounded-xl border border-white/10">
              <span className="text-indigo-300 block text-[10px] uppercase">Confidence Matrix</span>
              <strong className="text-sm text-emerald-300 font-bold">{metrics.demandConfidence}% (High)</strong>
            </div>
          </div>
        </div>
      </div>

      {/* THE PRIMARY USP: AGENT #1 EVENT MANAGEMENT AGENT (VISUALLY EMPHASIZED) */}
      <div className={`rounded-3xl p-6 sm:p-8 border-2 transition-all shadow-md ${
        eventRushActive 
          ? 'bg-gradient-to-r from-red-500/10 via-amber-500/10 to-purple-500/10 border-red-300 event-rush-glow' 
          : 'bg-white border-purple-200 hover:border-purple-300'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-red-500/25">
              <Flame className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                  Primary Unique Agent (USP)
                </span>
                <span className="text-[11px] font-bold text-slate-400">Core FeastIQ Innovation</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit'] mt-1">
                Agent #1: Event Management Agent
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              eventRushActive ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-100 text-slate-700'
            }`}>
              {eventRushActive ? 'STATUS: MITIGATING 500+ SURGE' : 'STATUS: MONITORING SURGES'}
            </span>
            <button
              onClick={() => setAdminTab('event-management')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <span>Open Event Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-800 uppercase block mb-1">
              Crowd Surge Detection
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitors orders per minute, active devices, and sudden variance over 3-sigma thresholds to classify demand as: Normal, Increased, Event Rush, or Extreme Rush.
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-800 uppercase block mb-1">
              Dynamic Prep Scaling
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates conversion rates (84–87% for 500 attendees) and dispatches automated preparation plans for high-demand items (Biryani, Shawarma, Puffs).
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-bold text-slate-800 uppercase block mb-1">
              Queue & Menu Rebalancing
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              During peak crowd surges, temporarily marks slow hand-made recipes as limited batch and prioritizes instant chilled beverages and grab-and-go boxes.
            </p>
          </div>
        </div>
      </div>

      {/* THE OTHER 4 AGENTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AGENT 2: Demand Prediction Agent */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase block">Agent #2</span>
                  <h4 className="font-bold text-slate-900 text-base font-['Outfit']">Demand Prediction Agent</h4>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Active Monitoring
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Cross-references academic timetable schedules, exam weeks, and historical weekday demand to forecast lunch and snack consumption curves.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Upcoming Peak Hour</span>
                <span className="font-bold text-slate-900">12:30 PM – 1:15 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Forecasted Daily Volume</span>
                <span className="font-bold text-indigo-700">{metrics.predictedOrders} orders</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Prediction Model Confidence</span>
                <span className="font-bold text-emerald-700">87% (High)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAdminTab('demand-prediction')}
            className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Hourly Forecast Curves</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AGENT 3: Food Waste Agent */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase block">Agent #3</span>
                  <h4 className="font-bold text-slate-900 text-base font-['Outfit']">Food Waste Agent</h4>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Analyzing Batch Yields
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Tracks prepared vs consumed food portions, expiring ingredients, and unserved quantities to eliminate kitchen wastage.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Waste Prevented Today</span>
                <span className="font-bold text-emerald-700">₹3,400 saved (24.5 kg)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Top Optimization Target</span>
                <span className="font-bold text-slate-900">Paneer Gravy (-18% prep)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sustainability Rating</span>
                <span className="font-bold text-indigo-700">A+ (Zero Spoilage)</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAdminTab('food-waste')}
            className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>View Waste Telemetry</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AGENT 4: Order Management Agent */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-purple-600 uppercase block">Agent #4</span>
                  <h4 className="font-bold text-slate-900 text-base font-['Outfit']">Order Management Agent</h4>
                </div>
              </div>
              <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                Optimizing Tokens
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Assigns unique tokens (#F284), predicts realistic completion ETAs, detects counter choke points, and groups batch orders for kitchen efficiency.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Queue Throughput</span>
                <span className="font-bold text-slate-900">{metrics.ordersPerMinute} tokens/min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Counter 1 (Meals) Wait</span>
                <span className="font-bold text-indigo-700">~8.5 mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Counter 2 (Snacks) Wait</span>
                <span className="font-bold text-indigo-700">~5.0 mins</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAdminTab('live-orders')}
            className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Inspect Live Order Tokens</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* AGENT 5: Recommendation Agent */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase block">Agent #5</span>
                  <h4 className="font-bold text-slate-900 text-base font-['Outfit']">Student Recommendation Agent</h4>
                </div>
              </div>
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                Context-Aware Personalization
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Guides students toward high-availability food choices during rush hours, preventing bottlenecks while matching dietary preferences and budgets under ₹100.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Top Recommended Item</span>
                <span className="font-bold text-slate-900">Shawarma & Puffs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Budget Match Rate</span>
                <span className="font-bold text-emerald-700">92% under ₹100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Wait Reduction Impact</span>
                <span className="font-bold text-indigo-700">-3.8 mins average</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setAdminTab('analytics')}
            className="mt-4 w-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs py-2.5 rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Review Recommendation Analytics</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
