import React from 'react';
import { useCanteen } from '../../context/CanteenContext';
import { 
  ShoppingBag, 
  IndianRupee, 
  Clock, 
  Flame, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  ChefHat, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShieldCheck,
  Zap,
  Users
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { HOURLY_NORMAL_DEMAND } from '../../data/mockData';

export function AdminDashboard() {
  const { 
    metrics, 
    orders, 
    updateOrderStatus, 
    eventRushActive, 
    activeEvent, 
    setAdminTab,
    simulateEventRush 
  } = useCanteen();

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8 pb-20">
      {/* Welcome & Event Mode Alert */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-semibold text-indigo-700 mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            <span>Central Kitchen Operations • Shift A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-['Outfit']">
            Kitchen Live Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time campus order intake, AI rush forecasts, and counter performance.
          </p>
        </div>

        {/* Quick event button if not active */}
        {!eventRushActive ? (
          <button
            onClick={simulateEventRush}
            className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 font-bold text-xs px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Flame className="w-4 h-4 text-red-600 animate-pulse" />
            <span>Simulate 500+ Student Event Surge</span>
          </button>
        ) : (
          <button
            onClick={() => setAdminTab('event-management')}
            className="bg-red-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-red-600/20 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Event Mode Active — Open Command Center</span>
          </button>
        )}
      </div>

      {/* EVENT MODE ACTIVE HERO BANNER */}
      {eventRushActive && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-purple-700 text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden event-rush-glow">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
                  Event Mode Active
                </span>
                <span className="text-red-200 text-xs font-semibold">• 500+ Surge Registered</span>
              </div>
              <h2 className="text-2xl font-black font-['Outfit']">
                🏆 {activeEvent?.name || 'ANNUAL SPORTS DAY 2026'}
              </h2>
              <p className="text-xs text-red-100 max-w-xl leading-relaxed">
                Orders/min reached {metrics.ordersPerMinute}. Event Management Agent has dispatched dynamic preparation batches to avoid menu exhaustion.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-black/20 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shrink-0 text-center">
              <div>
                <span className="text-[10px] text-red-200 block uppercase">Crowd</span>
                <strong className="text-base font-black">500</strong>
              </div>
              <div>
                <span className="text-[10px] text-red-200 block uppercase">Active Orders</span>
                <strong className="text-base font-black text-amber-300">{metrics.activeOrders}</strong>
              </div>
              <div>
                <span className="text-[10px] text-red-200 block uppercase">Rush Level</span>
                <strong className="text-base font-black text-red-300">{metrics.rushLevel}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8 LIVE METRICS TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Metric 1: Orders Today */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Orders Today</span>
            <ShoppingBag className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] block">
            {metrics.todayOrdersCount}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            +38% vs yesterday
          </span>
        </div>

        {/* Metric 2: Revenue Today in ₹ */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Revenue Today</span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">INR</span>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] block">
            ₹{metrics.todayRevenue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Campus digital payments
          </span>
        </div>

        {/* Metric 3: Active Orders */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Queue</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-indigo-700 font-['Outfit'] block">
            {metrics.activeOrders}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            ~{metrics.estimatedWaitTime} min average wait
          </span>
        </div>

        {/* Metric 4: Current Rush */}
        <div className={`rounded-2xl p-4 sm:p-5 border shadow-2xs ${
          metrics.rushLevel === 'EXTREME'
            ? 'bg-red-50 border-red-200 text-red-800'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
        }`}>
          <div className="flex items-center justify-between mb-2 opacity-80">
            <span className="text-xs font-bold uppercase tracking-wider">Current Rush</span>
            <Flame className="w-4 h-4" />
          </div>
          <span className="text-xl sm:text-2xl font-black font-['Outfit'] block">
            {metrics.rushLevel}
          </span>
          <span className="text-[11px] font-semibold mt-1 block">
            {metrics.ordersPerMinute} orders / min
          </span>
        </div>

        {/* Metric 5: Low Stock Items */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Stock Alerts</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-amber-600 font-['Outfit'] block">
            {eventRushActive ? '3 Critical' : '1 Low'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Shawarma & Beverages
          </span>
        </div>

        {/* Metric 6: Predicted Demand */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Predicted Demand</span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit'] block">
            {metrics.predictedOrders}
          </span>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">
            {metrics.demandConfidence}% Confidence
          </span>
        </div>

        {/* Metric 7: Food Waste Prevented */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Waste Saved</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-['Outfit'] block">
            ₹3,400
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            24.5 kg food preserved
          </span>
        </div>

        {/* Metric 8: Active Event */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Event</span>
            <Layers className="w-4 h-4 text-purple-500" />
          </div>
          <span className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit'] truncate block">
            {eventRushActive ? 'Sports Day' : 'None'}
          </span>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {eventRushActive ? '500 attendees' : 'Normal timetable'}
          </span>
        </div>
      </div>

      {/* DEMAND VELOCITY CHART */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
              Hourly Order Intake Velocity (Orders vs Capacity)
            </h3>
            <p className="text-xs text-slate-500">
              Comparing standard demand vs simulated surge volume
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Normal Orders</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
              <span>Event Surge</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={HOURLY_NORMAL_DEMAND} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="normGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="eventGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c084fc" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#c084fc" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="orders" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#normGrad)" name="Normal Orders" />
              {eventRushActive && (
                <Area type="monotone" dataKey="eventDemand" stroke="#9333ea" strokeWidth={2.5} fillOpacity={1} fill="url(#eventGrad)" name="Event Surge Demand" />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LIVE ORDERS QUEUE TABLE (Quick Actions) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base font-['Outfit']">
              Live Incoming Tokens
            </h3>
            <p className="text-xs text-slate-500">
              Kitchen staff token queue. Click to progress status in real-time.
            </p>
          </div>

          <button
            onClick={() => setAdminTab('live-orders')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Full Kitchen View ({orders.length} orders)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Token</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Items Ordered</th>
                <th className="py-3 px-4">Total (₹)</th>
                <th className="py-3 px-4">Counter</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-black font-['Outfit'] text-slate-900 text-sm">
                    {ord.token}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800 block">{ord.studentName || (ord.student_id ? `Student ${ord.student_id}` : 'Student')}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{ord.student_id || ord.studentId}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    ₹{ord.total}
                  </td>
                  <td className="py-3.5 px-4 text-indigo-700 font-medium">
                    {ord.counter}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                      ord.status === 'Completed'
                        ? 'bg-slate-100 text-slate-700'
                        : ord.status === 'Ready'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'Preparing'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {ord.status === 'Order Placed' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Accepted')}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer"
                      >
                        Accept
                      </button>
                    )}
                    {ord.status === 'Accepted' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Preparing')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer"
                      >
                        Start Cook
                      </button>
                    )}
                    {ord.status === 'Preparing' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Ready')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer"
                      >
                        Mark Ready
                      </button>
                    )}
                    {ord.status === 'Ready' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'Completed')}
                        className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-2.5 py-1 rounded-lg text-[11px] cursor-pointer"
                      >
                        Hand Over
                      </button>
                    )}
                    {ord.status === 'Completed' && (
                      <span className="text-[11px] text-slate-400 font-medium">Delivered</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
